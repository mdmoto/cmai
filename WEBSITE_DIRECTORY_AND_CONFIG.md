# 网站系统全域页面路由、本地路径、GitHub 仓库与 Cloudflare 配置清单

> **记录时间**：2026-11-19  
> **适用范围**：清迈人工智能中心（Chiang Mai AI Center）旗下所有线上生态站点与基础设施

---

## 快速总览速查表

| 站点系统 | 线上主域名 | 本地工程路径 | GitHub 仓库 (`origin/main`) | Cloudflare 构建命令 | 发布目录 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **清迈 AI 中心主站** | [lazzor.com](https://lazzor.com) | `/Users/adam/Desktop/cmai` | `https://github.com/mdmoto/cmai` | `npm run build` | `out` |
| **云算力与硬件合同** | [cloud.lazzor.com](https://cloud.lazzor.com) | `/Users/adam/Desktop/cmai/cloud` | `https://github.com/mdmoto/cloud.git` | `npm run build` | `out` |
| **ColaSola 光伏储能** | [colasola.com](https://colasola.com) | `/Users/adam/Desktop/solar` | `git@github.com:mdmoto/sola.git` | `npm run build` | `dist` |
| **泰国市场孪生沙盘** | [ai.lazzor.com](https://ai.lazzor.com) | `/Users/adam/Desktop/aI THAI/market-twin` | `https://github.com/mdmoto/thai.git` | `npm run build` (web) | `apps/web/out` |
| **多语言培训手册** | 培训内部站 | `/Users/adam/Desktop/TG/training_site_deploy` | `git@github.com:mdmoto/training.git` | 纯静态托管 | 根目录 |

---

## 1. 清迈人工智能中心官网 (`lazzor.com`)

### 1.1 基础信息
- **线上域名**：`https://lazzor.com`、`https://www.lazzor.com`
- **本地项目路径**：[cmai](file:///Users/adam/Desktop/cmai)
- **GitHub 仓库**：`https://github.com/mdmoto/cmai`（主分支：`main`）
- **技术栈**：Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS

### 1.2 Cloudflare 部署配置
- **托管类型**：Cloudflare Pages
- **构建设置**：
  - **Framework Preset**：Next.js (Static Export)
  - **Build Command**：`npm run build`（对应 `next build`，`next.config.ts` 已设 `output: "export"`, `images: { unoptimized: true }`）
  - **Build Output Directory**：`out`
- **Edge Functions**：`functions/api/contract/send-email.ts`（使用 Cloudflare Pages Functions 处理合同签署邮件自动发送）
- **安全与缓存规则**：[public/_headers](file:///Users/adam/Desktop/cmai/public/_headers)
  - 强制全站 `X-Frame-Options: SAMEORIGIN`、`X-Content-Type-Options: nosniff`；
  - `_next/static` 长效缓存 1 年 (`max-age=31536000, immutable`)；
  - 针对苹果系统配置文件 `vpnclient.mobileconfig` 声明 `application/x-apple-aspen-config` MIME 类型。
- **环境变量 (`.env.local`)**：
  - `SMTP_HOST`: `smtp.gmail.com`
  - `SMTP_USER`: `mdmoto@gmail.com`
  - `SMTP_FROM`: `Chiang Mai AI Center <cmai@lazzor.com>`
  - `ADMIN_EMAIL`: `cmai@lazzor.com`

### 1.3 页面路由清单
| 路由路径 | 对应本地源码文件 | 页面核心功能与内容 |
| :--- | :--- | :--- |
| `/` | [page.tsx](file:///Users/adam/Desktop/cmai/src/app/page.tsx) | **AI 中心官网首页**：品牌介绍、四大生态入口（算力、沙盘、光伏、空间）、实景照片、预约入驻引导 |
| `/workspace` | [page.tsx](file:///Users/adam/Desktop/cmai/src/app/workspace/page.tsx) | **办公空间与入驻**：5层空间规划详解、1F 公共共享设施区、独立办公室与固定工位、到访预约表单 |
| `/contract` | [page.tsx](file:///Users/adam/Desktop/cmai/src/app/contract/page.tsx) | **空间租赁服务合同**：在线工位/空间合同定制、电子签字与英文章签章、PDF 高保真导出与邮件同步 |
| `/cloud-contract` | [page.tsx](file:///Users/adam/Desktop/cmai/src/app/cloud-contract/page.tsx) | **云服务合同（主站镜像）**：与 cloud.lazzor.com/contract 双向同步，支持微电脑托管、AI 算力定制签署 |
| `/vpn` | [page.tsx](file:///Users/adam/Desktop/cmai/src/app/vpn/page.tsx) | **VPN 服务引导**：AnyConnect 泰国清迈专线客户端下载、iOS/macOS 移动描述文件一键安装 |
| `/api/contract/send-email` | [route.ts](file:///Users/adam/Desktop/cmai/src/app/api/contract/send-email/route.ts) | **邮件通知 API**：合同签署完成后向客户及管理员邮箱推送 PDF 附件 |

---

## 2. 算力中心与微电脑服务 (`cloud.lazzor.com`)

### 2.1 基础信息
- **线上域名**：`https://cloud.lazzor.com`
- **本地项目路径**：[cmai/cloud](file:///Users/adam/Desktop/cmai/cloud)
- **GitHub 仓库**：`https://github.com/mdmoto/cloud.git`（主分支：`main`）
- **技术栈**：Next.js 16 + React 19 + TypeScript + Tailwind CSS

### 2.2 Cloudflare 部署配置
- **托管类型**：Cloudflare Pages（绑定自定义域名 `cloud.lazzor.com`）
- **构建设置**：
  - **Build Command**：`npm run build`（对应 `next build --webpack`，`output: "export"`）
  - **Build Output Directory**：`out`
  - **Turbopack / Webpack 配置**：`next.config.ts` 中设定静态导出与独立图片不优化模式。

### 2.3 页面路由清单
| 路由路径 | 对应本地源码文件 | 页面核心功能与内容 |
| :--- | :--- | :--- |
| `/` | [page.tsx](file:///Users/adam/Desktop/cmai/cloud/src/app/page.tsx) | **算力中心门户**：微型电脑托管方案（488套餐/定制）、Mac 专用计算节点、企业级 AI 订阅、按需计算器组件 |
| `/contract` | [page.tsx](file:///Users/adam/Desktop/cmai/cloud/src/app/contract/page.tsx) | **云服务电子合同客户端**：支持微电脑 2C4G/4C8G 规格、Ubuntu/Debian 12 +100 元一次性环境费、只读签署模式、客户二维码分享与高保真 PDF 导出 |

---

## 3. ColaSola 绿色能源工程站 (`colasola.com`)

### 3.1 基础信息
- **线上域名**：`https://colasola.com`、`https://www.colasola.com`
- **本地项目路径**：[solar](file:///Users/adam/Desktop/solar)
- **GitHub 仓库**：`git@github.com:mdmoto/sola.git`（主分支：`main`）
- **技术栈**：Vite 6 + React 18 + TypeScript + Tailwind CSS + react-router-dom + i18next

### 3.2 Cloudflare 部署配置
- **托管类型**：Cloudflare Pages
- **构建设置**：
  - **Framework Preset**：Vite
  - **Build Command**：`npm run build`（对应 `tsc -b && vite build`）
  - **Build Output Directory**：`dist`
- **SPA 路由重写**：[public/_redirects](file:///Users/adam/Desktop/solar/public/_redirects) 配置 `/* /index.html 200`，支持所有多级子路由直接刷新不 404；
- **SEO & AI 搜索优化**：
  - `sitemap.xml`：全站索引；
  - `llms.txt` & `ai-profile.json`：针对 AI 引擎搜索与大模型引用的结构化实体；
  - 多语言：中 (`zh`)、英 (`en`)、泰 (`th`)、日 (`ja`)。

### 3.3 页面路由清单
| 路由路径 | 对应本地源码文件 | 页面核心功能与内容 |
| :--- | :--- | :--- |
| `/` | [Home.tsx](file:///Users/adam/Desktop/solar/src/pages/Home.tsx) | **ColaSola 官网首页**：分布式太阳能方案、储能微电网、EPC 工程服务总览、跳转清迈 AI 中心互通链接 |
| `/services` | [Services.tsx](file:///Users/adam/Desktop/solar/src/pages/Services.tsx) | **核心服务**：户用光伏并网、商业大棚/工商业厂房屋顶电站、微电网储能方案 |
| `/projects` | [Projects.tsx](file:///Users/adam/Desktop/solar/src/pages/Projects.tsx) | **成功案例**：清迈别墅离网系统、清莱工业园区分布式光伏等标杆工程实录 |
| `/pricing` | [Pricing.tsx](file:///Users/adam/Desktop/solar/src/pages/Pricing.tsx) | **装机预算与投资回报**：5kW / 10kW / 20kW+ 方案预算、回本周期测算 |
| `/about` | [About.tsx](file:///Users/adam/Desktop/solar/src/pages/About.tsx) | **关于团队**：中泰合资工程资质、团队履历、运维售后保障承诺 |
| `/careers` | [Careers.tsx](file:///Users/adam/Desktop/solar/src/pages/Careers.tsx) | **人才招聘**：光伏电气工程师、泰北本地项目经理招募 |
| `/contact` | [Contact.tsx](file:///Users/adam/Desktop/solar/src/pages/Contact.tsx) | **咨询与勘测预约**：联系电话、WhatsApp / LINE 快速咨询、屋顶勘测表单 |

---

## 4. 泰国数字市场孪生决策平台 (`ai.lazzor.com`)

### 4.1 基础信息
- **线上域名**：`https://ai.lazzor.com`
- **本地项目路径**：[market-twin](file:///Users/adam/Desktop/aI%20THAI/market-twin)
- **Web 前端子目录**：[apps/web](file:///Users/adam/Desktop/aI%20THAI/market-twin/apps/web)
- **GitHub 仓库**：`https://github.com/mdmoto/thai.git`（主分支：`main`）
- **技术栈**：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Recharts（后端结合 FastAPI + Cloud Run）

### 4.2 Cloudflare 部署配置
- **托管类型**：Cloudflare Pages（绑定自定义域名 `ai.lazzor.com`）
- **构建设置**：
  - **Root Directory**：`apps/web`
  - **Build Command**：`npm run build`（静态导出）
  - **Build Output Directory**：`out`
- **API 反向代理**：`/api/*` 路由由 Cloudflare 转发至云端 API 集群（Google Cloud Run / AWS 新加坡）。

### 4.3 核心页面清单
| 路由路径 | 对应本地源码文件 | 页面核心功能与内容 |
| :--- | :--- | :--- |
| `/` | `apps/web/src/app/page.tsx` | **孪生平台主站**：泰国 77 府人口统计学微观大盘、出海消费品弹性定价仿真、客群离散选择模型（MNL） |
| `/demo/pet-water` | `apps/web/src/app/demo/pet-water/page.tsx` | **行业示范 Demo**：泰国宠物智能饮水机全渠道推演与市场占有率测试报告 |

---

## 5. 多语言团队培训手册 (`Training Manual`)

### 5.1 基础信息
- **本地项目路径**：[training_site_deploy](file:///Users/adam/Desktop/TG/training_site_deploy)
- **GitHub 仓库**：`git@github.com:mdmoto/training.git`（主分支：`main`）
- **技术栈**：原生 HTML5 + CSS3 + 极速多语言静态部署
- **一键更新脚本**：[push_training_site.sh](file:///Users/adam/Desktop/TG/training_site_deploy/push_training_site.sh)（自动检测分支、配置 SSH 远端并推送到 `origin/main` 触发 Cloudflare 自动部署）

### 5.2 页面路由清单
| 路由路径 | 对应本地文件/目录 | 页面核心功能与内容 |
| :--- | :--- | :--- |
| `/` | [index.html](file:///Users/adam/Desktop/TG/training_site_deploy/index.html) | **多语言导航总入口**：中/英/泰三语门户选择界面 |
| `/zh/` | `zh/index.html` 及子页面 | **中文培训文档**：内部业务标准、系统操作规范 |
| `/en/` | `en/index.html` 及子页面 | **英文版培训手册** |
| `/th/` | `th/index.html` 及子页面 | **泰文版培训手册** |
