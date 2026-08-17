const http = require('http');
const fs = require('fs');
const path = require('path');

const startPort = Number(process.env.PORT) || 3000;
const root = __dirname;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

function createServer() {
  return http.createServer((request, response) => {
  const urlPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = path.join(root, decodeURIComponent(urlPath.split('?')[0]));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': types[path.extname(filePath)] || 'text/plain; charset=utf-8',
    });
    response.end(content);
  });
  });
}

function listen(port) {
  const server = createServer();

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      listen(port + 1);
      return;
    }

    console.error(error);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`Open http://localhost:${port}`);
  });
}

listen(startPort);
