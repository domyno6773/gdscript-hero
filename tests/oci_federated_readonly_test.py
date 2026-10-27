import base64
import copy
import io
import json
import sys
import time
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import oci_federated_readonly as fed
import oci_github_oidc_probe as probe
import oci_audit_readonly as audit


def jwt(claims):
    body = base64.urlsafe_b64encode(json.dumps(claims).encode()).decode().rstrip("=")
    return "eyJhbGciOiJSUzI1NiJ9." + body + ".signature"


PUBLIC_PEM = "-----BEGIN PUBLIC KEY-----\nYWJj\nZGVm\n-----END PUBLIC KEY-----\n"


class FederationTests(unittest.TestCase):
    def setUp(self):
        self.env = {
            "OCI_FED_DOMAIN_URL": "https://idcs-" + "a" * 32 + ".identity.oraclecloud.com",
            "OCI_FED_CLIENT_ID": "b" * 32, "OCI_FED_CLIENT_SECRET": "SECRET",
            "OCI_FED_TENANCY": "ocid1.tenancy.oc1..test",
            "OCI_FED_REGION": "eu-milan-1", "OCI_FED_DOMAIN_OCID": "ocid1.domain.oc1..test",
            "ACTIONS_ID_TOKEN_REQUEST_URL": "https://oidc.actions.githubusercontent.com/token?audience=old",
            "ACTIONS_ID_TOKEN_REQUEST_TOKEN": "GITHUB-SECRET",
        }
        now = int(time.time())
        self.claims = dict(iss=probe.ISSUER, aud=probe.AUDIENCE, repository=probe.REPOSITORY,
            repository_id=probe.REPOSITORY_ID, repository_owner_id=probe.OWNER_ID,
            environment=probe.ENVIRONMENT, workflow_ref=probe.WORKFLOW_REF,
            sub=probe.EXPECTED_SUBJECT, event_name="workflow_dispatch", ref="refs/heads/main",
            iat=now, exp=now + 300)
        self.rpst_claims = {"var_domain.id": self.env["OCI_FED_DOMAIN_OCID"],
                            "var_name": probe.EXPECTED_SUBJECT, "exp": now + 1200}

    def test_unconfigured_main_makes_no_http_request(self):
        with patch.dict(fed.os.environ, {}, clear=True), patch.object(fed, "http_json") as http, \
             redirect_stdout(io.StringIO()):
            self.assertEqual(fed.main(), 1)
        http.assert_not_called()

    def test_bad_domain_or_region_rejected(self):
        for key, value in (("OCI_FED_DOMAIN_URL", "https://evil.test"),
                            ("OCI_FED_REGION", "us-ashburn-1"),
                            ("OCI_FED_CLIENT_ID", "x:y")):
            env = dict(self.env, **{key: value})
            with self.subTest(key=key), self.assertRaises(Exception):
                fed.config_from_env(env)

    def test_github_claim_mismatch_and_expired_token_rejected(self):
        for changes in ({"workflow_ref": "other"}, {"ref": "refs/heads/evil"},
                        {"sub": "repo:evil"}, {"iat": 100, "exp": 200}):
            with self.subTest(changes=changes), self.assertRaises(Exception):
                fed.github_token(self.env, http=lambda _: {"value": jwt(dict(self.claims, **changes))})

    def test_audience_replaced_without_duplicate_or_token_output(self):
        seen = []
        def http(req):
            seen.append(req)
            return {"value": jwt(self.claims)}
        output = io.StringIO()
        with redirect_stdout(output):
            result = fed.github_token(self.env, http=http)
        query = fed.urllib.parse.parse_qs(fed.urllib.parse.urlsplit(seen[0].full_url).query)
        self.assertEqual(query["audience"], [probe.AUDIENCE])
        self.assertEqual(seen[0].get_header("Authorization"), "Bearer GITHUB-SECRET")
        self.assertNotIn(result, output.getvalue())

    def test_exchange_contract_and_expected_identity(self):
        def http(req):
            self.assertEqual(req.full_url, self.env["OCI_FED_DOMAIN_URL"] + "/oauth2/v1/token")
            fields = fed.urllib.parse.parse_qs(req.data.decode())
            self.assertEqual(fields["public_key"], ["YWJjZGVm"])
            self.assertEqual(fields["rpst_exp"], ["20"])
            self.assertEqual(fields["requested_token_type"], ["urn:oci:token-type:oci-rpst"])
            self.assertEqual(fields["res_type"], ["gdhgithubreadonly"])
            return {"token": jwt(self.rpst_claims)}
        self.assertEqual(fed.exchange(self.env["OCI_FED_DOMAIN_URL"], self.env,
                                     "GITHUB-JWT", PUBLIC_PEM, http=http), jwt(self.rpst_claims))
        for changes in ({"var_domain.id": "other"}, {"var_name": "other"}, {"exp": 1}):
            with self.subTest(changes=changes), self.assertRaises(fed.FederationError):
                fed.exchange(self.env["OCI_FED_DOMAIN_URL"], self.env, "JWT", PUBLIC_PEM,
                             http=lambda _: {"token": jwt(dict(self.rpst_claims, **changes))})

    def test_public_key_encoding_rejects_invalid_input_before_http(self):
        for value in ("PUBLIC", "-----BEGIN PRIVATE KEY-----\\nYWJj\\n-----END PRIVATE KEY-----",
                      "-----BEGIN PUBLIC KEY-----\\nnot-base64!\\n-----END PUBLIC KEY-----"):
            with self.subTest(value=value), self.assertRaises(fed.FederationError):
                http = Mock()
                try:
                    fed.exchange(self.env["OCI_FED_DOMAIN_URL"], self.env, "JWT", value, http=http)
                finally:
                    http.assert_not_called()
        self.assertEqual(base64.b64decode(fed.public_key_content(PUBLIC_PEM)), b"abcdef")

    def test_redirect_blocked_and_http_errors_sanitized(self):
        with self.assertRaises(fed.FederationError):
            fed.NoRedirect().redirect_request(None, None, 302, "", {}, "https://evil.test")
        req = fed.urllib.request.Request(self.env["OCI_FED_DOMAIN_URL"])
        error = fed.urllib.error.HTTPError(req.full_url, 401, "SECRET", {"SECRET": "VALUE"}, None)
        with patch.object(fed.urllib.request, "build_opener") as build:
            build.return_value.open.side_effect = error
            with self.assertRaises(fed.FederationError) as caught:
                fed.http_json(req)
        self.assertNotIn("SECRET", str(caught.exception))
        self.assertIn("401", str(caught.exception))

    def test_oauth_diagnostics_never_echo_server_values(self):
        payloads = [
            ({"error": "invalid_grant", "error_description": "SECRET subject claim expired"},
             ("OAuth=invalid_grant", "claim", "subject", "expired")),
            ({"error": "SECRET", "error_description": "SECRET", "token": "SECRET"}, ()),
            (["SECRET"], ()),
        ]
        for body, expected in payloads:
            error = fed.urllib.error.HTTPError("https://example.test", 400, "SECRET", {},
                                             io.BytesIO(json.dumps(body).encode()))
            result = fed.oauth_error_summary(error)
            self.assertNotIn("SECRET", result)
            for label in expected:
                self.assertIn(label, result)
        for raw in (b"SECRET-not-json", b"x" * 16385):
            error = fed.urllib.error.HTTPError("https://example.test", 400, "SECRET", {}, io.BytesIO(raw))
            self.assertEqual(fed.oauth_error_summary(error), "")

    def test_inventory_passes_ephemeral_signer_and_only_lists_resources(self):
        signer = object()
        identity = SimpleNamespace(
            list_region_subscriptions=Mock(return_value=[SimpleNamespace(region_name="eu-milan-1", is_home_region=True)]),
            list_availability_domains=Mock(return_value=[SimpleNamespace(name="ad1")]),
            list_compartments=Mock(return_value=[]))
        compute = SimpleNamespace(list_instances=Mock(return_value=[]))
        block = SimpleNamespace(**{name: Mock(return_value=[]) for name in (
            "list_volumes", "list_boot_volumes", "list_volume_backups", "list_boot_volume_backups")})
        sdk = SimpleNamespace(identity=SimpleNamespace(IdentityClient=Mock(return_value=identity)),
            core=SimpleNamespace(ComputeClient=Mock(return_value=compute), BlockstorageClient=Mock(return_value=block)),
            pagination=SimpleNamespace(list_call_get_all_results=lambda fn, *a, **kw: SimpleNamespace(data=fn(*a, **kw))))
        config = {"tenancy": "ocid1.tenancy.oc1..test", "region": "eu-milan-1"}
        summary = audit.inventory_oci(sdk, config, signer=signer)
        self.assertEqual(summary.compartments, 1)
        for ctor in (sdk.identity.IdentityClient, sdk.core.ComputeClient, sdk.core.BlockstorageClient):
            ctor.assert_called_once_with(config, signer=signer)


if __name__ == "__main__":
    unittest.main()
