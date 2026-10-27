import copy
import io
import json
import re
import sys
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import oci_trust_setup as setup


class ActivationTests(unittest.TestCase):
    def setUp(self):
        self.client = "a" * 32
        self.domain = "ocid1.domain.oc1..localtest"
        self.origin = "https://idcs-" + "d" * 32 + ".identity.oraclecloud.com"
        self.trust = dict(setup.trust_payload(self.client), id="b" * 32,
                          domainOcid=self.domain, meta={"version": 'W/"1"'})
        self.app = {"id": "c" * 32, "domainOcid": self.domain,
                    "name": self.client, "displayName": setup.TRUST_NAME,
                    "isOAuthClient": True, "clientType": "confidential",
                    "trustScope": "Explicit", "allowedGrants": ["client_credentials"],
                    "active": False}
        self.grants = {"totalResults": 0, "Resources": []}
        self.calls = []

    def api(self, origin, token, method, suffix, payload=None, version=None):
        self.calls.append((method, suffix, copy.deepcopy(payload), version))
        if method == "GET":
            if suffix.startswith(setup.COLLECTION):
                row = self.trust
            elif suffix.startswith("/admin/v1/Apps"):
                row = self.app
            else:
                return copy.deepcopy(self.grants)
            return {"totalResults": 1, "Resources": [copy.deepcopy(row)]}
        if method == "PUT":
            self.app["active"] = True
        elif method == "PATCH":
            self.assertEqual(version, 'W/"1"')
            self.trust["active"] = True
            self.trust["meta"]["version"] = 'W/"2"'
        else:
            self.fail("Unlisted mutation")
        return {}

    def activate(self, confirmation="ATTIVA PONTE SOLA LETTURA"):
        with redirect_stdout(io.StringIO()):
            return setup.activate_verified(self.origin, "SECRET-TOKEN", self.client,
                self.domain, confirm=lambda _: confirmation, api=self.api)

    def test_policy_contains_only_expected_lists_and_domain_condition(self):
        policy = setup.readonly_policy(self.domain)
        lines = policy.splitlines()
        self.assertEqual(len(lines), 6)
        self.assertEqual(set(re.findall(r"request.operation='([^']+)'", policy)), {
            "ListRegionSubscriptions", "ListCompartments", "ListAvailabilityDomains",
            "ListInstances", "ListVolumes", "ListBootVolumes", "ListVolumeBackups", "ListBootVolumeBackups"})
        for line in lines:
            self.assertIn("request.principal.domain.id='" + self.domain + "'", line)
            self.assertIn("request.principal.type='identityfederateddomainapp'", line)
            self.assertIn("request.principal.name='" + setup.SUBJECT + "'", line)
            self.assertIn("request.principal.ext_repository='domyno6773/gdscript-hero'", line)
            self.assertIn("request.principal.ext_workflow_ref='" + setup.WORKFLOW + "'", line)
            self.assertIn("request.principal.ext_event_name='workflow_dispatch'", line)
            self.assertNotIn(" to manage ", line)
            self.assertNotIn(" to use ", line)
        with self.assertRaises(setup.SetupError):
            setup.readonly_policy("ocid1.domain.oc1..x' }, request.principal.type='user")

    def test_policy_only_never_reads_credentials_or_calls_oracle(self):
        with patch("builtins.input", return_value=self.domain), \
             patch.object(setup, "read_token") as token, \
             patch.object(setup.urllib.request, "build_opener") as network, \
             patch.object(setup.os, "startfile", create=True), \
             redirect_stdout(io.StringIO()):
            self.assertEqual(setup.main(["--policy-only"]), 0)
        token.assert_not_called()
        network.assert_not_called()

    def test_cancel_never_activates(self):
        self.assertFalse(self.activate("no"))
        self.assertTrue(all(c[0] == "GET" for c in self.calls))

    def test_rejects_grants_and_incomplete_grant_inventory_before_writes(self):
        for grants in ({"totalResults": 1}, {}, {"totalResults": False}, {"totalResults": 0, "Resources": [{"id": "x"}]}):
            self.grants = grants
            with self.subTest(grants=grants), self.assertRaises(setup.SetupError):
                self.activate()
            self.assertTrue(all(c[0] == "GET" for c in self.calls))

    def test_rejects_broader_app_and_changed_trust(self):
        base = copy.deepcopy(self.app)
        for key, value in (("trustScope", "Account"), ("allowedScopes", [{"fqs": "admin"}]),
                           ("grantedAppRoles", [{"value": "admin"}]), ("allowedGrants", ["password"]),
                           ("domainOcid", "other")):
            self.app = dict(base, **{key: value})
            with self.subTest(key=key), self.assertRaises(setup.SetupError):
                self.activate()
        self.app = base
        self.trust["claimValidations"].pop()
        with self.assertRaises(setup.SetupError):
            self.activate()
        self.assertTrue(all(c[0] == "GET" for c in self.calls))

    def test_refresh_revalidates_after_confirmation(self):
        def changed(_):
            self.app["trustScope"] = "Account"
            return "ATTIVA PONTE SOLA LETTURA"
        with redirect_stdout(io.StringIO()), self.assertRaises(setup.SetupError):
            setup.activate_verified(self.origin, "secret", self.client, self.domain,
                                    confirm=changed, api=self.api)
        self.assertTrue(all(c[0] == "GET" for c in self.calls))

    def test_activation_only_flips_active_with_conditional_patch(self):
        self.assertTrue(self.activate())
        writes = [c for c in self.calls if c[0] != "GET"]
        self.assertEqual([c[0] for c in writes], ["PUT", "PATCH"])
        self.assertIs(self.app["active"], True)
        self.assertIs(self.trust["active"], True)
        self.assertEqual(writes[1][3], 'W/"1"')
        self.assertEqual(writes[1][2]["Operations"], [{"op": "replace", "path": "active", "value": True}])
        self.calls.clear()
        self.assertTrue(self.activate())
        self.assertTrue(all(c[0] == "GET" for c in self.calls))

    def test_activation_transport_rejects_other_paths_and_payloads_offline(self):
        invalid = [("POST", "/admin/v1/Policies", {}),
                   ("PUT", "/admin/v1/AppStatusChanger/" + "c" * 32, {"active": True}),
                   ("PATCH", setup.COLLECTION + "/" + "b" * 32,
                    {"Operations": [{"op": "remove", "path": "claimValidations"}]})]
        for method, suffix, payload in invalid:
            with self.subTest(method=method), self.assertRaises(setup.SetupError), \
                 patch.object(setup.urllib.request, "build_opener") as network:
                setup.activation_api(self.origin, "secret", method, suffix, payload)
            network.assert_not_called()


if __name__ == "__main__":
    unittest.main()
