// Sirve el build de produccion y redirige /api al backend.
// Uso: node scripts/serve-dist.mjs   (despues de npm run build)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PREVIEW_PORT ?? 4173);
const API_TARGET = process.env.API_TARGET ?? 'http://localhost:4001';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

if (!fs.existsSync(distDir)) {
  console.error('No existe dist/. Ejecuta primero: npm run build');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api')) {
    const target = `${API_TARGET}${req.url}`;
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

      const upstream = await fetch(target, {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] ?? 'application/json',
          ...(req.headers.authorization
            ? { Authorization: req.headers.authorization }
            : {}),
        },
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
      });

      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch (error) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: { message: error.message } }));
    }
    return;
  }

  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n  BabyTrack IA - build de produccion`);
  console.log(`  App:      http://localhost:${PORT}`);
  console.log(`  API:      ${API_TARGET}\n`);
});
