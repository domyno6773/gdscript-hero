#!/usr/bin/env python3
"""Test-only static Godot server enabling public CORS for an opaque-origin iframe."""
import functools
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class CorsStaticHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cross-Origin-Resource-Policy", "cross-origin")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: cors_server.py PORT STATIC_DIRECTORY")
    handler = functools.partial(CorsStaticHandler, directory=sys.argv[2])
    server = ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1])), handler)
    server.serve_forever()
