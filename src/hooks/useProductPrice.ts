import { useState, useEffect } from 'react';

export interface PriceData {
  adults: string | null;
  students: string | null;
}

let _cache: PriceData | null = null;
let _cacheTs = 0;
const CACHE_MS = 5 * 60 * 1000;
const RETRY_MS = 3000;

export function useProductPrice(): PriceData {
  const [prices, setPrices] = useState<PriceData>({ adults: null, students: null });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Use cache only if it contains real data
      if (_cache && _cache.adults !== null && (Date.now() - _cacheTs) < CACHE_MS) {
        setPrices(_cache);
        return;
      }

      try {
        const r = await fetch('/api/product-price');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data: { adults: string | null; students: string | null } = await r.json();
        if (cancelled) return;

        const result: PriceData = { adults: data.adults ?? null, students: data.students ?? null };
        setPrices(result);

        if (result.adults !== null) {
          // Got real data — cache it
          _cache = result;
          _cacheTs = Date.now();
        } else {
          // Server cache not warm yet — retry shortly
          setTimeout(() => { if (!cancelled) load(); }, RETRY_MS);
        }
      } catch {
        if (!cancelled) setTimeout(() => { if (!cancelled) load(); }, RETRY_MS);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return prices;
}
