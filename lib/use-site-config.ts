'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_CONFIG, normalizeConfig, SiteConfig } from './site-config';

// Simple module-level cache so every component shares one fetch per page load.
let cached: SiteConfig | null = null;
let inflight: Promise<SiteConfig> | null = null;

function load(): Promise<SiteConfig> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = fetch('/api/site-config')
    .then((r) => (r.ok ? r.json() : DEFAULT_CONFIG))
    .then((j) => { cached = normalizeConfig(j); return cached; })
    .catch(() => { cached = DEFAULT_CONFIG; return cached; })
    .finally(() => { inflight = null; });
  return inflight;
}

/**
 * Returns the site config (shipping, GST, announcement, WhatsApp, COD).
 * Starts from DEFAULT_CONFIG so the UI is correct instantly, then updates
 * once the WordPress-managed values load.
 */
export function useSiteConfig(): SiteConfig {
  const [config, setConfig] = useState<SiteConfig>(cached ?? DEFAULT_CONFIG);

  useEffect(() => {
    let alive = true;
    load().then((c) => { if (alive) setConfig(c); });
    return () => { alive = false; };
  }, []);

  return config;
}
