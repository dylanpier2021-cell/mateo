// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/data/business';

// https://astro.build/config
export default defineConfig({
  // `site` drives canonical URLs, sitemap.xml and og:url — and A2P reviewers do
  // check that the site they're sent to matches the registered domain.
  site: SITE.url,

  // Static output — deploy /dist to Netlify / Vercel / Cloudflare Pages.
  output: 'static',

  // Clean URLs: /get-a-free-quote — this exact path is what gets submitted to
  // the carrier as the opt-in URL, so it must not drift.
  trailingSlash: 'never',

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  vite: {
    // Cast avoids a cosmetic type clash between Astro's bundled Vite and
    // Tailwind's peer Vite (dual install). Runtime is unaffected.
    plugins: [/** @type {any} */ (tailwindcss())],
  },

  image: {
    responsiveStyles: true,
  },
});
