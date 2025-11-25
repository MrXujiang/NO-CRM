const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 5173;
const BACKEND_PORT = 3005;
const PUBLIC_DIR = process.argv[2] || '.';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// 代理 API 请求到后端
function proxyRequest(req, res) {
  const options = {
    hostname: 'localhost',
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error('代理请求失败:', err.message);
    res.writeHead(502);
    res.end('Bad Gateway: 无法连接到后端服务');
  });

  req.pipe(proxy, { end: true });
}

const server = http.createServer((req, res) => {
  // 如果是 API 请求，代理到后端
  if (req.url.startsWith('/api/')) {
    proxyRequest(req, res);
    return;
  }

  // 处理静态文件
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);

  // 处理 SPA 路由
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n================================');
  console.log('前端服务启动成功！');
  console.log('================================');
  console.log('\n可通过以下地址访问：');
  console.log('  - http://localhost:' + PORT);
  console.log('  - http://127.0.0.1:' + PORT);

  // 获取本地 IP 地址
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log('  - http://' + iface.address + ':' + PORT);
      }
    }
  }

  console.log('\n✓ API 请求将代理到: http://localhost:' + BACKEND_PORT);
  console.log('\n================================');
});
