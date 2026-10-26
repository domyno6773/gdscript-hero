#!/usr/bin/env python3
"""Temporary read-only Godot lesson lab, no accounts or API keys."""
import sys
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]
HOST=ROOT/"host"; WEB=ROOT/"web"
LAB={"lesson-lab.html","style.css","lesson-fixtures.js","lesson-validation.js","lesson-validation-native-scenes.js","lab-ui.js","host.js"}
GAME={"isolated.html","isolated-runner.js","godot.js","godot.wasm","godot.pck"}
MIMES={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".wasm":"application/wasm",".pck":"application/octet-stream"}
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        name=urlsplit(self.path).path.lstrip("/")
        if name in ("","index.html"):
            self.send_response(302)
            self.send_header("Location","/lesson-lab.html")
            self.end_headers()
            return
        if name in LAB: filepath=HOST/name
        elif name in GAME: filepath=WEB/name
        else:
            self.send_error(404,"Not in public demo");return
        if not filepath.is_file():
            self.send_error(404,"Godot export missing");return
        if name=="host.js":
            original=filepath.read_text()
            old="const RUNNER_ORIGIN = 'http://localhost:18768';"
            guard="""  if (location.origin === RUNNER_ORIGIN) {
    setStatus('BLOCCATO: runner e interfaccia devono avere origini differenti');
    return;
  }"""
            iframe="frame.src = RUNNER_ORIGIN + '/isolated.html?session=' + encodeURIComponent(session);"
            if not all(x in original for x in (old,guard,iframe)):
                self.send_error(500,"Host protocol mismatch");return
            original=original.replace(old,"const RUNNER_ORIGIN = location.origin;")
            original=original.replace(guard,"""  // The network origin matches, but the iframe has an OPAQUE origin
  // due to sandbox=allow-scripts without allow-same-origin.
""")
            original=original.replace(iframe,"""frame.src = RUNNER_ORIGIN + '/isolated.html?session=' + encodeURIComponent(session)
      + '&parentOrigin=' + encodeURIComponent(location.origin);""")
            data=original.encode()
        elif name=="isolated-runner.js":
            original=filepath.read_text()
            marker="const PARENT_ORIGIN = 'http://127.0.0.1:18767';"
            if marker not in original:
                self.send_error(500,"Runner protocol mismatch");return
            original=original.replace(marker,"""const PARENT_ORIGIN = new URL(location.href).searchParams.get('parentOrigin');
  if (!PARENT_ORIGIN || PARENT_ORIGIN !== new URL(location.href).origin) {
    throw new Error('Invalid parent origin');
  }""")
            data=original.encode()
        else: data=filepath.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type",MIMES.get(filepath.suffix,"application/octet-stream"))
        self.send_header("Content-Length",str(len(data)))
        self.send_header("Access-Control-Allow-Origin","*")
        self.send_header("Cross-Origin-Resource-Policy","cross-origin")
        self.send_header("Referrer-Policy","no-referrer")
        self.send_header("X-Content-Type-Options","nosniff")
        self.send_header("Cache-Control","public, max-age=300" if name.endswith((".wasm",".pck")) else "no-store")
        self.end_headers()
        try:self.wfile.write(data)
        except (BrokenPipeError,ConnectionResetError):pass
if __name__=="__main__":
    port=int(sys.argv[1]) if len(sys.argv)>1 else 18769
    print("TEMP_DEMO_SERVER http://127.0.0.1:"+str(port),flush=True)
    ThreadingHTTPServer(("127.0.0.1",port),Handler).serve_forever()
