import base64
import io
import sys
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from types import SimpleNamespace as S
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import oci_cloudshell_bootstrap as host
from oci_audit_readonly import Inventory


class Guards(unittest.TestCase):
    def test_budget_includes_non_compute_a1_usage_and_rejects_unknowns(self):
        host.budget(Inventory(), 0, 0)
        for summary, cpu, ram in [(Inventory(unknown=1), 0, 0),
                                  (Inventory(other_instances=1), 0, 0),
                                  (Inventory(storage_gb=151), 0, 0),
                                  (Inventory(), 2, 0), (Inventory(), 0, 7),
                                  (Inventory(), None, 0), (Inventory(), float('nan'), 0)]:
            with self.subTest(summary=summary, cpu=cpu, ram=ram), self.assertRaises(host.GuardError):
                host.budget(summary, cpu, ram)

    def test_free_subnet_never_overlaps_existing_ranges(self):
        self.assertEqual(host.free_subnet(["10.0.0.0/16"], ["10.0.0.0/24"]), "10.0.1.0/28")
        self.assertIsNone(host.free_subnet(["10.0.0.0/24"], ["10.0.0.0/24"]))
        self.assertIsNone(host.free_subnet(["8.8.8.0/24"], []))

    def test_name_collision_and_duplicate_stop_instead_of_adopting(self):
        with self.assertRaises(host.GuardError):
            host.named([S(display_name=host.NAME, lifecycle_state='AVAILABLE', freeform_tags={})], host.NAME)
        item = S(display_name=host.NAME, lifecycle_state='AVAILABLE', freeform_tags=host.TAGS)
        with self.assertRaises(host.GuardError):
            host.named([item, item], host.NAME)
        self.assertIs(host.named([item], host.NAME), item)

    def test_rejects_marketplace_custom_or_oversized_images(self):
        fields = dict(compartment_id=None, operating_system='Canonical Ubuntu', operating_system_version='24.04',
                      display_name='Canonical-Ubuntu-24.04-aarch64-2026', lifecycle_state='AVAILABLE', size_in_mbs=48000)
        host.validate_image(S(**fields), 'test')
        for changes in ({'compartment_id': 'custom'}, {'size_in_mbs': 60000},
                        {'display_name': 'Marketplace Ubuntu'}, {'operating_system': 'Paid OS'}):
            with self.subTest(changes=changes), self.assertRaises(host.GuardError):
                host.validate_image(S(**dict(fields, **changes)), 'test')

    def test_cloudshell_uses_cli_selected_file_and_profile(self):
        config = S(DEFAULT_LOCATION="default", from_file=Mock(return_value={"region": host.REGION}))
        sdk = S(config=config)
        host.cloudshell_config(sdk, {"OCI_CLI_CONFIG_FILE": "/cloud/config", "OCI_CLI_PROFILE": host.REGION})
        config.from_file.assert_called_once_with(file_location="/cloud/config", profile_name=host.REGION)
        config.from_file.return_value = {"region": "other-region"}
        with self.assertRaises(host.GuardError):
            host.cloudshell_config(sdk, {})
        self.assertEqual(host.cloudshell_config(sdk, {"OCI_CLI_REGION": host.REGION})["region"], host.REGION)

    def test_missing_free_account_confirmation_stops_before_import_or_network(self):
        with patch.object(host, 'inspect') as scan, redirect_stdout(io.StringIO()):
            self.assertEqual(host.main(['--apply']), 1)
            self.assertEqual(host.main(['--authorize-github']), 1)
        scan.assert_not_called()

    def test_apply_refreshes_plan_and_aborts_before_any_mutation(self):
        with patch.object(host, 'inspect', side_effect=host.GuardError('changed')) as scan:
            with self.assertRaises(host.GuardError):
                host.apply(S(), {}, {}, 'a' * 40, '__GDH_REPO_COMMIT__', True)
            scan.assert_called_once()

    def test_write_policy_has_no_iam_upgrade_delete_or_tenancy_write(self):
        policy = host.github_policy('ocid1.domain.oc1..test', 'ocid1.compartment.oc1..test')
        self.assertEqual(len(policy), 10)
        for line in policy:
            self.assertIn("request.principal.type='identityfederateddomainapp'", line)
            self.assertIn('request.principal.domain.id=', line)
            self.assertIn('request.principal.name=', line)
            self.assertIn('request.principal.ext_workflow_ref=', line)
            self.assertNotIn('manage all-resources', line)
            self.assertNotIn('Delete', line)
            self.assertNotIn('Update', line)
            self.assertNotIn('CreatePolicy', line)
            self.assertNotIn('CreateCompartment', line)
            if ' to manage ' in line:
                self.assertIn('in compartment id ocid1.compartment.oc1..test', line)

    def test_cloud_init_pins_checkout_without_shell_injection(self):
        text = '#!/bin/bash\necho __GDH_REPO_COMMIT__'
        result = base64.b64decode(host.cloud_init('a' * 40, text)).decode()
        self.assertIn('a' * 40, result)
        for commit in ('main', 'a' * 40 + '; id', '$(id)'):
            with self.assertRaises(host.GuardError):
                host.cloud_init(commit, text)


if __name__ == '__main__':
    unittest.main()
