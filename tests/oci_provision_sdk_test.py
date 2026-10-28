"""Exercise every real SDK call through intercepted transport, never OCI."""
import copy
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace as S
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import oci
from cryptography.hazmat.primitives.asymmetric import rsa
import oci_cloudshell_bootstrap as host


class SDKContracts(unittest.TestCase):
    def setUp(self):
        self.root = 'ocid1.tenancy.oc1..test'
        self.cid = 'ocid1.compartment.oc1..test'
        self.config = {'region': host.REGION, 'tenancy': self.root}
        signer = oci.auth.signers.SecurityTokenSigner('OFFLINE', rsa.generate_private_key(public_exponent=65537, key_size=2048))
        self.signer = signer
        self.data = {'vcn': [], 'igw': [], 'routes': [], 'security': [], 'subnet': [], 'instance': []}
        self.calls = []
        self.billing = 'LIMITED_FREE'
        self.has_compartment = True
        self.policies = []
        self.clients = [cls(self.config, signer=signer) for cls in (
            oci.identity.IdentityClient, oci.core.ComputeClient, oci.core.VirtualNetworkClient,
            oci.limits.LimitsClient, oci.core.BlockstorageClient)]
        for client in self.clients:
            client.base_client.call_api = self.transport

    def transport(self, resource_path, **kw):
        method = kw.get('method', 'GET')
        self.calls.append((method, resource_path, kw.get('body')))
        q = dict(kw.get('query_params', []))
        pp = kw.get('path_params', {})
        m = oci.core.models
        if resource_path.endswith('/regionSubscriptions'):
            data = [S(region_name=host.REGION, is_home_region=True)]
        elif resource_path == '/availabilityDomains':
            data = [S(name='test-ad')]
        elif resource_path == '/domains':
            data = [S(display_name='Default', lifecycle_state='ACTIVE', id='ocid1.domain.oc1..test')]
        elif resource_path.startswith('/policies'):
            if method == 'POST':
                detail = kw['body']
                data = oci.identity.models.Policy(id='ocid1.policy.oc1..test', name=detail.name,
                    statements=detail.statements, freeform_tags=detail.freeform_tags, lifecycle_state='ACTIVE')
                self.policies.append(data)
            elif pp:
                data = self.policies[0]
            else:
                data = self.policies
        elif resource_path.startswith('/compartments'):
            if method == 'POST':
                self.has_compartment = True
            rows = [oci.identity.models.Compartment(id=self.cid, compartment_id=self.root, name=host.NAME,
                    lifecycle_state='ACTIVE', freeform_tags=host.TAGS)]
            data = rows[0] if method == 'POST' or pp else (rows if self.has_compartment else [])
        elif resource_path == '/shapes':
            data = [m.Shape(shape=host.SHAPE, billing_type=self.billing)]
        elif resource_path.endswith('/resourceAvailability'):
            used = (6 if pp.get('limitName') == 'standard-a1-memory-count' else 1) if self.data['instance'] else 0
            data = S(used=used, available=(12 if pp.get('limitName') == 'standard-a1-memory-count' else 2) - used)
        elif resource_path == '/images':
            data = [m.Image(id='ocid1.image.oc1.eu-milan-1.test', compartment_id=None,
                operating_system='Canonical Ubuntu', operating_system_version='24.04',
                display_name='Canonical-Ubuntu-24.04-aarch64-2026', lifecycle_state='AVAILABLE', size_in_mbs=48000)]
        elif resource_path.startswith('/dhcps/'):
            data = S(options=[S(type='DomainNameServer', server_type='VcnLocalPlusInternet')])
        elif resource_path in ('/volumes', '/bootVolumes', '/volumeBackups', '/bootVolumeBackups'):
            data = []
        else:
            resource_map = {'/vcns': ('vcn', m.Vcn), '/internetGateways': ('igw', m.InternetGateway),
                '/routeTables': ('routes', m.RouteTable), '/securityLists': ('security', m.SecurityList),
                '/subnets': ('subnet', m.Subnet), '/instances': ('instance', m.Instance)}
            base = resource_path.split('/{')[0]
            if base not in resource_map:
                raise AssertionError('Unexpected SDK API: ' + resource_path)
            kind, cls = resource_map[base]
            if method == 'POST':
                detail = kw['body']
                if kind == 'instance':
                    data = cls(id='ocid1.instance.oc1..test', compartment_id=self.cid,
                        display_name=detail.display_name, freeform_tags=detail.freeform_tags,
                        shape=detail.shape, shape_config=m.InstanceShapeConfig(ocpus=1, memory_in_gbs=6),
                        availability_domain='test-ad', lifecycle_state='RUNNING')
                else:
                    data = cls(**{k: getattr(detail, k) for k in detail.swagger_types if k in cls().swagger_types})
                    data.id = 'ocid1.' + kind + '.oc1..test'
                    data.lifecycle_state = 'AVAILABLE'
                self.data[kind].append(data)
            elif pp:
                data = next(x for x in self.data[kind] if x.id in pp.values())
            else:
                data = [x for x in self.data[kind] if x.compartment_id == q.get('compartmentId')
                        and (not q.get('vcnId') or x.vcn_id == q.get('vcnId'))]
        return oci.response.Response(200, {}, data, S(method=method))

    def patched(self):
        return (patch.object(oci.identity, 'IdentityClient', return_value=self.clients[0]),
                patch.object(oci.core, 'ComputeClient', return_value=self.clients[1]),
                patch.object(oci.core, 'VirtualNetworkClient', return_value=self.clients[2]),
                patch.object(oci.limits, 'LimitsClient', return_value=self.clients[3]),
                patch.object(oci.core, 'BlockstorageClient', return_value=self.clients[4]),
                patch('oci._vendor.requests.sessions.Session.send', side_effect=AssertionError('Network forbidden')))

    def test_full_real_sdk_plan_create_and_idempotent_second_apply(self):
        from contextlib import ExitStack
        with ExitStack() as stack:
            for p in self.patched():
                stack.enter_context(p)
            state = host.inspect(oci, self.config, signer=self.signer)
            self.assertFalse(any(m != 'GET' for m, _, _ in self.calls))
            host.apply(oci, self.config, state, 'a' * 40, '#!/bin/bash\necho __GDH_REPO_COMMIT__',
                       True, signer=self.signer)
            posts = [(path, body) for method, path, body in self.calls if method == 'POST']
            self.assertEqual(len(posts), 6)
            launch = posts[-1][1]
            self.assertEqual(launch.shape, host.SHAPE)
            self.assertEqual(launch.source_details.boot_volume_size_in_gbs, 50)
            self.assertEqual(launch.source_details.boot_volume_vpus_per_gb, 10)
            security = self.data['security'][0]
            self.assertEqual(security.ingress_security_rules, [])
            self.assertEqual(self.data['subnet'][0].security_list_ids, [security.id])
            before = len(posts)
            host.apply(oci, self.config, state, 'a' * 40, '#!/bin/bash\necho __GDH_REPO_COMMIT__', True, signer=self.signer)
            self.assertEqual(sum(m == 'POST' for m, _, _ in self.calls), before)

    def test_cloudshell_authorizes_only_dedicated_compartment_and_exact_policy(self):
        from contextlib import ExitStack
        self.has_compartment = False
        with ExitStack() as stack:
            for p in self.patched():
                stack.enter_context(p)
            state = host.inspect(oci, self.config)
            host.authorize_github(oci, self.config, state)
            self.assertEqual([(m, p) for m, p, _ in self.calls if m != 'GET'],
                             [('POST', '/compartments'), ('POST', '/vcns'), ('POST', '/internetGateways'),
                              ('POST', '/routeTables'), ('POST', '/securityLists'), ('POST', '/subnets'), ('POST', '/policies')])
            state = host.inspect(oci, self.config)
            host.authorize_github(oci, self.config, state)
            self.assertEqual(sum(m != 'GET' for m, _, _ in self.calls), 7)

    def test_two_existing_vcns_reuse_only_new_isolated_subnet(self):
        from contextlib import ExitStack
        m = oci.core.models
        for suffix, cidr in (("a", "10.0.0.0/16"), ("b", "10.1.0.0/16")):
            vcn_id = 'ocid1.vcn.oc1..external' + suffix
            self.data['vcn'].append(m.Vcn(id=vcn_id, compartment_id=self.root, display_name='existing-' + suffix,
                lifecycle_state='AVAILABLE', cidr_blocks=[cidr], default_dhcp_options_id='dhcp-' + suffix))
            self.data['igw'].append(m.InternetGateway(id='ocid1.internetgateway.oc1..' + suffix,
                compartment_id=self.root, vcn_id=vcn_id, lifecycle_state='AVAILABLE', is_enabled=True))
            self.data['subnet'].append(m.Subnet(id='ocid1.subnet.oc1..' + suffix,
                compartment_id=self.root, vcn_id=vcn_id, lifecycle_state='AVAILABLE',
                cidr_block='10.' + ('0' if suffix == 'a' else '1') + '.0.0/24'))
        original = copy.deepcopy(self.data)
        with ExitStack() as stack:
            for p in self.patched():
                stack.enter_context(p)
            state = host.inspect(oci, self.config)
            self.assertTrue(state['netplan']['reuse'])
            self.assertEqual(state['netplan']['cidr'], '10.0.1.0/28')
            host.authorize_github(oci, self.config, state)
            host.apply(oci, self.config, state, 'a' * 40, '#!/bin/bash\necho __GDH_REPO_COMMIT__', True, signer=self.signer)
        posts = [p for method, p, _ in self.calls if method == 'POST']
        self.assertNotIn('/vcns', posts)
        self.assertNotIn('/internetGateways', posts)
        self.assertEqual(len(self.data['vcn']), 2)
        self.assertEqual(self.data['vcn'], original['vcn'])
        self.assertEqual(self.data['igw'], original['igw'])
        self.assertEqual(self.data['subnet'][:2], original['subnet'])
        self.assertFalse(any(method in ('DELETE', 'PUT', 'PATCH') for method, _, _ in self.calls))
        self.assertEqual(self.data['security'][0].ingress_security_rules, [])

    def test_paid_shape_stops_all_creation(self):
        from contextlib import ExitStack
        self.billing = 'PAID'
        with ExitStack() as stack:
            for p in self.patched():
                stack.enter_context(p)
            with self.assertRaises(host.GuardError):
                host.inspect(oci, self.config, signer=self.signer)
        self.assertFalse(any(method != 'GET' for method, _, _ in self.calls))


if __name__ == '__main__':
    unittest.main()
