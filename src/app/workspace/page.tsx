"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Workspace from "@/components/Workspace";
import Services from "@/components/Services";
import PricingCalculator from "@/components/PricingCalculator";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useTranslation } from "@/context/LanguageContext";
import { MapPin, Building2, Wifi, ShieldCheck, ArrowRight, FileText, Calendar } from "lucide-react";

export default function WorkspacePage() {
  const { t, language } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);

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

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
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

        <main className="flex-grow pt-20">
          {/* Dedicated Workspace Hero Header */}
          <section className="relative w-full bg-[#0a0a0a] text-white py-20 border-b border-neutral-900 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono tracking-widest uppercase text-blue-400 mb-6"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>1,600㎡ Modern 5-Story Facility · Chiang Mai</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 leading-[1.15]"
                >
                  {language === "zh" ? "探索独栋实体办公空间" : language === "th" ? "สำรวจพื้นที่สำนักงานระดับพรีเมียม" : language === "ja" ? "独立型オフィスビルを探索する" : "Explore Premium Office Spaces"}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-8 max-w-2xl"
                >
                  {language === "zh"
                    ? "坐落于清迈玛希敦路核心商务主干道，独栋 5 层 1600㎡ 现代化设施，提供 40+ 间独立办公室、共享工位、企业级对称光纤及全套中泰企业出海落地服务，拎包即刻入驻。"
                    : language === "th"
                    ? "อาคารสำนักงาน 5 ชั้นทันสมัยขนาด 1,600 ตร.ม. บนถนนมหิดล หนองหอย พร้อม 40+ ออฟฟิศส่วนตัว โต๊ะทำงานส่วนกลาง โครงข่ายไฟเบอร์ระดับองค์กร และบริการตั้งบริษัทครบวงจร"
                    : language === "ja"
                    ? "チェンマイ・マヒドン通り沿いに位置する1600㎡の独立型5階建てビル。40以上の専用オフィス、専用光ファイバー回線、現地法人設立支援まで完備。"
                    : "A modern 5-story 1,600㎡ flagship building on Mahidol Road, offering 40+ fully furnished private offices, hot desks, enterprise fiber internet, and comprehensive Thailand landing services."}
                </motion.p>

                {/* Key Quick Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
                >
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-neutral-500 font-mono">Location</div>
                      <div className="text-xs font-medium text-neutral-200">Nong Hoi (5km to CNX)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-neutral-500 font-mono">Structure</div>
                      <div className="text-xs font-medium text-neutral-200">5 Floors · 1,600㎡</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <Wifi className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-neutral-500 font-mono">Network</div>
                      <div className="text-xs font-medium text-neutral-200">Symmetric Fiber / VPN</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[11px] text-neutral-500 font-mono">Security</div>
                      <div className="text-xs font-medium text-neutral-200">24/7 Access / CCTV</div>
                    </div>
                  </div>
                </motion.div>

                {/* Primary Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <a
                    href="#workspace"
                    onClick={(e) => handleScrollTo(e, "#workspace")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-950 font-medium text-[13px] rounded-full hover:bg-neutral-100 transition-colors shadow-sm"
                  >
                    <span>{language === "zh" ? "查看楼层平面与工位" : "View Floor Plans"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <Link
                    href="/contract"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] rounded-full transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{language === "zh" ? "在线签署租赁合同" : "Online Lease Agreement"}</span>
                  </Link>

                  <a
                    href="#contact"
                    onClick={(e) => handleScrollTo(e, "#contact")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 text-neutral-200 font-medium text-[13px] rounded-full transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t("navBookVisit")}</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Full Workspace Components Suite */}
          <About />
          <Workspace />
          <Services />
          <PricingCalculator />
          <Gallery />
          <FAQ />
          <Contact />
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
