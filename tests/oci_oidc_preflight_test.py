"""Offline tests for the GitHub OIDC read-only identity preflight."""
import base64
import importlib.util
import json
import pathlib
import sys
import unittest

HERE = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "gdh_oidc_probe", HERE / "scripts" / "oci_github_oidc_probe.py")
probe = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = probe
spec.loader.exec_module(probe)


def jwt(claims):
    data = base64.urlsafe_b64encode(json.dumps(claims).encode()).decode().rstrip("=")
    return "header." + data + ".signed"


class TestOIDC(unittest.TestCase):
    def claims(self):
        return {
            "iss": probe.ISSUER,
            "aud": probe.AUDIENCE,
            "sub": probe.EXPECTED_SUBJECT,
            "repository": probe.REPOSITORY,
            "repository_id": probe.REPOSITORY_ID,
            "repository_owner_id": probe.OWNER_ID,
            "environment": probe.ENVIRONMENT,
            "workflow_ref": probe.WORKFLOW_REF,
            "event_name": "workflow_dispatch",
            "ref": "refs/heads/main",
            "iat": 100,
            "exp": 400,
        }

    def test_valid_claims(self):
        payload = self.claims()
        self.assertEqual(probe.validate_claims(probe.extract_claims(jwt(payload)))["sub"],
                         payload["sub"])

    def test_rejects_other_repo_or_pull_request(self):
        for key, value in [
            ("repository", "someone/another-repo"),
            ("event_name", "pull_request"),
            ("ref", "refs/heads/experimental"),
            ("aud", "unexpected"),
            ("sub", "repo:someone/another-repo:environment:oci-readonly"),
            ("repository_id", "000000000"),
            ("repository_owner_id", "000000000"),
            ("environment", "oci-provision"),
            ("workflow_ref", "domyno6773/gdscript-hero/.github/workflows/untrusted.yml@refs/heads/main"),
        ]:
            payload = self.claims()
            payload[key] = value
            with self.subTest(key=key):
                with self.assertRaises(ValueError):
                    probe.validate_claims(payload)

    def test_rejects_previous_subject_format(self):
        payload = self.claims()
        payload["sub"] = f"repo:{probe.REPOSITORY}:environment:{probe.ENVIRONMENT}"
        with self.assertRaises(ValueError):
            probe.validate_claims(payload)

    def test_rejects_expired_or_unreasonable_lifetime(self):
        payload = self.claims()
        payload["exp"] = payload["iat"] + 5000
        with self.assertRaises(ValueError):
            probe.validate_claims(payload)

    def test_does_not_accept_invalid_jwt(self):
        with self.assertRaises(ValueError):
            probe.extract_claims("invalid")

    def test_token_endpoints_allow_documented_github_hosts_only(self):
        for url in (
            "https://vstoken.actions.githubusercontent.com/_apis/distributedtask/hubs/build/plans/123?x=1",
            "https://pipelines.actions.githubusercontent.com/_apis/token?x=1",
            "https://pipelinesghubeus12.actions.githubusercontent.com/_apis/token?x=1",
        ):
            with self.subTest(url=url):
                probe.validate_endpoint(url)
        for url in (
            "http://vstoken.actions.githubusercontent.com/token",
            "https://vstoken.actions.githubusercontent.com.evil.example/token",
            "https://vstoken.actions.githubusercontent.com@evil.example/token",
            "https://evil.example/token",
            "https://actions.githubusercontent.com/token",
            "https://vstoken.actions.githubusercontent.com:444/token",
        ):
            with self.subTest(url=url):
                with self.assertRaises(ValueError):
                    probe.validate_endpoint(url)

    def test_workflow_manual_only_and_no_oci_calls(self):
        text = (HERE / ".github" / "workflows" / "oci-oidc-preflight.yml").read_text()
        self.assertIn("workflow_dispatch", text)
        self.assertIn("id-token: write", text)
        self.assertNotIn("pull_request:", text)
        self.assertNotIn("schedule:", text)
        self.assertNotIn("secrets.", text)
        self.assertNotIn("oci cli", text.lower())


if __name__ == "__main__":
    unittest.main()
