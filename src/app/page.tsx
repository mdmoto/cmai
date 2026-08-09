"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSandbox } from "@/context/SandboxContext";
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
import AiSandboxPortal from "@/components/AiSandboxPortal";

export default function Home() {
  const { isSandboxOpen, closeSandbox } = useSandbox();

  return (
    <div
      className="relative w-full min-h-screen bg-black overflow-x-hidden"
      style={{ perspective: "2400px" }}
    >
      <motion.div
        animate={{ rotateY: isSandboxOpen ? 180 : 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full min-h-screen"
      >
        {/* Front Face: CMAI Official Physical & Digital Hub */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={`w-full min-h-screen flex flex-col bg-white dark:bg-black transition-colors ${
            isSandboxOpen ? "pointer-events-none select-none invisible" : ""
          }`}
        >
          <Navbar />
          <main className="flex-grow">
            <Hero />
            <About />
            <Workspace />
            <Services />
            <AiCenter />
            <PricingCalculator />
            <Gallery />
            <FAQ />
            <Contact />
          </main>
          <Footer />
        </div>

        {/* Back Face (180° Revolving Door): AI Market Twin Sandbox */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className={`absolute inset-0 w-full min-h-screen bg-[#070709] ${
            !isSandboxOpen ? "pointer-events-none select-none invisible" : ""
          }`}
        >
          <AiSandboxPortal onClose={closeSandbox} />
        </div>
      </motion.div>
    </div>
  );
}
