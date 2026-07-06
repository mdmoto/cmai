"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const { t } = useTranslation();
  const [currentBg, setCurrentBg] = useState(0);

  const bgImages = [
    "/images/image_1.jpg",
    "/images/image_2.jpg",
    "/images/image_5.jpg",
    "/images/image_10.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  const handleScrollTo = (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
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
    <section id="home" className="relative h-screen w-full flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImages[currentBg]})` }}
          />
        </AnimatePresence>
        {/* Architectural gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-white pt-20">
        <div className="max-w-2xl">
          {/* Subtle Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-[11px] font-sans tracking-[0.25em] text-[#86868b] uppercase font-semibold">
              Business Infrastructure
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-[#f5f5f7] mb-6 leading-[1.05]"
          >
            Chiang Mai <br />
            <span className="font-semibold text-white">AI Center</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-[#86868b] font-light leading-relaxed mb-10 max-w-xl"
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-row items-center gap-6"
          >
            <button
              onClick={(e) => handleScrollTo(e, "#workspace")}
              className="px-6 py-3 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] text-[13px] font-medium rounded-full transition-colors shadow-sm"
            >
              {t("heroCTAExplore")}
            </button>
            <button
              onClick={(e) => handleScrollTo(e, "#contact")}
              className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white text-[13px] font-medium rounded-full transition-colors"
            >
              {t("heroCTABook")}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-10 left-12 z-10 flex items-center gap-3 text-[#86868b]">
        <div className="w-8 h-[1px] bg-neutral-700" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-light">Scroll to Explore</span>
      </div>
    </section>
  );
}
