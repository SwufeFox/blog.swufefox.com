# blog.swufefox.com

SwufeFox（西南财经大学学生开源社区）的博客，作者 [Magixyne](https://github.com/Magixyne)。
基于 [`open-ak-blog-template`](https://github.com/SwufeFox/ak-blog-template)，用 Next.js 16 与
ak-ui 搭成；狐狸标记、海军蓝与金色 Hero 是 SwufeFox 的品牌层。

> The final variable is yours to change.

## 开始

```sh
npm ci
npm run dev          # http://localhost:3000
npm run build        # 静态导出 + postbuild → out/
npm run preview      # npx serve out
```

`npm run lint`、`npx tsc --noEmit`。构建需要 Node 20.9+。

## 内容

- `content/posts/*.md`：中文文章，文件名即 slug；`content/posts/en/` 放同名英文版。
- `content/images/`：正文图片；`src/site.config.ts`：站点身份、语言与导航。
- `src/lib/`：文章校验、Markdown 管线、i18n 与 URL。
- `src/app/[locale]/`：首页、文章、归档、搜索、RSS 与 404。

第一篇：[把博客做成一台档案终端](content/posts/how-this-blog-was-built.md)。

## 部署

Cloudflare Pages 静态导出：Framework preset **Next.js (Static HTML Export)**，Build command
**`npm run build`**，Output **`out`**；构建前设置 `NEXT_PUBLIC_SITE_URL`。详见
[`docs/deploy.md`](docs/deploy.md)。

## 文档与许可

[写作](docs/writing.md) · [配置](docs/configuration.md) · [设计](docs/design-system.md) ·
[架构](docs/architecture.md) · [部署](docs/deploy.md)

代码 [MIT](LICENSE)；文章 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。
GitHub：<https://github.com/SwufeFox> · 加入 / 贡献：<magi0@swufefox.com>
