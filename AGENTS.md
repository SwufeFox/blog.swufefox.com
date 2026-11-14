# Repository Guidelines

## Scope

`blog.swufefox.com` is the content repository for the bilingual SwufeFox community blog, authored by Magixyne. Chinese posts are published at the root locale; English translations use `/en`.

The application, styles, Markdown pipeline and static builder live in [`SwufeFox/ak-blog`](https://github.com/SwufeFox/ak-blog). Keep application code, package manifests, dependency lockfiles and framework configuration in that repository.

## Files

- `content/posts/*.md`: Chinese articles; the filename is the public slug.
- `content/posts/en/*.md`: English translations with matching filenames.
- `content/images/`: article images and site artwork.
- `site.json`: site identity, localized descriptions, canonical origin, author, links, home-page count and content license, using the upstream `SiteOptions` contract.
- `README.md`: writing, building and deployment instructions for this content repository.

## Writing

- Front matter requires `title`, `description` and `date`. Dates and optional `updated` use `YYYY-MM-DD`; `tags` is a list. `category` is optional. `draft: true` excludes a post from production output.
- Keep translation filenames aligned and preserve published slugs unless a redirect is deliberately arranged upstream.
- Chinese image references use `../images/name.ext`; English references use `../../images/name.ext`. The builder exports images under `/content/images/`.
- Markdown supports GFM, math, highlighted code and `data`, `stats`, `mermaid`, `sketch`, `echarts` fences. Follow the upstream [writing guide](https://github.com/SwufeFox/ak-blog/blob/main/docs/writing.md).
- Preserve authored text and existing article licenses during repository maintenance. Articles use CC BY-NC-SA 4.0; the existing MIT license remains in `LICENSE`.
- `site.json` accepts data only. Follow upstream configuration fields rather than restoring TypeScript configuration or application customizations here.

## Build & Verification

Node.js 20.9+ is needed only for building; Node.js 22 is recommended. Use the published version 1.0.2 explicitly:

```sh
npx --yes @swufefox/ak-blog@1.0.2 build --content ./content --config ./site.json --out ./out
```

Keep the builder version pinned rather than following `latest`. Do not install application dependencies in this content repository.

- A real `ak-blog build` validates front matter and Markdown. For repository extraction, also verify that articles and image bytes are preserved.
- There is no local lint command, TypeScript project or test runner. Do not run obsolete `npm run build`, `npm run lint` or `tsc` commands here.
- `out/` is generated and ignored. The builder accepts an empty/missing output directory or its own previous output, not an unrelated old export.
- `NEXT_PUBLIC_SITE_URL` overrides `site.json.url` at build time for canonical, RSS and sitemap URLs.
- Cloudflare Pages uses preset `None`, the command above, and output `out`. Deployment is fully static; no Node runtime or Functions are required.
- Renderer or UI changes and their browser checks belong in `ak-blog`; content changes should be checked against the real builder.
