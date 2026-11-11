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
  Laptop
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
    id: "ai_lazy_488",
    name: "海外AI无忧懒人包",
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
      "中泰 IPLC / 国际专线直达 (<18ms), 全天候稳定挂机防关联与防封禁",
      "开户费 ¥98 含 1 对 1 专属技术支持协助调优、环境部署与客户端配置",
    ],
    specs: {
      hardware: "微主机 (轻量共享型云电脑，4-8 vCPU / 8-16GB RAM / NVMe 高速盘)",
      os: "Linux / Windows 安全沙箱环境 · 预装防关联指纹浏览器",
      ip: "1x 独立海外原生静态商业 IP (100% 独享 Clean ASN，欺诈分 0)",
      network: "中泰 IPLC / 国际专线直连 (<18ms 极低延迟) + 企业级 VPN 安全隧道",
      aiAccount: "ChatGPT PLUS 或 Claude 官方订阅会员 2 选 1 (每月订阅费用全包)",
      support: "开户费含 1 对 1 专属工程师环境调优、客户端一键部署与日常代运维",
    },
  },
  {
    id: "workstation_888",
    name: "云工位全服务包",
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
      "1x Mac 专属云工作站 (1V1 物理独享 Apple Silicon M 系列芯片，原生 macOS) + VPN",
      "ChatGPT PLUS 或 Claude 会员 2 选 1 (已含每月官方会员订阅权益，专享纯净环境无惧封号降智，开箱即用)",
      "1x 独立海外原生静态商业 IP (专属绑定 Mac，支持海外开发者后台与 App Store 提审)",
      "海外大模型/开发者账号专属 KYC 代充服务 (专享合规海外卡与手机号充值，免风控拒付)",
      "独占千兆对等带宽与国际专线直连，原生 macOS 物理机直通，开发编译零卡顿",
      "开机费 ¥198 含 1 对 1 专属技术支持环境调优、专属节点初始化与客户端一键直连",
    ],
    specs: {
      hardware: "1V1 物理独享 Apple Silicon M 系列芯片工作站 (物理机硬件级独占)",
      os: "原生 macOS 开发者工作站环境 (支持 Xcode、编译构建与原生开发工具链)",
      ip: "1x 独立海外原生静态商业 IP (专属物理绑定，支持 App Store 提审与外服部署)",
      network: "独占千兆对等带宽 + 国际专线直连 + 企业级 VPN 隧道 (开发编译零卡顿)",
      aiAccount: "ChatGPT PLUS 或 Claude 官方顶配会员 2 选 1 (每月官方订阅全包)",
      support: "开机费含 1 对 1 专属技术工程师环境深度调优、专属节点初始化与直连客户端",
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
      "中泰 IPLC 专线直达 (<18ms)，全天候稳定挂机防关联",
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
    id: "indie_dev_pack",
    name: "跨国独立开发敏捷包 (Indie Dev Pro)",
    enName: "Indie Dev Pro Global Cloud Suite",
    category: "DEV CHOICE · 极客进阶",
    badge: "PRO DEV",
    priceCNY: 680,
    originalPriceCNY: 800,
    setupFeeCNY: 198,
    priceTHB: 3399,
    originalPriceTHB: 3999,
    setupFeeTHB: 990,
    description: "1V1 物理独享 Apple Silicon 算力与全球大模型 API 聚合通道的极简开发工作站。",
    tags: ["+Mac 1V1 独享", "+大模型 API 额度", "+独立静态IP", "+账号代充/KYC"],
    features: [
      "1x Mac 专属云工作站 (1V1 物理独享 Apple Silicon M 系列芯片，原生 macOS)",
      "1x 全球大模型 API 聚合网关 (每月含 ฿500 高速额度，支持 GPT-6 & Claude 5.6)",
      "1x 独立海外原生静态商业 IP (专属绑定 Mac，支持海外开发者后台与 App Store 提审)",
      "海外大模型/开发者账号专属代充与 KYC 服务 (提供合规海外信用卡与手机号绑定)",
      "独占千兆对等带宽，原生 macOS 物理机直通，开发编译零卡顿",
    ],
    specs: {
      hardware: "Apple Silicon Mac 物理机独享算力",
      os: "原生 macOS 纯净开发环境",
      ip: "1x 独立静态原生商业出口 IP",
      network: "千兆对等出口直连专线",
      aiAccount: "内置每月 ฿500 全球大模型 API 额度 + 开发者账号代充通道",
      support: "专属远程桌面配置与开发环境调试",
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
  {
    id: "nomad_dual_pack",
    name: "「云地一体」清迈数字游民双栖包",
    enName: "Chiang Mai Nomad Cloud & Physical Hybrid Suite",
    category: "HYBRID · 线上云端 + 线下大楼",
    badge: "CLOUD + DESK",
    priceCNY: 380,
    originalPriceCNY: 480,
    setupFeeCNY: 98,
    priceTHB: 1899,
    originalPriceTHB: 2398,
    setupFeeTHB: 490,
    description: "清迈独栋 5 层 AI 中心线下共享工位 + 24h 永续在线云工位特惠打包方案。",
    tags: ["+线下大楼工位", "+24h 微主机", "+独立静态IP", "+实体卡保号"],
    features: [
      "1x 清迈 AI 中心线下 5 层实体大厦共享工位月度通票 (挑高空间、万兆光纤、免费现磨咖啡与会议室权益)",
      "1x 轻量共享型云电脑 (微主机，24h 云端全自动挂机、自动化脚本与防关联沙箱)",
      "1x 独立海外原生静态商业 IP (专属绑定，Fraud Score 0，跨国漫游无感直连)",
      "1x 泰国原生真实实体 SIM 卡长期保号 (接收本地银行网银、PromptPay 与外卖应用 OTP)",
      "线下大厦内网千兆直通云端机房，出门在外随时通过中泰 IPLC 专线安全接入",
    ],
    specs: {
      hardware: "线下 AI 中心 5 层大楼工位通行权 + 线上 24h 永续轻量微主机",
      os: "双端互通：大厦内网直连 + 远程桌面安全接入",
      ip: "1x 独立海外原生静态商业 IP",
      network: "大厦万兆局域网直通机房 + 国际专线",
      aiAccount: "含实体卡长期保号与本地支付代充通道",
      support: "前台管家服务与工程师 1 对 1 技术保障",
    },
  },
];

// Pure jsPDF Vector Contract Generator for Cloud Services
async function generateVectorCloudContractPdf(data: {
  contractSerial: string;
  contractHash: string;
  signingDateStr: string;
  selectedPlan: CloudPlanItem;
  chosenAiService: string;
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
  doc.text("CHIANG MAI AI CENTER · CLOUD DESK", margin + 32, 17);

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
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("CLOUD WORKSTATION & COMPUTING SERVICE AGREEMENT", margin, 38);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Enterprise Cloud Workstation, Dedicated Clean IP & AI Services Agreement", margin, 43);

  // Plan Badge
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(pageWidth - margin - 58, 33, 58, 12, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202);
  doc.text(`${data.selectedPlan.name}`, pageWidth - margin - 29, 39, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`${currSym}${data.monthlyServiceFee.toLocaleString()}/mo · ${data.durationMonths} Months`, pageWidth - margin - 29, 43, { align: "center" });

  let y = 50;

  // Parties Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE PROVIDER (Party A):", margin + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text("Chiang Mai AI Center (Colasola Co., Ltd.) · Tax ID: 0505566006478", margin + 50, y + 6);
  doc.text("236/105 Chiang Mai AI Center, Moo 6, Mahidol Rd, Nong Hoi, Chiang Mai 50000", margin + 50, y + 10);

  doc.setFont("helvetica", "bold");
  doc.text("CUSTOMER (Party B):", margin + 4, y + 17);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.effectiveCustomerName || "Customer"} ${data.customerType === "company" ? `(Rep: ${data.effectiveSignatoryDisplay})` : ""}`, margin + 50, y + 17);
  doc.setFont("helvetica", "bold");
  doc.text("ID / Tax / Business No:", margin + 4, y + 22);
  doc.setFont("helvetica", "normal");
  doc.text(String(data.customerIdNumber || "-"), margin + 50, y + 22);
  doc.setFont("helvetica", "bold");
  doc.text("Phone & Email:", margin + 4, y + 27);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.customerPhone || "-"}  |  ${data.customerEmail || "-"}`, margin + 50, y + 27);
  doc.setFont("helvetica", "bold");
  doc.text("Official Address:", margin + 4, y + 31);
  doc.setFont("helvetica", "normal");
  const truncatedAddr = data.customerAddress && data.customerAddress.length > 70 ? data.customerAddress.slice(0, 67) + "..." : (data.customerAddress || "-");
  doc.text(truncatedAddr, margin + 50, y + 31);

  y += 40;

  // Section 1: Service Scope & Resource Allocation
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. SERVICE SCOPE & RESOURCE SPECIFICATIONS (服务项目与配置约定)", margin, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`1.1 Selected Plan: ${data.selectedPlan.name} (${data.selectedPlan.enName}).`, margin, y);
  y += 4;
  doc.text(`1.2 Hardware & OS: ${data.selectedPlan.specs.hardware} | ${data.selectedPlan.specs.os}.`, margin, y);
  y += 4;
  doc.text(`1.3 Network & IP: ${data.selectedPlan.specs.ip} | ${data.selectedPlan.specs.network}.`, margin, y);
  y += 4;
  doc.text(`1.4 AI Account & Support: ${data.chosenAiService} (Included) | ${data.selectedPlan.specs.support}.`, margin, y);
  y += 4;
  doc.text(`1.5 Service Term: From ${data.startDate} to ${data.endDate} (Total: ${data.durationMonths} Month${data.durationMonths > 1 ? "s" : ""}).`, margin, y);

  y += 7;

  // Section 2: Financial Summary Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("2. FEES & PAYMENT SCHEDULE (费用明细与支付清单)", margin, y);
  y += 4.5;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("Item / Description", margin + 4, y + 4);
  doc.text(`Amount (${data.currency})`, pageWidth - margin - 4, y + 4, { align: "right" });
  y += 5.5;

  const feeItems = [
    [`Monthly Cloud Service Fee (${data.selectedPlan.name})`, `${currSym}${data.monthlyServiceFee.toLocaleString()} / mo`],
    [`Total Subscription Service Fee (${data.durationMonths} Months)`, `${currSym}${(data.monthlyServiceFee * data.durationMonths).toLocaleString()}`],
    [`One-time Setup / Initialization Fee (开机/开户技术服务费)`, data.setupFee === 0 ? "Waived (¥0 免收)" : `${currSym}${data.setupFee.toLocaleString()}`],
    [`TOTAL INITIAL PAYMENT DUE UPON SIGNING (首期签约应付合计)`, `${currSym}${data.totalInitialPayment.toLocaleString()}`],
  ];

  feeItems.forEach(([desc, amt], idx) => {
    const isTotal = idx === feeItems.length - 1;
    if (isTotal) {
      doc.setFillColor(236, 253, 245);
      doc.rect(margin, y, contentWidth, 6.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(6, 95, 70);
    } else {
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
    }
    doc.text(desc, margin + 4, y + 4.2);
    doc.text(amt, pageWidth - margin - 4, y + 4.2, { align: "right" });
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + (isTotal ? 6.5 : 5.5), pageWidth - margin, y + (isTotal ? 6.5 : 5.5));
    y += isTotal ? 6.5 : 5.5;
  });

  y += 6;

  // Section 3: SLA & Critical Terms
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("3. KEY TERMS, SLA & COMPLIANCE (核心保障、SLA 与合规条款)", margin, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const clauses = [
    "3.1 99.9% Service SLA: Party A guarantees 99.9% hardware and dedicated line availability. Unscheduled hardware outages exceeding 4 hours are compensated 3x.",
    "3.2 Dedicated Clean IP: 100% exclusive native static commercial IP (Clean ASN, Fraud Score 0). Strict anti-ban environment for enterprise development and e-commerce.",
    "3.3 Data Privacy & Code Security: Source code never lands off-premise. All customer data, virtual machine images, and AI training outputs belong solely to Party B.",
    "3.4 Acceptable Use Policy: Party B agrees to use resources solely for lawful development, research, and commerce. Malicious scans, DDoS, or telecom fraud are strictly prohibited.",
    "3.5 Renewal & Termination: Party B may renew 7 days prior to expiry. Governing law: The Laws of the Kingdom of Thailand (Chiang Mai Jurisdiction).",
  ];
  clauses.forEach((c) => {
    doc.text(c, margin, y);
    y += 3.8;
  });

  y += 4;

  // Dual Signatures Block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("SIGNATURES & COUNTERSIGNATURE (双方盖章与签署)", margin, y);
  y += 4;

  const sigBoxWidth = (contentWidth - 6) / 2;
  const sigBoxHeight = 40;

  // Provider Box (Party A)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, sigBoxWidth, sigBoxHeight, 2, 2, "D");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("SERVICE PROVIDER / 服务提供方 (Colasola Co., Ltd.):", margin + 4, y + 5);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Chiang Mai AI Center · cloud.lazzor.com", margin + 4, y + 9);

  // Official Stamp
  if (data.stampDataUrl && data.stampDataUrl.startsWith("data:")) {
    try {
      doc.addImage(data.stampDataUrl, "PNG", margin + 26, y + 9, 22, 22, undefined, "FAST");
    } catch {}
  }

  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Authorized Representative (法定代表人/授权代表)", margin + 4, y + 32);
  doc.text(`Date: ${data.signingDateStr}`, margin + 4, y + 36);

  // Customer Box (Party B)
  const custX = margin + sigBoxWidth + 6;
  doc.roundedRect(custX, y, sigBoxWidth, sigBoxHeight, 2, 2, "D");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("CUSTOMER / 客户认购方:", custX + 4, y + 5);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(String(data.effectiveCustomerName || "Customer"), custX + 4, y + 9);

  // Customer Signature
  if (data.signatureData && data.signatureData.startsWith("data:")) {
    try {
      doc.addImage(data.signatureData, "PNG", custX + 6, y + 10, sigBoxWidth - 12, 20, undefined, "FAST");
    } catch {}
  }

  doc.setFontSize(6.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Signed by: ${data.effectiveSignatoryDisplay || data.effectiveCustomerName}`, custX + 4, y + 32);
  doc.text(`Date: ${data.signingDateStr}`, custX + 4, y + 36);

  // Page 1 Footer
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Official Cloud Service Agreement · Colasola Co., Ltd. (Chiang Mai AI Center) · Tax ID: 0505566006478 · cloud.lazzor.com", pageWidth / 2, pageHeight - 6, { align: "center" });

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

  // Selection States
  const rawPlanParam = (searchParams.get("plan") || "").trim().toLowerCase();
  const rawCodeParam = (searchParams.get("code") || "").trim().toLowerCase();

  // Match initial plan
  const matchedPlan = CLOUD_PLANS.find(
    (p) =>
      p.id.toLowerCase() === rawPlanParam ||
      (rawPlanParam === "488" && p.id === "ai_lazy_488") ||
      (rawPlanParam === "ai_lazy" && p.id === "ai_lazy_488") ||
      (rawPlanParam === "888" && p.id === "workstation_888") ||
      (rawPlanParam === "88" && p.id === "workstation_888") ||
      (rawPlanParam === "workstation" && p.id === "workstation_888") ||
      (rawPlanParam === "cloud_workstation" && p.id === "workstation_888")
  );

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    matchedPlan ? matchedPlan.id : "ai_lazy_488"
  );
  const [currency, setCurrency] = useState<"CNY" | "THB">("CNY");
  const [durationMonths, setDurationMonths] = useState<number>(1); // 1, 3, 6, 12
  const [chosenAiService, setChosenAiService] = useState<string>("ChatGPT PLUS (官方会员)");

  // Promo Code State
  const initialPromo = rawCodeParam && VALID_PROMO_CODES[rawCodeParam] ? VALID_PROMO_CODES[rawCodeParam] : null;
  const [promoInput, setPromoInput] = useState<string>(initialPromo ? initialPromo.code : "");
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeInfo | null>(initialPromo);
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    initialPromo ? { type: "success", text: `优惠码 "${initialPromo.code}" 验证成功！已享受 ${initialPromo.percentOff}% 折扣。` } : null
  );

  // Customer Profile
  const [customerType, setCustomerType] = useState<"individual" | "company">("individual");
  const [customerName, setCustomerName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [signatoryName, setSignatoryName] = useState<string>("");
  const [signatoryTitle, setSignatoryTitle] = useState<string>("创始人 / 法定代表人");
  const [customerIdNumber, setCustomerIdNumber] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");

  // Dates
  const [startDate, setStartDate] = useState<string>(getTomorrowDateString());

  // Attachments
  const [idImage, setIdImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Digital Signature
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [typedSigText, setTypedSigText] = useState<string>("");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

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
    const serial = `CMAI-CLOUD-${yStr}${mStr}${dStr}-${randomSuffix}`;
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

    // Handle high DPI
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

  // Convert Typed Name to Signature Canvas
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

  // Verify Promo Code
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
        text: `优惠码 "${found.code}" 验证成功！已减免 ${found.percentOff}% (${found.name})。`,
      });
    } else {
      setAppliedPromo(null);
      setPromoMessage({
        type: "error",
        text: `优惠码 "${promoInput}" 无效或已过期。`,
      });
    }
  };

  // Handle ID Image Upload
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

  // Currently Selected Plan
  const currentPlan = CLOUD_PLANS.find((p) => p.id === selectedPlanId) || CLOUD_PLANS[0];

  // Price Calculations
  const baseMonthlyPrice = currency === "CNY" ? currentPlan.priceCNY : currentPlan.priceTHB;
  const baseSetupFee = currency === "CNY" ? currentPlan.setupFeeCNY : currentPlan.setupFeeTHB;

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

  // Combined Promo Rate
  const promoDiscountRate = appliedPromo ? appliedPromo.rate : 1;

  // Final Calculations
  const effectiveMonthlyFee = Math.round(baseMonthlyPrice * durationDiscountRate * promoDiscountRate);
  const effectiveSetupFee = isSetupFeeWaived ? 0 : baseSetupFee;
  const totalSubscriptionFee = effectiveMonthlyFee * durationMonths;
  const totalInitialPayment = totalSubscriptionFee + effectiveSetupFee;

  // Dates
  const endDate = calculateServiceEndDate(startDate, durationMonths);

  // Effective Customer Info
  const effectiveCustomerName = customerType === "company" ? (companyName || "企业客户名称") : (customerName || "客户姓名");
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
        chosenAiService,
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

  // Native Print
  const handleNativePrint = () => {
    window.print();
  };

  // Copy Contract Link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/contract?plan=${currentPlan.id}${appliedPromo ? `&code=${appliedPromo.code}` : ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 print:hidden">
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
            <button
              onClick={handleCopyLink}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Tag className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "链接已复制" : "分享本合同"}</span>
            </button>

            <button
              onClick={handleNativePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印合同</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 transition-colors shadow-xs disabled:opacity-50"
            >
              {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>导出矢量 PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Interactive Configurator & Signature Controls (Hidden during print) */}
        <section className="lg:col-span-5 flex flex-col gap-6 print:hidden">
          {/* Step 1: Select Plan */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  选定云服务方案与配置
                </h2>
              </div>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setCurrency("CNY")}
                  className={`px-2 py-0.5 rounded transition-all ${
                    currency === "CNY" ? "bg-white dark:bg-neutral-700 shadow-xs font-bold text-neutral-950 dark:text-white" : "text-neutral-500"
                  }`}
                >
                  ¥ 人民币
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("THB")}
                  className={`px-2 py-0.5 rounded transition-all ${
                    currency === "THB" ? "bg-white dark:bg-neutral-700 shadow-xs font-bold text-neutral-950 dark:text-white" : "text-neutral-500"
                  }`}
                >
                  ฿ 泰铢
                </button>
              </div>
            </div>

            {/* Featured New Plans: 488 and 888 (Prominently Highlighted) */}
            <div className="grid grid-cols-1 gap-3.5 mb-4">
              {/* Plan 1: AI Lazy Bundle 488 */}
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
                        全包爆款 · 免运维
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      海外AI无忧懒人包
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      专为个人与团队出海打造的海外 AI 与研发软硬件全套免运维基座。
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[11px] text-neutral-400 line-through">
                      {currency === "CNY" ? "¥688" : "฿3,440"}
                    </span>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {currency === "CNY" ? "¥488" : "฿2,440"}
                      <span className="text-xs font-normal text-neutral-500"> /月</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      开户费 {currency === "CNY" ? "¥98" : "฿490"} (首月一次性)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +微主机
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +独立商业IP
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +VPN
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +ChatGPT/Claude账号
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +KYC代充
                  </span>
                </div>
              </div>

              {/* Plan 2: Cloud Workstation 888 */}
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
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      云工位全服务包
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      1V1 物理独享 Apple Silicon 算力、独立静态 IP、企业 VPN 与官方 AI 顶配会员全功能云工位。
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[11px] text-neutral-400 line-through">
                      {currency === "CNY" ? "¥1,188" : "฿5,940"}
                    </span>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {currency === "CNY" ? "¥888" : "฿4,440"}
                      <span className="text-xs font-normal text-neutral-500"> /月</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      开机费 {currency === "CNY" ? "¥198" : "฿990"} (首月一次性)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +Mac 1V1 独享
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +独立静态IP
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +VPN
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +ChatGPT/Claude账号
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    +KYC代充
                  </span>
                </div>
              </div>
            </div>

            {/* Other Plans Dropdown */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                切换至其它场景服务包：
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

            {/* AI Account Choice */}
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                官方 AI 会员专属权益 (已含每月订阅，2选1)：
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChosenAiService("ChatGPT PLUS (官方会员订阅)")}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    chosenAiService.includes("ChatGPT")
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 font-bold"
                      : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span>ChatGPT PLUS 官方会员</span>
                  {chosenAiService.includes("ChatGPT") && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setChosenAiService("Claude Pro 官方会员 (Sonnet/Opus 极速通道)")}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    chosenAiService.includes("Claude")
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 font-bold"
                      : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span>Claude Pro 官方会员</span>
                  {chosenAiService.includes("Claude") && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                服务采购周期与优惠力度：
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { m: 1, label: "月付", discount: "原价" },
                  { m: 3, label: "季付 (3月)", discount: "95折" },
                  { m: 6, label: "半年付", discount: "9折" },
                  { m: 12, label: "年付 (12月)", discount: "8折+免开机费" },
                ].map((item) => (
                  <button
                    key={item.m}
                    type="button"
                    onClick={() => setDurationMonths(item.m)}
                    className={`py-2 px-1.5 rounded-lg text-center flex flex-col items-center justify-center border transition-all ${
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
            </div>

            {/* Promo Code Input */}
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                优惠码 / 合作伙伴代码 (Promo Code)：
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="例如: cmai2026 或 colasola2026"
                  className="flex-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 outline-hidden uppercase"
                />
                <button
                  type="button"
                  onClick={handleVerifyPromo}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  应用
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] mt-1.5 font-medium ${promoMessage.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>
          </div>

          {/* Step 2: Customer Identity Form */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                签约主体信息 (乙方 / Customer)
              </h2>
            </div>

            {/* Type Switch */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setCustomerType("individual")}
                className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                  customerType === "individual"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                个人开发者 / 个人
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("company")}
                className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                  customerType === "company"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                企业客户 / 团队
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
                        法定代表/签约人
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
                        职位头衔
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
                    电子邮箱 (接收账号凭据) *
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
                  通讯地址 / 法定注册地址
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

          {/* Step 3: Identity Document Upload */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  客户实名认证附件 (可选 / KYC Annex)
                </h2>
              </div>
              <span className="text-[10px] text-neutral-400">身份证 / 护照 / 营业执照</span>
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
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
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
                  点击上传身份证、护照或营业执照照片
                </span>
                <span className="text-[10px] text-neutral-400">
                  支持 JPG / PNG，用于合规实名备案与 KYC 代充保障
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

          {/* Step 4: Digital Signature Canvas */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                  4
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
                  className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
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
                  className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
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
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded text-neutral-900 focus:ring-0 w-4 h-4"
              />
              <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">
                我已仔细阅读并确认同意《企业级 AI 云工位与海外算力服务协议》及 SLA 保障条款，确认所填签约信息真实有效，电子签名与防伪存证具有完全法律约束力。
              </span>
            </label>
          </div>
        </section>

        {/* Right Side: The Official Digital Contract Sheet (A4 Aesthetic Paper Document) */}
        <section className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[800px] bg-white text-neutral-900 rounded-2xl p-6 sm:p-10 shadow-lg border border-neutral-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full print:rounded-none">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-5 border-b-2 border-neutral-900">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center text-white shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">
                    CHIANG MAI AI CENTER · CLOUD PLATFORM
                  </span>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-neutral-950">
                    企业级 AI 云工位与海外算力服务协议
                  </h1>
                  <span className="text-[11px] text-neutral-600">
                    Colasola Co., Ltd. (Thailand) · 商业登记税号: 0505566006478
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
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-sans font-bold text-[10px] border border-emerald-200 w-fit sm:ml-auto">
                  ● 官方合规受保节点
                </span>
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
                <div className="text-xs text-neutral-500">签约优惠服务费</div>
                <div className="text-xl font-black text-neutral-950">
                  {currSym}{effectiveMonthlyFee.toLocaleString()}
                  <span className="text-xs font-normal text-neutral-500"> /月</span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  服务周期: {durationMonths} 个月
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

            {/* Checklist of Included Features (Directly matching user's two images) */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                SERVICE ENTITLEMENTS & INCLUDED CAPABILITIES (本方案包含的专属权益清单)
              </h3>
              <div className="grid grid-cols-1 gap-2 bg-neutral-50/70 p-3.5 rounded-xl border border-neutral-200 text-xs">
                {currentPlan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-neutral-800 leading-relaxed font-medium">
                      {feat}
                    </span>
                  </div>
                ))}
                <div className="flex items-start gap-2 pt-1 border-t border-neutral-200/80">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-neutral-800 leading-relaxed font-medium">
                    选定 AI 官方会员：<strong>{chosenAiService}</strong> (由服务商全流程提供正规海外卡代开与月度合规代充，免除封号拒付风控)
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Schedule Table */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                FEES & SETTLEMENT SCHEDULE (费用明细与首期结算表)
              </h3>
              <div className="overflow-hidden rounded-xl border border-neutral-200 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                      <th className="py-2 px-3">计费项目 (Item Description)</th>
                      <th className="py-2 px-3">周期 / 数量</th>
                      <th className="py-2 px-3">基准单价</th>
                      <th className="py-2 px-3 text-right">结算金额 ({currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-800">
                    <tr>
                      <td className="py-2 px-3 font-medium">
                        {currentPlan.name} - 云服务订阅费
                      </td>
                      <td className="py-2 px-3">{durationMonths} 个月</td>
                      <td className="py-2 px-3">
                        {currSym}{baseMonthlyPrice.toLocaleString()} / 月
                      </td>
                      <td className="py-2 px-3 text-right font-medium">
                        {currSym}{(effectiveMonthlyFee * durationMonths).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">
                        专属节点初始化与 1 对 1 环境调优开机/开户费
                      </td>
                      <td className="py-2 px-3">首月一次性</td>
                      <td className="py-2 px-3">
                        {currSym}{baseSetupFee.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-medium">
                        {effectiveSetupFee === 0 ? "¥0 (年付特惠免收)" : `${currSym}${effectiveSetupFee.toLocaleString()}`}
                      </td>
                    </tr>
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

            {/* Legal Clauses Section */}
            <div className="mt-6 space-y-3 text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-200 pt-5">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                TERMS & CONDITIONS (服务条款与法律约定)
              </h3>

              <div>
                <strong className="text-neutral-900">1. 服务范围与资源配置约定：</strong>
                甲方按照本协议约定的规格标准为乙方开通对应的云工位、微主机或 1V1 Apple Silicon 独立硬件资源，并交付专属独立海外原生静态商业 IP 及 VPN 直连接入凭证。甲方承诺保障中泰 IPLC / 国际专线超低延迟传输链路稳定。
              </div>

              <div>
                <strong className="text-neutral-900">2. 服务可用性保障 (SLA) 与运维责任：</strong>
                甲方为乙方提供 99.9% 算力与专线网络服务可用性。若因甲方网络或物理硬件故障导致服务不可用连续超过 4 小时，甲方按故障时长的 3 倍顺延乙方服务周期。1 对 1 技术顾问提供日常环境调优与专属节点初始化保障。
              </div>

              <div>
                <strong className="text-neutral-900">3. 独占纯净 IP 与官方 AI 账号合规防封承诺：</strong>
                甲方分配之 IP 为 100% 独享海外原生静态商业 IP（Clean ASN、欺诈分 0），杜绝普通代理 IP 频繁飘移与降智风险。包含之官方 AI 账号由正规海外银行卡与专属手机号充值开通，开箱即用，并在服务期内提供全流程防风控合规运维保障。
              </div>

              <div>
                <strong className="text-neutral-900">4. 数据资产安全、隐私隔离与代码不落地承诺：</strong>
                甲方机房采用物理隔离与高强度加密传输，严格恪守“源码不落地、数据全私有”原则。乙方在云工位内创建、运行、存储的所有代码库、业务数据、模型权重及产出成果，其 100% 知识产权与所有权归乙方所有。甲方绝不审查、扫描、转存或向任何第三方披露乙方数据。
              </div>

              <div>
                <strong className="text-neutral-900">5. 费用结算与服务期限：</strong>
                本协议服务有效期自 <strong>{startDate}</strong> 起至 <strong>{endDate}</strong> 止（共 {durationMonths} 个月）。服务期满前 7 日，甲方将通过系统通知乙方续约事宜。
              </div>

              <div>
                <strong className="text-neutral-900">6. 合规使用守则：</strong>
                乙方承诺将本服务严格用于合法的软件研发、AI 辅助办公、跨境电商运营等业务，严禁利用本服务从事网络攻击、电信欺诈、垃圾邮件轰炸等违法违规行为。若乙方违规操作导致 IP 被封禁或招致司法调查，甲方有权立即关停服务并不予退款。
              </div>

              <div>
                <strong className="text-neutral-900">7. 电子签名效力与司法管辖：</strong>
                双方确认本电子协议通过数字时间戳与哈希防伪技术认证，经甲乙双方在线盖章/签名后即具备完全法律效力。如产生纠纷，双方应友好协商，协商不成时提交泰王国清迈当地管辖法院审理。
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
                  <span>签署时间: {signingDateIso}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1">
                    {termsAgreed ? "✓ 已在线签署并确认全部条款" : "待勾选同意协议并签名"}
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
              Chiang Mai AI Center · Colasola Co., Ltd. · cloud.lazzor.com · Official Digital Lease & Service Protocol · Serial: {contractSerial}
            </div>
          </div>
        </section>
      </main>
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
