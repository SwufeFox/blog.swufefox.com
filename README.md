# blog.swufefox.com

SwufeFox 的博客，作者 [Magixyne](https://github.com/SwufeFox)。站点从
[`open-ak-blog-template`](https://github.com/SwufeFox/ak-blog-template) 生长而来，保留模板的
构建方式与 ak-ui 设计语言。

界面以档案纸面、深色 Hero 和动作黄为主；首页、文章、归档、搜索、RSS 与 404 都由同一套
Next.js App Router 路由生成。文章在 `next build` 时解析、校验并渲染，运行时只负责路由、
图片与 404。

- **双语**：中文在根路径，英文在 `/en`；同名文件互为翻译。
- **Markdown**：目录、代码高亮、公式、数据表、KPI、Mermaid、手写 SVG、ECharts。
- **主题**：`archive` 浅色默认，`terminal` 深色可切换并记忆。
- **构建时定稿**：文章、归档、RSS、sitemap、OG 卡片都在构建时生成。

## 开始

```sh
npm ci
npm run dev          # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
npm start
```

Node 20.9 以上。构建前设置站点地址（默认已是 `https://blog.swufefox.com`）：

```sh
NEXT_PUBLIC_SITE_URL=https://blog.swufefox.com npm run build
```

## 内容

```text
content/posts/            中文文章，文件名就是 slug
content/posts/en/         同一篇文章的英文版
content/images/           正文图片，由 /content/images/ 提供
src/site.config.ts        站点身份、语言、导航与 licence
src/lib/posts.ts          文章读取、front matter 校验、翻译与归档
src/lib/markdown.ts       Markdown 管线、自定义代码块与目录
src/app/[locale]/         首页、文章、归档、搜索、404、RSS
src/components/           页头、页脚、文章列表、目录、搜索、主题与图表运行时
src/styles/globals.css    ak-ui 主题映射与全站样式
```

第一篇笔记是 [`how-this-blog-was-built.md`](content/posts/how-this-blog-was-built.md)，记录了这套
模板从 mizore 的 Go 博客到 Next.js 与 ak-ui 的重写过程。

## 文档

模板引擎的细节仍在 `docs/`：

| 文档 | 内容 |
| --- | --- |
| [写文章](docs/writing.md) | 元数据、代码、公式、图片与自定义块 |
| [配置与主题](docs/configuration.md) | `site.config.ts`、界面文案、语言与配色 |
| [设计系统](docs/design-system.md) | ak-ui 组件、信号色、版式与取舍 |
| [架构](docs/architecture.md) | 路由、渲染管线、客户端边界、搜索 |
| [部署](docs/deploy.md) | Node 主机、Vercel / Netlify、子路径与静态托管取舍 |

## 部署

默认部署到 Node 主机或 Vercel / Netlify，使用 `next start`。代理、动态 404 与
`/content/images/` 图片路由需要运行时；纯静态导出需要按 [`docs/deploy.md`](docs/deploy.md)
迁移。

## 许可

代码以 [MIT License](LICENSE) 发布。文章内容采用
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。

设计语言来自 [YunYouJun/ak-ui](https://github.com/YunYouJun/ak-ui)、
[MooncellWiki/prts-design](https://github.com/MooncellWiki/prts-design) 与
[SwufeFox/ak-ui-react](https://github.com/SwufeFox/ak-ui-react)（MIT）。
