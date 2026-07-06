"use client";

import React, { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Search } from "lucide-react";
import Image from "next/image";

interface OfficeUnit {
  id: string;
  type: "Small" | "Medium" | "Large" | "Facility";
  capacity: string;
  area: string;
  price: string;
  status: "Available" | "Limited" | "Full";
}

export default function Workspace() {
  const { t } = useTranslation();
  const [activeFloor, setActiveFloor] = useState<number>(2); // Default to Floor 2 (Workspace)
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const floors = [
    {
      num: 1,
      name: t("workspaceFloor1"),
      desc: t("workspaceFloor1Desc"),
      img: "/images/floor_1.png",
      units: [
        { id: "Entrance / Hall", type: "Facility", capacity: "Public Area", area: "180 sqm", price: "Free Access", status: "Available" },
        { id: "Meeting Room", type: "Facility", capacity: "8-10 Pax", area: "32 sqm", price: "Hourly Booking", status: "Available" },
        { id: "Pantry & Kitchen", type: "Facility", capacity: "Break Space", area: "25 sqm", price: "Shared Area", status: "Available" },
      ] as OfficeUnit[],
    },
    {
      num: 2,
      name: t("workspaceFloor2"),
      desc: t("workspaceFloor2Desc"),
      img: "/images/floor_2.png",
      units: [
        { id: "B1", type: "Small", capacity: "1-2 Pax", area: "10 sqm", price: "Contact us", status: "Available" },
        { id: "B2", type: "Small", capacity: "1-2 Pax", area: "10 sqm", price: "Contact us", status: "Available" },
        { id: "B3", type: "Medium", capacity: "2-4 Pax", area: "14 sqm", price: "Contact us", status: "Limited" },
        { id: "B4", type: "Medium", capacity: "2-4 Pax", area: "15 sqm", price: "Contact us", status: "Available" },
        { id: "B5", type: "Large", capacity: "4-6 Pax", area: "24 sqm", price: "Contact us", status: "Full" },
        { id: "B6", type: "Large", capacity: "4-6 Pax", area: "25 sqm", price: "Contact us", status: "Available" },
        { id: "B7", type: "Small", capacity: "1-2 Pax", area: "11 sqm", price: "Contact us", status: "Available" },
      ] as OfficeUnit[],
    },
    {
      num: 3,
      name: t("workspaceFloor3"),
      desc: t("workspaceFloor3Desc"),
      img: "/images/floor_3.png",
      units: [
        { id: "C1 - C4", type: "Small", capacity: "1-2 Pax", area: "12 sqm ea.", price: "Contact us", status: "Available" },
        { id: "C5 - C8", type: "Medium", capacity: "3-4 Pax", area: "18 sqm ea.", price: "Contact us", status: "Limited" },
        { id: "C9 - C11", type: "Large", capacity: "4-6 Pax", area: "28 sqm ea.", price: "Contact us", status: "Available" },
      ] as OfficeUnit[],
    },
    {
      num: 4,
      name: t("workspaceFloor4"),
      desc: t("workspaceFloor4Desc"),
      img: "/images/floor_4.png",
      units: [
        { id: "D1 - D4", type: "Small", capacity: "1-2 Pax", area: "12 sqm ea.", price: "Contact us", status: "Available" },
        { id: "D5 - D8", type: "Medium", capacity: "3-4 Pax", area: "18 sqm ea.", price: "Contact us", status: "Available" },
        { id: "D9 - D11", type: "Large", capacity: "4-6 Pax", area: "28 sqm ea.", price: "Contact us", status: "Full" },
      ] as OfficeUnit[],
    },
    {
      num: 5,
      name: t("workspaceFloor5"),
      desc: t("workspaceFloor5Desc"),
      img: "/images/floor_5.png",
      units: [
        { id: "E1 - E4 (Penthouse)", type: "Large", capacity: "6-8 Pax", area: "35 sqm ea.", price: "Contact us", status: "Limited" },
        { id: "E5 - E8 (Executive)", type: "Medium", capacity: "4-5 Pax", area: "22 sqm ea.", price: "Contact us", status: "Available" },
      ] as OfficeUnit[],
    },
  ];

  const currentFloorData = floors.find((f) => f.num === activeFloor) || floors[1];

  const getStatusDot = (status: OfficeUnit["status"]) => {
    switch (status) {
      case "Available":
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t("workspaceAvailable")}
          </span>
        );
      case "Limited":
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {t("workspaceLimited")}
          </span>
        );
      case "Full":
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#86868b]">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            {t("workspaceFull")}
          </span>
        );
    }
  };

  return (
    <section id="workspace" className="py-28 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
            {t("workspaceSectionTitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] dark:text-white tracking-tight mb-6">
            Discover Premium <span className="font-semibold">Workspace</span>
          </h2>
          <p className="text-base text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
            {t("workspaceDesc")}
          </p>
        </div>

        {/* Minimalist Floor selector */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-neutral-100 dark:border-neutral-900 pb-4">
          {floors.map((floor) => (
            <button
              key={floor.num}
              onClick={() => setActiveFloor(floor.num)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${
                activeFloor === floor.num
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                  : "bg-transparent text-[#515154] hover:text-[#1d1d1f] dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {floor.num} {t("workspaceFloor").toLowerCase()}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Floor Plan Display */}
          <div className="lg:col-span-6 bg-[#fafafa] dark:bg-[#070707] rounded-2xl p-6 relative group overflow-hidden border border-neutral-200/50 dark:border-neutral-800/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#86868b] uppercase font-medium">
                {currentFloorData.name}
              </span>
              <button
                onClick={() => setZoomImage(currentFloorData.img)}
                className="p-1.5 rounded-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-sm hover:scale-105 transition-transform"
                title="Expand Floor Plan"
              >
                <Search className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-white dark:bg-black rounded-xl overflow-hidden border border-neutral-200/20 dark:border-neutral-800/10 shadow-inner p-2">
              <Image
                src={currentFloorData.img}
                alt={currentFloorData.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <p className="mt-4 text-[12px] text-neutral-500 dark:text-[#86868b] leading-relaxed font-light">
              {currentFloorData.desc}
            </p>
          </div>

          {/* Directory table (replacing blocky dashboard cards) */}
          <div className="lg:col-span-6">
            <h3 className="text-[12px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold mb-6">
              {t("workspaceDetails")}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800/80 text-[10px] uppercase font-mono tracking-wider text-neutral-400 pb-3">
                    <th className="py-3 font-semibold">Unit</th>
                    <th className="py-3 font-semibold">Type</th>
                    <th className="py-3 font-semibold">Capacity</th>
                    <th className="py-3 font-semibold">Area</th>
                    <th className="py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900/60">
                  {currentFloorData.units.map((unit) => (
                    <tr key={unit.id} className="text-[13px] hover:bg-neutral-50/50 dark:hover:bg-[#070707] transition-colors">
                      <td className="py-3.5 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {unit.id}
                      </td>
                      <td className="py-3.5 text-neutral-500 dark:text-neutral-400 font-light">
                        {unit.type}
                      </td>
                      <td className="py-3.5 text-neutral-500 dark:text-neutral-400 font-light">
                        {unit.capacity}
                      </td>
                      <td className="py-3.5 text-neutral-500 dark:text-neutral-400 font-light">
                        {unit.area}
                      </td>
                      <td className="py-3.5 text-right font-light">
                        {getStatusDot(unit.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoomImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative max-w-5xl w-full aspect-[4/3] bg-white dark:bg-black p-4 rounded-xl shadow-2xl z-10 flex items-center justify-center"
            >
              <button
                onClick={() => setZoomImage(null)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={zoomImage}
                  alt="Expanded floor plan"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
