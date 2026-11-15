/**
 * The Grind — development server.
 * A dependency-free static server with a health endpoint.
 *
 *   npm start          (or: node server.js)
 *   → http://localhost:5173
 *
 * Deployed on GitHub Pages from the `main` branch.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, app: "The Grind", by: "Anjul Sati" }));
    return;
  }

  let file = url.pathname === "/" ? "/index.html" : url.pathname;
  file = file.split("?")[0];
  const full = path.normalize(path.join(ROOT, file));

  if (!full.startsWith(ROOT)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  fs.readFile(full, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(full)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  The Grind — running at http://localhost:${PORT}\n  Plan by Anjul Sati\n`);
});
