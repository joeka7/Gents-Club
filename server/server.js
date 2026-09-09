'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors    = require('cors');

const contactRoute      = require('./src/routes/contact');
const productPriceRoute = require('./src/routes/productPrice');
const healthRoute       = require('./src/routes/health');
const { verifyTransport }   = require('./src/services/mailer');
const { startPriceRefresh } = require('./src/services/priceScraper');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    'http://localhost:4173',
  ],
  methods: ['GET', 'POST'],
}));

// ─── Startup checks / background work ────────────────────────────────────────
verifyTransport();
startPriceRefresh();

// ─── API ──────────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRoute);
app.use('/api/product-price', productPriceRoute);
app.use('/api/health', healthRoute);

// ─── Serve Vite build (production) ───────────────────────────────────────────
// The catch-all must stay last so it never shadows an /api route. The
// '/{*path}' form is Express 5 syntax — under Express 4 it matches literally
// and every deep link 404s.
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✦  Aljameela Club server running at http://localhost:${PORT}\n`);
});
