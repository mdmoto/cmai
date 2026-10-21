"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { useTranslation } from "@/context/LanguageContext";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Sun,
  Bot,
  Building2,
  Monitor,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  MapPin,
  Flame,
  Layers
} from "lucide-react";

export default function Home() {
  const { t, language } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

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

  // Network pre-handshake and speculation rules prerendering for AI Sandbox (0 latency)
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

  const handleScrollToPillars = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#pillars");
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
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

        <main className="flex-grow">
          {/* Flagship Hero Section */}
          <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#0a0a0a]">
            {/* Background Image Carousel with Architectural Dark Filter */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentBg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.0, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroBackgrounds[currentBg]})` }}
                />
              </AnimatePresence>
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/60" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            </div>

            {/* Hero Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full text-white pt-24 pb-16">
              <div className="max-w-3xl">
                {/* Badge Tagline */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-[11px] font-mono tracking-widest text-[#86868b] uppercase mb-6 backdrop-blur-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t("homeHeroBadge")}</span>
                </motion.div>

                {/* Primary Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#f5f5f7] mb-6 leading-[1.08]"
                >
                  {t("homeHeroTitle1")} <br />
                  <span className="font-semibold text-white">{t("homeHeroTitle2")}</span>
                </motion.h1>

                {/* Core Triad Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="text-lg sm:text-2xl font-light tracking-wide text-blue-300/90 mb-6"
                >
                  {t("homeHeroSubtitle")}
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-sm sm:text-base text-[#86868b] font-light leading-relaxed mb-10 max-w-2xl"
                >
                  {t("homeHeroDesc")}
                </motion.p>

                {/* Actions Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="flex flex-wrap items-center gap-3.5"
                >
                  <a
                    href="#pillars"
                    onClick={handleScrollToPillars}
                    className="px-6 py-3 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] text-[13px] font-medium rounded-full transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{language === "zh" ? "探索核心三大产业" : "Explore Triad Synergy"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {/* AI Decision Sandbox Launch Button */}
                  <button
                    onClick={handleTriggerNavigation}
                    onMouseEnter={handlePreheat}
                    onTouchStart={handlePreheat}
                    className="px-6 py-3 bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-neutral-100 backdrop-blur-md rounded-full text-[13px] font-medium transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t("navAiSandbox")}</span>
                  </button>

                  <Link
                    href="/workspace"
                    className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-neutral-200 text-[13px] font-medium rounded-full transition-colors cursor-pointer"
                  >
                    {t("navExploreWorkspace")}
                  </Link>

                  <Link
                    href="/cloud-desk"
                    className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[13px] font-medium rounded-full transition-colors cursor-pointer"
                  >
                    {t("navCloudDesk")}
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-8 z-10 hidden sm:flex items-center gap-3 text-[#86868b]">
              <div className="w-8 h-[1px] bg-neutral-700" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-light">
                Scroll to Discover
              </span>
            </div>
          </section>

          {/* Three Core Pillars: AI Services · High-Performance Compute · Clean Solar Energy */}
          <section id="pillars" className="py-28 bg-[#0d0d0f] text-white border-b border-neutral-800/80">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-400 font-semibold">
                  {t("homePillarsBadge")}
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mt-2 mb-4">
                  {t("homePillarsTitle")}
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base font-light">
                  {t("homePillarsSub")}
                </p>
              </div>

              {/* Three Pillar Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Pillar 1: AI Services */}
                <div className="p-8 sm:p-9 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Bot className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-blue-400 tracking-wider uppercase block mb-1">
                      {t("homePillar1Badge")}
                    </span>
                    <h3 className="text-2xl font-light text-white mb-4">
                      {t("homePillar1Title")}
                    </h3>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
                      {t("homePillar1Desc")}
                    </p>

                    <div className="space-y-2.5 text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{language === "zh" ? "大模型东盟多语言本地化适配" : "Foundation model ASEAN localization"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{language === "zh" ? "企业级智能体自动化流水线" : "Enterprise multi-agent automated pipelines"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{language === "zh" ? "跨国 AI 商业决策沙盘系统" : "Transnational AI commercial war-gaming"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-800">
                    <Link
                      href="/sandbox"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>{language === "zh" ? "探索 AI 决策沙盘" : "Explore Decision Sandbox"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Pillar 2: Compute Services */}
                <div className="p-8 sm:p-9 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-indigo-400 tracking-wider uppercase block mb-1">
                      {t("homePillar2Badge")}
                    </span>
                    <h3 className="text-2xl font-light text-white mb-4">
                      {t("homePillar2Title")}
                    </h3>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
                      {t("homePillar2Desc")}
                    </p>

                    <div className="space-y-2.5 text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{language === "zh" ? "中泰专属跨境专用通道 (<18ms)" : "Sino-Thai dedicated SD-WAN (<18ms)"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{language === "zh" ? "弹性预装 AI 栈云工位 (Cloud Desk)" : "Pre-installed AI Cloud Workstations"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{language === "zh" ? "1600㎡ 独栋高可用服务器机房" : "1,600㎡ dedicated datacenter housing"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-800">
                    <Link
                      href="/cloud-desk"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>{language === "zh" ? "了解企业级云工位" : "Explore Cloud Workstations"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Pillar 3: Clean Solar Energy */}
                <div className="p-8 sm:p-9 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Sun className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-amber-400 tracking-wider uppercase block mb-1">
                      {t("homePillar3Badge")}
                    </span>
                    <h3 className="text-2xl font-light text-white mb-4">
                      {t("homePillar3Title")}
                    </h3>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
                      {t("homePillar3Desc")}
                    </p>

                    <div className="space-y-2.5 text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{language === "zh" ? "工商业分布式屋顶光伏电站开发" : "Commercial rooftop solar power plants"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{language === "zh" ? "微电网储能与绿电驱动算力中心" : "Microgrid storage powering computing hubs"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{language === "zh" ? "低碳 ESG 认证与跨国绿色电力撮合" : "ESG green energy certificate matchmaking"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-800">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400">
                      <span>Colasola Clean Solar Energy</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ecosystem Portals Grid: Connects to the 3 Subpages */}
          <section className="py-28 bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-semibold">
                  {t("homePortalsBadge")}
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight mt-2 mb-4">
                  {t("homePortalsTitle")}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
                  {t("homePortalsSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Portal Card 1: Explore Physical Workspace */}
                <Link
                  href="/workspace"
                  className="group relative p-8 sm:p-9 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">
                      Platform 01
                    </span>
                    <h3 className="text-2xl font-light mb-3">
                      {t("homePortalsCard1Title")}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-6">
                      {t("homePortalsCard1Desc")}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span>{t("homePortalsCard1Action")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>

                {/* Portal Card 2: Cloud Desk */}
                <Link
                  href="/cloud-desk"
                  className="group relative p-8 sm:p-9 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">
                      Platform 02
                    </span>
                    <h3 className="text-2xl font-light mb-3">
                      {t("homePortalsCard2Title")}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-6">
                      {t("homePortalsCard2Desc")}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>{t("homePortalsCard2Action")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>

                {/* Portal Card 3: AI Sandbox */}
                <Link
                  href="/sandbox"
                  className="group relative p-8 sm:p-9 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                      <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">
                      Platform 03
                    </span>
                    <h3 className="text-2xl font-light mb-3">
                      {t("homePortalsCard3Title")}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-6">
                      {t("homePortalsCard3Desc")}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    <span>{t("homePortalsCard3Action")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Strategic Regional Advantages: Chiang Mai Hub */}
          <section className="py-24 bg-neutral-50 dark:bg-[#0a0a0c] text-neutral-900 dark:text-white border-t border-b border-neutral-200 dark:border-neutral-800 transition-colors">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-semibold">
                  {t("homeAdvantagesBadge")}
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight mt-2 mb-4">
                  {t("homeAdvantagesTitle")}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
                  {t("homeAdvantagesSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Adv 1 */}
                <div className="p-7 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <MapPin className="w-6 h-6 text-emerald-500 mb-4" />
                  <h4 className="text-base font-medium mb-2">{t("homeAdv1Title")}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("homeAdv1Desc")}
                  </p>
                </div>

                {/* Adv 2 */}
                <div className="p-7 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <ShieldCheck className="w-6 h-6 text-blue-500 mb-4" />
                  <h4 className="text-base font-medium mb-2">{t("homeAdv2Title")}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("homeAdv2Desc")}
                  </p>
                </div>

                {/* Adv 3 */}
                <div className="p-7 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <Building2 className="w-6 h-6 text-purple-500 mb-4" />
                  <h4 className="text-base font-medium mb-2">{t("homeAdv3Title")}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("homeAdv3Desc")}
                  </p>
                </div>

                {/* Adv 4 */}
                <div className="p-7 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <Globe className="w-6 h-6 text-amber-500 mb-4" />
                  <h4 className="text-base font-medium mb-2">{t("homeAdv4Title")}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {t("homeAdv4Desc")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <Contact />
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
