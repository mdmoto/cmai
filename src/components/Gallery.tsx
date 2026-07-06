"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
  src: string;
  category: "exterior" | "reception" | "offices" | "common";
  title: string;
}

export default function Gallery() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items: GalleryItem[] = [
    // Exterior (1)
    { src: "/images/image_1.jpg", category: "exterior", title: "Chiang Mai AI Center Exterior" },
    
    // Lobby/Reception (2~4)
    { src: "/images/image_2.jpg", category: "reception", title: "Main Lobby Entrance" },
    { src: "/images/image_3.jpg", category: "reception", title: "Reception Desk" },
    { src: "/images/image_4.jpg", category: "reception", title: "Lobby Visitor Seating" },
    
    // Private Offices (5~9, no 6.jpg exists)
    { src: "/images/image_5.jpg", category: "offices", title: "Premium Team Suite" },
    { src: "/images/image_7.jpg", category: "offices", title: "Executive Workspace" },
    { src: "/images/image_8.jpg", category: "offices", title: "Private Office View" },
    { src: "/images/image_9.jpg", category: "offices", title: "Furnished Office Unit" },
    
    // Common Areas (10~16)
    { src: "/images/image_10.jpg", category: "common", title: "Common Coworking Space" },
    { src: "/images/image_11.jpg", category: "common", title: "Pantry & Coffee Bar" },
    { src: "/images/image_12.jpg", category: "common", title: "Meeting & Training Room" },
    { src: "/images/image_13.jpg", category: "common", title: "Collaborative Area" },
    { src: "/images/image_14.jpg", category: "common", title: "Lounge Seating" },
    { src: "/images/image_15.jpg", category: "common", title: "Open Air Balcony" },
    { src: "/images/image_16.jpg", category: "common", title: "Outdoor Spirit House Area" },
  ];

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter);

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  return (
    <section id="gallery" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <span className="text-[12px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold block mb-3">
              {t("gallerySectionTitle")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white tracking-tight">
              {t("gallerySubtitle")}
            </h2>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: t("galleryAll") },
              { id: "exterior", label: t("galleryExterior") },
              { id: "reception", label: t("galleryReception") },
              { id: "offices", label: t("galleryOffices") },
              { id: "common", label: t("galleryCommon") },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilter(cat.id);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all ${
                  filter === cat.id
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                    : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-like Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIndex(idx)}
                className="relative group aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 cursor-pointer border border-neutral-200/20 dark:border-neutral-800/10 shadow-sm"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={idx < 6}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-white text-base font-semibold tracking-tight">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full h-[70vh] z-10 flex items-center justify-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-neutral-300 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-0 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all -translate-x-6 md:-translate-x-12"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Image viewport */}
              <div className="relative w-full h-full">
                <Image
                  src={filteredItems[lightboxIndex].src}
                  alt={filteredItems[lightboxIndex].title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-0 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all translate-x-6 md:translate-x-12"
                title="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Info bar */}
              <div className="absolute -bottom-14 left-0 right-0 text-center text-white">
                <p className="text-sm font-medium tracking-tight">
                  {filteredItems[lightboxIndex].title}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono mt-1">
                  {lightboxIndex + 1} / {filteredItems.length}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
