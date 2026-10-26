#!/usr/bin/env python3
"""Ephemeral, read-only TWO-ORIGIN preview of the REAL course + actual Godot WASM.

Never serves the real supabase-config.js, any secrets or GitHub internals.
The course is behind a locked-down HTTPS preview origin; Godot is behind
a SEPARATE runner origin with opaque iframe sandbox. No account service is used.
"""
import os
import sys
import mimetypes
import posixpath
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit

REPO = Path(__file__).resolve().parents[3]
SPIKE = REPO / "spikes" / "godot-web"
WEB = SPIKE / "web"
HOST_ORIGIN = os.environ.get("PUBLIC_HOST_URL", "")
RUNNER_ORIGIN = os.environ.get("PUBLIC_RUNNER_URL", "")
ROLE = sys.argv[1] if len(sys.argv) > 1 else "host"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else (18771 if ROLE == "host" else 18772)
if ROLE not in ("host", "runner"):
    sys.exit("Usage: preview_fullsite.py host|runner PORT")
if not HOST_ORIGIN.startswith(("http://", "https://")) or not RUNNER_ORIGIN.startswith(("http://", "https://")):
    sys.exit("Set PUBLIC_HOST_URL and PUBLIC_RUNNER_URL before starting")
if HOST_ORIGIN == RUNNER_ORIGIN:
    sys.exit("The parent and Godot runner origins MUST be separate")

# This is a temporary demo; serve only what is needed for the public lesson UI.
ROOT_JS = {
    "audio.js", "confetti.js", "runtime.js", "diagnostic.js", "lessons.js",
    "review_variants.js", "arena_project.js", "viewport2d.js", "auth.js",
    "stats.js", "gdscript-highlighter.js", "app.js",
}
ROOT_CSS = {"styles.css", "godot-theme.css", "exercise-redesign.css"}
SAFE_MEDIA = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".woff2", ".ttf", ".mp3", ".ogg"}
NATIVE = {
    "spikes/godot-web/integration/native-preview-adapter.js",
    "spikes/godot-web/host/lesson-fixtures.js",
    "spikes/godot-web/host/lesson-validation.js",
    "spikes/godot-web/host/lesson-validation-native-scenes.js",
}
GAME = {"isolated.html", "isolated-runner.js", "godot.js", "godot.wasm", "godot.pck"}
CONFIG_STUB = b'window.SupabaseConfig={url:"",anonKey:"",isConfigured:()=>false,isAdmin:()=>false,adminEmails:[]};'
BANNER = (
    '<div id="gdh-public-https-preview" role="note" style="position:fixed;'
    'top:0;left:0;right:0;z-index:2147483646;background:#203242;color:white;'
    'text-align:center;padding:8px 12px;font:600 13px system-ui">'
    'ANTEPRIMA GODOT HTTPS &mdash; accessi cloud disattivati, nessun XP o progresso attribuito dalla verifica nativa'
    '</div>'
)
MIMES = {".js":"text/javascript; charset=utf-8",".html":"text/html; charset=utf-8",
         ".css":"text/css; charset=utf-8",".wasm":"application/wasm",
         ".pck":"application/octet-stream"}

class Handler(BaseHTTPRequestHandler):
    def respond(self, data: bytes, name: str, code: int = 200):
        self.send_response(code)
        self.send_header("Content-Type", MIMES.get(Path(name).suffix) or mimetypes.guess_type(name)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-store" if name.endswith((".html",".js")) else "public, max-age=3600")
        if ROLE == "host":
            self.send_header("X-Frame-Options", "DENY")
        if ROLE == "host":
            self.send_header("Content-Security-Policy",
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; "
                "connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; "
                "frame-src " + RUNNER_ORIGIN + "; frame-ancestors 'none'")
        else:
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cross-Origin-Resource-Policy", "cross-origin")
            # The document receives an opaque origin through iframe sandbox=allow-scripts;
            # restricting script fetches to 'self' here would break Godot export assets.
            # Its embedding parent is nonetheless pinned to this temporary host URL.
            self.send_header("Content-Security-Policy", "frame-ancestors " + HOST_ORIGIN)
        self.end_headers()
        try:
            self.wfile.write(data)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_GET(self):
        name = urlsplit(self.path).path.lstrip("/")
        if not name:
            name = "index.html" if ROLE == "host" else "isolated.html"
        if name.startswith("/") or ".." in name.split("/") or "\x00" in name or "\\" in name:
            self.send_error(404)
            return
        # Serve a minimal stub, never the repository's real Supabase endpoint/key.
        if ROLE == "host" and name == "supabase-config.js":
            return self.respond(CONFIG_STUB, name)
        if ROLE == "host":
            if name == "index.html":
                raw = (REPO / "index.html").read_text("utf-8")
                remote_sdk = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'
                if remote_sdk not in raw:
                    self.send_error(500, "Unexpected public site script layout")
                    return
                raw = raw.replace(remote_sdk, "")
                raw = raw.replace("</body>", BANNER + "</body>")
                return self.respond(raw.encode("utf-8"), name)
            if name in ROOT_JS or name in ROOT_CSS or name in NATIVE:
                path = REPO / name
            elif (Path(name).suffix in SAFE_MEDIA and
                  not name.startswith(("spikes/", ".github/")) and
                  (REPO / name).resolve().is_relative_to(REPO)):
                path = REPO / name
            else:
                self.send_error(404, "Not part of isolated public preview")
                return
            if not path.is_file():
                self.send_error(404)
                return
            if name == "spikes/godot-web/integration/native-preview-adapter.js":
                source = path.read_text("utf-8")
                old_gate = """  const localOnly = location.protocol === 'http:' && location.hostname === '127.0.0.1' &&
    location.port === '18767';"""
                replacement_gate = "  const localOnly = location.origin === " + repr(HOST_ORIGIN).replace("'", '"') + ";"
                old_runner = "  const RUNNER_ORIGIN='http://localhost:18768';"
                toggle = "    nativeToggle.checked=verifyMode;"
                if not all(x in source for x in (old_gate, old_runner, toggle)):
                    self.send_error(500, "Native Verify adapter version mismatch")
                    return
                source = source.replace(old_gate, replacement_gate)
                source = source.replace(old_runner, "  const RUNNER_ORIGIN=" + repr(RUNNER_ORIGIN).replace("'", '"') + ";")
                # Never activate the JS XP path in a public preview.
                source = source.replace(toggle, toggle + "\n    nativeToggle.disabled=verifyMode;")
                source = source.replace(
                    "Disattiva per tornare al runtime JavaScript normale.",
                    "Qui il runtime JS con XP e salvataggi non e disponibile.")
                return self.respond(source.encode("utf-8"), name)
            return self.respond(path.read_bytes(), name)
        if name not in GAME:
            self.send_error(404, "Only Godot isolated WebAssembly runner is exposed")
            return
        path = WEB / name
        if not path.is_file():
            self.send_error(404, "Godot WASM not built")
            return
        if name == "isolated-runner.js":
            src = path.read_text("utf-8")
            anchor = "const PARENT_ORIGIN = 'http://127.0.0.1:18767';"
            if anchor not in src:
                self.send_error(500, "Unexpected runner protocol")
                return
            src = src.replace(anchor, "const PARENT_ORIGIN = " + repr(HOST_ORIGIN).replace("'", '"') + ";")
            return self.respond(src.encode("utf-8"), name)
        return self.respond(path.read_bytes(), name)

if __name__ == "__main__":
    host = "127.0.0.1"
    print(f"GDH_FULLSITE_ROLE={ROLE} address={host}:{PORT}", flush=True)
    ThreadingHTTPServer((host, PORT), Handler).serve_forever()
