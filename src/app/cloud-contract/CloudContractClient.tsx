"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Printer,
  ArrowLeft,
  Upload,
  Camera,
  Trash2,
  PenTool,
  RotateCcw,
  Building2,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Lock,
  Download,
  Check,
  Send,
  Loader2,
  Type,
  ExternalLink,
  Tag,
  Cpu,
  Server,
  Globe2,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  Clock,
  Laptop,
  HardDrive,
  Sliders,
  CheckSquare,
  ShieldAlert,
  Smartphone,
  Coins,
  Bot,
  Plus,
  Minus,
  QrCode,
  Copy,
  Share2,
  Award,
  X,
  Unlock
} from "lucide-react";

// --- Number to Words Utilities ---
function numberToChineseRMB(num: number): string {
  if (num <= 0) return "零元整";
  const fraction = ["角", "分"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"],
  ];

  let head = num < 0 ? "欠" : "";
  num = Math.abs(num);

  let s = "";
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, "");
  }
  s = s || "整";
  num = Math.floor(num);

  for (let i = 0; i < unit[0].length && num > 0; i++) {
    let p = "";
    for (let j = 0; j < unit[1].length && num > 0; j++) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, "元").replace(/(零.)+/g, "零").replace(/^整$/, "零元整");
}

function numberToEnglishWords(num: number, currency: "CNY" | "THB" = "CNY"): string {
  if (num <= 0) return `Zero ${currency === "CNY" ? "Chinese Yuan" : "Thai Baht"} Only`;
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertChunk(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  }

  let words = "";
  if (num >= 1000000) {
    words += convertChunk(Math.floor(num / 1000000)) + " Million ";
    num %= 1000000;
  }
  if (num >= 1000) {
    words += convertChunk(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }
  if (num > 0) {
    words += convertChunk(num);
  }

  const currencyUnit = currency === "CNY" ? "Chinese Yuan Only" : "Thai Baht Only";
  return words.trim() + " " + currencyUnit;
}

// Calculate Service End Date
function calculateServiceEndDate(startStr: string, durationMonths: number): string {
  if (!startStr) return "";
  try {
    const parts = startStr.split("-").map(Number);
    if (parts.length !== 3) return "";
    const [y, m, d] = parts;

    const targetMonthIdx = (m - 1) + durationMonths;
    const targetYear = y + Math.floor(targetMonthIdx / 12);
    const targetMonth = targetMonthIdx % 12;

    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const clampedDay = Math.min(d, daysInTargetMonth);

    const endDateObj = new Date(targetYear, targetMonth, clampedDay);
    endDateObj.setDate(endDateObj.getDate() - 1);

    const ey = endDateObj.getFullYear();
    const em = String(endDateObj.getMonth() + 1).padStart(2, "0");
    const ed = String(endDateObj.getDate()).padStart(2, "0");
    return `${ey}-${em}-${ed}`;
  } catch {
    return "";
  }
}

function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatEngDate(isoStr: string): string {
  if (!isoStr) return "______________";
  try {
    const [y, m, d] = isoStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${d} ${months[dateObj.getMonth()]} ${y}`;
  } catch {
    return isoStr;
  }
}

// --- Promo Code Definitions ---
export interface PromoCodeInfo {
  code: string;
  rate: number;
  percentOff: number;
  name: string;
  tagZh: string;
  tagEng: string;
}

export const VALID_PROMO_CODES: Record<string, PromoCodeInfo> = {
  cmai2026: {
    code: "cmai2026",
    rate: 0.95,
    percentOff: 5,
    name: "CMAI 会员特惠 (95折 / 5% OFF)",
    tagZh: "95折特惠",
    tagEng: "5% OFF",
  },
  colasola2026: {
    code: "colasola2026",
    rate: 0.90,
    percentOff: 10,
    name: "Colasola 商业伙伴专享 (9折 / 10% OFF)",
    tagZh: "9折特惠",
    tagEng: "10% OFF",
  },
  newcome2026: {
    code: "newcome2026",
    rate: 0.80,
    percentOff: 20,
    name: "出海首秀迎新礼 (8折 / 20% OFF)",
    tagZh: "8折迎新",
    tagEng: "20% OFF",
  },
  festival2026: {
    code: "festival2026",
    rate: 0.85,
    percentOff: 15,
    name: "节日限时特惠 (85折 / 15% OFF)",
    tagZh: "85折特惠",
    tagEng: "15% OFF",
  },
};

// --- Configurable Hardware Options (M2, M4, M6 / RAM: 8, 16, 24, 32 / SSD: 256, 512, 1TB) ---
export interface MacCpuOption {
  id: string;
  name: string;
  specs: string;
  priceDeltaCNY: number;
  priceDeltaTHB: number;
}

export const MAC_CPU_OPTIONS: MacCpuOption[] = [
  {
    id: "m2",
    name: "Apple M2",
    specs: "8核 CPU · 10核 GPU · 16核神经网络引擎 · 高性价比经典款",
    priceDeltaCNY: 0,
    priceDeltaTHB: 0,
  },
  {
    id: "m4",
    name: "Apple M4",
    specs: "10核 CPU · 10核 GPU · 第二代 3nm 工艺 · 顶级单核与大模型推理",
    priceDeltaCNY: 100,
    priceDeltaTHB: 500,
  },
  {
    id: "m6",
    name: "Apple M6",
    specs: "下一代极致算力芯片 · 2nm 极客架构 · 超高并发持续吞吐",
    priceDeltaCNY: 300,
    priceDeltaTHB: 1500,
  },
];

export interface MemoryOption {
  id: string;
  size: string;
  priceDeltaCNY: number;
  priceDeltaTHB: number;
  description: string;
}

export const MAC_MEMORY_OPTIONS: MemoryOption[] = [
  { id: "8", size: "8GB", priceDeltaCNY: 0, priceDeltaTHB: 0, description: "基础入门 · 适合日常轻量挂机与浏览" },
  { id: "16", size: "16GB", priceDeltaCNY: 50, priceDeltaTHB: 250, description: "标准推荐 · 畅快多任务与工程编译" },
  { id: "24", size: "24GB", priceDeltaCNY: 100, priceDeltaTHB: 500, description: "进阶高负载 · 适合大型容器与代码构建" },
  { id: "32", size: "32GB", priceDeltaCNY: 160, priceDeltaTHB: 800, description: "专业极客 · 本地多大模型推理与重度研发" },
];

export interface StorageOption {
  id: string;
  size: string;
  priceDeltaCNY: number;
  priceDeltaTHB: number;
}

export const MAC_STORAGE_OPTIONS: StorageOption[] = [
  { id: "256", size: "256GB SSD", priceDeltaCNY: 0, priceDeltaTHB: 0 },
  { id: "512", size: "512GB SSD", priceDeltaCNY: 40, priceDeltaTHB: 200 },
  { id: "1tb", size: "1TB SSD", priceDeltaCNY: 80, priceDeltaTHB: 400 },
];

// --- Configurable AI Subscription Options (ChatGPT & Claude) ---
export interface AiSubscriptionOption {
  id: string;
  name: string;
  modelFamily: "chatgpt" | "claude" | "dual";
  tier: "personal" | "team" | "combo";
  officialPriceUsd: number;
  priceDeltaCNY: number;
  priceDeltaTHB: number;
  summary: string;
  detailedSpecs: string[];
}

export const AI_SUBSCRIPTION_OPTIONS: AiSubscriptionOption[] = [
  {
    id: "chatgpt_plus",
    name: "ChatGPT PLUS 官方个人会员 (已包含)",
    modelFamily: "chatgpt",
    tier: "personal",
    officialPriceUsd: 20,
    priceDeltaCNY: 0,
    priceDeltaTHB: 0,
    summary: "官方每月 $20 订阅全包 · GPT-4o / o1 / GPT-6 · 独立纯净原生环境",
    detailedSpecs: [
      "官方原价 $20/月 会员订阅费用全包，服务期内由服务商合规代充与续费",
      "支持 GPT-4o、o1 推理模型、GPT-6 原生调用与高级语音模式 (Advanced Voice)",
      "含 DALL-E 3 高清画图、Canvas 协作画布及自定义专属 GPTs 构建与使用",
      "专享独立原生海外商业 IP 固定出口，彻底免除异地跳 IP 导致的封号与降智",
      "海外正规银行合规外卡结算代充，全程提供 KYC 认证与风控拒付兜底保障",
    ],
  },
  {
    id: "claude_pro",
    name: "Claude Pro 官方个人会员 (已包含)",
    modelFamily: "claude",
    tier: "personal",
    officialPriceUsd: 20,
    priceDeltaCNY: 0,
    priceDeltaTHB: 0,
    summary: "官方每月 $20 订阅全包 · Claude 3.5 Sonnet / 3.7 / Opus · 5倍配额",
    detailedSpecs: [
      "官方原价 $20/月 会员订阅全包，由服务商提供海外合规信用卡与手机号代充",
      "完整支持顶尖代码模型 Claude 3.5 Sonnet、Claude 3.7 以及超大上下文 Opus",
      "开箱即用 Artifacts 交互式沙箱（支持前端、SVG、交互组件即时调试预览）",
      "相比免费账号享有 5 倍以上的高峰期调用配额与 Projects 知识库空间",
      "专享纯净 Clean ASN 静态出口，免梯直连，无封号降智顾虑",
    ],
  },
  {
    id: "chatgpt_team",
    name: "ChatGPT Team 企业团队席位 (高级升级)",
    modelFamily: "chatgpt",
    tier: "team",
    officialPriceUsd: 30,
    priceDeltaCNY: 60,
    priceDeltaTHB: 300,
    summary: "企业级数据不用于训练 · 无限高速 · 团队工作区协作 · 统一管理",
    detailedSpecs: [
      "企业合规保障：客户商业数据、研发源码与提示词绝对不参与 OpenAI 模型训练",
      "支持多人团队协同工作区，统一管理权限与账单，共享私有企业 GPTs",
      "相比个人版拥有更高用量配额上限与更快的专属计算响应队列",
      "服务商协助完成企业主体认证 (KYC) 与合规商业外卡代缴扣款",
    ],
  },
  {
    id: "claude_team",
    name: "Claude Team 企业协同席位 (高级升级)",
    modelFamily: "claude",
    tier: "team",
    officialPriceUsd: 30,
    priceDeltaCNY: 60,
    priceDeltaTHB: 300,
    summary: "企业团队级上下文 · 团队项目空间协作 · 优先新特性体验",
    detailedSpecs: [
      "团队共享 Projects 知识库空间与文档上下文，无缝支撑敏捷产研团队协同",
      "提供更高频次的 Sonnet 与 Opus 高并发调用额度，告别日常限额打断",
      "服务商全套提供企业海外认证资质与稳定代扣运维服务",
    ],
  },
  {
    id: "dual_combo",
    name: "ChatGPT PLUS + Claude Pro 双官方会员全包 (顶配双开)",
    modelFamily: "dual",
    tier: "combo",
    officialPriceUsd: 40,
    priceDeltaCNY: 150,
    priceDeltaTHB: 750,
    summary: "同时开通两大顶尖 AI 官方会员 · 满足全能研发与出海全业务场景",
    detailedSpecs: [
      "同时获得 ChatGPT PLUS 与 Claude Pro 两个独立官方个人会员账号",
      "每月合计 $40 官方美金订阅全额由服务商代缴代充",
      "代码编写用 Claude 3.5 Sonnet，复杂推理与画图多模态用 GPT-4o/o1，生产力翻倍",
      "双账号均享有专属合规海外外卡代充通道与服务期内全生命周期运维保障",
    ],
  },
];

// --- Miscellaneous Cloud Services / Add-ons Matrix (From cloud.lazzor.com) ---
export interface AddonService {
  id: string;
  name: string;
  iconName: string;
  badge: string;
  monthlyPriceCNY: number;
  monthlyPriceTHB: number;
  isOneTime?: boolean;
  description: string;
  highlights: string[];
}

export const CLOUD_ADDON_SERVICES: AddonService[] = [
  {
    id: "thai_sim",
    name: "泰国原生真实实体 SIM 卡长期保号 (Thai SMS / OTP)",
    iconName: "Smartphone",
    badge: "本地实名",
    monthlyPriceCNY: 80,
    monthlyPriceTHB: 399,
    description: "100% 真实泰国物理 SIM 卡池，专属号码长期持有，接收本地银行网银、TikTok 本土店、Shopee、PromptPay 验证码。",
    highlights: ["非虚拟接码平台，支持长期防风控抽查", "即时 Web 接收面板 / 消息直达推送"],
  },
  {
    id: "extra_ip",
    name: "加购独立海外原生静态商业 IP (Clean ASN, Fraud Score 0)",
    iconName: "Globe2",
    badge: "纯净网络",
    monthlyPriceCNY: 100,
    monthlyPriceTHB: 500,
    description: "一人一 IP 专线物理绑定，欺诈分恒为 0，用于跨境多店铺防关联、开发者提审及多环境隔离 (套餐已含 1 个，此项为加配)。",
    highlights: ["中泰 IPLC 直连优化出口", "绝非公共代理池，杜绝连带风控封号"],
  },
  {
    id: "api_relay",
    name: "全球大模型 API 聚合网关月度高速额度包 (฿500额度)",
    iconName: "Bot",
    badge: "API 中转",
    monthlyPriceCNY: 100,
    monthlyPriceTHB: 500,
    description: "内置每月 ฿500 高速 API Token 额度，全面支持 GPT-6、Claude 5.5/5.6、DeepSeek，免梯直连。",
    highlights: ["兼容 OpenAI / Anthropic 官方标准接口", "企业级高并发 QPS 保障，Token 消耗清晰透明"],
  },
  {
    id: "offline_desk",
    name: "清迈 AI 中心独栋 5 层实体大楼线下共享工位通票",
    iconName: "Building2",
    badge: "云地双栖",
    monthlyPriceCNY: 200,
    monthlyPriceTHB: 1000,
    description: "清迈独栋 5 层 AI 中心实体大厦线下工位通行权，挑高空间、万兆光纤、免费现磨咖啡与会议室使用权益。",
    highlights: ["大楼内网千兆直通云端机房", "线上 24h 云工位 + 线下大厦办公一站式"],
  },
  {
    id: "colocation",
    name: "物理设备/主机机房托管服务 (Hardware Colocation)",
    iconName: "HardDrive",
    badge: "机房托管",
    monthlyPriceCNY: 300,
    monthlyPriceTHB: 1500,
    description: "自带或采购主机入驻清迈自建机房，专属机架位，双路千兆光纤、ColaSola 光伏绿电与 APC 在线式 UPS 零秒倒闸保障。",
    highlights: ["24 小时恒温恒湿监控与专人现场硬重启/插拔运维", "PUE 仅 1.15，享有绿色微电网长期成本优势"],
  },
  {
    id: "micro_topup",
    name: "海外 SaaS 订阅与泰国本地小额代充代缴通道",
    iconName: "Coins",
    badge: "外币代充",
    monthlyPriceCNY: 60,
    monthlyPriceTHB: 300,
    description: "提供合规海外商业银行卡与手机实名充值通道，支持批量员工 SaaS 代付、PromptPay 扫码即时代付。",
    highlights: ["15% 专属代充费率通道 (最低 ฿300/最高 ฿1,000 封顶)", "无需繁琐换汇，人民币/USDT 快速结算"],
  },
  {
    id: "enterprise_dbd",
    name: "出海企业合规商业落地包 (DBD公司注册 + 对公银行账户)",
    iconName: "Building2",
    badge: "商业合规",
    monthlyPriceCNY: 7000,
    monthlyPriceTHB: 35000,
    isOneTime: true,
    description: "泰国 DBD 商业发展局全套公司合规注册 (享7折 ฿21,000) + 商业银行对公账户开设及网银 (享7折 ฿14,000) + 大厦商业地址。",
    highlights: ["中泰资深法务财税专家全程代办", "清迈 AI 中心独栋五层办公空间商业地址官方授权"],
  },
];

// --- Cloud Packages Definitions ---
export interface CloudPlanItem {
  id: string;
  name: string;
  enName: string;
  category: string;
  badge: string;
  highlight?: boolean;
  devChoice?: boolean;
  priceCNY: number;
  originalPriceCNY: number;
  setupFeeCNY: number;
  priceTHB: number;
  originalPriceTHB: number;
  setupFeeTHB: number;
  description: string;
  tags: string[];
  features: string[];
  specs: {
    hardware: string;
    os: string;
    ip: string;
    network: string;
    aiAccount: string;
    support: string;
  };
}

export const CLOUD_PLANS: CloudPlanItem[] = [
  {
    id: "workstation_888",
    name: "云工位全服务包 (888套餐)",
    enName: "Cloud Workstation Full-Service Flagship",
    category: "FLAGSHIP · 极客旗舰首选",
    badge: "DEV CHOICE",
    devChoice: true,
    priceCNY: 888,
    originalPriceCNY: 1188,
    setupFeeCNY: 198,
    priceTHB: 4440,
    originalPriceTHB: 5940,
    setupFeeTHB: 990,
    description: "1V1 物理独享 Apple Silicon 算力、独立静态 IP、企业 VPN 与官方 AI 顶配会员全功能云工位。",
    tags: ["+Mac 1V1 独享", "+独立静态IP", "+VPN", "+ChatGPT、Claude账号", "+KYC代充"],
    features: [
      "1x Mac 专属云工作站 (1V1 物理独享 Apple Silicon 芯片，原生 macOS) + VPN",
      "ChatGPT PLUS 或 Claude 会员 2 选 1 (已含每月官方会员订阅权益，专享纯净环境无惧封号降智，开箱即用)",
      "1x 独立海外原生静态商业 IP (专属绑定 Mac，支持海外开发者后台与 App Store 提审)",
      "海外大模型/开发者账号专属 KYC 代充服务 (专享合规海外卡与手机号充值，免风控拒付)",
      "独占千兆对等带宽与国际专线直连，原生 macOS 物理机直通，开发编译零卡顿",
      "开机费 ¥198 含 1 对 1 专属技术支持环境调优、专属节点初始化与客户端一键直连",
    ],
    specs: {
      hardware: "1V1 物理独享 Apple Silicon 芯片工作站 (物理机硬件级独占)",
      os: "原生 macOS 开发者工作站环境 (支持 Xcode、编译构建与原生开发工具链)",
      ip: "1x 独立海外原生静态商业 IP (专属物理绑定，支持 App Store 提审与外服部署)",
      network: "独占千兆对等带宽 + 国际专线直连 + 企业级 VPN 隧道 (开发编译零卡顿)",
      aiAccount: "ChatGPT PLUS 或 Claude 官方顶配会员 2 选 1 (每月官方订阅全包)",
      support: "开机费含 1 对 1 专属技术工程师环境深度调优、专属节点初始化与直连客户端",
    },
  },
  {
    id: "ai_lazy_488",
    name: "海外AI无忧懒人包 (488套餐)",
    enName: "Overseas AI All-in-One Carefree Pack",
    category: "MOST POPULAR · 全包爆款",
    badge: "RECOMMENDED",
    highlight: true,
    priceCNY: 488,
    originalPriceCNY: 688,
    setupFeeCNY: 98,
    priceTHB: 2440,
    originalPriceTHB: 3440,
    setupFeeTHB: 490,
    description: "专为个人与团队出海打造的海外 AI 与研发软硬件全套免运维基座。",
    tags: ["+微主机", "+独立商业IP", "+VPN", "+ChatGPT、Claude账号", "+KYC代充"],
    features: [
      "1x 轻量共享型云电脑 (微主机，预装防关联指纹浏览器与日常值守环境) + VPN",
      "ChatGPT PLUS 或 Claude 会员 2 选 1 (已含每月官方会员订阅权益，专享纯净环境无惧封号降智，开箱即用)",
      "1x 独立海外原生静态商业 IP (100% 独享 Clean ASN, Fraud Score 0)",
      "海外账号专属 KYC 代充服务 (专享合规海外卡与手机号充值，免风控拒付)",
      "中泰 IPLC / 国际专线直达 (&lt;18ms), 全天候稳定挂机防关联与防封禁",
      "开户费 ¥98 含 1 对 1 专属技术支持协助调优、环境部署与客户端配置",
    ],
    specs: {
      hardware: "微主机 (轻量共享型云电脑，4-8 vCPU / 8-16GB RAM / NVMe 高速盘)",
      os: "Linux / Windows 安全沙箱环境 · 预装防关联指纹浏览器",
      ip: "1x 独立海外原生静态商业 IP (100% 独享 Clean ASN，欺诈分 0)",
      network: "中泰 IPLC / 国际专线直连 (&lt;18ms 极低延迟) + 企业级 VPN 安全隧道",
      aiAccount: "ChatGPT PLUS 或 Claude 官方订阅会员 2 选 1 (每月订阅费用全包)",
      support: "开户费含 1 对 1 专属工程师环境调优、客户端一键部署与日常代运维",
    },
  },
  {
    id: "ecommerce_pack",
    name: "泰国电商本土店抗风控开店包",
    enName: "Thai Local E-Commerce Anti-Risk Suite",
    category: "CROSS-BORDER · 跨境电商",
    badge: "E-COMMERCE",
    priceCNY: 240,
    originalPriceCNY: 280,
    setupFeeCNY: 98,
    priceTHB: 1199,
    originalPriceTHB: 1398,
    setupFeeTHB: 490,
    description: "专为 TikTok Shop 泰国本土店、Shopee、Lazada 打造的软硬件全流程抗风控基座。",
    tags: ["+微主机", "+独立商业IP", "+实体卡保号", "+代充通道"],
    features: [
      "1x 轻量共享型云电脑 (微主机，预装防关联指纹浏览器与日常值守环境)",
      "1x 独立海外原生静态商业 IP (100% 独享 Clean ASN，Fraud Score 0)",
      "1x 泰国原生真实实体 SIM 卡长期保号 (接收银行、本土电商关键 OTP 验证码)",
      "赠送：泰国本地 PromptPay / 话费小额代充优先秒级处理通道",
      "中泰 IPLC 专线直达 (&lt;18ms)，全天候稳定挂机防关联",
    ],
    specs: {
      hardware: "轻量微主机 · 预装反指纹浏览器防关联环境",
      os: "多环境隔离沙箱 · 硬件指纹防风控伪装",
      ip: "1x 泰国本地原生商业 IP (Clean ASN, 零风控历史)",
      network: "中泰 IPLC 直连低延迟专线",
      aiAccount: "可选配 API 中转通道或电商自动化脚本助手",
      support: "协助本土店网络环境验收与防关联指导",
    },
  },
  {
    id: "vision_creator_pack",
    name: "AI 视觉与数字人创作者包 (RTX 4090)",
    enName: "AI Vision & Digital Avatar Creator Suite",
    category: "CREATOR · 视觉渲染神器",
    badge: "GPU 4090",
    priceCNY: 920,
    originalPriceCNY: 1160,
    setupFeeCNY: 198,
    priceTHB: 4599,
    originalPriceTHB: 5800,
    setupFeeTHB: 990,
    description: "为电商模特换装、短视频数字人生成、FLUX.1 与 ComfyUI 打造的专属高性能算力工位。",
    tags: ["+RTX 4090 独享", "+ComfyUI/FLUX.1 预装", "+1TB 独立盘", "+独立商业IP"],
    features: [
      "1x NVIDIA RTX 4090 独享 GPU 算力云主机 (24GB 顶级显存，秒级渲染出图)",
      "开箱预装完整 ComfyUI + FLUX.1 + SDXL 常用热门商用 LoRA & ControlNet",
      "1x 独立海外原生静态商业 IP (直连 Civitai、HuggingFace、Midjourney 极速无阻)",
      "1TB NVMe 超高速独立素材盘 + 自动每日镜像快照备份",
      "赠送：每月 ฿500 多模态视觉 API 额度 (支持 Prompt 图像反推与自动化脚本)",
    ],
    specs: {
      hardware: "NVIDIA RTX 4090 24GB 独享 GPU + 64GB 内存 + 1TB NVMe 高速盘",
      os: "Ubuntu 24.04 LTS / Windows · 预装 CUDA 12.4 与 PyTorch",
      ip: "1x 独立海外商业原生 IP",
      network: "高速海外专线直连 AI 生态镜像站",
      aiAccount: "每月 ฿500 视觉 API 额度 + 预置 FLUX.1 / SDXL 商业节点",
      support: "ComfyUI 工作流调优与模型加载专属协助",
    },
  },
];

// Pure jsPDF Vector Contract Generator for Cloud Services
async function generateVectorCloudContractPdf(data: {
  contractSerial: string;
  contractHash: string;
  signingDateStr: string;
  selectedPlan: CloudPlanItem;
  chosenCpuOption?: MacCpuOption;
  chosenMemoryOption?: MemoryOption;
  chosenStorageOption?: StorageOption;
  chosenAiSubscription: AiSubscriptionOption;
  selectedAddons: AddonService[];
  currency: "CNY" | "THB";
  durationMonths: number;
  monthlyServiceFee: number;
  setupFee: number;
  totalInitialPayment: number;
  startDate: string;
  endDate: string;
  effectiveCustomerName: string;
  effectiveSignatoryDisplay: string;
  effectiveSignatoryTitle: string;
  customerType: "individual" | "company";
  customerIdNumber: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  logoDataUrl?: string;
  stampDataUrl?: string;
  signatureData?: string | null;
  idImage?: string | null;
}): Promise<string> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const currSym = data.currency === "CNY" ? "¥" : "฿";

  // Header Logo
  if (data.logoDataUrl && data.logoDataUrl.startsWith("data:")) {
    try {
      doc.addImage(data.logoDataUrl, "PNG", margin, 12, 28, 14, undefined, "FAST");
    } catch {}
  }

  // Header Company Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("CHIANG MAI AI CENTER · OFFICIAL ELECTRONIC CONTRACT", margin + 32, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Colasola Co., Ltd. · Tax ID: 0505566006478 · cloud.lazzor.com", margin + 32, 22);
  doc.text("236/105 Chiang Mai AI Center, Moo 6, Mahidol Rd, Nong Hoi, Chiang Mai 50000", margin + 32, 26);

  // Right Reference Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Ref: ${data.contractSerial || "CMAI-CLOUD"}`, pageWidth - margin, 17, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${data.signingDateStr}`, pageWidth - margin, 22, { align: "right" });
  doc.text(`Hash: ${data.contractHash ? data.contractHash.slice(0, 16) : "SECURE-HASH"}`, pageWidth - margin, 26, { align: "right" });

  // Divider Line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.6);
  doc.line(margin, 30, pageWidth - margin, 30);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("ENTERPRISE AI CLOUD WORKSTATION & INFRASTRUCTURE AGREEMENT", margin, 37);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Cloud Compute, Hardware Config (M2/M4/M6), Clean IP & AI Services Agreement", margin, 42);

  // Plan Badge
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(pageWidth - margin - 58, 33, 58, 12, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(67, 56, 202);
  doc.text(`${data.selectedPlan.name}`, pageWidth - margin - 29, 38.5, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`${currSym}${data.monthlyServiceFee.toLocaleString()}/mo · ${data.durationMonths}M Term`, pageWidth - margin - 29, 42.5, { align: "center" });

  let y = 48;

  // Parties Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, "FD");

  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE PROVIDER (Party A):", margin + 4, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.text("Chiang Mai AI Center (Colasola Co., Ltd.) · Tax ID: 0505566006478", margin + 48, y + 5.5);
  doc.text("236/105 Chiang Mai AI Center, Moo 6, Mahidol Rd, Nong Hoi, Chiang Mai 50000", margin + 48, y + 9.5);

  doc.setFont("helvetica", "bold");
  doc.text("CUSTOMER (Party B):", margin + 4, y + 15.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.effectiveCustomerName || "Customer"} ${data.customerType === "company" ? `(Rep: ${data.effectiveSignatoryDisplay})` : ""}`, margin + 48, y + 15.5);
  doc.setFont("helvetica", "bold");
  doc.text("ID / Tax / Business No:", margin + 4, y + 20);
  doc.setFont("helvetica", "normal");
  doc.text(String(data.customerIdNumber || "-"), margin + 48, y + 20);
  doc.setFont("helvetica", "bold");
  doc.text("Phone & Email:", margin + 4, y + 24.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.customerPhone || "-"}  |  ${data.customerEmail || "-"}`, margin + 48, y + 24.5);
  doc.setFont("helvetica", "bold");
  doc.text("Official Address:", margin + 4, y + 28.5);
  doc.setFont("helvetica", "normal");
  const truncatedAddr = data.customerAddress && data.customerAddress.length > 70 ? data.customerAddress.slice(0, 67) + "..." : (data.customerAddress || "-");
  doc.text(truncatedAddr, margin + 48, y + 28.5);

  y += 37;

  // Section 1: Detailed Resource & Hardware Specifications
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("1. DELIVERABLES & HARDWARE SPECIFICATIONS (服务标的与硬件配置清单)", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);

  const hwLine = data.selectedPlan.id === "workstation_888"
    ? `1.1 Workstation Hardware: 1V1 Apple Silicon [CPU: ${data.chosenCpuOption?.name || "Apple M2"} | RAM: ${data.chosenMemoryOption?.size || "8GB"} | SSD: ${data.chosenStorageOption?.size || "256GB SSD"} | OS: Native macOS].`
    : `1.1 Workstation Hardware: Lightweight Cloud Computer (Micro PC) [4-8 vCPU / 8-16GB RAM / 120-240GB SSD / Sandbox].`;
  doc.text(hwLine, margin, y);
  y += 3.8;

  doc.text(`1.2 Official AI Subscription: ${data.chosenAiSubscription.name} ($${data.chosenAiSubscription.officialPriceUsd}/mo included with compliant card billing).`, margin, y);
  y += 3.8;
  doc.text(`1.3 Network & IP: 1x Dedicated Native Static Commercial IP (Clean ASN, Fraud Score 0) + China-Thai IPLC (<18ms) + VPN.`, margin, y);
  y += 3.8;

  if (data.selectedAddons && data.selectedAddons.length > 0) {
    const addonNames = data.selectedAddons.map((a) => a.name.split(" ")[0]).join(", ");
    doc.text(`1.4 Add-on Services: ${addonNames} (Configured & Delivered simultaneously).`, margin, y);
    y += 3.8;
  }

  doc.text(`1.5 Setup & Term: 1-on-1 Engineering Setup. Service Term: ${data.startDate} to ${data.endDate} (${data.durationMonths} Months).`, margin, y);

  y += 6;

  // Section 2: Financial Schedule Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("2. FEES & PAYMENT SCHEDULE (费用明细与支付清单)", margin, y);
  y += 4;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("Item / Description", margin + 4, y + 3.6);
  doc.text(`Amount (${data.currency})`, pageWidth - margin - 4, y + 3.6, { align: "right" });
  y += 5;

  const feeItems = [
    [`Monthly Cloud Service Fee (${data.selectedPlan.name} with Configured Specs)`, `${currSym}${data.monthlyServiceFee.toLocaleString()} / mo`],
    [`Total Subscription Service Fee (${data.durationMonths} Months)`, `${currSym}${(data.monthlyServiceFee * data.durationMonths).toLocaleString()}`],
    [`One-time Setup / Initialization Fee (开机/开户技术服务费)`, data.setupFee === 0 ? "Waived (¥0 免收)" : `${currSym}${data.setupFee.toLocaleString()}`],
    [`TOTAL INITIAL PAYMENT DUE UPON SIGNING (首期签约应付合计)`, `${currSym}${data.totalInitialPayment.toLocaleString()}`],
  ];

  feeItems.forEach(([desc, amt], idx) => {
    const isTotal = idx === feeItems.length - 1;
    if (isTotal) {
      doc.setFillColor(236, 253, 245);
      doc.rect(margin, y, contentWidth, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(6, 95, 70);
    } else {
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
    }
    doc.text(desc, margin + 4, y + 3.8);
    doc.text(amt, pageWidth - margin - 4, y + 3.8, { align: "right" });
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + (isTotal ? 6 : 5), pageWidth - margin, y + (isTotal ? 6 : 5));
    y += isTotal ? 6 : 5;
  });

  y += 5;

  // Section 3: SLA & Critical Terms
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("3. KEY TERMS, SLA & LEGAL COMPLIANCE (核心保障、SLA 与合规约定)", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  const clauses = [
    "3.1 99.9% Service SLA: Party A guarantees 99.9% hardware and line uptime. Outages exceeding 4 hours are compensated 3x in duration.",
    "3.2 Clean Static IP: Exclusive native commercial IP (Fraud Score 0, Clean ASN). Suitable for App Store dev accounts and global AI models.",
    "3.3 AI Membership & KYC: Monthly official subscriptions are paid by Party A using compliant overseas cards; anti-ban support included.",
    "3.4 Code Privacy: Source code never lands off-premise. All customer data, virtual machines, and AI assets belong 100% to Party B.",
    "3.5 Acceptable Use: Prohibited for DDoS, network attacks, spam, or financial fraud. Violations result in immediate termination.",
    "3.6 Governing Law: The Laws of the Kingdom of Thailand (Chiang Mai Jurisdiction). Electronic signatures hold full legal validity.",
  ];
  clauses.forEach((c) => {
    doc.text(c, margin, y);
    y += 3.5;
  });

  y += 4;

  // Dual Signatures Block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("SIGNATURES & COUNTERSIGNATURE (双方盖章与签署)", margin, y);
  y += 3.5;

  const sigBoxWidth = (contentWidth - 6) / 2;
  const sigBoxHeight = 38;

  // Provider Box (Party A)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, sigBoxWidth, sigBoxHeight, 2, 2, "D");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("SERVICE PROVIDER / 服务提供方 (Party A):", margin + 4, y + 4.5);
  doc.setFontSize(6.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Colasola Co., Ltd. (Chiang Mai AI Center)", margin + 4, y + 8.5);

  // Official Stamp
  if (data.stampDataUrl && data.stampDataUrl.startsWith("data:")) {
    try {
      doc.addImage(data.stampDataUrl, "PNG", margin + 26, y + 8, 22, 22, undefined, "FAST");
    } catch {}
  }

  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Authorized Representative (法定代表授权章)", margin + 4, y + 31);
  doc.text(`Date: ${data.signingDateStr}`, margin + 4, y + 35);

  // Customer Box (Party B)
  const custX = margin + sigBoxWidth + 6;
  doc.roundedRect(custX, y, sigBoxWidth, sigBoxHeight, 2, 2, "D");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("CUSTOMER / 客户认购方 (Party B):", custX + 4, y + 4.5);
  doc.setFontSize(6.8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(String(data.effectiveCustomerName || "Customer"), custX + 4, y + 8.5);

  // Customer Signature
  if (data.signatureData && data.signatureData.startsWith("data:")) {
    try {
      doc.addImage(data.signatureData, "PNG", custX + 6, y + 9.5, sigBoxWidth - 12, 19, undefined, "FAST");
    } catch {}
  }

  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Signed by: ${data.effectiveSignatoryDisplay || data.effectiveCustomerName}`, custX + 4, y + 31);
  doc.text(`Date: ${data.signingDateStr}`, custX + 4, y + 35);

  // Page 1 Footer
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text("Official Cloud Service Protocol · Colasola Co., Ltd. (Chiang Mai AI Center) · Tax ID: 0505566006478 · cloud.lazzor.com", pageWidth / 2, pageHeight - 5, { align: "center" });

  // Optional Annex: Customer ID Document
  if (data.idImage && data.idImage.startsWith("data:")) {
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("ANNEX 1: CUSTOMER IDENTITY / BUSINESS LICENSE (附件一：身份及营业执照证明)", margin, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Contract Serial: ${data.contractSerial} · Subscriber: ${data.effectiveCustomerName}`, margin, 24);

    try {
      const imgFormat = data.idImage.includes("png") ? "PNG" : "JPEG";
      doc.addImage(data.idImage, imgFormat, margin, 30, contentWidth, 140, undefined, "FAST");
    } catch {}

    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Official Verification Document · Chiang Mai AI Center Cloud", pageWidth / 2, pageHeight - 6, { align: "center" });
  }

  const rawUri = doc.output("datauristring");
  return rawUri.split(",")[1];
}

// Inner Contract Component using useSearchParams
function CloudContractContent() {
  const searchParams = useSearchParams();

  // Basic Contract Meta
  const [contractSerial, setContractSerial] = useState<string>("");
  const [contractHash, setContractHash] = useState<string>("");
  const [signingDateIso, setSigningDateIso] = useState<string>("");

  // Asset Data URLs
  const [logoDataUrl, setLogoDataUrl] = useState<string>("/images/cmai_header_logo.png");
  const [stampDataUrl, setStampDataUrl] = useState<string>("/images/colasola_stamp.png");

  // Selection States & Comprehensive URL Param Parsing
  const rawPlanParam = (searchParams.get("plan") || "").trim().toLowerCase();
  const rawCodeParam = (searchParams.get("code") || "").trim().toLowerCase();
  const rawCpuParam = (searchParams.get("cpu") || "").trim().toLowerCase();
  const rawRamParam = (searchParams.get("ram") || "").trim().toLowerCase();
  const rawSsdParam = (searchParams.get("ssd") || "").trim().toLowerCase();
  const rawAiParam = (searchParams.get("ai") || "").trim().toLowerCase();
  const rawAddonsParam = (searchParams.get("addons") || "").trim();
  const rawExtraIpParam = (searchParams.get("extra_ip") || "").trim();
  const rawTierParam = (searchParams.get("tier") || "").trim().toLowerCase();
  const rawOsParam = (searchParams.get("os") || "").trim().toLowerCase();
  const rawMonthsParam = (searchParams.get("months") || searchParams.get("duration") || "").trim();
  const rawCurParam = (searchParams.get("cur") || searchParams.get("currency") || "").trim().toUpperCase();
  const rawSerialParam = (searchParams.get("serial") || searchParams.get("ref") || "").trim();
  const rawLockedParam = (searchParams.get("locked") || "").trim().toLowerCase();

  // Customer pre-fill params
  const rawClientParam = (searchParams.get("client") || searchParams.get("name") || "").trim();
  const rawCompanyParam = (searchParams.get("company") || "").trim();
  const rawTypeParam = (searchParams.get("type") || "").trim().toLowerCase();
  const rawSignatoryParam = (searchParams.get("signatory") || "").trim();
  const rawTitleParam = (searchParams.get("title") || "").trim();
  const rawIdNoParam = (searchParams.get("id_no") || searchParams.get("tax_id") || "").trim();
  const rawPhoneParam = (searchParams.get("phone") || "").trim();
  const rawEmailParam = (searchParams.get("email") || "").trim();
  const rawAddressParam = (searchParams.get("address") || "").trim();
  const rawStartParam = (searchParams.get("start") || "").trim();

  // Match initial plan
  const matchedPlan = CLOUD_PLANS.find(
    (p) =>
      p.id.toLowerCase() === rawPlanParam ||
      (rawPlanParam === "488" && p.id === "ai_lazy_488") ||
      (rawPlanParam === "ai_lazy" && p.id === "ai_lazy_488") ||
      (rawPlanParam === "888" && p.id === "workstation_888") ||
      (rawPlanParam === "88" && p.id === "workstation_888") ||
      (rawPlanParam === "workstation" && p.id === "workstation_888") ||
      (rawPlanParam === "cloud_workstation" && p.id === "workstation_888") ||
      (rawPlanParam === "ecommerce" && p.id === "ecommerce_pack") ||
      (rawPlanParam === "4090" && p.id === "vision_creator_pack")
  );

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    matchedPlan ? matchedPlan.id : "workstation_888"
  );
  const [currency, setCurrency] = useState<"CNY" | "THB">(
    rawCurParam === "THB" ? "THB" : "CNY"
  );
  const [durationMonths, setDurationMonths] = useState<number>(() => {
    const m = parseInt(rawMonthsParam, 10);
    return [1, 3, 6, 12].includes(m) ? m : 1;
  });

  // --- Requested Hardware Specifications: CPU: M2, M4, M6 | RAM: 8, 16, 24, 32 | SSD: 256, 512, 1TB ---
  const [selectedCpuId, setSelectedCpuId] = useState<string>(() => {
    if (["m2", "m4", "m6"].includes(rawCpuParam)) return rawCpuParam;
    return "m2";
  });
  const [selectedMemoryId, setSelectedMemoryId] = useState<string>(() => {
    if (["8", "16", "24", "32"].includes(rawRamParam)) return rawRamParam;
    return "8";
  });
  const [selectedStorageId, setSelectedStorageId] = useState<string>(() => {
    if (["256", "512", "1tb"].includes(rawSsdParam)) return rawSsdParam;
    if (rawSsdParam === "1" || rawSsdParam === "1000" || rawSsdParam === "1t") return "1tb";
    return "256";
  });

  // --- Hardware Configuration States for 488 Micro PC ---
  const [microPcTier, setMicroPcTier] = useState<"std" | "pro">(
    rawTierParam === "pro" ? "pro" : "std"
  );
  const [microPcOs, setMicroPcOs] = useState<"ubuntu" | "windows">(
    rawOsParam === "windows" ? "windows" : "ubuntu"
  );

  // --- AI Subscription Specification State ---
  const [selectedAiSubId, setSelectedAiSubId] = useState<string>(() => {
    const found = AI_SUBSCRIPTION_OPTIONS.find((a) => a.id.toLowerCase() === rawAiParam);
    if (found) return found.id;
    if (rawAiParam.includes("claude_team")) return "claude_team";
    if (rawAiParam.includes("chatgpt_team") || rawAiParam.includes("team")) return "chatgpt_team";
    if (rawAiParam.includes("claude")) return "claude_pro";
    if (rawAiParam.includes("dual") || rawAiParam.includes("combo")) return "dual_combo";
    return "chatgpt_plus";
  });

  // --- Add-on Services State (Miscellaneous from cloud.lazzor.com) ---
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(() => {
    if (!rawAddonsParam) return [];
    const valid = CLOUD_ADDON_SERVICES.map((a) => a.id);
    return rawAddonsParam.split(",").map((s) => s.trim()).filter((id) => valid.includes(id));
  });
  const [extraIpCount, setExtraIpCount] = useState<number>(() => {
    const n = parseInt(rawExtraIpParam, 10);
    return isNaN(n) ? 0 : Math.max(0, Math.min(10, n));
  });

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Promo Code State
  const initialPromo = rawCodeParam && VALID_PROMO_CODES[rawCodeParam] ? VALID_PROMO_CODES[rawCodeParam] : null;
  const [promoInput, setPromoInput] = useState<string>(initialPromo ? initialPromo.code : "");
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeInfo | null>(initialPromo);
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    initialPromo ? { type: "success", text: `优惠码 "${initialPromo.code}" 验证成功！已减免 ${initialPromo.percentOff}%。` } : null
  );

  // Customer Profile
  const [customerType, setCustomerType] = useState<"individual" | "company">(
    rawTypeParam === "company" || !!rawCompanyParam ? "company" : "individual"
  );
  const [customerName, setCustomerName] = useState<string>(rawClientParam);
  const [companyName, setCompanyName] = useState<string>(rawCompanyParam);
  const [signatoryName, setSignatoryName] = useState<string>(rawSignatoryParam);
  const [signatoryTitle, setSignatoryTitle] = useState<string>(rawTitleParam || "创始人 / 法定代表人");
  const [customerIdNumber, setCustomerIdNumber] = useState<string>(rawIdNoParam);
  const [customerPhone, setCustomerPhone] = useState<string>(rawPhoneParam);
  const [customerEmail, setCustomerEmail] = useState<string>(rawEmailParam);
  const [customerAddress, setCustomerAddress] = useState<string>(rawAddressParam);

  // Dates
  const [startDate, setStartDate] = useState<string>(rawStartParam || getTomorrowDateString());

  // Attachments
  const [idImage, setIdImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Digital Signature
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [typedSigText, setTypedSigText] = useState<string>("");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  // --- E-Contract Execution & Customizer Modal States ---
  const [isLockedConfig, setIsLockedConfig] = useState<boolean>(
    rawLockedParam === "1" || rawLockedParam === "true" || rawLockedParam === "yes"
  );
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [signedTimestamp, setSignedTimestamp] = useState<string | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [copiedInvitation, setCopiedInvitation] = useState<boolean>(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState<boolean>(false);

  // Customizer Inner Working Form States
  const [custPlanId, setCustPlanId] = useState<string>("workstation_888");
  const [custCpuId, setCustCpuId] = useState<string>("m2");
  const [custMemoryId, setCustMemoryId] = useState<string>("8");
  const [custStorageId, setCustStorageId] = useState<string>("256");
  const [custMicroTier, setCustMicroTier] = useState<"std" | "pro">("std");
  const [custMicroOs, setCustMicroOs] = useState<"ubuntu" | "windows">("ubuntu");
  const [custAiSubId, setCustAiSubId] = useState<string>("chatgpt_plus");
  const [custAddonIds, setCustAddonIds] = useState<string[]>([]);
  const [custExtraIpCount, setCustExtraIpCount] = useState<number>(0);
  const [custDurationMonths, setCustDurationMonths] = useState<number>(1);
  const [custCurrency, setCustCurrency] = useState<"CNY" | "THB">("CNY");
  const [custPromoCode, setCustPromoCode] = useState<string>("");
  const [custCustomerType, setCustCustomerType] = useState<"individual" | "company">("individual");
  const [custCustomerName, setCustCustomerName] = useState<string>("");
  const [custCompanyName, setCustCompanyName] = useState<string>("");
  const [custPhone, setCustPhone] = useState<string>("");
  const [custEmail, setCustEmail] = useState<string>("");
  const [custCustomerIdNumber, setCustCustomerIdNumber] = useState<string>("");
  const [custSignatoryName, setCustSignatoryName] = useState<string>("");
  const [custSignatoryTitle, setCustSignatoryTitle] = useState<string>("创始人 / 法定代表人");
  const [custAddress, setCustAddress] = useState<string>("");
  const [custContractSerial, setCustContractSerial] = useState<string>("");
  const [custLockSpecs, setCustLockSpecs] = useState<boolean>(true);

  // Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  // Loading States
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Preload and Initialize Contract Numbers
  useEffect(() => {
    const today = new Date();
    const yStr = today.getFullYear().toString();
    const mStr = String(today.getMonth() + 1).padStart(2, "0");
    const dStr = String(today.getDate()).padStart(2, "0");
    setSigningDateIso(`${yStr}-${mStr}-${dStr}`);

    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const serial = rawSerialParam || `CMAI-CLOUD-${yStr}${mStr}${dStr}-${randomSuffix}`;
    setContractSerial(serial);

    const rawData = `${serial}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      hash = (hash << 5) - hash + rawData.charCodeAt(i);
      hash |= 0;
    }
    setContractHash(Math.abs(hash).toString(16).padStart(8, "0").toUpperCase());

    // Convert Assets to Data URLs
    const toDataUrl = async (url: string): Promise<string> => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve(url);
          reader.readAsDataURL(blob);
        });
      } catch {
        return url;
      }
    };

    toDataUrl("/images/cmai_header_logo.png").then((d) => {
      if (d && d.startsWith("data:")) setLogoDataUrl(d);
    });
    toDataUrl("/images/colasola_stamp.png").then((d) => {
      if (d && d.startsWith("data:")) setStampDataUrl(d);
    });
  }, []);

  // Canvas Event Handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#0f172a";
  }, [sigMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
    setHasDrawn(false);
  };

  const handleTypedSignature = (text: string) => {
    setTypedSigText(text);
    if (!text.trim()) {
      setSignatureData(null);
      return;
    }
    const offCanvas = document.createElement("canvas");
    offCanvas.width = 400;
    offCanvas.height = 120;
    const ctx = offCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 400, 120);
    ctx.font = "italic bold 32px 'Brush Script MT', 'Dancing Script', 'Caveat', cursive, serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 200, 60);

    setSignatureData(offCanvas.toDataURL("image/png"));
  };

  const handleVerifyPromo = () => {
    const clean = promoInput.trim().toLowerCase();
    if (!clean) {
      setPromoMessage({ type: "error", text: "请输入有效的优惠码。" });
      setAppliedPromo(null);
      return;
    }
    const found = VALID_PROMO_CODES[clean];
    if (found) {
      setAppliedPromo(found);
      setPromoMessage({
        type: "success",
        text: `优惠码 "${found.code}" 验证成功！已享受 ${found.percentOff}% 折扣 (${found.name})。`,
      });
    } else {
      setAppliedPromo(null);
      setPromoMessage({
        type: "error",
        text: `优惠码 "${promoInput}" 无效或已过期。`,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("请上传有效的图片文件 (PNG, JPG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setIdImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Currently Selected Base Plan
  const currentPlan = CLOUD_PLANS.find((p) => p.id === selectedPlanId) || CLOUD_PLANS[0];

  // Configured Specs for Mac Workstation
  const chosenCpu = MAC_CPU_OPTIONS.find((c) => c.id === selectedCpuId) || MAC_CPU_OPTIONS[0];
  const chosenMemory = MAC_MEMORY_OPTIONS.find((m) => m.id === selectedMemoryId) || MAC_MEMORY_OPTIONS[0];
  const chosenStorage = MAC_STORAGE_OPTIONS.find((s) => s.id === selectedStorageId) || MAC_STORAGE_OPTIONS[0];
  const chosenAiSubscription = AI_SUBSCRIPTION_OPTIONS.find((a) => a.id === selectedAiSubId) || AI_SUBSCRIPTION_OPTIONS[0];

  // Base Plan Price
  const basePlanPrice = currency === "CNY" ? currentPlan.priceCNY : currentPlan.priceTHB;
  const baseSetupFee = currency === "CNY" ? currentPlan.setupFeeCNY : currentPlan.setupFeeTHB;

  // Additional Hardware Delta (Applicable to 888 Mac Plan or 488 Micro PC)
  let hwDeltaMonthly = 0;
  if (selectedPlanId === "workstation_888") {
    hwDeltaMonthly += currency === "CNY" ? chosenCpu.priceDeltaCNY : chosenCpu.priceDeltaTHB;
    hwDeltaMonthly += currency === "CNY" ? chosenMemory.priceDeltaCNY : chosenMemory.priceDeltaTHB;
    hwDeltaMonthly += currency === "CNY" ? chosenStorage.priceDeltaCNY : chosenStorage.priceDeltaTHB;
  } else if (selectedPlanId === "ai_lazy_488") {
    if (microPcTier === "pro") {
      hwDeltaMonthly += currency === "CNY" ? 80 : 400;
    }
  }

  // Additional AI Subscription Delta
  const aiDeltaMonthly = currency === "CNY" ? chosenAiSubscription.priceDeltaCNY : chosenAiSubscription.priceDeltaTHB;

  // Additional Add-on Services Delta
  const activeAddons = CLOUD_ADDON_SERVICES.filter((a) => selectedAddonIds.includes(a.id));
  const addonsRecurringMonthly = activeAddons
    .filter((a) => !a.isOneTime)
    .reduce((sum, a) => sum + (currency === "CNY" ? a.monthlyPriceCNY : a.monthlyPriceTHB), 0);

  const addonsOneTimeFee = activeAddons
    .filter((a) => a.isOneTime)
    .reduce((sum, a) => sum + (currency === "CNY" ? a.monthlyPriceCNY : a.monthlyPriceTHB), 0);

  // Extra IPs
  const extraIpMonthly = extraIpCount * (currency === "CNY" ? 100 : 500);

  // Undiscounted Monthly Total
  const subtotalMonthly = basePlanPrice + hwDeltaMonthly + aiDeltaMonthly + addonsRecurringMonthly + extraIpMonthly;

  // Duration Discount (12 months = 20% off and waive setup fee; 6 months = 10% off; 3 months = 5% off)
  let durationDiscountRate = 1;
  let isSetupFeeWaived = false;
  if (durationMonths >= 12) {
    durationDiscountRate = 0.8;
    isSetupFeeWaived = true;
  } else if (durationMonths >= 6) {
    durationDiscountRate = 0.9;
  } else if (durationMonths >= 3) {
    durationDiscountRate = 0.95;
  }

  // Promo Discount Rate
  const promoDiscountRate = appliedPromo ? appliedPromo.rate : 1;

  // Effective Monthly Fee after Discounts
  const effectiveMonthlyFee = Math.round(subtotalMonthly * durationDiscountRate * promoDiscountRate);
  const effectiveSetupFee = isSetupFeeWaived ? 0 : baseSetupFee;
  const totalSubscriptionFee = effectiveMonthlyFee * durationMonths;
  const totalInitialPayment = totalSubscriptionFee + effectiveSetupFee + addonsOneTimeFee;

  // Dates
  const endDate = calculateServiceEndDate(startDate, durationMonths);

  // Effective Customer Info
  const effectiveCustomerName = customerType === "company" ? (companyName || "企业客户全称") : (customerName || "客户姓名");
  const effectiveSignatoryDisplay = customerType === "company" ? (signatoryName || "法定代表人") : (customerName || "签署人");

  // Currency Symbols
  const currSym = currency === "CNY" ? "¥" : "฿";

  // PDF Export
  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      const pdfBase64 = await generateVectorCloudContractPdf({
        contractSerial,
        contractHash,
        signingDateStr: formatEngDate(signingDateIso),
        selectedPlan: currentPlan,
        chosenCpuOption: chosenCpu,
        chosenMemoryOption: chosenMemory,
        chosenStorageOption: chosenStorage,
        chosenAiSubscription,
        selectedAddons: activeAddons,
        currency,
        durationMonths,
        monthlyServiceFee: effectiveMonthlyFee,
        setupFee: effectiveSetupFee,
        totalInitialPayment,
        startDate: formatEngDate(startDate),
        endDate: formatEngDate(endDate),
        effectiveCustomerName,
        effectiveSignatoryDisplay,
        effectiveSignatoryTitle: signatoryTitle,
        customerType,
        customerIdNumber,
        customerPhone,
        customerEmail,
        customerAddress,
        logoDataUrl,
        stampDataUrl,
        signatureData,
        idImage,
      });

      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${pdfBase64}`;
      link.download = `${contractSerial}_${currentPlan.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF 生成失败，请直接使用浏览器的打印功能另存为 PDF。");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  // --- Contract URL & Invitation Building Functions ---
  const getShareableUrl = (overrideParams?: {
    plan?: string;
    cpu?: string;
    ram?: string;
    ssd?: string;
    tier?: string;
    os?: string;
    ai?: string;
    addons?: string[];
    extraIp?: number;
    months?: number;
    cur?: "CNY" | "THB";
    code?: string;
    client?: string;
    company?: string;
    type?: "individual" | "company";
    phone?: string;
    email?: string;
    idNo?: string;
    signatory?: string;
    title?: string;
    address?: string;
    serial?: string;
    locked?: boolean;
  }) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://cloud.lazzor.com";
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/contract";
    const p = new URLSearchParams();

    const plan = overrideParams?.plan ?? selectedPlanId;
    if (plan) p.set("plan", plan);

    if (plan === "workstation_888") {
      p.set("cpu", overrideParams?.cpu ?? selectedCpuId);
      p.set("ram", overrideParams?.ram ?? selectedMemoryId);
      p.set("ssd", overrideParams?.ssd ?? selectedStorageId);
    } else if (plan === "ai_lazy_488") {
      p.set("tier", overrideParams?.tier ?? microPcTier);
      p.set("os", overrideParams?.os ?? microPcOs);
    }

    const ai = overrideParams?.ai ?? selectedAiSubId;
    if (ai) p.set("ai", ai);

    const addons = overrideParams?.addons ?? selectedAddonIds;
    if (addons.length > 0) p.set("addons", addons.join(","));

    const extraIp = overrideParams?.extraIp ?? extraIpCount;
    if (extraIp > 0) p.set("extra_ip", String(extraIp));

    const months = overrideParams?.months ?? durationMonths;
    if (months > 1) p.set("months", String(months));

    const cur = overrideParams?.cur ?? currency;
    if (cur !== "CNY") p.set("cur", cur);

    const promo = overrideParams?.code ?? (appliedPromo ? appliedPromo.code : "");
    if (promo) p.set("code", promo);

    const client = overrideParams?.client ?? customerName;
    if (client) p.set("client", client);

    const company = overrideParams?.company ?? companyName;
    if (company) p.set("company", company);

    const type = overrideParams?.type ?? customerType;
    if (type === "company") p.set("type", "company");

    const phone = overrideParams?.phone ?? customerPhone;
    if (phone) p.set("phone", phone);

    const email = overrideParams?.email ?? customerEmail;
    if (email) p.set("email", email);

    const idNo = overrideParams?.idNo ?? customerIdNumber;
    if (idNo) p.set("id_no", idNo);

    const signatory = overrideParams?.signatory ?? signatoryName;
    if (signatory) p.set("signatory", signatory);

    const title = overrideParams?.title ?? signatoryTitle;
    if (title) p.set("title", title);

    const address = overrideParams?.address ?? customerAddress;
    if (address) p.set("address", address);

    const serial = overrideParams?.serial ?? contractSerial;
    if (serial) p.set("serial", serial);

    const locked = overrideParams?.locked ?? isLockedConfig;
    if (locked) p.set("locked", "1");

    return `${origin}${pathname}?${p.toString()}`;
  };

  const handleCopyLink = () => {
    const url = getShareableUrl({ locked: isLockedConfig });
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Customizer: Open and prefill from current page state
  const handleOpenCustomizer = () => {
    setCustPlanId(selectedPlanId);
    setCustCpuId(selectedCpuId);
    setCustMemoryId(selectedMemoryId);
    setCustStorageId(selectedStorageId);
    setCustMicroTier(microPcTier);
    setCustMicroOs(microPcOs);
    setCustAiSubId(selectedAiSubId);
    setCustAddonIds([...selectedAddonIds]);
    setCustExtraIpCount(extraIpCount);
    setCustDurationMonths(durationMonths);
    setCustCurrency(currency);
    setCustPromoCode(appliedPromo ? appliedPromo.code : promoInput);
    setCustCustomerType(customerType);
    setCustCustomerName(customerName);
    setCustCompanyName(companyName);
    setCustPhone(customerPhone);
    setCustEmail(customerEmail);
    setCustCustomerIdNumber(customerIdNumber);
    setCustSignatoryName(signatoryName);
    setCustSignatoryTitle(signatoryTitle);
    setCustAddress(customerAddress);
    setCustContractSerial(contractSerial);
    setCustLockSpecs(true);
    setIsCustomizerOpen(true);
  };

  // Customizer: Compute URL on the fly
  const computeCustomizerUrl = () => {
    return getShareableUrl({
      plan: custPlanId,
      cpu: custCpuId,
      ram: custMemoryId,
      ssd: custStorageId,
      tier: custMicroTier,
      os: custMicroOs,
      ai: custAiSubId,
      addons: custAddonIds,
      extraIp: custExtraIpCount,
      months: custDurationMonths,
      cur: custCurrency,
      code: custPromoCode,
      client: custCustomerName,
      company: custCompanyName,
      type: custCustomerType,
      phone: custPhone,
      email: custEmail,
      idNo: custCustomerIdNumber,
      signatory: custSignatoryName,
      title: custSignatoryTitle,
      address: custAddress,
      serial: custContractSerial,
      locked: custLockSpecs,
    });
  };

  // Customizer: Compute invitation letter
  const computeInvitationText = (url: string) => {
    const plan = CLOUD_PLANS.find((p) => p.id === custPlanId) || CLOUD_PLANS[0];
    const cpu = MAC_CPU_OPTIONS.find((c) => c.id === custCpuId) || MAC_CPU_OPTIONS[0];
    const mem = MAC_MEMORY_OPTIONS.find((m) => m.id === custMemoryId) || MAC_MEMORY_OPTIONS[0];
    const ssd = MAC_STORAGE_OPTIONS.find((s) => s.id === custStorageId) || MAC_STORAGE_OPTIONS[0];
    const ai = AI_SUBSCRIPTION_OPTIONS.find((a) => a.id === custAiSubId) || AI_SUBSCRIPTION_OPTIONS[0];

    const recipient = custCustomerType === "company" ? (custCompanyName || custCustomerName || "贵司") : (custCustomerName || "尊敬的客户");
    const currSym = custCurrency === "CNY" ? "¥" : "฿";

    // Dynamic cost calculation
    const baseP = custCurrency === "CNY" ? plan.priceCNY : plan.priceTHB;
    let hwD = 0;
    if (custPlanId === "workstation_888") {
      hwD += custCurrency === "CNY" ? cpu.priceDeltaCNY + mem.priceDeltaCNY + ssd.priceDeltaCNY : cpu.priceDeltaTHB + mem.priceDeltaTHB + ssd.priceDeltaTHB;
    }
    const aiD = custCurrency === "CNY" ? ai.priceDeltaCNY : ai.priceDeltaTHB;
    const activeAdds = CLOUD_ADDON_SERVICES.filter((a) => custAddonIds.includes(a.id));
    const addsRec = activeAdds.filter((a) => !a.isOneTime).reduce((s, a) => s + (custCurrency === "CNY" ? a.monthlyPriceCNY : a.monthlyPriceTHB), 0);
    const addsOne = activeAdds.filter((a) => a.isOneTime).reduce((s, a) => s + (custCurrency === "CNY" ? a.monthlyPriceCNY : a.monthlyPriceTHB), 0);
    const extraIpM = custExtraIpCount * (custCurrency === "CNY" ? 100 : 500);

    const sub = baseP + hwD + aiD + addsRec + extraIpM;
    let durRate = 1;
    let setupWaived = false;
    if (custDurationMonths >= 12) { durRate = 0.8; setupWaived = true; }
    else if (custDurationMonths >= 6) durRate = 0.9;
    else if (custDurationMonths >= 3) durRate = 0.95;

    const promoFound = custPromoCode && VALID_PROMO_CODES[custPromoCode.toLowerCase()] ? VALID_PROMO_CODES[custPromoCode.toLowerCase()] : null;
    const promoR = promoFound ? promoFound.rate : 1;
    const effM = Math.round(sub * durRate * promoR);
    const baseS = custCurrency === "CNY" ? plan.setupFeeCNY : plan.setupFeeTHB;
    const effS = setupWaived ? 0 : baseS;
    const initialT = effM * custDurationMonths + effS + addsOne;

    return `【Chiang Mai AI Center · 官方专属服务电子合同】
尊敬的 ${recipient}：

您好！为您专属定制的「Chiang Mai AI Center 企业级云工位与海外算力服务协议」已生成就绪。

📋 定制方案配置：
● 签约方案：${plan.name}
● 硬件规格：${custPlanId === "workstation_888" ? `${cpu.name} · ${mem.size} 统一内存 · ${ssd.size} 存储 (原生 macOS)` : "轻量高可用微主机 (防指纹浏览器日常值守环境)"}
● 官方 AI 会员：${ai.name} (每月官方订阅全包)
● 纯净商业网络：${1 + custExtraIpCount}x 独享原生静态商业 IP (Clean ASN) + 中泰 IPLC 极速专线 (<18ms)
${activeAdds.length > 0 ? `● 增值配套服务：${activeAdds.map(a => a.name.split(" ")[0]).join("、")}
` : ""}● 签约服务期：${custDurationMonths} 个月
● 首期结算金额：${currSym}${initialT.toLocaleString()} 元整
● 电子合同编号：${custContractSerial || "CMAI-CLOUD-2026"}

✍️ 请点击专属安全链接查阅 SLA 条款并在手机或电脑上完成原笔迹电子签署：
👉 ${url}

（本合同通过 Chiang Mai AI Center 官方电子存证系统签署，加盖 Colasola Co., Ltd. 官方公章与防伪时间戳，具备完整中泰法律效力）`;
  };

  // Customizer: Apply to live page
  const handleApplyCustomizerToLive = () => {
    setSelectedPlanId(custPlanId);
    setSelectedCpuId(custCpuId);
    setSelectedMemoryId(custMemoryId);
    setSelectedStorageId(custStorageId);
    setMicroPcTier(custMicroTier);
    setMicroPcOs(custMicroOs);
    setSelectedAiSubId(custAiSubId);
    setSelectedAddonIds([...custAddonIds]);
    setExtraIpCount(custExtraIpCount);
    setDurationMonths(custDurationMonths);
    setCurrency(custCurrency);
    if (custPromoCode) {
      setPromoInput(custPromoCode);
      const found = VALID_PROMO_CODES[custPromoCode.toLowerCase()];
      if (found) setAppliedPromo(found);
    }
    setCustomerType(custCustomerType);
    if (custCustomerName) setCustomerName(custCustomerName);
    if (custCompanyName) setCompanyName(custCompanyName);
    if (custPhone) setCustomerPhone(custPhone);
    if (custEmail) setCustomerEmail(custEmail);
    if (custCustomerIdNumber) setCustomerIdNumber(custCustomerIdNumber);
    if (custSignatoryName) setSignatoryName(custSignatoryName);
    if (custSignatoryTitle) setSignatoryTitle(custSignatoryTitle);
    if (custAddress) setCustomerAddress(custAddress);
    if (custContractSerial) setContractSerial(custContractSerial);
    if (custLockSpecs) setIsLockedConfig(true);
    setIsCustomizerOpen(false);
  };

  // Execute E-Contract Signing
  const handleExecuteContract = () => {
    if (!signatureData) {
      alert("请先在电子签名画板上手写签名，或在键盘输入框中输入您的法定姓名。");
      return;
    }
    if (!termsAgreed) {
      alert("请勾选并确认《企业级 AI 云工位与海外算力服务协议》所有细则及 SLA 交付标准承诺。");
      return;
    }

    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} (UTC+7)`;
    setSignedTimestamp(formatted);
    setIsSigned(true);
    setIsCertificateOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
              title="返回云平台主页"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold tracking-tight text-neutral-950 dark:text-white flex items-center gap-1.5">
                  企业级 AI 云工位与海外算力服务协议
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold">
                    ELECTRONIC SIGNING
                  </span>
                </h1>
                <span className="text-[11px] text-neutral-500 font-mono">
                  REF: {contractSerial || "CMAI-CLOUD-PENDING"} · HASH: {contractHash || "SECURE-SHA256"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Customizer Button */}
            <button
              onClick={handleOpenCustomizer}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer"
              title="根据客户要求定制硬件参数与价格，一键生成专属在线电子签署链接"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>定制专属签约链接</span>
            </button>

            {isSigned && (
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>存证证书</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Tag className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "链接已复制" : "分享本合同"}</span>
            </button>

            <button
              onClick={handleNativePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印合同</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>导出矢量 PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Interactive Configurator */}
        <section className="lg:col-span-5 flex flex-col gap-6 print:hidden">
          {/* Locked Config Alert Banner */}
          {isLockedConfig && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between font-bold text-blue-950 dark:text-blue-200 text-sm">
                  <span>Chiang Mai AI Center 官方定制专属合同 · 配置已锁定</span>
                  <button
                    type="button"
                    onClick={() => setIsLockedConfig(false)}
                    className="text-xs font-normal underline text-blue-600 hover:text-blue-800 dark:text-blue-300 cursor-pointer flex items-center gap-1"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>解锁调整</span>
                  </button>
                </div>
                <p className="text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                  本合同已由 Chiang Mai AI Center 商务顾问为您预先定制配置（流水号：<span className="font-mono font-bold">{contractSerial}</span>）。方案标的、硬件算力与优惠费率已锁定。请核对右侧合同清单并在下方完成实名签署。
                </p>
              </div>
            </div>
          )}

          {/* Customizer Shortcut Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-neutral-900 dark:to-neutral-800/90 border border-blue-200/80 dark:border-neutral-700 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  合同定制与外发生成器
                </span>
                <span className="text-[11px] text-neutral-500">
                  为客户单独定制硬件与费率，一键生成专属在线电子签署链接
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenCustomizer}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 transition-colors cursor-pointer shrink-0"
            >
              打开定制器
            </button>
          </div>

          {/* Step 1: Base Package Selection */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  选定基础套餐
                </h2>
              </div>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setCurrency("CNY")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    currency === "CNY" ? "bg-white dark:bg-neutral-700 shadow-xs font-bold text-neutral-950 dark:text-white" : "text-neutral-500"
                  }`}
                >
                  ¥ 人民币
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("THB")}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    currency === "THB" ? "bg-white dark:bg-neutral-700 shadow-xs font-bold text-neutral-950 dark:text-white" : "text-neutral-500"
                  }`}
                >
                  ฿ 泰铢
                </button>
              </div>
            </div>

            {/* Two Primary Packages */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              {/* Plan 1: Workstation 888 (Flagship) */}
              <div
                onClick={() => setSelectedPlanId("workstation_888")}
                className={`relative rounded-xl p-4 cursor-pointer border-2 transition-all ${
                  selectedPlanId === "workstation_888"
                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 tracking-wider uppercase">
                        DEV CHOICE
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        FLAGSHIP · 极客旗舰首选
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                      云工位全服务包 (888套餐)
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      1V1 物理独享 Apple Silicon 算力 · 独立静态IP · 企业VPN · 官方AI会员全包
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    <span className="text-[11px] text-neutral-400 line-through">
                      {currency === "CNY" ? "¥1,188" : "฿5,940"}
                    </span>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {currency === "CNY" ? "¥888" : "฿4,440"}
                      <span className="text-xs font-normal text-neutral-500"> /月起</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      开机费 {currency === "CNY" ? "¥198" : "฿990"} (首月一次性)
                    </span>
                  </div>
                </div>
              </div>

              {/* Plan 2: AI Lazy 488 */}
              <div
                onClick={() => setSelectedPlanId("ai_lazy_488")}
                className={`relative rounded-xl p-4 cursor-pointer border-2 transition-all ${
                  selectedPlanId === "ai_lazy_488"
                    ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white tracking-wider uppercase">
                        RECOMMENDED
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        MOST POPULAR · 全包爆款
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                      海外AI无忧懒人包 (488套餐)
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      微主机 · 独立静态商业IP · VPN · 官方AI账号 · 专享海外代充
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    <span className="text-[11px] text-neutral-400 line-through">
                      {currency === "CNY" ? "¥688" : "฿3,440"}
                    </span>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {currency === "CNY" ? "¥488" : "฿2,440"}
                      <span className="text-xs font-normal text-neutral-500"> /月起</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      开户费 {currency === "CNY" ? "¥98" : "฿490"} (首月一次性)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Plans Select */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                切换至其它场景服务：
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full text-xs font-medium bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-800 dark:text-neutral-200 outline-hidden"
              >
                {CLOUD_PLANS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({currency === "CNY" ? `¥${p.priceCNY}` : `฿${p.priceTHB}`}/月)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Strict Hardware Specs: CPU: M2, M4, M6 | RAM: 8, 16, 24, 32 | SSD: 256, 512, 1TB */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  硬件算力规格自选 (CPU / 内存 / SSD)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {selectedPlanId === "workstation_888" ? "1V1 物理独享 Apple Silicon" : "云端虚拟化算力"}
              </span>
            </div>

            {selectedPlanId === "workstation_888" ? (
              <div className="space-y-4">
                {/* 1. CPU: M2 / M4 / M6 */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    <span>Apple Silicon CPU 芯片类型 (M2 / M4 / M6) *</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MAC_CPU_OPTIONS.map((cpu) => {
                      const isSelected = selectedCpuId === cpu.id;
                      const deltaText = cpu.priceDeltaCNY === 0 ? "标配 ¥0" : `+${currSym}${currency === "CNY" ? cpu.priceDeltaCNY : cpu.priceDeltaTHB}/月`;
                      return (
                        <div
                          key={cpu.id}
                          onClick={() => setSelectedCpuId(cpu.id)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-neutral-950 dark:text-white font-bold shadow-xs"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          <span className="text-sm font-bold">{cpu.name}</span>
                          <span className={`text-[10px] font-mono mt-1 ${isSelected ? "text-blue-600 dark:text-blue-400 font-bold" : "text-neutral-400"}`}>
                            {deltaText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Memory: 8, 16, 24, 32 */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    <span>统一内存容量 (8GB / 16GB / 24GB / 32GB) *</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {MAC_MEMORY_OPTIONS.map((mem) => {
                      const isSelected = selectedMemoryId === mem.id;
                      const deltaText = mem.priceDeltaCNY === 0 ? "标配" : `+${currSym}${currency === "CNY" ? mem.priceDeltaCNY : mem.priceDeltaTHB}`;
                      return (
                        <div
                          key={mem.id}
                          onClick={() => setSelectedMemoryId(mem.id)}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-neutral-950 dark:text-white font-bold shadow-xs"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          <span className="text-xs font-bold block">{mem.size}</span>
                          <span className={`text-[10px] font-mono ${isSelected ? "text-blue-600 dark:text-blue-400 font-bold" : "text-neutral-400"}`}>
                            {deltaText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. SSD: 256, 512, 1TB */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    <span>NVMe 高速固态存储 (256GB / 512GB / 1TB) *</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MAC_STORAGE_OPTIONS.map((st) => {
                      const isSelected = selectedStorageId === st.id;
                      const deltaText = st.priceDeltaCNY === 0 ? "标配" : `+${currSym}${currency === "CNY" ? st.priceDeltaCNY : st.priceDeltaTHB}`;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setSelectedStorageId(st.id)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 font-bold text-neutral-950 dark:text-white shadow-xs"
                              : "border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:bg-neutral-50"
                          }`}
                        >
                          <span className="text-xs font-bold block">{st.size}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{deltaText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedPlanId === "ai_lazy_488" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    微主机算力规格：
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => setMicroPcTier("std")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        microPcTier === "std"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold"
                          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span>标准型 (4 vCPU / 8GB)</span>
                        <span className="text-[10px] text-emerald-600">标配 ¥0</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 block">120GB NVMe 独立系统盘 · 满足日常挂机</span>
                    </div>

                    <div
                      onClick={() => setMicroPcTier("pro")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        microPcTier === "pro"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold"
                          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span>增强型 (8 vCPU / 16GB)</span>
                        <span className="text-[10px] text-emerald-600 font-mono">+{currSym}{currency === "CNY" ? 80 : 400}/月</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 block">240GB NVMe 高速盘 · 支撑多店铺多任务</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    预装系统沙箱环境：
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMicroPcOs("ubuntu")}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        microPcOs === "ubuntu"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-600"
                      }`}
                    >
                      Ubuntu 24.04 (预装防关联指纹浏览器)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMicroPcOs("windows")}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        microPcOs === "windows"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-600"
                      }`}
                    >
                      Windows Server 隔离开发沙箱
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600">
                当前场景包包含固定高规格资源配置：{currentPlan.specs.hardware} ({currentPlan.specs.os})。
              </div>
            )}
          </div>

          {/* Step 3: AI Subscription Detailed Specifications */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  官方 AI 顶配会员规格选定 (含每月订阅全包)
                </h2>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                合规海外外卡代充 · 零风控拒付
              </span>
            </div>

            <div className="space-y-2.5">
              {AI_SUBSCRIPTION_OPTIONS.map((opt) => {
                const isSelected = selectedAiSubId === opt.id;
                const deltaStr = opt.priceDeltaCNY === 0 ? "套餐内已包含 (¥0)" : `+${currSym}${currency === "CNY" ? opt.priceDeltaCNY : opt.priceDeltaTHB}/月`;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedAiSubId(opt.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 bg-white dark:bg-neutral-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-neutral-400"}`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          {opt.name}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono font-medium ${isSelected ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-neutral-400"}`}>
                        {deltaStr}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 pl-6">
                      {opt.summary}
                    </p>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 pl-6 border-t border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
                        {opt.detailedSpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-1.5 text-[10px] text-neutral-700 dark:text-neutral-300">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 4: Add-on Services Matrix (All miscellaneous services from cloud.lazzor.com) */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  配套与增值服务自选 (可自由组合，无冲突)
                </h2>
              </div>
              <span className="text-[10px] text-neutral-400">已选 {selectedAddonIds.length + (extraIpCount > 0 ? 1 : 0)} 项</span>
            </div>

            <p className="text-xs text-neutral-500 mb-3">
              整合平台所有出海服务能力（实体SIM卡长期保号、机房托管、API额度、线下工位、合规落地等），按需勾选自动列入合同。
            </p>

            <div className="space-y-2">
              {/* Extra Dedicated IP Multiplier */}
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>加购独享静态原生商业 IP (Clean ASN)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600">
                      套餐已含 1 个
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    一人一固定 IP 专线绑定 · 欺诈分 0 (+{currSym}{currency === "CNY" ? 100 : 500}/个/月)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExtraIpCount((prev) => Math.max(0, prev - 1))}
                    disabled={extraIpCount === 0}
                    className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold w-4 text-center">{extraIpCount}</span>
                  <button
                    type="button"
                    onClick={() => setExtraIpCount((prev) => prev + 1)}
                    className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Other Add-ons */}
              {CLOUD_ADDON_SERVICES.filter((a) => a.id !== "extra_ip").map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                const priceStr = addon.isOneTime
                  ? `一次性 ${currSym}${currency === "CNY" ? addon.monthlyPriceCNY : addon.monthlyPriceTHB}`
                  : `+${currSym}${currency === "CNY" ? addon.monthlyPriceCNY : addon.monthlyPriceTHB} /月`;

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60 shadow-xs"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center ${isSelected ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900" : "border-neutral-400"}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {addon.name}
                          </span>
                          <span className="text-[10px] font-mono px-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600">
                            {addon.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {addon.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono font-bold ${isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-500"}`}>
                        {priceStr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 5: Billing Cycle, Promo Code & Price Summary */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                采购周期与优惠码
              </h2>
            </div>

            {/* Duration Selector */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { m: 1, label: "月付", discount: "基础周期" },
                { m: 3, label: "季付 (3月)", discount: "95折特惠" },
                { m: 6, label: "半年付", discount: "9折特惠" },
                { m: 12, label: "年付合约", discount: "8折+免开机费" },
              ].map((item) => (
                <button
                  key={item.m}
                  type="button"
                  onClick={() => setDurationMonths(item.m)}
                  className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    durationMonths === item.m
                      ? "border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  <span className={`text-[10px] ${durationMonths === item.m ? "text-neutral-300 dark:text-neutral-700" : "text-emerald-600 dark:text-emerald-400 font-medium"}`}>
                    {item.discount}
                  </span>
                </button>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="优惠码 (如 cmai2026 或 colasola2026)"
                className="flex-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden uppercase font-mono"
              />
              <button
                type="button"
                onClick={handleVerifyPromo}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                验证优惠
              </button>
            </div>
            {promoMessage && (
              <p className={`text-[11px] mt-1.5 font-medium ${promoMessage.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                {promoMessage.text}
              </p>
            )}

            {/* Realtime Price Calculation Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>月度订阅小计 (含所选硬件、AI会员及配套):</span>
                <span>{currSym}{subtotalMonthly.toLocaleString()} / 月</span>
              </div>
              {durationDiscountRate < 1 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>长周期阶梯折扣 ({durationMonths}个月):</span>
                  <span>省 {Math.round((1 - durationDiscountRate) * 100)}%</span>
                </div>
              )}
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>专属优惠券抵扣 ({appliedPromo.name}):</span>
                  <span>省 {appliedPromo.percentOff}%</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>一次性开机/开户技术服务费:</span>
                <span>{effectiveSetupFee === 0 ? "¥0 (年付特惠全免)" : `${currSym}${effectiveSetupFee.toLocaleString()}`}</span>
              </div>
              {addonsOneTimeFee > 0 && (
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>一次性商业合规落地费用:</span>
                  <span>{currSym}{addonsOneTimeFee.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-baseline font-bold text-sm text-neutral-950 dark:text-white">
                <span>首期签约应付合计:</span>
                <span className="text-base text-emerald-600 dark:text-emerald-400">
                  {currSym}{totalInitialPayment.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Step 6: Customer Profile Information */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                6
              </span>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                签约主体信息 (乙方 / Customer)
              </h2>
            </div>

            {/* Type Switch */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setCustomerType("individual")}
                className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                  customerType === "individual"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                个人开发者 / 个人认购
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("company")}
                className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                  customerType === "company"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                出海企业 / 团队采购
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {customerType === "individual" ? (
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                    客户真实姓名 (Full Name) *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="例如: 张三 / Alex Chen"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                      企业全称 (Company Full Name) *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="例如: 杭州云起科技有限公司 / Global Trade Ltd."
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                        法定代表人/签约人
                      </label>
                      <input
                        type="text"
                        value={signatoryName}
                        onChange={(e) => setSignatoryName(e.target.value)}
                        placeholder="例如: 李四"
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                        职务头衔
                      </label>
                      <input
                        type="text"
                        value={signatoryTitle}
                        onChange={(e) => setSignatoryTitle(e.target.value)}
                        placeholder="例如: CEO / 业务负责人"
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  证件号码 / 统一社会信用代码 / Passport / Tax ID *
                </label>
                <input
                  type="text"
                  value={customerIdNumber}
                  onChange={(e) => setCustomerIdNumber(e.target.value)}
                  placeholder="身份证号 / 护照号 / 营业执照信用代码"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                    联系电话 (含区号) *
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+86 / +66 / 手机号"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                    电子邮箱 (接收账号及凭据) *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  通讯地址 / 注册地址
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="详细地址与城市"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">
                  服务起租生效日期
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Step 7: Identity Document Upload */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  7
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  客户资质与 KYC 实名凭证上传 (可选)
                </h2>
              </div>
              <span className="text-[10px] text-neutral-400">身份证 / 营业执照</span>
            </div>

            {idImage ? (
              <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-700 p-2 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded overflow-hidden bg-neutral-200 relative">
                    <img src={idImage} alt="Uploaded Doc" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 证件已成功上传
                    </span>
                    <span className="text-[11px] text-neutral-400">将作为合同附件一合并导出</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIdImage(null)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 bg-neutral-50/50 dark:bg-neutral-800/30"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-200/60 dark:bg-neutral-700/60 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  点击上传身份证、护照或营业执照文件
                </span>
                <span className="text-[10px] text-neutral-400">
                  JPG / PNG，用于合规实名备案与 KYC 官方外卡充值保障
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Step 8: Digital Signature Canvas */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  8
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  客户在线电子签约 (Digital Signature)
                </h2>
              </div>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setSigMode("draw");
                    setSignatureData(null);
                  }}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                    sigMode === "draw" ? "bg-white dark:bg-neutral-700 shadow-xs font-bold text-neutral-950 dark:text-white" : "text-neutral-500"
                  }`}
                >
                  <PenTool className="w-3 h-3" />
                  <span>手写画板</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSigMode("type");
                    setSignatureData(null);
                  }}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                    sigMode === "type" ? "bg-white dark:bg-neutral-700 shadow-xs font-bold text-neutral-950 dark:text-white" : "text-neutral-500"
                  }`}
                >
                  <Type className="w-3 h-3" />
                  <span>键盘输入</span>
                </button>
              </div>
            </div>

            {sigMode === "draw" ? (
              <div className="flex flex-col gap-2">
                <div className="relative w-full h-36 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden touch-none">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-neutral-400">
                      请在此区域使用鼠标或手指书写签名
                    </div>
                  )}
                  <div className="absolute bottom-1 right-2 pointer-events-none text-[10px] text-neutral-400 font-mono">
                    TIMESTAMP: {signingDateIso}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>清除重签</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={typedSigText}
                  onChange={(e) => handleTypedSignature(e.target.value)}
                  placeholder="在此输入您的法定签名全名 (如: Zhang San)"
                  className="w-full text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden"
                />
                <div className="h-20 bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center">
                  {signatureData ? (
                    <img src={signatureData} alt="Signature Preview" className="h-14 object-contain" />
                  ) : (
                    <span className="text-xs text-neutral-400">电子签名艺术字体实时预览</span>
                  )}
                </div>
              </div>
            )}

            <label className="flex items-start gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded text-neutral-900 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">
                我已仔细阅读并确认《企业级 AI 云工位与海外算力服务协议》所有细则及 SLA 交付标准，确认所选硬件参数（Apple {chosenCpu.name} / {chosenMemory.size} / {chosenStorage.size}）、AI 账号与增值配套服务规格无误，电子签名与时间戳哈希存证具有完全法律效力。
              </span>
            </label>

            {/* Execute Button */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              {isSigned ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>本合同已完成正式电子签署 · 存证已生效</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCertificateOpen(true)}
                    className="text-xs font-bold underline text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 cursor-pointer"
                  >
                    查看存证证书
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleExecuteContract}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>✍️ 确认并签署电子合同 (Sign & Seal E-Contract)</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: The Official Digital Contract Sheet */}
        <section className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[820px] bg-white text-neutral-900 rounded-2xl p-6 sm:p-10 shadow-lg border border-neutral-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full print:rounded-none">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-5 border-b-2 border-neutral-900">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center text-white shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase flex items-center gap-2">
                    <span>CHIANG MAI AI CENTER · 官方电子合同系统</span>
                    <span className="px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-mono text-[10px]">
                      CLOUD
                    </span>
                  </span>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-950">
                    企业级 AI 云工位与海外算力服务协议
                  </h1>
                  <span className="text-[11px] text-neutral-600">
                    Colasola Co., Ltd. (Chiang Mai AI Center 官方运营主体) · 商业登记税号: 0505566006478 · cloud.lazzor.com
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right flex flex-col text-xs text-neutral-500 font-mono">
                <span className="font-bold text-neutral-900">
                  REF: {contractSerial || "CMAI-CLOUD-2026"}
                </span>
                <span>签署日期: {signingDateIso || "2026-11-11"}</span>
                <span className="text-[10px] text-neutral-400">
                  HASH: {contractHash || "SHA256-VERIFIED"}
                </span>
                <div className="mt-1 flex items-center gap-1.5 justify-end">
                  {isSigned ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-bold text-[10px] border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      已正式签署生效 · 存证已固化
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-sans font-bold text-[10px] border border-amber-300">
                      <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                      待客户电子签署
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Plan Highlight Banner */}
            <div className={`mt-5 p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              currentPlan.id === "ai_lazy_488"
                ? "border-emerald-500 bg-emerald-50/50"
                : currentPlan.id === "workstation_888"
                ? "border-blue-600 bg-blue-50/50"
                : "border-neutral-300 bg-neutral-50"
            }`}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-900 text-white font-mono uppercase">
                    {currentPlan.badge}
                  </span>
                  <span className="text-xs font-bold text-neutral-700">
                    {currentPlan.category}
                  </span>
                </div>
                <div className="text-lg font-black text-neutral-950 mt-1">
                  {currentPlan.name}
                  <span className="text-xs font-normal text-neutral-500 ml-2">
                    ({currentPlan.enName})
                  </span>
                </div>
                <div className="text-xs text-neutral-600 mt-0.5">
                  {currentPlan.description}
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="text-xs text-neutral-500">签约实际服务费 (含所选规格与增值项)</div>
                <div className="text-xl font-black text-neutral-950">
                  {currSym}{effectiveMonthlyFee.toLocaleString()}
                  <span className="text-xs font-normal text-neutral-500"> /月</span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  服务期: {durationMonths} 个月
                  {appliedPromo && <span className="text-emerald-700 font-bold ml-1">({appliedPromo.percentOff}% 折扣)</span>}
                </div>
              </div>
            </div>

            {/* Parties Details Box */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs">
              {/* Party A */}
              <div className="flex flex-col gap-1 pr-0 md:pr-3 md:border-r border-neutral-200">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-700" />
                  服务提供方 (甲方 / Service Provider):
                </span>
                <span className="font-semibold text-neutral-800">
                  Colasola Co., Ltd. (Chiang Mai AI Center / cloud.lazzor.com)
                </span>
                <span className="text-neutral-600">
                  企业商业税号 (Tax ID): 0505566006478
                </span>
                <span className="text-neutral-600">
                  机房物理地址: 236/105 Chiang Mai AI Center, Moo 6, Mahidol Rd, Nong Hoi, Chiang Mai 50000, Thailand
                </span>
                <span className="text-neutral-600">
                  官方服务邮箱: service@colasola.com / admin@cmai.center
                </span>
              </div>

              {/* Party B */}
              <div className="flex flex-col gap-1 pl-0 md:pl-1">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-neutral-700" />
                  客户认购方 (乙方 / Customer / Subscriber):
                </span>
                <span className="font-semibold text-neutral-800">
                  {effectiveCustomerName} {customerType === "company" ? `(法定代表人: ${effectiveSignatoryDisplay})` : ""}
                </span>
                <span className="text-neutral-600">
                  证件号码 / Tax ID: {customerIdNumber || "待补充填写"}
                </span>
                <span className="text-neutral-600">
                  联系电话: {customerPhone || "待补充"} | 电子邮箱: {customerEmail || "待补充"}
                </span>
                <span className="text-neutral-600">
                  法定通讯地址: {customerAddress || "客户指定通讯地址"}
                </span>
              </div>
            </div>

            {/* Section 1: Detailed Deliverables & Hardware Specs Table */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center justify-between">
                <span>1. DELIVERABLES & HARDWARE SPECIFICATIONS (交付清单与硬件详细规格)</span>
                <span className="text-[10px] text-neutral-400 font-normal">逐项严格核对与验收标准</span>
              </h3>

              <div className="rounded-xl border border-neutral-200 overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-neutral-200">
                    {/* Item 1: Hardware & Chip Specs */}
                    <tr className="bg-neutral-50/50">
                      <td className="py-2.5 px-3.5 font-bold text-neutral-800 w-1/4">
                        算力硬件规格
                        <span className="block text-[10px] font-normal text-neutral-500">Hardware / CPU / RAM</span>
                      </td>
                      <td className="py-2.5 px-3.5 text-neutral-700">
                        {selectedPlanId === "workstation_888" ? (
                          <div className="space-y-1">
                            <div className="font-bold text-neutral-900 flex items-center gap-2">
                              <span>1V1 物理独享工作站：{chosenCpu.name} ({chosenCpu.specs})</span>
                            </div>
                            <div className="text-neutral-600">
                              统一内存: <strong>{chosenMemory.size}</strong> · 存储空间: <strong>{chosenStorage.size}</strong> · 操作系统: 原生 macOS (Sonoma/Sequoia)
                            </div>
                            <div className="text-[11px] text-emerald-700 font-medium">
                              ✓ 物理机完全独占 · 支持 App Store 提审与原生 Xcode 编译开发零卡顿
                            </div>
                          </div>
                        ) : selectedPlanId === "ai_lazy_488" ? (
                          <div className="space-y-1">
                            <div className="font-bold text-neutral-900">
                              轻量共享型云电脑 (微主机) - {microPcTier === "pro" ? "增强型 8 vCPU / 16GB RAM / 240GB NVMe" : "标准型 4 vCPU / 8GB RAM / 120GB NVMe"}
                            </div>
                            <div className="text-neutral-600">
                              运行环境: {microPcOs === "ubuntu" ? "Ubuntu 24.04 LTS (预装防关联指纹浏览器环境)" : "Windows Server 安全隔离开发沙箱"}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-medium">
                              ✓ 预装反指纹伪装与 7×24h 自动化值守守护进程
                            </div>
                          </div>
                        ) : (
                          <div>{currentPlan.specs.hardware} · {currentPlan.specs.os}</div>
                        )}
                      </td>
                    </tr>

                    {/* Item 2: AI Subscription Specs */}
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-neutral-800">
                        AI 顶配会员规格
                        <span className="block text-[10px] font-normal text-neutral-500">Official AI Membership</span>
                      </td>
                      <td className="py-2.5 px-3.5 text-neutral-700">
                        <div className="space-y-1">
                          <div className="font-bold text-neutral-900 flex items-center gap-2">
                            <span>{chosenAiSubscription.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              官方原价 ${chosenAiSubscription.officialPriceUsd}/月 费用全包
                            </span>
                          </div>
                          <div className="text-neutral-600 text-[11px]">
                            {chosenAiSubscription.summary}
                          </div>
                          <div className="text-[11px] text-neutral-600">
                            <strong>保障承诺：</strong>服务商使用合规海外商业外卡代缴代充；服务期内若出现非人为官方风控，提供 24h 免费协助解封或重置更换，免除风控拒付降智。
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Item 3: Dedicated Clean IP */}
                    <tr className="bg-neutral-50/50">
                      <td className="py-2.5 px-3.5 font-bold text-neutral-800">
                        独立静态商业 IP
                        <span className="block text-[10px] font-normal text-neutral-500">Dedicated Clean IP</span>
                      </td>
                      <td className="py-2.5 px-3.5 text-neutral-700">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-neutral-900">
                            {1 + extraIpCount}× 海外原生独占静态商业出口 IP (Clean ASN, Fraud Score 0)
                          </div>
                          <div className="text-neutral-600 text-[11px]">
                            专属绑定所分配云工位/物理机，出口长期固定，不与其他租户共享。支持海外开发者后台、TikTok/亚马逊跨境防关联、App Store 提审与大模型免降智直连。
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Item 4: Dedicated Network & Tunnel */}
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-neutral-800">
                        网络传输与安全隧道
                        <span className="block text-[10px] font-normal text-neutral-500">IPLC Line & Enterprise VPN</span>
                      </td>
                      <td className="py-2.5 px-3.5 text-neutral-700">
                        <div className="text-neutral-800">
                          <strong>中泰 IPLC / 国际专线端到端直连</strong> (&lt;18ms 超低抖动延迟) + 企业级 VPN 安全传输隧道（提供 WireGuard / Cisco AnyConnect SSL VPN 全平台凭据，数据端到端硬件级加密）。
                        </div>
                      </td>
                    </tr>

                    {/* Item 5: Add-ons Summary if any */}
                    {activeAddons.length > 0 && (
                      <tr className="bg-neutral-50/50">
                        <td className="py-2.5 px-3.5 font-bold text-neutral-800">
                          选配配套增值服务
                          <span className="block text-[10px] font-normal text-neutral-500">Configured Add-ons</span>
                        </td>
                        <td className="py-2.5 px-3.5 text-neutral-700">
                          <div className="space-y-1">
                            {activeAddons.map((add, aIdx) => (
                              <div key={aIdx} className="flex items-center gap-1.5 text-neutral-800">
                                <span className="font-bold text-emerald-700">● {add.name}:</span>
                                <span>{add.description}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Item 6: Setup & Support */}
                    <tr>
                      <td className="py-2.5 px-3.5 font-bold text-neutral-800">
                        开机/开户技术服务
                        <span className="block text-[10px] font-normal text-neutral-500">Setup & Engineering Support</span>
                      </td>
                      <td className="py-2.5 px-3.5 text-neutral-700">
                        <div className="text-neutral-800 text-[11px] leading-relaxed">
                          含 1 对 1 专属技术支持环境深度调优、专属节点初始化上架、客户端一键直连配置交付、7×24h 物理服务器心跳监控与故障 15 分钟内应急响应。
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Schedule Table */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                2. FEES & SETTLEMENT SCHEDULE (费用明细与首期结算表)
              </h3>
              <div className="overflow-hidden rounded-xl border border-neutral-200 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                      <th className="py-2 px-3">计费明细项 (Item Description)</th>
                      <th className="py-2 px-3">周期 / 数量</th>
                      <th className="py-2 px-3">核定单价</th>
                      <th className="py-2 px-3 text-right">结算金额 ({currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-800">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">
                        {currentPlan.name} 服务费 (含 CPU: {chosenCpu.name} / 内存: {chosenMemory.size} / SSD: {chosenStorage.size} / AI: {chosenAiSubscription.name})
                      </td>
                      <td className="py-2.5 px-3">{durationMonths} 个月</td>
                      <td className="py-2.5 px-3">
                        {currSym}{effectiveMonthlyFee.toLocaleString()} / 月
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {currSym}{(effectiveMonthlyFee * durationMonths).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">
                        专属物理节点初始化与 1 对 1 环境调优开机/开户服务费
                      </td>
                      <td className="py-2.5 px-3">首月一次性</td>
                      <td className="py-2.5 px-3">
                        {currSym}{baseSetupFee.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium">
                        {effectiveSetupFee === 0 ? "¥0 (年付特惠全免)" : `${currSym}${effectiveSetupFee.toLocaleString()}`}
                      </td>
                    </tr>
                    {addonsOneTimeFee > 0 && (
                      <tr>
                        <td className="py-2.5 px-3 font-medium">
                          商业合规落地一次性代办费 (DBD注册 + 银行对公账户 享7折特惠)
                        </td>
                        <td className="py-2.5 px-3">单次一次性</td>
                        <td className="py-2.5 px-3">
                          {currSym}{addonsOneTimeFee.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium">
                          {currSym}{addonsOneTimeFee.toLocaleString()}
                        </td>
                      </tr>
                    )}
                    {appliedPromo && (
                      <tr className="bg-emerald-50/60 text-emerald-800 font-medium">
                        <td className="py-2 px-3" colSpan={3}>
                          优惠券抵扣: {appliedPromo.name}
                        </td>
                        <td className="py-2 px-3 text-right">
                          - {appliedPromo.percentOff}%
                        </td>
                      </tr>
                    )}
                    <tr className="bg-emerald-50 text-emerald-950 font-bold text-sm">
                      <td className="py-3 px-3" colSpan={2}>
                        首期签约应付总计 (TOTAL INITIAL PAYMENT):
                      </td>
                      <td className="py-3 px-3 text-xs text-neutral-600 font-normal">
                        大写: {currency === "CNY" ? numberToChineseRMB(totalInitialPayment) : numberToEnglishWords(totalInitialPayment, "THB")}
                      </td>
                      <td className="py-3 px-3 text-right text-base text-emerald-700">
                        {currSym}{totalInitialPayment.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legal Clauses Section: Structured & Explicit */}
            <div className="mt-6 space-y-3.5 text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-200 pt-5">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                3. TERMS & CONDITIONS (核心基础条款与服务保障细则)
              </h3>

              <div>
                <strong className="text-neutral-900">第一条 服务交付与标的标准：</strong>
                甲方承诺按照本合同第一条所列明的具体规格标准向乙方交付所选定的 Apple Silicon 物理机（包含指定 CPU 芯片型号 {chosenCpu.name}、统一内存 {chosenMemory.size} 及 {chosenStorage.size} SSD 空间）或微主机算力，并配置 1× 独享海外原生静态商业 IP 及专线 VPN 账号。甲方承诺在乙方完成首付款项后 24 小时内完成初始化调优并交付使用凭证。
              </div>

              <div>
                <strong className="text-neutral-900">第二条 官方 AI 会员服务及 KYC 合规代充条款：</strong>
                甲方负责为乙方开通所选定的官方 AI 会员账号（ChatGPT Plus / Claude Pro / Team 席位），每月官方订阅美金费用全额由甲方承担并由境外正规银行商业外卡代缴。甲方承诺代充渠道合法合规，免除普通虚拟卡封号拒付风险。在服务有效期内，若账号发生非因乙方违法使用造成的官方风控异常，甲方提供全流程免费运维及重置更换保障。
              </div>

              <div>
                <strong className="text-neutral-900">第三条 独立商业 IP 与专线 SLA 保障：</strong>
                甲方交付之 IP 为 100% 原生静态商业 IP（固定 IPv4，Clean ASN，欺诈分 0），独占专用，支持苹果开发者账号及各类高风控外服平台。中泰专线提供端到端 &lt;18ms 超低时延。甲方承诺提供 99.9% 算力与网络可用性 SLA；若因甲方机房电力或网络单点故障导致服务连续中断超过 4 小时，甲方按实际中断时长的 3 倍无偿顺延服务期。
              </div>

              <div>
                <strong className="text-neutral-900">第四条 增值服务交付标准与保障：</strong>
                若乙方选配泰国实体 SIM 卡保号，甲方承诺提供 100% 真实泰国物理 SIM 卡，全天候保障 OTP 验证码接收；若乙方选配机房托管，甲方承诺提供双路市电、ColaSola 光伏绿电与 APC 在线式 UPS 零秒倒闸供电；若选配线下大楼共享工位，乙方享有清迈 AI 中心独栋 5 层实体大厦工位通行、万兆光纤与现磨咖啡权益。
              </div>

              <div>
                <strong className="text-neutral-900">第五条 数据安全、知识产权与代码不落地保障：</strong>
                甲方严格履行保密义务，采用机房物理隔离与全链路加密机制，确保“源码不落地、数据私有化”。乙方在云工位内创建、存储、运行的所有代码、项目工程、模型权重及业务资产，其 100% 知识产权与所有权独家归乙方所有。甲方绝不以任何形式审查、复制、镜像或向第三方透露乙方数据资产。
              </div>

              <div>
                <strong className="text-neutral-900">第六条 服务期限与续费规则：</strong>
                本协议服务有效期自 <strong>{startDate}</strong> 起至 <strong>{endDate}</strong> 止（共 {durationMonths} 个月）。服务期满前 7 个工作日，甲方将提醒乙方办理续费。若乙方选择年付合约，直接免收首月开机/开户技术服务费并享受合约优惠费率。
              </div>

              <div>
                <strong className="text-neutral-900">第七条 合规使用守则与终止权：</strong>
                乙方承诺将本服务严格用于正规的软件研发、出海业务、AI 办公与电商合规运营，严禁从事任何网络攻击（如 DDoS、端口嗅探）、电信诈骗、垃圾邮件轰炸或违反中泰两国法律法规的行为。如乙方违规操作导致 IP 被封或列入黑名单，甲方有权立即解除合同并不予退还剩余款项。
              </div>

              <div>
                <strong className="text-neutral-900">第八条 电子签名效力与司法管辖：</strong>
                双方确认本协议采用电子签名、数字时间戳及 SHA-256 哈希存证，具备与纸质合同完全同等的法律证明力。因本合同引起的争议，双方应友好协商，协商不成的，由泰王国清迈当地管辖法院审理。
              </div>
            </div>

            {/* Dual Signatures and Official Stamp */}
            <div className="mt-8 pt-6 border-t-2 border-neutral-900 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Party A: Service Provider */}
              <div className="relative p-4 rounded-xl border border-neutral-300 bg-neutral-50/50 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="text-xs font-bold text-neutral-900 uppercase">
                    服务提供方 (甲方盖章 / PARTY A)
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">
                    Colasola Co., Ltd. (Chiang Mai AI Center)
                  </div>
                </div>

                {/* Official Stamp Img */}
                <div className="absolute right-6 top-8 w-28 h-28 pointer-events-none opacity-90 select-none">
                  {stampDataUrl && (
                    <img src={stampDataUrl} alt="Colasola Official Stamp" className="w-full h-full object-contain" />
                  )}
                </div>

                <div className="mt-8 text-[11px] text-neutral-700 flex flex-col">
                  <span>法定代表人 / 授权签署人: Authorized Director</span>
                  <span>签署日期: {signingDateIso}</span>
                  <span className="font-mono text-[9px] text-neutral-400 mt-1">
                    VERIFIED HASH: {contractHash}
                  </span>
                </div>
              </div>

              {/* Party B: Customer Signature */}
              <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50/50 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="text-xs font-bold text-neutral-900 uppercase">
                    客户认购方 (乙方签署 / PARTY B)
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">
                    {effectiveCustomerName}
                  </div>
                </div>

                {/* Customer Signature Display */}
                <div className="h-16 flex items-center justify-center my-1">
                  {signatureData ? (
                    <img src={signatureData} alt="Customer Digital Signature" className="max-h-14 object-contain" />
                  ) : (
                    <div className="text-xs text-neutral-400 italic">
                      [等待乙方在左侧画板完成签名]
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-neutral-700 flex flex-col">
                  <span>签署人姓名: {effectiveSignatoryDisplay}</span>
                  <span>签署时间: {signedTimestamp || signingDateIso}</span>
                  <span className="text-[10px] font-semibold mt-1">
                    {isSigned ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        已完成原笔迹电子签署 · 存证上链生效
                      </span>
                    ) : termsAgreed ? (
                      <span className="text-blue-600">✓ 条款已核对确认，等待点击完成签署</span>
                    ) : (
                      <span className="text-neutral-400">待完成电子签名与条款确认</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Annex Section: Attached ID Document Preview */}
            {idImage && (
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <div className="text-xs font-bold text-neutral-900 uppercase mb-2">
                  ANNEX 1: CUSTOMER IDENTITY DOCUMENT (附件一：实名凭证)
                </div>
                <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-neutral-200 shadow-xs">
                  <img src={idImage} alt="Customer ID / License" className="w-full object-contain max-h-64" />
                </div>
                <p className="text-[10px] text-center text-neutral-400 mt-1.5">
                  已做合规数字水印加密存储，仅用于本次服务开通与跨境支付实名备案
                </p>
              </div>
            )}

            {/* Document Bottom Footer */}
            <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-[10px] text-neutral-400 font-mono">
              Chiang Mai AI Center · Colasola Co., Ltd. · cloud.lazzor.com · Official Digital Protocol · Serial: {contractSerial}
            </div>
          </div>
        </section>
      </main>

      {/* --- Certificate of Digital Execution Modal --- */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 text-neutral-900 dark:text-neutral-100 overflow-hidden">
            {/* Background seal watermark */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 pointer-events-none">
              <Cpu className="w-full h-full text-blue-600" />
            </div>

            <button
              onClick={() => setIsCertificateOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    OFFICIAL VERIFICATION
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    SHA-256 CHECKED
                  </span>
                </div>
                <h3 className="text-lg font-black text-neutral-950 dark:text-white">
                  Chiang Mai AI Center 电子合同存证证书
                </h3>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 p-4 border border-neutral-200/80 dark:border-neutral-700 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">电子合同流水号:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{contractSerial}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">存证防伪哈希:</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">{contractHash}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">电子签署时间戳:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{signedTimestamp || signingDateIso}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">服务提供方 (甲方):</span>
                <span className="font-semibold text-neutral-900 dark:text-white">Chiang Mai AI Center (Colasola Co., Ltd.)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">客户认购方 (乙方):</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{effectiveCustomerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">签约交付标的:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{currentPlan.name} (含 {chosenCpu.name} / {chosenMemory.size} / {chosenStorage.size})</span>
              </div>
            </div>

            <div className="my-5 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>电子签署生效与存证保障：</strong>
                双方电子签名已与合同防伪哈希（SHA-256）及清迈标准时间戳安全绑定并加盖 Colasola 官方公章。依据《中华人民共和国电子签名法》及泰王国《电子交易法令》(Electronic Transactions Act)，本存证函具备完整不可篡改的法律证明力。
              </div>
            </div>

            {/* Signatures Preview */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 text-center">
                <div className="text-[10px] text-neutral-500 uppercase mb-1">甲方授权印章</div>
                <div className="h-16 flex items-center justify-center">
                  {stampDataUrl && <img src={stampDataUrl} alt="Official Stamp" className="h-14 object-contain" />}
                </div>
                <div className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-1">Colasola Innovation Co., Ltd.</div>
              </div>

              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 text-center">
                <div className="text-[10px] text-neutral-500 uppercase mb-1">乙方电子签名</div>
                <div className="h-16 flex items-center justify-center">
                  {signatureData ? (
                    <img src={signatureData} alt="Client Signature" className="h-14 object-contain" />
                  ) : (
                    <span className="text-xs text-neutral-400 italic">已确认签署</span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-1">{effectiveSignatoryDisplay}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>下载盖章版 PDF 合同</span>
              </button>

              <button
                onClick={handleNativePrint}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-semibold text-xs border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>打印存证</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-semibold text-xs border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "链接已复制" : "复制存证链接"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Contract Customizer & Link Sharing Generator Modal --- */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm print:hidden animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
                      CHIANG MAI AI CENTER · GENERATOR
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      REF: {custContractSerial}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-neutral-950 dark:text-white">
                    客户专属服务合同定制与签约链接生成器
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setIsCustomizerOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Columns */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Section A: Customer Details */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>1. 客户签约主体信息 (预填或由客户补充)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">主体类型</label>
                      <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 p-0.5 bg-white dark:bg-neutral-800 text-xs">
                        <button
                          type="button"
                          onClick={() => setCustCustomerType("individual")}
                          className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                            custCustomerType === "individual" ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold" : "text-neutral-500"
                          }`}
                        >
                          个人客户
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustCustomerType("company")}
                          className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                            custCustomerType === "company" ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold" : "text-neutral-500"
                          }`}
                        >
                          企业主体
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                        {custCustomerType === "company" ? "企业客户全称" : "客户姓名"}
                      </label>
                      <input
                        type="text"
                        value={custCustomerType === "company" ? custCompanyName : custCustomerName}
                        onChange={(e) => {
                          if (custCustomerType === "company") setCustCompanyName(e.target.value);
                          else setCustCustomerName(e.target.value);
                        }}
                        placeholder={custCustomerType === "company" ? "例如：清迈智能创新科技有限公司" : "例如：张伟 / Alex"}
                        className="w-full text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">联系手机</label>
                      <input
                        type="text"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="例如：+86 13800000000 / 0812345678"
                        className="w-full text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">联系邮箱</label>
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="例如：client@company.com"
                        className="w-full text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Plan Selection */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-blue-600" />
                    <span>2. 选定服务方案套餐</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {CLOUD_PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setCustPlanId(plan.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          custPlanId === plan.id
                            ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs"
                            : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono">
                            {plan.badge}
                          </span>
                          <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                            {custCurrency === "CNY" ? `¥${plan.priceCNY}` : `฿${plan.priceTHB}`}/月
                          </span>
                        </div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {plan.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: Hardware Specs (for 888 Mac Plan) */}
                {custPlanId === "workstation_888" && (
                  <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 space-y-3">
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span>3. 硬件规格指定 (M2 / M4 / M6 · 内存 · SSD)</span>
                    </h3>

                    {/* CPU Selection */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1.5">CPU 芯片型号</label>
                      <div className="grid grid-cols-3 gap-2">
                        {MAC_CPU_OPTIONS.map((cpu) => (
                          <button
                            key={cpu.id}
                            type="button"
                            onClick={() => setCustCpuId(cpu.id)}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                              custCpuId === cpu.id
                                ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                                : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div>{cpu.name}</div>
                            <div className={`text-[10px] font-normal ${custCpuId === cpu.id ? "text-blue-100" : "text-neutral-400"}`}>
                              {cpu.priceDeltaCNY === 0 ? "标配基准" : `+¥${cpu.priceDeltaCNY}/月`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* RAM Selection */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1.5">RAM 统一内存容量</label>
                      <div className="grid grid-cols-4 gap-2">
                        {MAC_MEMORY_OPTIONS.map((mem) => (
                          <button
                            key={mem.id}
                            type="button"
                            onClick={() => setCustMemoryId(mem.id)}
                            className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                              custMemoryId === mem.id
                                ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                                : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div>{mem.size}</div>
                            <div className={`text-[9px] font-normal ${custMemoryId === mem.id ? "text-blue-100" : "text-neutral-400"}`}>
                              {mem.priceDeltaCNY === 0 ? "标配" : `+¥${mem.priceDeltaCNY}`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SSD Selection */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1.5">NVMe 高速存储 (SSD)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {MAC_STORAGE_OPTIONS.map((ssd) => (
                          <button
                            key={ssd.id}
                            type="button"
                            onClick={() => setCustStorageId(ssd.id)}
                            className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                              custStorageId === ssd.id
                                ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                                : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div>{ssd.size}</div>
                            <div className={`text-[9px] font-normal ${custStorageId === ssd.id ? "text-blue-100" : "text-neutral-400"}`}>
                              {ssd.priceDeltaCNY === 0 ? "标配" : `+¥${ssd.priceDeltaCNY}`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section D: AI Subscription Specification */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span>4. 官方 AI 会员规格包含 (ChatGPT & Claude)</span>
                  </h3>

                  <div className="space-y-2">
                    {AI_SUBSCRIPTION_OPTIONS.map((ai) => (
                      <div
                        key={ai.id}
                        onClick={() => setCustAiSubId(ai.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          custAiSubId === ai.id
                            ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs"
                            : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {ai.name}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {ai.summary}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 shrink-0">
                          {ai.priceDeltaCNY === 0 ? "套餐内已全包" : `+¥${ai.priceDeltaCNY}/月`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section E: Add-ons & Term */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 space-y-3">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>5. 增值服务、租期与流水号定制</span>
                  </h3>

                  {/* Add-on Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {CLOUD_ADDON_SERVICES.map((addon) => {
                      const isSelected = custAddonIds.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => {
                            setCustAddonIds((prev) =>
                              prev.includes(addon.id) ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]
                            );
                          }}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="mt-0.5 rounded text-emerald-600 pointer-events-none"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[11px] truncate">{addon.name}</div>
                            <div className="text-[10px] text-neutral-500">
                              {custCurrency === "CNY" ? `+¥${addon.monthlyPriceCNY}` : `+฿${addon.monthlyPriceTHB}`} {addon.isOneTime ? "(一次性)" : "/月"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Extra IPs */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-900 dark:text-white">加购独立原生商业 IP 数量</span>
                      <span className="text-[10px] text-neutral-500">套餐已含 1 个独享出口，可加购防关联</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustExtraIpCount(Math.max(0, custExtraIpCount - 1))}
                        className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold w-6 text-center">{custExtraIpCount}</span>
                      <button
                        type="button"
                        onClick={() => setCustExtraIpCount(Math.min(10, custExtraIpCount + 1))}
                        className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Duration, Currency, Serial */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">签约服务周期</label>
                      <select
                        value={custDurationMonths}
                        onChange={(e) => setCustDurationMonths(Number(e.target.value))}
                        className="w-full text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 font-bold outline-hidden"
                      >
                        <option value={1}>1 个月 (月付)</option>
                        <option value={3}>3 个月 (95折特惠)</option>
                        <option value={6}>6 个月 (9折特惠)</option>
                        <option value={12}>12 个月 (8折 + 免开机费)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">结算币种</label>
                      <select
                        value={custCurrency}
                        onChange={(e) => setCustCurrency(e.target.value as "CNY" | "THB")}
                        className="w-full text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 font-bold outline-hidden"
                      >
                        <option value="CNY">¥ 人民币 (CNY)</option>
                        <option value="THB">฿ 泰铢 (THB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">自定义合同编号</label>
                      <input
                        type="text"
                        value={custContractSerial}
                        onChange={(e) => setCustContractSerial(e.target.value)}
                        placeholder="CMAI-CLOUD-XXXX"
                        className="w-full text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 font-mono outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Lock Specs Option */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                      <input
                        type="checkbox"
                        checked={custLockSpecs}
                        onChange={(e) => setCustLockSpecs(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-blue-950 dark:text-blue-200">
                          锁定服务与硬件配置（推荐客户直接签字）
                        </span>
                        <span className="block text-[11px] text-blue-700 dark:text-blue-300">
                          开启后，客户打开链接时无需自选，直接查阅已商定方案并在线实名签署。
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Generated Link, QR, Invitation (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Box 1: Real-time Price Summary */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-5 rounded-2xl shadow-lg">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    CHIANG MAI AI CENTER · 专属定制合同
                  </span>
                  <div className="flex items-baseline justify-between">
                    <div className="text-lg font-bold text-white">
                      {custDurationMonths} 个月合约方案
                    </div>
                    <span className="text-xs font-mono text-emerald-400">
                      {custLockSpecs ? "● 已锁定配置" : "○ 允许自选"}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-2 pt-2 border-t border-neutral-700/60 leading-relaxed">
                    专为出海团队打造的高性能硬件与合规网络基座，客户点击链接即可核对明细并完成原笔迹电子签署。
                  </div>
                </div>

                {/* Box 2: Personalized Shareable Link */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>专属客户签约链接 (URL)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const url = computeCustomizerUrl();
                        navigator.clipboard.writeText(url).then(() => {
                          setCopiedShareUrl(true);
                          setTimeout(() => setCopiedShareUrl(false), 2000);
                        });
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedShareUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedShareUrl ? "已复制链接" : "一键复制"}</span>
                    </button>
                  </div>

                  <textarea
                    readOnly
                    rows={3}
                    value={computeCustomizerUrl()}
                    className="w-full text-[11px] font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-neutral-700 dark:text-neutral-300 outline-hidden select-all"
                  />
                </div>

                {/* Box 3: Formal WeChat/Email Invitation */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      <span>微信 / WhatsApp / 邮件 签约邀请函</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const url = computeCustomizerUrl();
                        const text = computeInvitationText(url);
                        navigator.clipboard.writeText(text).then(() => {
                          setCopiedInvitation(true);
                          setTimeout(() => setCopiedInvitation(false), 2000);
                        });
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedInvitation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedInvitation ? "已复制文案" : "一键复制文案"}</span>
                    </button>
                  </div>

                  <textarea
                    readOnly
                    rows={5}
                    value={computeInvitationText(computeCustomizerUrl())}
                    className="w-full text-[10px] leading-relaxed bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-neutral-700 dark:text-neutral-300 outline-hidden select-all"
                  />
                </div>

                {/* Box 4: QR Code for Mobile Scanning */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 flex items-center gap-4">
                  <div className="w-24 h-24 bg-white rounded-xl p-1.5 border border-neutral-200 dark:border-neutral-700 shrink-0 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(computeCustomizerUrl())}`}
                      alt="Contract QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-neutral-950 dark:text-white">手机扫码原笔迹手写签署</span>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                      可直接让客户使用微信或手机自带相机扫码，在触屏手机上流畅完成原笔迹电子手写签名。
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleApplyCustomizerToLive}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer text-center"
                  >
                    应用到当前合同并查阅
                  </button>
                  <a
                    href={computeCustomizerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl font-semibold text-xs border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>新标签页预览</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CloudContractClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            正在加载企业级云工位合同界面...
          </div>
        </div>
      }
    >
      <CloudContractContent />
    </Suspense>
  );
}
