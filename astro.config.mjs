// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://chaudglace.com',
  integrations: [
    svelte(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Prioritize main page and menu sections higher
        if (item.url === 'https://chaudglace.com/') {
          item.priority = 1.0;
        } else if (item.url.includes('#')) {
          item.priority = 0.9;
        }
        return item;
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});