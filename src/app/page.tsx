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
  const [isNavigating, setIsNavigating] = useState(false);

  // Network pre-handshake and speculation rules prerendering (0 latency)
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
    // Execute seamless redirect at 480ms when the 3D rotation reaches 90deg
    setTimeout(() => {
      window.location.href = "https://ai.lazzor.com";
    }, 480);
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
          <Hero onOpenSandbox={handleTriggerNavigation} onPreheat={handlePreheat} />
          <About />
          <Workspace />
          <Services />
          <AiCenter onOpenSandbox={handleTriggerNavigation} onPreheat={handlePreheat} />
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
