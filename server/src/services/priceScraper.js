'use strict';

/* Scrapes the public WooCommerce product page for the current AED prices.
   Kept verbatim from the original single-file server: the parsing is tuned to
   that page's markup and European number format (2.499,00). */

let _priceCache = { adults: null, students: null };
const PRICE_REFRESH_MS = 7 * 24 * 60 * 60 * 1000; // 1 Week

async function fetchAndCachePrice() {
  try {
    const r = await fetch('https://everlastwellness.store/product/aljameela-club/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AljameelaBot/1.0)', Accept: 'text/html' },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    // All prices on this AED store use European format: 2.499,00 (dot=thousands, comma=decimal)
    const parseEU = s => {
      const m = s.match(/([\d.,]+)/);
      return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : NaN;
    };
    const fmtRaw = s => {
      const m = s.match(/([\d.,]+)/);
      return m ? m[1].replace(/[.,]00$/, '') : null;
    };
    const stripTags = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

    // WooCommerce renders the main product price inside <p class="price">...</p>.
    // Extract that block first so we only parse the product's own price, not related products.
    const priceSectionRe = /<p[^>]*\bclass="[^"]*\bprice\b[^"]*"[^>]*>([\s\S]*?)<\/p>/g;
    let priceSection = null;
    let psm;
    while ((psm = priceSectionRe.exec(html)) !== null) {
      if (psm[1].includes('woocommerce-Price-amount')) {
        priceSection = psm[1];
        break;
      }
    }

    console.log('[price] price section found:', priceSection ? 'yes' : 'no');

    const source = priceSection ?? html;
    const found = [];
    const blockRe = /class="woocommerce-Price-amount[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
    let m;
    while ((m = blockRe.exec(source)) !== null) {
      const inner = stripTags(m[1]);
      const val = parseEU(inner);
      const raw = fmtRaw(inner);
      console.log('[price] amount:', JSON.stringify(inner), '→', val);
      if (!isNaN(val) && val >= 100 && raw) found.push({ raw, val });
    }

    console.log('[price] found:', JSON.stringify(found));
    const unique = [...new Map(found.map(p => [p.val, p])).values()].sort((a, b) => b.val - a.val);

    if (unique.length === 0) {
      console.warn('[price] Could not parse price from store page');
      return;
    }

    _priceCache = {
      adults:   unique[0].raw,
      students: unique.length > 1 ? unique[unique.length - 1].raw : null,
    };
    console.log('[price] Cache updated:', JSON.stringify(_priceCache));
  } catch (err) {
    console.error('[price] Fetch error:', err.message);
  }
}

/** Warms the cache immediately, then refreshes weekly. */
function startPriceRefresh() {
  fetchAndCachePrice();
  setInterval(fetchAndCachePrice, PRICE_REFRESH_MS);
}

/** Current cached prices, served as-is to the client. */
function getPrices() {
  return _priceCache;
}

module.exports = { startPriceRefresh, getPrices, fetchAndCachePrice };
