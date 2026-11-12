import type { NextConfig } from 'next'

import { siteConfig } from './src/site.config'

const base = siteConfig.defaultLocale
const isDev = process.env.NODE_ENV === 'development'

/**
 * Cloudflare Pages serves a static export. Locale routing is completed by
 * `scripts/export-static.mjs`, which copies the default-locale output to the
 * root; `public/_redirects` sends the duplicate /zh paths back to the root.
 * Development keeps the same root-path rewrites as the template.
 */
const nextConfig: NextConfig = {
  ...(isDev
    ? {
        async rewrites() {
          return {
            beforeFiles: [
              { source: '/', destination: `/${base}` },
              { source: '/posts/:slug', destination: `/${base}/posts/:slug` },
              { source: '/tags', destination: `/${base}/tags` },
              { source: '/tags/:tag', destination: `/${base}/tags/:tag` },
              { source: '/search', destination: `/${base}/search` },
              { source: '/feed.xml', destination: `/${base}/feed.xml` },
            ],
            afterFiles: [],
            fallback: [],
          }
        },
      }
    : {
        output: 'export',
        images: { unoptimized: true },
      }),
}

export default nextConfig
