"""Serve one or two builds locally with a read-only proxy for public CMS GETs."""
import argparse
import re
from functools import lru_cache
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Event, Thread
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import urlopen

API = 'https://ap-v2-1.ljconstrutic.com/v2'


@lru_cache(maxsize=128)
def cms(path):
    with urlopen(API + path, timeout=12) as response:
        return response.read()


def handler(root):
    class Preview(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=root, **kwargs)

        def send_bytes(self, body, mime, status=200):
            self.send_response(status)
            self.send_header('Content-Type', mime)
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)

        def send_head(self):
            path = urlsplit(self.path).path.rstrip('/')
            if re.fullmatch(r'/__audit_api/(languages|pages/[a-zA-Z0-9-]+)', path):
                try:
                    body = cms(self.path.removeprefix('/__audit_api'))
                except HTTPError as error:
                    self.send_bytes(b'{}', 'application/json', error.code)
                except OSError:
                    self.send_bytes(b'{}', 'application/json', 502)
                else:
                    self.send_bytes(body, 'application/json')
                return None
            if re.fullmatch(r'/[a-zA-Z0-9-]+\.js', path):
                asset = Path(root) / path[1:]
                if asset.is_file():
                    body = asset.read_bytes().replace(API.encode(), b'/__audit_api')
                    self.send_bytes(body, 'text/javascript')
                    return None
            if re.fullmatch(r'(/[a-zA-Z0-9_-]+)+', path):
                if (Path(root) / 'index.csr.html').exists():
                    redirects = {'/about': '/about/about-detail', '/privated': '/privacy'}
                    if path in redirects:
                        self.send_response(301)
                        self.send_header('Location', redirects[path])
                        self.send_header('Content-Length', '0')
                        self.end_headers()
                        return None
                    document = Path(root) / 'route-html' / (path[1:] + '.html')
                    if document.is_file():
                        self.send_bytes(document.read_bytes(), 'text/html; charset=utf-8')
                    elif re.fullmatch(r'/(product-detail|service-detail)/[^/]+', path):
                        self.send_bytes((Path(root) / 'index.csr.html').read_bytes(), 'text/html; charset=utf-8')
                    else:
                        self.send_bytes((Path(root) / '404.html').read_bytes(), 'text/html; charset=utf-8', 404)
                    return None
                self.path = '/index.html'
            return super().send_head()
    return Preview


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('builds', nargs='+', help='PORT=PATH, one per build')
    args = parser.parse_args()
    for build in args.builds:
        port, directory = build.split('=', maxsplit=1)
        root = Path(directory).resolve(strict=True)
        server = ThreadingHTTPServer(('127.0.0.1', int(port)), handler(root))
        Thread(target=server.serve_forever, daemon=True).start()
    Event().wait()
