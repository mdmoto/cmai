"use client";

import React, { useState } from "react";
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

  const handleTriggerFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    // Smoothly navigate to ai.lazzor.com in the exact same tab upon completing the 180-deg revolving door rotation
    setTimeout(() => {
      window.location.href = "https://ai.lazzor.com";
    }, 750);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-black overflow-x-hidden"
      style={{ perspective: "2400px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipping ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
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

        {/* Back Face (180° Revolving Door Face directly leading to ai.lazzor.com) */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 w-full min-h-screen bg-[#060608] text-white flex flex-col items-center justify-center p-8"
        >
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-white tracking-tight">
                进入 AI 决策商业沙盘
              </h2>
              <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest">
                Connecting to ai.lazzor.com ...
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
