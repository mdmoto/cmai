# Chiang Mai AI Center — SEO / GEO 审计报告

> 审计日期：2026-10-27 · 对象：`/Users/adam/Desktop/cmai`（Next.js 16 静态导出 → Cloudflare Pages，域名 lazzor.com）
> 依据：Google 官方搜索文档（抓取→索引→呈现三阶段）+ GEO（AI 搜索）最佳实践
> 验证方式：实际检查 `src/` 源码、`next.config.ts`、`out/` 导出产物的 HTML head

---

## P0 — 严重问题（不修，收录基本白做）

### 1. 没有 robots.txt 和 sitemap.xml ❌
`out/` 导出产物里两者都不存在，Google 无法高效发现页面，spec 里承诺的 "Sitemap · Robots" 并未交付。

**修法（二选一）：**
- 简单：在 `public/` 放静态 `robots.txt` 和 `sitemap.xml`
- 推荐：新增 `src/app/robots.ts` 和 `src/app/sitemap.ts`（Next 静态导出支持，build 时自动生成）

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/workspace", "/vpn", "/contract"].map((p) => ({
    url: `https://lazzor.com${p}`,
    lastModified: new Date(),
  }));
}
```

### 2. 全站 4 个页面共用同一套 title / description ❌
`workspace.html`、`vpn.html`、`contract.html` 的 `<title>` 全部是首页的 "Chiang Mai AI Center | Business Infrastructure in Thailand"。原因是这些 page 都是 `"use client"`，无法导出 `metadata`。

**修法：** 把每个 page 拆成「server page 导出 metadata + 渲染 client 组件」的结构，或为每个路由加 `layout.tsx` 导出 metadata：

```
src/app/workspace/page.tsx        → server component，export const metadata
src/app/workspace/WorkspaceClient.tsx → 现有 "use client" 代码移到这里
```

### 3. 预渲染语言错乱：HTML 声明英文，正文却是中文 ⚠️（本站最大的隐性坑）
- `LanguageContext` 默认 `useState<Language>("zh")` → 静态导出的 `index.html` 里 h1 是「清迈 AI 中心」，正文全中文
- 但 `<html lang="en">`、title、description、JSON-LD 全是英文
- 用户浏览器里再靠 localStorage / navigator.language 切换 → 爬虫每次抓到的内容还可能不一样

Google 和 AI 引擎看到的页面 = 中文正文 + 英文元信息 + 错误的 lang 声明，对英文关键词（"office rental chiang mai" 等）的排名是致命伤。

**修法（按投入排序）：**
1. 最小改动：把默认语言改为 `"en"`（英文站定位），预渲染 HTML 与 meta 一致；用户端再按浏览器语言切换
2. 正确做法：URL 级 i18n（`/en/`、`/zh/`、`/th/`、`/ja/`）+ `hreflang` 互链，每个语言版本都是独立可收录页面 — 工作量大但收益最高，建议 v2 规划

### 4. 缺 canonical / metadataBase / og:image / twitter card
所有页面无 `<link rel="canonical">`、无 OG 图片（分享到 WhatsApp/LINE 没有预览大图，这对一个靠 LINE 获客的清迈业务很伤）。

**修法：** 在 `layout.tsx` 加：
```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://lazzor.com"),
  alternates: { canonical: "/" },
  openGraph: { ..., images: ["/images/og-cover.jpg"] }, // 制作 1200×630 封面图
  twitter: { card: "summary_large_image" },
};
```

---

## P1 — 高优先级

### 5. 结构化数据不完整
现有 `LocalBusiness` 是好的起点，但缺关键字段，且没有其他 schema：

| 缺失 | 价值 |
|---|---|
| `geo`（经纬度）+ `hasMap` | 本地搜索/AI 回答"位置在哪"的直接来源 |
| `telephone`、`openingHoursSpecification` | 本地富摘要必需 |
| `sameAs`（Google Maps、LINE、WhatsApp、colasola.com、ai.lazzor.com、cloud.lazzor.com） | 实体一致性，让 AI 引擎把多个域名归到同一实体 |
| `FAQPage` schema | FAQ 内容已经存在（Radix Accordion 内容在 DOM 里，直接标即可），加 schema 后可命中 AI Overview 和富摘要 |
| `BreadcrumbList` | 站点结构信号 |

注意：schema 里 `url: "https://lazzor.com"` 与实际部署域名要保持一致（如果最终域名不是 lazzor.com，全部同步改）。

### 6. 图片严重超重，Lighthouse 95+ 目标必然达不到
- `public/images` 共 **9.5MB**；`image_8.jpg` 869KB、`floor_1~5.png` 每张 640–860KB
- hero 轮播用 CSS `background-image` → 无 alt、无法 preload、无法响应式
- `images.unoptimized: true`（静态导出所迫）

**修法：**
- 全部转 WebP/AVIF（`cwebp -q 80`，预计减 70–85%）；floor plan PNG 可转 WebP 或压成 1600px 宽
- hero 首图改用 `<img>` / `<picture>` + `alt` + `<link rel="preload" as="image">`，背景装饰图才用 CSS
- 或接 Cloudflare Images / Polish 在 CDN 层做格式转换与压缩

### 7. 首页与 /workspace 内容大面积重复
`workspace/page.tsx` 把 Navbar→Hero→About→Workspace→Services→Pricing→Gallery→FAQ→Contact 全套渲染了一遍，和首页高度重复 → 重复内容稀释排名。建议 /workspace 聚焦楼层平面、办公室规格与报价，About/Services 等只保留在首页（或反向）。

### 8. 图片无 alt、标题层级混乱
- 全站图片组件几乎无 `alt`；gallery 图片对图片 SEO 和 AI 理解都是浪费
- index 预渲染 h1 是中文、workspace 预渲染 h1 是英文，页与页之间标题层级需要统一规范（每页唯一 h1）

---

## P2 — GEO（AI 搜索优化）专项

Google 官方明确：**GEO 不是新玩法，不需要 llms.txt**，核心还是「高质量、可引用、实体一致」的内容。针对本站：

### 9. 营销卡片式文案 → 缺少 AI 可引用的"事实型内容" ⚠️
现在全站是 Apple 风格的短句卡片，视觉很好，但 AI 引擎（AI Overview / ChatGPT / Perplexity）引用的是**能直接回答用户问题的事实段落**。你手里其实有一堆独特一手素材没被内容化：

建议新增 2–4 个干货页（英文优先），例如：
- `How a Foreigner Can Rent an Office & Register a Company in Chiang Mai`（把 FAQ 6 条扩成完整指南，含流程、费用区间、时间线）
- `BOI Incentives for Tech Companies in Thailand: What Actually Applies`
- `Chiang Mai vs Bangkok for Tech Teams: Cost & Infrastructure Comparison`
- 价目透明页（PricingCalculator 里的数据本身就是差异化内容——大多数竞品不公开价格）

这些是 AI 查询扇出（"chiang mai company registration cost"、"thailand BOI office requirement"）时会被检索引用的页面，也是竞品（普通 co-working 站）没有的深度。

### 10. 本地 SEO 最大杠杆：Google Business Profile
对一个实体办公场地，GBP 的价值可能超过所有站内优化。注册并验证 GBP，NAP（Name / Address / Phone）与 JSON-LD、页脚完全一致，把 GBP 的地图链接回填到 schema 的 `hasMap`。再收集入驻团队的真实评价（review 会进入 AI 回答）。

### 11. 生态域名实体网络
lazzor.com / ai.lazzor.com / cloud.lazzor.com / colasola.com 四个域互相提及但零结构化关联。在 schema `sameAs` + 各站页脚互链中固定下来，让 AI 建立实体图谱，而不是当成四个不相干网站。

---

## P3 — 顺手清理

- **删掉 `keywords` meta** — Google 明确不用 meta keywords，纯噪音
- `public/_headers` 目前只有 mobileconfig 一条，建议补安全头（X-Content-Type-Options、Referrer-Policy）和 `_next/static` 长缓存
- icon 用的是 `/images/logo.png`，建议补专用 favicon（多尺寸）+ `apple-icon` + 1200×630 的 `opengraph-image`
- 上线后第一周：Search Console 验证 → 提交 sitemap → Rich Results Test 跑一遍 JSON-LD → PageSpeed Insights 记录基线

---

## 修复优先级清单（TL;DR）

| # | 事项 | 类型 | 工作量 |
|---|---|---|---|
| 1 | robots.txt + sitemap.xml | P0 | 10 分钟 |
| 2 | 每页独立 title/description（拆 server/client） | P0 | 半天 |
| 3 | 预渲染默认语言改英文（或 URL 级 i18n） | P0 | 小改 / 大改 |
| 4 | metadataBase + canonical + OG 图 + twitter card | P0 | 1 小时 |
| 5 | LocalBusiness 补 geo/phone/hours/sameAs + FAQPage schema | P1 | 2 小时 |
| 6 | 图片转 WebP + hero 改 img 标签 | P1 | 半天 |
| 7 | /workspace 去重定位 | P1 | 半天 |
| 8 | Google Business Profile 注册 | P1 | 线下流程 |
| 9 | 2–4 个干货型内容页（GEO） | P2 | 持续 |
| 10 | 删 keywords meta、补 _headers、favicon | P3 | 1 小时 |
