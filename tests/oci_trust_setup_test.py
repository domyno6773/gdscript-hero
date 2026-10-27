import copy
import io
import unittest
from contextlib import redirect_stdout
from unittest.mock import patch
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import oci_trust_setup as setup


class TrustSetupTests(unittest.TestCase):
    def setUp(self):
        self.payload = setup.trust_payload("a" * 32)
        self.origin = "https://idcs-" + "b" * 32 + ".identity.oraclecloud.com"

    def test_domain_allowlist_rejects_credential_exfiltration(self):
        for url in ("http://" + self.origin[8:], self.origin + ".evil.test",
                    self.origin + "/other", self.origin + "?x=1",
                    self.origin.replace("https://", "https://secret@"),
                    self.origin + ":444", self.origin + ":bad"):
            with self.subTest(url=url), self.assertRaises(setup.SetupError):
                setup.domain_origin(url)
        self.assertEqual(setup.domain_origin(self.origin + ":443/"), self.origin)

    def test_trust_inactive_and_identity_constraints_exact(self):
        self.assertIs(self.payload["active"], False)
        rules = {x["name"]: x["value"] for x in self.payload["claimValidations"]}
        self.assertEqual(len(rules), 5)
        self.assertEqual(rules["sub"], setup.SUBJECT)
        self.assertIn("@1431761977", rules["sub"])
        self.assertEqual(rules["workflow_ref"], setup.WORKFLOW)
        self.assertEqual(rules["ref"], "refs/heads/main")
        self.assertEqual(rules["aud"], setup.AUDIENCE)
        self.assertEqual(rules["event_name"], "workflow_dispatch")

    def test_redirects_never_forward_credentials(self):
        with self.assertRaises(setup.SetupError):
            setup.NoRedirect().redirect_request(None, None, 302, "", {}, "https://evil.test")

    def test_existing_or_unknown_trust_inventory_never_writes(self):
        for response in ({"totalResults": 1}, {}, {"totalResults": -1},
                         {"totalResults": False}, {"totalResults": 0, "Resources": [{"id": "x"}]}):
            calls = []
            def api(*args):
                calls.append(args[2])
                return response
            with self.subTest(response=response), self.assertRaises(setup.SetupError):
                setup.create_inactive(self.origin, "secret", self.payload, api=api)
            self.assertEqual(calls, ["GET"])

    def test_cancel_has_no_post(self):
        calls = []
        def api(*args):
            calls.append(args[2])
            return {"totalResults": 0}
        with redirect_stdout(io.StringIO()):
            self.assertFalse(setup.create_inactive(self.origin, "secret", self.payload,
                                                 confirm=lambda _: "no", api=api))
        self.assertEqual(calls, ["GET"])

    def test_create_reads_back_and_does_not_print_token(self):
        calls = []
        def api(origin, token, method, suffix, payload=None):
            calls.append((method, suffix))
            if len(calls) == 1:
                return {"totalResults": 0}
            if method == "POST":
                self.assertIs(payload["active"], False)
                return {"id": "c" * 32}
            return dict(self.payload, id="c" * 32)
        output = io.StringIO()
        with redirect_stdout(output):
            setup.create_inactive(self.origin, "TOP-SECRET-TOKEN", self.payload,
                                  confirm=lambda _: "CREA TRUST INATTIVO", api=api)
        self.assertEqual([x[0] for x in calls], ["GET", "POST", "GET"])
        self.assertNotIn("TOP-SECRET-TOKEN", output.getvalue())

    def test_server_dropped_or_broadened_constraints_detected(self):
        for key, value in (("active", True), ("claimValidations", []),
                           ("oauthClients", ["a" * 32, "d" * 32]),
                           ("publicKeyEndpoint", "https://evil.test"),
                           ("clientClaimValues", ["other"])):
            saved = copy.deepcopy(self.payload)
            saved[key] = value
            with self.subTest(key=key), self.assertRaises(setup.SetupError):
                setup.validate_saved(saved, self.payload)

    def test_network_failure_after_post_is_not_retried(self):
        calls = []
        def api(*args):
            calls.append(args[2])
            if len(calls) == 1:
                return {"totalResults": 0}
            raise setup.SetupError("Esito sconosciuto")
        with redirect_stdout(io.StringIO()), self.assertRaises(setup.SetupError):
            setup.create_inactive(self.origin, "secret", self.payload,
                                  confirm=lambda _: "CREA TRUST INATTIVO", api=api)
        self.assertEqual(calls, ["GET", "POST"])

    def test_default_preview_does_not_read_token_or_contact_network(self):
        with patch("builtins.input", side_effect=[self.origin, "a" * 32]), \
             patch.object(setup, "read_token") as token, \
             patch.object(setup, "request_json") as network, redirect_stdout(io.StringIO()):
            self.assertEqual(setup.main([]), 0)
        token.assert_not_called()
        network.assert_not_called()


if __name__ == "__main__":
    unittest.main()
