"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/context/LanguageContext";
import {
  Sparkles,
  Play,
  Layers,
  TrendingUp,
  ShieldAlert,
  Workflow,
  Cpu,
  Globe,
  ArrowRight,
  ExternalLink,
  Activity
} from "lucide-react";

export default function SandboxPage() {
  const { t, language } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  // Interactive Scenario Simulator State
  const [selectedIndustry, setSelectedIndustry] = useState<string>("ev");
  const [selectedMarket, setSelectedMarket] = useState<string>("asean");
  const [selectedStress, setSelectedStress] = useState<string>("tariff");

  const heroBackgrounds = [
    "/images/image_1.jpg",
    "/images/image_2.jpg",
    "/images/image_5.jpg",
    "/images/image_10.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBackgrounds.length]);

  // Network preheat for AI sandbox
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

  const scenariosData: Record<string, {
    confidence: string;
    riskScore: string;
    roi: string;
    summary: string;
    action: string;
  }> = {
    "ev-asean-tariff": {
      confidence: "98.2%",
      riskScore: "0.14 (Low)",
      roi: "+34.5% (Year 2)",
      summary: language === "zh"
        ? "借助泰国 BOI 新能源汽车投资免税政策，在清迈及东部经济走廊建立组装与分销节点，可有效抵消 25% 潜在关税波动并占据 18% 当地细分市场。"
        : "Leveraging Thai BOI EV tax incentives creates a 34.5% projected ROI, effectively hedging against 25% tariff swings while capturing 18% market share.",
      action: language === "zh" ? "建议优先布局本地化零部件认证与售后快充站网格。" : "Prioritize localized component sourcing and fast-charging grid alliances.",
    },
    "ev-asean-supply": {
      confidence: "96.8%",
      riskScore: "0.28 (Moderate)",
      roi: "+22.1% (Year 2)",
      summary: language === "zh"
        ? "针对东盟海运断供场景，沙盘推演建议在泰国建立 60 天关键电芯冗余仓储，使整体供应链中断概率降低 76%。"
        : "Simulating a 45-day maritime shipping outage suggests establishing a 60-day battery cell buffer in Thailand, slashing disruption odds by 76%.",
      action: language === "zh" ? "启动中泰铁路冷链及陆运备选冗余通道。" : "Establish dual-route logistics redundancy via the Sino-Thai railway.",
    },
    default: {
      confidence: "97.5%",
      riskScore: "0.18 (Low-Med)",
      roi: "+28.4% (Year 2)",
      summary: language === "zh"
        ? "多智能体博弈显示：提前进行场景化推演并构建本地化合规联盟，能将海外资本试错成本降低 60% 以上。"
        : "Multi-agent strategic gaming proves pre-emptive scenario war-gaming reduces capital trial-and-error costs by over 60%.",
      action: language === "zh" ? "进入沙盘控制台加载完整 100,000+ 智能体模型。" : "Launch console to load full 100,000+ autonomous agent simulation.",
    },
  };

  const currentResultKey = `${selectedIndustry}-${selectedMarket}-${selectedStress}`;
  const simulationResult = scenariosData[currentResultKey] || scenariosData["default"];

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

        <main className="flex-grow">
          {/* Hero Section with Building Photo Carousel */}
          <section className="relative min-h-[90vh] w-full flex items-center overflow-hidden bg-[#0a0a0a]">
            {/* Background Image Carousel */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentBg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.48 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.0, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroBackgrounds[currentBg]})` }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-black/50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full text-white pt-28 pb-16">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <span className="text-[11px] font-sans tracking-[0.25em] text-[#86868b] uppercase font-semibold">
                    {t("sandboxHeroBadge")}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#f5f5f7] mb-6 leading-[1.08]"
                >
                  {t("sandboxHeroTitle")}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-base text-[#86868b] font-light leading-relaxed mb-10 max-w-2xl"
                >
                  {t("sandboxHeroSubtitle")}
                </motion.p>

                {/* Primary 3D Launch Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <button
                    onClick={handleTriggerNavigation}
                    onMouseEnter={handlePreheat}
                    onTouchStart={handlePreheat}
                    className="px-8 py-3.5 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] font-medium text-[13px] rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#1d1d1f]" />
                    <span>{t("sandboxLaunchBtn")}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <div className="text-xs font-mono text-neutral-400">
                    Host: <span className="text-neutral-200">https://ai.lazzor.com</span>
                  </div>
                </motion.div>
              </div>

              {/* Clean Telemetry Metrics Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md"
              >
                <div className="p-3">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">{t("sandboxMetric1")}</div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric1Val")}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Agent Swarm Simulation</div>
                </div>

                <div className="p-3">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">{t("sandboxMetric2")}</div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric2Val")}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Monte Carlo Iterations</div>
                </div>

                <div className="p-3">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">{t("sandboxMetric3")}</div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric3Val")}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Confidence Significance</div>
                </div>

                <div className="p-3">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1">{t("sandboxMetric4")}</div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric4Val")}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Systemic Risk Hedge</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Three Core Decision Engines */}
          <section className="py-24 bg-[#fafafa] dark:bg-[#070707] text-neutral-900 dark:text-white border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-8">
              <div className="max-w-3xl mb-16">
                <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
                  WAR-GAMING CORE ENGINES
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#1d1d1f] dark:text-white leading-[1.15] mb-4">
                  {t("sandboxEnginesTitle")}
                </h2>
                <p className="text-base text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                  {t("sandboxEnginesSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Engine 1 */}
                <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-6">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-[#86868b] tracking-wider uppercase block mb-1">
                      Engine 01
                    </span>
                    <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-white mb-3">{t("sandboxEngine1Title")}</h3>
                    <p className="text-sm text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                      {t("sandboxEngine1Desc")}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                    Macro Multi-Variable Regression
                  </div>
                </div>

                {/* Engine 2 */}
                <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-6">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-[#86868b] tracking-wider uppercase block mb-1">
                      Engine 02
                    </span>
                    <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-white mb-3">{t("sandboxEngine2Title")}</h3>
                    <p className="text-sm text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                      {t("sandboxEngine2Desc")}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                    Agent-Based Modeling (ABM)
                  </div>
                </div>

                {/* Engine 3 */}
                <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-6">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-[#86868b] tracking-wider uppercase block mb-1">
                      Engine 03
                    </span>
                    <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-white mb-3">{t("sandboxEngine3Title")}</h3>
                    <p className="text-sm text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                      {t("sandboxEngine3Desc")}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                    Stochastic Supply Chain Graph
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Simulation Configurator Demo */}
          <section className="py-24 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-8">
              <div className="max-w-3xl mb-14">
                <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
                  INTERACTIVE SIMULATOR PREVIEW
                </span>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#1d1d1f] dark:text-white mb-3 leading-[1.15]">
                  {language === "zh" ? "模拟您的跨国出海战略推演" : "Simulate Your Cross-Border Strategic War-Game"}
                </h2>
                <p className="text-base text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                  {language === "zh"
                    ? "设定您的行业、目标市场与外部压力条件，快速预览沙盘推演模型生成的抗风险决策指标与优化建议。"
                    : "Configure industry, target market, and external stress shocks to preview real-time AI strategic simulations."}
                </p>
              </div>

              {/* Configurator Box */}
              <div className="p-8 sm:p-10 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-2">
                      {language === "zh" ? "01. 选择产业赛道" : "01. Select Industry"}
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                    >
                      <option value="ev">{language === "zh" ? "新能源汽车与智能硬件" : "Electric Vehicles & Hardware"}</option>
                      <option value="brand">{language === "zh" ? "跨境出海消费品牌" : "Cross-Border Consumer Brand"}</option>
                      <option value="compute">{language === "zh" ? "绿色算力与分布式数据中心" : "Green Compute & AI Datacenter"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-2">
                      {language === "zh" ? "02. 目标扩展区域" : "02. Target Geography"}
                    </label>
                    <select
                      value={selectedMarket}
                      onChange={(e) => setSelectedMarket(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                    >
                      <option value="asean">{language === "zh" ? "泰国及东盟重点市场 (ASEAN)" : "Thailand & ASEAN Region"}</option>
                      <option value="na">{language === "zh" ? "北美与欧洲成熟市场" : "North America & Europe"}</option>
                      <option value="mena">{language === "zh" ? "中东与拉美新兴市场" : "Middle East & LATAM"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-2">
                      {language === "zh" ? "03. 极端压力测试变量" : "03. Stress Test Variable"}
                    </label>
                    <select
                      value={selectedStress}
                      onChange={(e) => setSelectedStress(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
                    >
                      <option value="tariff">{language === "zh" ? "关税与地缘政策上调 25%" : "+25% Tariff & Geopolitical Shift"}</option>
                      <option value="supply">{language === "zh" ? "海运延误 45 天 / 元器件断供" : "45-Day Shipping Bottleneck"}</option>
                      <option value="price_war">{language === "zh" ? "本地竞品降价 30% 价格战" : "-30% Rival Price War Disruption"}</option>
                    </select>
                  </div>
                </div>

                {/* Simulation Output Card */}
                <div className="p-6 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[11px] font-mono text-neutral-500">Confidence Interval</div>
                    <div className="text-2xl font-light text-neutral-900 dark:text-white mt-1">{simulationResult.confidence}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[11px] font-mono text-neutral-500">Systemic Risk Index</div>
                    <div className="text-2xl font-light text-neutral-900 dark:text-white mt-1">{simulationResult.riskScore}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <div className="text-[11px] font-mono text-neutral-500">Optimized Horizon ROI</div>
                    <div className="text-2xl font-light text-neutral-900 dark:text-white mt-1">{simulationResult.roi}</div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleTriggerNavigation}
                      onMouseEnter={handlePreheat}
                      onTouchStart={handlePreheat}
                      className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-xs rounded-full transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{language === "zh" ? "在控制台运行完整推演" : "Run at ai.lazzor.com"}</span>
                    </button>
                    <div className="text-[10px] text-center font-mono text-neutral-400">
                      Monte Carlo 50,000 passes
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-light text-[#515154] dark:text-[#86868b] leading-relaxed">
                  <span className="font-mono text-neutral-400 uppercase block mb-1">
                    Simulation Strategic Summary:
                  </span>
                  {simulationResult.summary}
                  <div className="mt-2 text-neutral-900 dark:text-white font-mono text-xs">
                    {simulationResult.action}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Real-World Case Studies */}
          <section className="py-24 bg-[#fafafa] dark:bg-[#070707] text-neutral-900 dark:text-white border-t border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-8">
              <div className="max-w-3xl mb-16">
                <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
                  PROVEN SIMULATION TEMPLATES
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#1d1d1f] dark:text-white leading-[1.15] mb-4">
                  {t("sandboxCasesTitle")}
                </h2>
                <p className="text-base text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                  {t("sandboxCasesSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Case 1 */}
                <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-[#86868b] tracking-wider uppercase block mb-2">
                      Case Study 01
                    </span>
                    <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-white mb-3">{t("sandboxCase1Title")}</h3>
                    <p className="text-sm text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                      {t("sandboxCase1Desc")}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>120,000 Agents</span>
                    <span className="text-neutral-900 dark:text-neutral-200">Verified BOI Alignment</span>
                  </div>
                </div>

                {/* Case 2 */}
                <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-[#86868b] tracking-wider uppercase block mb-2">
                      Case Study 02
                    </span>
                    <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-white mb-3">{t("sandboxCase2Title")}</h3>
                    <p className="text-sm text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                      {t("sandboxCase2Desc")}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>85,000 Agents</span>
                    <span className="text-neutral-900 dark:text-neutral-200">-76% Disruption Risk</span>
                  </div>
                </div>

                {/* Case 3 */}
                <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-[#86868b] tracking-wider uppercase block mb-2">
                      Case Study 03
                    </span>
                    <h3 className="text-xl font-medium text-[#1d1d1f] dark:text-white mb-3">{t("sandboxCase3Title")}</h3>
                    <p className="text-sm text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
                      {t("sandboxCase3Desc")}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Colasola Microgrid</span>
                    <span className="text-neutral-900 dark:text-neutral-200">Zero-Carbon Arbitrage</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Launch Banner */}
          <section className="py-20 bg-neutral-950 text-white border-t border-neutral-800 text-center">
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
                {language === "zh" ? "准备好开启您的全局战略推演了吗？" : "Ready to Launch Your Strategic War-Game?"}
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base font-light mb-8 max-w-xl mx-auto">
                {language === "zh"
                  ? "进入专用 AI 商业决策沙盘控制台，部署您的智能体集群，开展实战推演。"
                  : "Launch the dedicated sandbox console to deploy agent swarms and de-risk your cross-border capital investments."}
              </p>
              <button
                onClick={handleTriggerNavigation}
                onMouseEnter={handlePreheat}
                onTouchStart={handlePreheat}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 font-medium text-sm rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{t("sandboxLaunchBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
