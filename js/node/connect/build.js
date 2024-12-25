const http = require('http');

export const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      console.log('Req Json:', parsedBody);
            res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('JSON data accepted');
    } catch (error) {
      console.error('JSON parse error:', error);
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Invalid JSON data.');
    }
  });
});
export function build(){
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
}