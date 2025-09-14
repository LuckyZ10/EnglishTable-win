import http.server
import socketserver
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    # 启用CORS
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    # 处理OPTIONS请求
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

# 更改工作目录到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f'Serving at http://localhost:{PORT}')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('Server stopped')
        httpd.server_close()