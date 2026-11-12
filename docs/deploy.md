# 部署（Cloudflare Pages）

博客以 **静态导出** 发布，不需要 Node 运行时。`npm run build` 会执行 `next build`，随后
`postbuild` 脚本把产物整理成 Cloudflare Pages 能直接服务的 `out/`。

## Cloudflare Pages 设置

| 字段 | 值 |
| --- | --- |
| Framework preset | **Next.js (Static HTML Export)**（没有该选项时选 None，手动填下面两项） |
| Build command | **`npm run build`** |
| Build output directory | **`out`** |
| Root directory | 留空或 `/`（仓库根目录） |
| Branch | `main` |

构建命令必须是 `npm run build`，不要写成 `npx next build`：构建后的 `postbuild` 才会复制默认语言页面、图片和 404。

### 环境变量

| 变量 | 值 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 首轮可用 `https://blog-swufefox-com.pages.dev`；接上自定义域名后改为 `https://blog.swufefox.com` |
| `NODE_VERSION` | `22`（构建需要 Node 20.9+） |

`NEXT_PUBLIC_SITE_URL` 会被写进 canonical、RSS、sitemap、OG 卡片和结构化数据，所以要在构建前设好。

## 本地构建

```sh
npm ci
npm run build     # next build + scripts/export-static.mjs
npm run preview   # npx serve out
```

`npm run dev` 仍然在 `http://localhost:3000` 用 `/` 访问默认语言；它使用开发期的重写，不依赖静态复制。

## 构建后处理

`scripts/export-static.mjs` 做三件事：

1. 把 `content/images` 复制到 `out/content/images`，正文里的 `/content/images/...` 继续有效；
2. 把 `out/zh` 的页面复制到 `out` 根目录，让默认语言仍然位于 `/`；
3. 把 `public/404.html` 复制成 `out/404.html`，使用带 SwufeFox 外观的静态 404。

`public/_redirects` 把重复的 `/zh/...` 301 回根路径；`public/_headers` 给无扩展名的
`/og` 文件补上 `image/png`。

## 自定义域名

在 Pages 项目里绑定 `blog.swufefox.com`，然后把 `NEXT_PUBLIC_SITE_URL` 改成
`https://blog.swufefox.com` 并重新部署。`_redirects`、OG、RSS 与 sitemap 都会跟着新域名生成。

## 上线后检查

```sh
curl -sI https://blog-swufefox-com.pages.dev/                         # 200
curl -sI https://blog-swufefox-com.pages.dev/en                       # 200
curl -sI https://blog-swufefox-com.pages.dev/feed.xml                 # 200, application/rss+xml
curl -sI https://blog-swufefox-com.pages.dev/og                       # 200, image/png
curl -s  https://blog-swufefox-com.pages.dev/sitemap.xml | head
curl -sI https://blog-swufefox-com.pages.dev/nope                     # 404, 自定义 404
curl -sI https://blog-swufefox-com.pages.dev/content/images/pipeline.svg # 200
curl -sI https://blog-swufefox-com.pages.dev/zh                       # 301 → /
```

Cloudflare Pages 会把 `/en.html` 匹配到 `/en`、`/posts/x.html` 匹配到 `/posts/x`；不需要额外重写。
