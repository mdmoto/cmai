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
  Sliders,
  Workflow,
  Cpu,
  Globe,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Flame,
  Activity
} from "lucide-react";

export default function SandboxPage() {
  const { t, language } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);

  // Interactive Scenario Simulator State
  const [selectedIndustry, setSelectedIndustry] = useState<string>("ev");
  const [selectedMarket, setSelectedMarket] = useState<string>("asean");
  const [selectedStress, setSelectedStress] = useState<string>("tariff");

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

        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <section className="relative w-full bg-[#070709] text-white pt-20 pb-28 border-b border-neutral-800/80 overflow-hidden">
            {/* Holographic grid and ambient light */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-emerald-600/15 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono tracking-widest uppercase text-purple-300 mb-6"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t("sandboxHeroBadge")}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl sm:text-6xl font-light tracking-tight text-white mb-6 leading-[1.12]"
                >
                  {t("sandboxHeroTitle")}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-10 max-w-2xl mx-auto"
                >
                  {t("sandboxHeroSubtitle")}
                </motion.p>

                {/* Primary 3D Launch Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <button
                    onClick={handleTriggerNavigation}
                    onMouseEnter={handlePreheat}
                    onTouchStart={handlePreheat}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm rounded-full transition-all shadow-xl shadow-indigo-600/25 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t("sandboxLaunchBtn")}</span>
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <div className="text-xs font-mono text-neutral-500">
                    Host: <span className="text-neutral-300">https://ai.lazzor.com</span>
                  </div>
                </motion.div>
              </div>

              {/* Simulation Telemetry Metrics Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-xl text-left"
              >
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("sandboxMetric1")}</span>
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric1Val")}</div>
                  <div className="text-[11px] text-purple-400/90 font-mono mt-1">Autonomous Agent Swarm</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("sandboxMetric2")}</span>
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric2Val")}</div>
                  <div className="text-[11px] text-blue-400/90 font-mono mt-1">High-Precision Iterations</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("sandboxMetric3")}</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric3Val")}</div>
                  <div className="text-[11px] text-emerald-400/90 font-mono mt-1">Statistical Significance</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-xs font-mono">{t("sandboxMetric4")}</span>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-light text-white tracking-tight">{t("sandboxMetric4Val")}</div>
                  <div className="text-[11px] text-amber-400/90 font-mono mt-1">Systemic Risk Hedge</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Three Core Decision Engines */}
          <section className="py-24 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-semibold">
                  WAR-GAMING CORE ENGINES
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight mt-2 mb-4">
                  {t("sandboxEnginesTitle")}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
                  {t("sandboxEnginesSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Engine 1 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                      <Globe className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">
                      Engine 01
                    </span>
                    <h3 className="text-xl font-medium mb-3">{t("sandboxEngine1Title")}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {t("sandboxEngine1Desc")}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono text-blue-600 dark:text-blue-400">
                    Macro Multi-Variable Regression
                  </div>
                </div>

                {/* Engine 2 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">
                      Engine 02
                    </span>
                    <h3 className="text-xl font-medium mb-3">{t("sandboxEngine2Title")}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {t("sandboxEngine2Desc")}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono text-purple-600 dark:text-purple-400">
                    Agent-Based Modeling (ABM)
                  </div>
                </div>

                {/* Engine 3 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/80 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                      <Workflow className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">
                      Engine 03
                    </span>
                    <h3 className="text-xl font-medium mb-3">{t("sandboxEngine3Title")}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {t("sandboxEngine3Desc")}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    Stochastic Supply Chain Graph
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Simulation Configurator Demo */}
          <section className="py-24 bg-[#0a0a0a] text-white border-t border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-400 font-semibold">
                  INTERACTIVE SIMULATOR PREVIEW
                </span>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mt-2 mb-4">
                  {language === "zh" ? "模拟您的跨国出海战略推演" : "Simulate Your Cross-Border Strategic War-Game"}
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base font-light">
                  {language === "zh"
                    ? "设定您的行业、目标市场与外部压力条件，快速预览沙盘推演模型生成的抗风险决策指标与优化建议。"
                    : "Configure industry, target market, and external stress shocks to preview real-time AI strategic simulations."}
                </p>
              </div>

              {/* Configurator Box */}
              <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Select 1 */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-2">
                      {language === "zh" ? "01. 选择产业赛道" : "01. Select Industry"}
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="ev">{language === "zh" ? "新能源汽车与智能硬件" : "Electric Vehicles & Hardware"}</option>
                      <option value="brand">{language === "zh" ? "跨境出海消费品牌" : "Cross-Border Consumer Brand"}</option>
                      <option value="compute">{language === "zh" ? "绿色算力与分布式数据中心" : "Green Compute & AI Datacenter"}</option>
                    </select>
                  </div>

                  {/* Select 2 */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-2">
                      {language === "zh" ? "02. 目标扩展区域" : "02. Target Geography"}
                    </label>
                    <select
                      value={selectedMarket}
                      onChange={(e) => setSelectedMarket(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="asean">{language === "zh" ? "泰国及东盟重点市场 (ASEAN)" : "Thailand & ASEAN Region"}</option>
                      <option value="na">{language === "zh" ? "北美与欧洲成熟市场" : "North America & Europe"}</option>
                      <option value="mena">{language === "zh" ? "中东与拉美新兴市场" : "Middle East & LATAM"}</option>
                    </select>
                  </div>

                  {/* Select 3 */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-2">
                      {language === "zh" ? "03. 极端压力测试变量" : "03. Stress Test Variable"}
                    </label>
                    <select
                      value={selectedStress}
                      onChange={(e) => setSelectedStress(e.target.value)}
                      className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="tariff">{language === "zh" ? "关税与地缘政策上调 25%" : "+25% Tariff & Geopolitical Shift"}</option>
                      <option value="supply">{language === "zh" ? "海运延误 45 天 / 元器件断供" : "45-Day Shipping Bottleneck"}</option>
                      <option value="price_war">{language === "zh" ? "本地竞品降价 30% 价格战" : "-30% Rival Price War Disruption"}</option>
                    </select>
                  </div>
                </div>

                {/* Simulation Output Card */}
                <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-xs font-mono text-neutral-500">Confidence Interval</div>
                    <div className="text-2xl font-light text-blue-400 mt-1">{simulationResult.confidence}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-xs font-mono text-neutral-500">Systemic Risk Index</div>
                    <div className="text-2xl font-light text-emerald-400 mt-1">{simulationResult.riskScore}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-xs font-mono text-neutral-500">Optimized Horizon ROI</div>
                    <div className="text-2xl font-light text-purple-400 mt-1">{simulationResult.roi}</div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleTriggerNavigation}
                      onMouseEnter={handlePreheat}
                      onTouchStart={handlePreheat}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{language === "zh" ? "在控制台运行完整推演" : "Run Full Model at ai.lazzor.com"}</span>
                    </button>
                    <div className="text-[10px] text-center font-mono text-neutral-500">
                      Monte Carlo 50,000 passes
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-800/80 text-xs sm:text-sm font-light text-neutral-300 leading-relaxed">
                  <span className="font-mono text-neutral-500 uppercase block mb-1">
                    Simulation Strategic Summary:
                  </span>
                  {simulationResult.summary}
                  <div className="mt-2 text-blue-400 font-mono text-xs">
                    {simulationResult.action}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Real-World Case Studies */}
          <section className="py-24 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-semibold">
                  PROVEN SIMULATION TEMPLATES
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight mt-2 mb-4">
                  {t("sandboxCasesTitle")}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
                  {t("sandboxCasesSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Case 1 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 tracking-wider uppercase block mb-2">
                      Case Study 01
                    </span>
                    <h3 className="text-xl font-medium mb-3">{t("sandboxCase1Title")}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {t("sandboxCase1Desc")}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>120,000 Agents</span>
                    <span className="text-emerald-500">Verified BOI Alignment</span>
                  </div>
                </div>

                {/* Case 2 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 tracking-wider uppercase block mb-2">
                      Case Study 02
                    </span>
                    <h3 className="text-xl font-medium mb-3">{t("sandboxCase2Title")}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {t("sandboxCase2Desc")}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>85,000 Agents</span>
                    <span className="text-blue-500">-76% Disruption Risk</span>
                  </div>
                </div>

                {/* Case 3 */}
                <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 tracking-wider uppercase block mb-2">
                      Case Study 03
                    </span>
                    <h3 className="text-xl font-medium mb-3">{t("sandboxCase3Title")}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {t("sandboxCase3Desc")}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>Colasola Microgrid</span>
                    <span className="text-emerald-500">Zero-Carbon Arbitrage</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Launch Banner */}
          <section className="py-20 bg-neutral-950 text-white border-t border-neutral-800 text-center">
            <div className="max-w-3xl mx-auto px-6">
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-4" />
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
