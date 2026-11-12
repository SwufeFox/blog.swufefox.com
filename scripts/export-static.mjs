import { cp, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const out = 'out'
const defaultLocale = 'zh'

// Route handlers cannot run on Cloudflare Pages; `content/images` is copied
// into the export so the Markdown pipeline's `/content/images/...` URLs work.
await mkdir(join(out, 'content'), { recursive: true })
await cp('content/images', join(out, 'content', 'images'), { recursive: true, force: true })

// The [locale] route exports `/zh/...` and `/zh.html`; the public site keeps
// the default locale at the root, so copy those next to `/en`.
for (const entry of await readdir(join(out, defaultLocale))) {
  await cp(join(out, defaultLocale, entry), join(out, entry), {
    recursive: true,
    force: true,
  })
}
await cp(join(out, `${defaultLocale}.html`), join(out, 'index.html'), { force: true })

// Next's generic export 404 does not know about the site shell; use the static
// branded page instead.
await cp('public/404.html', join(out, '404.html'), { force: true })
