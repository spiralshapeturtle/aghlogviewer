const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const ADGUARD_HOST = process.env.ADGUARD_HOST || 'http://172.16.1.254:3000';
const ADGUARD_AUTH = process.env.ADGUARD_AUTH || null; // "user:pass" of leeg
const PORT = process.env.PORT || 3000;

const app = express();

// 1) Serve statics uit /public
app.use(express.static(path.join(__dirname, 'public')));

// 2) Fallback voor /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3) Proxy enkel /api/querylog
const proxyOpts = {
  target: ADGUARD_HOST,
  changeOrigin: true,
  pathRewrite: { '^/api/querylog': '/control/querylog' },
  ...(ADGUARD_AUTH ? { auth: ADGUARD_AUTH } : {})
};
app.use('/api/querylog', createProxyMiddleware(proxyOpts));

app.listen(PORT, () => {
  console.log(`Log Viewer draait op poort ${PORT}, haalt data op bij ${ADGUARD_HOST}`);
});