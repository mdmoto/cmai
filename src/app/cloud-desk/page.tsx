"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/context/LanguageContext";
import {
  Cpu,
  Zap,
  Globe2,
  ShieldCheck,
  Server,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  HardDrive,
  Sparkles,
  ChevronRight,
  Send,
  Building,
  MonitorCheck
} from "lucide-react";

export default function CloudDeskPage() {
  const { t, language } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedWorkload, setSelectedWorkload] = useState<number>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [trialForm, setTrialForm] = useState({
    name: "",
    contact: "",
    plan: "AI Developer Pro",
    usage: "",
  });

  // Preheating for AI sandbox
  useEffect(() => {
    try {
      fetch("https://ai.lazzor.com", { mode: "no-cors", priority: "low" as RequestPriority }).catch(() => {});
    } catch {}

    try {
      if (typeof HTMLScriptElement !== "undefined" && HTMLScriptElement.supports?.("speculationrules")) {
        const specScript = document.createElement("script");
        specScript.type = "speculationrules";
        specScript.textContent = JSON.stringify({
          prerender: [{ source: "list", urls: ["https://ai.lazzor.com"] }],
        });
        document.head.appendChild(specScript);
      }
    } catch {}
  }, []);

  const handlePreheat = () => {
    try {
      fetch("https://ai.lazzor.com", { mode: "no-cors", priority: "high" as RequestPriority }).catch(() => {});
    } catch {}
  };

  const handleTriggerNavigation = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setTimeout(() => {
      window.location.href = "https://ai.lazzor.com";
    }, 480);
  };

  const workloads = [
    {
      id: "llm",
      title: language === "zh" ? "大语言模型微调与推理" : "LLM Inference & Fine-tuning",
      badge: "LLM & RAG",
      gpu: "NVIDIA RTX 4090 / A100 (24GB-80GB)",
      stack: "vLLM · Ollama · PyTorch 2.4 · CUDA 12.4 · TensorRT-LLM · DeepSpeed",
      speed: "180 tokens/sec",
      description:
        language === "zh"
          ? "一键部署高吞吐量本地推理引擎与轻量微调环境，支持 Llama 3、DeepSeek、Qwen 2.5 等开源基座模型私有化部署与 RAG 检索流水线。"
          : "Deploy high-throughput local inference and fine-tuning pipelines. Optimized for Llama 3, DeepSeek, and Qwen models with full private RAG indexing.",
    },
    {
      id: "vision",
      title: language === "zh" ? "生成式 AI 视觉与视频流水线" : "Generative AI & Video Pipelines",
      badge: "ComfyUI / Diffusion",
      gpu: "NVIDIA RTX 4090 (24GB VRAM)",
      stack: "ComfyUI · Stable Diffusion XL · FLUX.1 · Animatediff · ControlNet",
      speed: "0.8s / 1024x1024 frame",
      description:
        language === "zh"
          ? "预装最全 ComfyUI 官方及社区节点模型库，挂载海量 LoRA 及大模型权重，支持 4K 超清出图、动态视频生成与电商批量素材自动化合成。"
          : "Pre-installed ComfyUI nodes, model weights, and custom pipelines for FLUX, SD-XL, and video diffusion with lightning-fast batch synthesis.",
    },
    {
      id: "crossborder",
      title: language === "zh" ? "跨境电商多矩阵与海外运营" : "Cross-Border Business & E-Commerce",
      badge: "Static Business IP",
      gpu: "High-Frequency vCPU (8-16 Cores)",
      stack: "Dedicated Clean IP · Anti-Detect Sandbox · IPLC SD-WAN · Dual-Auth",
      speed: "Zero Risk / Clean ASN",
      description:
        language === "zh"
          ? "独占纯净海外原生商业 IP 与独立环境沙箱，彻底避免 TikTok 跨境小店、Amazon 店铺、海外社交矩阵及跨国银行账户的风控与封号风险。"
          : "Independent clean static business IPs with zero fraud score. Prevent account bans across TikTok Shop, Amazon Seller Central, Stripe, and global SaaS.",
    },
    {
      id: "devops",
      title: language === "zh" ? "跨国远程全栈敏捷开发" : "Remote Full-Stack Agility",
      badge: "Remote IDE / 4K 60FPS",
      gpu: "Workstation GPU / High RAM",
      stack: "VS Code Server · Docker · Moonlight / RDP 4K 60FPS · Zero-Trust VPC",
      speed: "< 18ms Roundtrip",
      description:
        language === "zh"
          ? "专属企业级跨境专线直连，随时随地通过浏览器或本地客户端接入。提供 4K 60FPS 低延迟流畅远程桌面体验，零丢包、如同操作本地电脑。"
          : "Dedicated IPLC SD-WAN tunnel with <18ms cross-border latency. Stream your 4K 60FPS desktop smoothly with zero packet loss from anywhere.",
    },
  ];

  const plans = [
    {
      name: t("cloudPlan1Name"),
      tag: t("cloudPlan1Tag"),
      specs: t("cloudPlan1Specs"),
      priceMonthly: "2,500",
      priceAnnual: "2,000",
      popular: false,
      features: [
        "8-Core vCPU (High Performance)",
        "32 GB High-Speed DDR5 RAM",
        "512 GB PCIe 4.0 NVMe SSD",
        "100 Mbps Dedicated Cross-Border Line",
        "1x Dedicated Static Business IP",
        "Basic Remote Desktop & Browser IDE",
        "Automated Weekly Snapshots",
      ],
    },
    {
      name: t("cloudPlan2Name"),
      tag: t("cloudPlan2Tag"),
      specs: t("cloudPlan2Specs"),
      priceMonthly: "7,800",
      priceAnnual: "6,500",
      popular: true,
      features: [
        "16-Core vCPU (Dedicated Core Binding)",
        "64 GB High-Speed DDR5 RAM",
        "1x NVIDIA RTX 4090 (24GB GDDR6X)",
        "1 TB PCIe 4.0 NVMe SSD",
        "200 Mbps Dedicated Cross-Border Line",
        "Pre-installed PyTorch / CUDA / vLLM / ComfyUI",
        "Moonlight / RDP 4K 60FPS Low-Latency",
        "Daily Automated NVMe Snapshots",
      ],
    },
    {
      name: t("cloudPlan3Name"),
      tag: t("cloudPlan3Tag"),
      specs: t("cloudPlan3Specs"),
      priceMonthly: "15,800",
      priceAnnual: "13,500",
      popular: false,
      features: [
        "32-Core vCPU (Enterprise SMT)",
        "128 GB ECC High-Speed RAM",
        "2x NVIDIA RTX 4090 or 1x A100 (80GB)",
        "2 TB Ultra-Fast NVMe SSD RAID",
        "500 Mbps High-Throughput Dedicated Line",
        "Multi-User Workspace & Shared Volume",
        "Priority GPU Cluster Node Scheduling",
        "Dedicated SRE Technical Engineer Support",
      ],
    },
    {
      name: t("cloudPlan4Name"),
      tag: t("cloudPlan4Tag"),
      specs: t("cloudPlan4Specs"),
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      popular: false,
      features: [
        "Bare-Metal Server Sole Occupancy",
        "Customized GPU/CPU Heterogeneous Matrix",
        "Physical Rack Hosting at Chiang Mai AI Center",
        "Private SD-WAN / Direct Leased Fiber Line",
        "Full Air-Gapped or Hybrid VPC Topology",
        "24/7/365 On-Premise Physical Inspection",
        "Tailored SLA & Data Residency Compliance",
      ],
    },
  ];

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setTrialForm({ name: "", contact: "", plan: "AI Developer Pro", usage: "" });
    }, 4000);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-black overflow-x-hidden"
      style={isNavigating ? { perspective: "2000px" } : undefined}
    >
      <motion.div
        animate={
          isNavigating
            ? { rotateY: 90, scale: 0.92, opacity: 0.15 }
            : undefined
        }
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={isNavigating ? { transformStyle: "preserve-3d" } : undefined}
        className="relative w-full min-h-screen flex flex-col bg-white dark:bg-black transition-colors"
      >
        <Navbar onOpenSandbox={handleTriggerNavigation} onPreheat={handlePreheat} />

        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <section className="relative w-full bg-[#080808] text-white pt-16 pb-24 border-b border-neutral-800/80 overflow-hidden">
            {/* Cybernetic ambient glow & grid */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-20 left-10 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
              <div className="max-w-3xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono tracking-widest uppercase text-blue-400 mb-6"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t("cloudHeroBadge")}</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 leading-[1.12]"
                >
                  {t("cloudHeroTitle")}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-10 max-w-2xl"
                >
                  {t("cloudHeroSubtitle")}
                </motion.p>

                {/* Action CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <a
                    href="#trial-form"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-[13px] rounded-full transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    <span>{t("cloudCtaBtn")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#plans"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-medium text-[13px] rounded-full transition-colors cursor-pointer"
                  >
                    <span>{language === "zh" ? "查看规格与价格" : "View Plans & Pricing"}</span>
                  </a>
                </motion.div>
              </div>

              {/* Live Telemetry Status Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl shadow-2xl"
              >
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("cloudMetricLatency")}</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("cloudMetricLatencyVal")}</div>
                  <div className="text-[11px] text-emerald-400/90 font-mono mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>IPLC Direct Tunnel</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("cloudMetricUptime")}</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("cloudMetricUptimeVal")}</div>
                  <div className="text-[11px] text-blue-400/90 font-mono mt-1">High Availability SLA</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("cloudMetricIP")}</span>
                    <Globe2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("cloudMetricIPVal")}</div>
                  <div className="text-[11px] text-purple-400/90 font-mono mt-1">Zero Fraud Score</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("cloudMetricDeployment")}</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("cloudMetricDeploymentVal")}</div>
                  <div className="text-[11px] text-amber-400/90 font-mono mt-1">Instant Spin-up</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Interactive Workload Engine Switcher */}
          <section className="py-24 bg-[#0d0d0d] text-white border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-400 font-semibold">
                  PRE-CONFIGURED WORKLOADS
                </span>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mt-2 mb-4">
                  {language === "zh" ? "针对前沿业务形态量身优化的预置环境" : "Tailored for High-Intensity AI & Global Operations"}
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base font-light">
                  {language === "zh"
                    ? "告别繁琐的依赖冲突、网络阻塞与显卡驱动报错。选择您的业务场景，即刻体验专业就绪的算力工作站。"
                    : "No more broken CUDA drivers or network throttles. Select your workload to preview the pre-configured software stack."}
                </p>
              </div>

              {/* Workload Selector Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {workloads.map((wl, idx) => (
                  <button
                    key={wl.id}
                    onClick={() => setSelectedWorkload(idx)}
                    className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                      selectedWorkload === idx
                        ? "bg-neutral-800/90 border-blue-500 shadow-md shadow-blue-500/10 text-white"
                        : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 text-neutral-400"
                    }`}
                  >
                    <span className="text-[11px] font-mono tracking-wider uppercase text-blue-400 block mb-1">
                      {wl.badge}
                    </span>
                    <span className="text-sm font-medium line-clamp-1 text-white">{wl.title}</span>
                  </button>
                ))}
              </div>

              {/* Workload Deep Detail Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedWorkload}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-10 rounded-2xl bg-neutral-900/50 border border-neutral-800 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
                >
                  <div className="lg:col-span-2 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono">
                      <span>Scenario {selectedWorkload + 1} of {workloads.length}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-light text-white">
                      {workloads[selectedWorkload].title}
                    </h3>
                    <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
                      {workloads[selectedWorkload].description}
                    </p>
                    <div className="pt-2">
                      <div className="text-xs font-mono text-neutral-500 mb-1">Pre-installed Stack:</div>
                      <div className="text-sm font-mono text-blue-300 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
                        {workloads[selectedWorkload].stack}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-neutral-950/90 border border-neutral-800 space-y-4">
                    <div>
                      <div className="text-xs font-mono text-neutral-500 uppercase">Hardware Acceleration</div>
                      <div className="text-base font-medium text-white mt-0.5">{workloads[selectedWorkload].gpu}</div>
                    </div>
                    <div className="pt-2 border-t border-neutral-800">
                      <div className="text-xs font-mono text-neutral-500 uppercase">Benchmark Performance</div>
                      <div className="text-base font-medium text-emerald-400 mt-0.5">{workloads[selectedWorkload].speed}</div>
                    </div>
                    <div className="pt-2 border-t border-neutral-800">
                      <div className="text-xs font-mono text-neutral-500 uppercase">Network Tunnel</div>
                      <div className="text-xs font-mono text-neutral-300 mt-0.5">Sino-Thai Direct SD-WAN (&lt;18ms)</div>
                    </div>
                    <a
                      href="#trial-form"
                      onClick={() => setTrialForm((prev) => ({ ...prev, usage: workloads[selectedWorkload].title }))}
                      className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-center text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{language === "zh" ? "以该场景申请测试" : "Test This Configuration"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Six Core Enterprise Pillars */}
          <section className="py-24 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-semibold">
                  ENTERPRISE ARCHITECTURE
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight mt-2 mb-4">
                  {t("cloudPillarsTitle")}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
                  {t("cloudPillarsSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 01 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("cloudFeature1Title")}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("cloudFeature1Desc")}
                  </p>
                </div>

                {/* 02 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("cloudFeature2Title")}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("cloudFeature2Desc")}
                  </p>
                </div>

                {/* 03 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("cloudFeature3Title")}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("cloudFeature3Desc")}
                  </p>
                </div>

                {/* 04 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("cloudFeature4Title")}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("cloudFeature4Desc")}
                  </p>
                </div>

                {/* 05 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("cloudFeature5Title")}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("cloudFeature5Desc")}
                  </p>
                </div>

                {/* 06 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("cloudFeature6Title")}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("cloudFeature6Desc")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & Plans Section */}
          <section id="plans" className="py-24 bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-white border-t border-b border-neutral-200 dark:border-neutral-800/80">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-semibold">
                  PLANS & SPECS
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight mt-2 mb-4">
                  {t("cloudPlansTitle")}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
                  {t("cloudPlansSub")}
                </p>

                {/* Billing Cycle Switcher */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 mt-6">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      billingCycle === "monthly"
                        ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {language === "zh" ? "按月订阅" : "Monthly"}
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      billingCycle === "annual"
                        ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    <span>{language === "zh" ? "年度订阅" : "Annual"}</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((p, idx) => (
                  <div
                    key={idx}
                    className={`relative p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-all ${
                      p.popular
                        ? "bg-white dark:bg-neutral-900 border-2 border-blue-500 shadow-xl shadow-blue-500/10"
                        : "bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono tracking-widest uppercase font-semibold">
                        RECOMMENDED
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-mono text-neutral-500 mb-1">{p.tag}</div>
                      <h3 className="text-xl font-medium mb-3">{p.name}</h3>

                      <div className="mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                        {p.priceMonthly === "Custom" ? (
                          <div className="text-2xl font-light text-neutral-900 dark:text-white">
                            {language === "zh" ? "定制方案" : "Bespoke Quote"}
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-light tracking-tight text-neutral-950 dark:text-white">
                              ฿{billingCycle === "annual" ? p.priceAnnual : p.priceMonthly}
                            </span>
                            <span className="text-xs text-neutral-500 font-light">/ mo</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mb-8">
                        {p.features.map((feat, fidx) => (
                          <div key={fidx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href="#trial-form"
                      onClick={() => setTrialForm((prev) => ({ ...prev, plan: p.name }))}
                      className={`w-full py-2.5 rounded-xl text-center text-xs font-medium transition-colors cursor-pointer ${
                        p.popular
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white"
                      }`}
                    >
                      {p.priceMonthly === "Custom"
                        ? language === "zh" ? "咨询定制方案" : "Inquire Custom"
                        : language === "zh" ? "免费申请试用" : "Request Trial"}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trial Application & Contact Section */}
          <section id="trial-form" className="py-24 bg-[#080808] text-white">
            <div className="max-w-4xl mx-auto px-6">
              <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-xs font-mono tracking-widest uppercase text-blue-400 font-semibold">
                    FREE 24H TRIAL
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white mt-2 mb-3">
                    {t("cloudCtaTitle")}
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm font-light">
                    {t("cloudCtaDesc")}
                  </p>
                </div>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center text-blue-300 text-sm"
                  >
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                    <p className="font-medium text-base text-white mb-1">
                      {language === "zh" ? "申请已收到！" : "Application Received!"}
                    </p>
                    <p className="font-light text-xs text-neutral-300">
                      {language === "zh"
                        ? "技术专家将在 2 小时内与您联系，交付您的 24 小时独立云工位账号及登录凭证。"
                        : "Our engineer will reach out within 2 hours with your trial credentials and connection guide."}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleTrialSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                          {language === "zh" ? "您的姓名 / 团队称呼" : "Name / Team"}
                        </label>
                        <input
                          type="text"
                          required
                          value={trialForm.name}
                          onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                          placeholder={language === "zh" ? "张先生 / Alpha Tech" : "John Doe / AI Lab"}
                          className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                          {language === "zh" ? "微信 / WhatsApp / 邮箱" : "WeChat / WhatsApp / Email"}
                        </label>
                        <input
                          type="text"
                          required
                          value={trialForm.contact}
                          onChange={(e) => setTrialForm({ ...trialForm, contact: e.target.value })}
                          placeholder={language === "zh" ? "微信号 / 邮箱地址" : "+66 81... or email"}
                          className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                          {language === "zh" ? "意向云工位规格" : "Desired Plan"}
                        </label>
                        <select
                          value={trialForm.plan}
                          onChange={(e) => setTrialForm({ ...trialForm, plan: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="Nomad Base">{t("cloudPlan1Name")}</option>
                          <option value="AI Developer Pro">{t("cloudPlan2Name")}</option>
                          <option value="Enterprise GPU Studio">{t("cloudPlan3Name")}</option>
                          <option value="Private Cluster">{t("cloudPlan4Name")}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                          {language === "zh" ? "主要业务用途 / 软件需求" : "Expected Workload"}
                        </label>
                        <input
                          type="text"
                          value={trialForm.usage}
                          onChange={(e) => setTrialForm({ ...trialForm, usage: e.target.value })}
                          placeholder={language === "zh" ? "例如：ComfyUI 绘图、LLM 推理、TikTok 运营" : "e.g., ComfyUI, vLLM, Remote Dev"}
                          className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{language === "zh" ? "立即开通 24 小时免费测试环境" : "Submit & Claim 24h Trial"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
