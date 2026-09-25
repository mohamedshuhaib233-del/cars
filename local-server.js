import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  let rawPath = req.url.split('?')[0];
  if (rawPath === '/' || rawPath === '') {
    rawPath = '/index.html';
  }

  // Decode URI component so folders like "3D%20VIDEO%20HEROSECTION" resolve to "3D VIDEO HEROSECTION"
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(rawPath);
  } catch (e) {
    decodedPath = rawPath;
  }

  const safePath = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + decodedPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isVideo = ext === '.mp4' || ext === '.webm' || ext === '.mov';

    // Handle HTTP Range requests for video seeking and streaming
    if (isVideo && req.headers.range) {
      const range = req.headers.range;
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      stream.pipe(res);
      return;
    }

    // Allow caching for images so frame scrolling is butter smooth
    const isImage = ext === '.png' || ext === '.jpg' || ext === '.webp';
    const cacheControl = isImage 
      ? 'public, max-age=86400, immutable' 
      : 'no-cache, no-store, must-revalidate';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': cacheControl,
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('\n========================================================');
  console.log('  🏎️  3D HERO SECTION // SCROLL ANIMATION DEV SERVER  🏎️');
  console.log('========================================================');
  console.log(`  ➜ Local URL: http://localhost:${PORT}/`);
  console.log('  ➜ Ready for ultra-smooth 60-120fps scrolling!\n');
});
