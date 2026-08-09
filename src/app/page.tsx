"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Workspace from "@/components/Workspace";
import Services from "@/components/Services";
import AiCenter from "@/components/AiCenter";
import PricingCalculator from "@/components/PricingCalculator";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [isFlipping, setIsFlipping] = useState(false);

  // Preconnect to ai.lazzor.com so network resolution starts in advance
  useEffect(() => {
    try {
      const link1 = document.createElement("link");
      link1.rel = "preconnect";
      link1.href = "https://ai.lazzor.com";
      document.head.appendChild(link1);

      const link2 = document.createElement("link");
      link2.rel = "dns-prefetch";
      link2.href = "https://ai.lazzor.com";
      document.head.appendChild(link2);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleTriggerFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    // Smooth cinematic 3D rotation transition (1.05s) giving ai.lazzor.com ample time to load seamlessly
    setTimeout(() => {
      window.location.href = "https://ai.lazzor.com";
    }, 1050);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-[#030305] overflow-x-hidden"
      style={{ perspective: "2200px" }}
    >
      <motion.div
        animate={{
          rotateY: isFlipping ? 180 : 0,
          scale: isFlipping ? [1, 0.92, 1] : 1,
        }}
        transition={{
          duration: 1.0,
          ease: [0.25, 1, 0.5, 1],
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full min-h-screen"
      >
        {/* Front Face (0°): CMAI Official Hub */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className={`w-full min-h-screen flex flex-col bg-white dark:bg-black transition-colors ${
            isFlipping ? "pointer-events-none select-none" : ""
          }`}
        >
          <Navbar onOpenSandbox={handleTriggerFlip} />
          <main className="flex-grow">
            <Hero onOpenSandbox={handleTriggerFlip} />
            <About />
            <Workspace />
            <Services />
            <AiCenter onOpenSandbox={handleTriggerFlip} />
            <PricingCalculator />
            <Gallery />
            <FAQ />
            <Contact />
          </main>
          <Footer />
        </div>

        {/* Back Face (180° Revolving Door Face directly transitioning to ai.lazzor.com) */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 w-full min-h-screen bg-gradient-to-b from-[#07070a] via-[#050508] to-[#020204] text-white flex flex-col items-center justify-center p-8 overflow-hidden"
        >
          {/* Futuristic Cyber Light & Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.18),transparent_65%)]" />
          <div className="absolute w-[550px] h-[550px] rounded-full border border-blue-500/10 animate-ping opacity-25" />
          <div className="absolute w-[380px] h-[380px] rounded-full border border-indigo-500/20 animate-pulse" />

          <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg text-center">
            {/* Holographic Glowing Core */}
            <div className="relative flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-[1px] shadow-2xl shadow-blue-500/40 animate-spin"
                style={{ animationDuration: "8s" }}
              >
                <div className="w-full h-full bg-[#070709] rounded-3xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-5 w-5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 shadow-lg shadow-blue-400" />
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <span>CMAI Discrete Choice & Simulation Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                正在切入 <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white">AI 决策商业沙盘</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono tracking-widest pt-1">
                TRANSITIONING TO AI.LAZZOR.COM ...
              </p>
            </div>

            {/* Dynamic Loading Progress Line */}
            <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
