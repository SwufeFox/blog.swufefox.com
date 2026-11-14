# blog.swufefox.com

SwufeFox（西南财经大学学生开源社区）的博客内容仓库，作者 [Magixyne](https://github.com/Magixyne)。
页面、样式、Markdown 渲染和静态构建统一由 [`SwufeFox/ak-blog`](https://github.com/SwufeFox/ak-blog) 提供。
本仓库维护文章、图片和站点配置。

> The final variable is yours to change.

## 内容

- `content/posts/*.md`：中文文章，文件名即 slug，发布到 `/posts/<slug>`。
- `content/posts/en/*.md`：同名英文翻译，发布到 `/en/posts/<slug>`。
- `content/images/`：正文图片和站点素材，包含狐狸标记 `swufefox.jpg`。
- `site.json`：站点名称、双语简介、域名、作者、链接、首页篇数和文章许可。

新文章需要 YAML front matter：

```yaml
---
title: 文章标题
description: 一句话摘要。
date: '2026-11-14'
category: 随笔
tags: [开源, 写作]
---
```

`title`、`description`、`date` 必填；日期使用 `YYYY-MM-DD`，`tags` 使用列表。
`draft: true` 的文章不进入生产构建。中英文翻译使用相同文件名。
中文文章的图片路径为 `../images/文件名`，英文文章为 `../../images/文件名`。
完整 Markdown 和图表语法见 [ak-blog 写作指南](https://github.com/SwufeFox/ak-blog/blob/main/docs/writing.md)。

## 构建

需要 Node.js 20.9+，推荐 Node.js 22。本仓库不需要 `package.json` 或本地前端依赖。
在仓库根目录使用已发布的 `@swufefox/ak-blog@1.0.2` 构建，显式固定版本以避免跟随 `latest`：

```sh
npx --yes @swufefox/ak-blog@1.0.2 build --content ./content --config ./site.json --out ./out
```

构建会校验文章并生成完整静态站。`out/` 不提交；输出目录须为空、不存在，或由 `ak-blog` 生成。
首次切换时，旧模板生成的非空 `out/` 需要先移走。
站点默认域名是 `site.json` 中的 `https://blog.swufefox.com`，可在构建前通过 `NEXT_PUBLIC_SITE_URL` 覆盖。

Windows 本地构建时，npm 缓存与临时工作区应放在同一磁盘，避免 Next.js 生成无效的跨盘模块路径。
若 npm 使用默认缓存，可先在 PowerShell 中设置当前会话的临时目录，再运行上面的构建命令：

```powershell
$env:TEMP = "$env:LOCALAPPDATA\Temp"
$env:TMP = $env:TEMP
```

## Cloudflare Pages

连接本内容仓库，使用以下构建设置：

| 设置 | 值 |
| --- | --- |
| Framework preset | `None` |
| Build command | `npx --yes @swufefox/ak-blog@1.0.2 build --content ./content --config ./site.json --out ./out` |
| Build output directory | `out` |
| Root directory | 仓库根目录 |
| `NODE_VERSION` | `22` |
| `NEXT_PUBLIC_SITE_URL` | `https://blog.swufefox.com`；预览环境可设为 `https://blog-swufefox-com.pages.dev` |

部署产物不需要 Node 服务或 Pages Functions。404、重定向和静态响应头由 `ak-blog` 生成。
构建与部署的实现细节见 [ak-blog 部署指南](https://github.com/SwufeFox/ak-blog/blob/main/docs/deploy.md)。

## 许可与联系

文章采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)，既有 MIT 许可保留于 [LICENSE](LICENSE)。
GitHub：<https://github.com/SwufeFox> · 加入 / 贡献：<magi0@swufefox.com>
