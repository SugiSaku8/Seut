from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # リクエストヘッダーを取得
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            # JSONデータをパース
            parsed_body = json.loads(post_data.decode())
            
            # パースしたJSONデータをコンソールにログ出力
            print('受信したJSON:', parsed_body)
            
            # レスポンスを返す（この例では空のレスポンス）
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'JSONデータを受け付けました')
        except json.JSONDecodeError:
            print('無効なJSONデータです')
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'無効なJSONデータです')

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f'Server running on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
