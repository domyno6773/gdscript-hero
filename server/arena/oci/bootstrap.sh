#!/bin/bash
# OCI user-data, no credentials. Stage the runtime; never expose official grading.
set -euo pipefail
exec > >(tee -a /var/log/gdh-bootstrap.log) 2>&1
trap 'echo BOOTSTRAP_FAILED > /var/lib/gdh-bootstrap-status' ERR
test "$(uname -m)" = aarch64
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends ca-certificates curl git xz-utils docker.io
systemctl enable --now docker
install -d -m 0755 /opt/gdh
install -d -m 0700 /etc/gdh /var/lib/gdh/fixtures
install -d -m 0755 /var/lib/gdh/work
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
cd "$work"
node_version=22.23.4
asset="node-v${node_version}-linux-arm64.tar.xz"
base="https://nodejs.org/dist/v${node_version}"
curl --fail --location --proto '=https' --tlsv1.2 "$base/$asset" -o "$asset"
curl --fail --location --proto '=https' --tlsv1.2 "$base/SHASUMS256.txt" -o SHASUMS256.txt
awk -v asset="$asset" '$2 == asset {print}' SHASUMS256.txt > node.sha256
test "$(wc -l < node.sha256)" -eq 1
sha256sum --check --status node.sha256
tar -xJf "$asset" -C /opt/gdh
ln -sfn "/opt/gdh/node-v${node_version}-linux-arm64/bin/node" /usr/local/bin/node
git init /opt/gdh/source
git -C /opt/gdh/source remote add origin https://github.com/domyno6773/gdscript-hero.git
git -C /opt/gdh/source fetch --depth=1 origin __GDH_REPO_COMMIT__
git -C /opt/gdh/source checkout --detach FETCH_HEAD
test "$(git -C /opt/gdh/source rev-parse HEAD)" = __GDH_REPO_COMMIT__
docker build --file /opt/gdh/source/server/arena/godot/Dockerfile.oci-arm64 \
    --tag gdh-godot-grader:4.4.1 /opt/gdh/source/server/arena/godot
node --test /opt/gdh/source/server/arena/tests/*.test.cjs
docker run --rm --network none --read-only --cap-drop ALL \
    --security-opt no-new-privileges --pids-limit 64 --memory 192m --cpus 0.5 \
    --entrypoint /usr/local/bin/godot gdh-godot-grader:4.4.1 --headless --version
id gdh >/dev/null 2>&1 || useradd --system --home-dir /var/lib/gdh --shell /usr/sbin/nologin gdh
usermod -aG docker gdh
chown gdh:gdh /var/lib/gdh/fixtures /var/lib/gdh/work
cat > /etc/systemd/system/gdh-arena.service <<'UNIT'
[Unit]
Description=GDScript Hero staging coordinator
Requires=docker.service
After=docker.service network-online.target
ConditionPathExists=/etc/gdh/arena.env
[Service]
User=gdh
Group=gdh
SupplementaryGroups=docker
EnvironmentFile=/etc/gdh/arena.env
Environment=HOST=127.0.0.1
Environment=PORT=8787
Environment=TMPDIR=/var/lib/gdh/work
Environment=GDH_PRIVATE_FIXTURES_DIR=/var/lib/gdh/fixtures
ExecStart=/usr/local/bin/node /opt/gdh/source/server/arena/coordinator.js
WorkingDirectory=/var/lib/gdh
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/lib/gdh
Restart=on-failure
RestartSec=5
MemoryMax=512M
TasksMax=128
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
# Deliberately do not enable/start: private fixtures, secrets and HTTPS are absent.
echo RUNTIME_READY_BACKEND_DISABLED > /var/lib/gdh-bootstrap-status
echo 'Runtime ARM installato. Servizio coordinatore disattivato in attesa della configurazione privata.'
