"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Search, Building2, Wifi, Car, FileCheck2 } from "lucide-react";
import Image from "next/image";

interface OfficeUnit {
  id: string;
  type: "Small" | "Medium" | "Large" | "Facility";
  capacity: string;
  area: string;
  price: string;
  status: "Available" | "Limited" | "Full";
  features?: string;
  desks?: number;
}

export default function Workspace() {
  const { t, language } = useTranslation();
  const [activeFloor, setActiveFloor] = useState<number>(2); // Default to Floor 2 (Workspace)
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const getFloorTabLabel = (num: number) => {
    if (language === "zh") return `${num} 楼`;
    if (language === "th") return `ชั้น ${num}`;
    if (language === "ja") return `${num}階`;
    return `Floor ${num}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when floor plan is zoomed
  useEffect(() => {
    if (zoomImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomImage]);

  const floors = [
    {
      num: 1,
      name: t("workspaceFloor1"),
      desc: t("workspaceFloor1Desc"),
      img: "/images/floor_1.webp",
      units: [
        {
          id: language === "zh" ? "前台礼宾接待大厅" : language === "th" ? "ล็อบบี้ต้อนรับ" : language === "ja" ? "総合受付ロビー" : "Reception Lobby",
          type: "Facility",
          capacity: language === "zh" ? "全楼共享" : "Shared",
          area: "180 sqm",
          price: language === "zh" ? "免费开放共享" : "Complimentary Access",
          status: "Available",
          features: "Lounge"
        },
        {
          id: language === "zh" ? "租户共享会议室" : language === "th" ? "ห้องประชุมส่วนกลาง" : language === "ja" ? "共用会議室" : "Shared Conference Room",
          type: "Facility",
          capacity: "8-10 Pax",
          area: "32 sqm",
          price: language === "zh" ? "租户免费预约" : "Free for Tenants",
          status: "Available",
          features: "Projector, Whiteboard"
        },
        {
          id: language === "zh" ? "社区茶水吧与厨房" : language === "th" ? "แพนทรี & ห้องครัว" : language === "ja" ? "共用パントリー＆キッチン" : "Pantry & Dining Area",
          type: "Facility",
          capacity: language === "zh" ? "休闲餐饮" : "Dining & Coffee",
          area: "25 sqm",
          price: language === "zh" ? "免费开放共享" : "Complimentary Access",
          status: "Available",
          features: "Coffee, Microwave, Fridge"
        },
        {
          id: language === "zh" ? "访客接待洽谈区" : language === "th" ? "พื้นที่รับรองผู้มาเยือน" : language === "ja" ? "ビジターラウンジ" : "Visitor Discussion Lounge",
          type: "Facility",
          capacity: language === "zh" ? "商务会客" : "Guest Meetings",
          area: "45 sqm",
          price: language === "zh" ? "免费开放共享" : "Complimentary Access",
          status: "Available",
          features: "Soft Seating, High-Speed WiFi"
        },
      ] as OfficeUnit[],
    },
    {
      num: 2,
      name: t("workspaceFloor2"),
      desc: t("workspaceFloor2Desc"),
      img: "/images/floor_2.webp",
      units: [
        { id: "B1-2", type: "Medium", capacity: "2-4 Pax", area: "20 sqm", price: "฿9,400/mo", features: "AC, Window", status: "Available", desks: 4 },
        { id: "B3-4", type: "Medium", capacity: "2-4 Pax", area: "29 sqm", price: "฿7,300/mo", features: "AC, Window", status: "Full", desks: 3 },
        { id: "B5", type: "Large", capacity: "4-6 Pax", area: "24 sqm", price: "฿8,700/mo", features: "AC, Window", status: "Full", desks: 3 },
        { id: "B6", type: "Large", capacity: "4-6 Pax", area: "25 sqm", price: "฿3,700/mo", features: "W/o AC, W/o Window", status: "Available", desks: 1 },
        { id: "B7", type: "Small", capacity: "1-2 Pax", area: "11 sqm", price: "฿3,100/mo", features: "W/o AC, Window", status: "Available", desks: 1 },
        { id: "Common Room (CM)", type: "Large", capacity: "Co-working", area: "80 sqm", price: "฿22,600/mo", features: "AC, Window", status: "Full", desks: 12 },
      ] as OfficeUnit[],
    },
    {
      num: 3,
      name: t("workspaceFloor3"),
      desc: t("workspaceFloor3Desc"),
      img: "/images/floor_3.webp",
      units: [
        { id: "C1-2", type: "Medium", capacity: "2-4 Pax", area: "24 sqm", price: "฿9,700/mo", features: "AC, Window", status: "Available", desks: 4 },
        { id: "C3", type: "Small", capacity: "1-2 Pax", area: "12 sqm", price: "฿5,000/mo", features: "AC, Window", status: "Available", desks: 2 },
        { id: "C4", type: "Small", capacity: "1-2 Pax", area: "12 sqm", price: "฿7,800/mo", features: "AC, Window", status: "Available", desks: 3 },
        { id: "C5", type: "Medium", capacity: "3-4 Pax", area: "18 sqm", price: "฿4,700/mo", features: "AC, Window", status: "Available", desks: 2 },
        { id: "C6", type: "Medium", capacity: "3-4 Pax", area: "18 sqm", price: "฿1,800/mo", features: "W/o AC, W/o Window", status: "Available", desks: 1 },
        { id: "C7-8", type: "Large", capacity: "4-6 Pax", area: "36 sqm", price: "฿5,800/mo", features: "AC, Window", status: "Available", desks: 2 },
        { id: "C9", type: "Large", capacity: "4-6 Pax", area: "28 sqm", price: "฿6,000/mo", features: "AC, Window", status: "Available", desks: 2 },
        { id: "C10", type: "Large", capacity: "4-6 Pax", area: "28 sqm", price: "฿3,000/mo", features: "W/o AC, W/o Window", status: "Full", desks: 1 },
        { id: "C11", type: "Large", capacity: "4-6 Pax", area: "28 sqm", price: "฿3,000/mo", features: "W/o AC, W/o Window", status: "Available", desks: 1 },
        { id: "C12", type: "Small", capacity: "1-2 Pax", area: "10 sqm", price: "฿1,500/mo", features: "W/o AC, Window", status: "Available", desks: 1 },
      ] as OfficeUnit[],
    },
    {
      num: 4,
      name: t("workspaceFloor4"),
      desc: t("workspaceFloor4Desc"),
      img: "/images/floor_4.webp",
      units: [
        { id: "D1-2", type: "Medium", capacity: "2-4 Pax", area: "24 sqm", price: "฿9,700/mo", features: "AC, Window", status: "Available", desks: 4 },
        { id: "D3", type: "Small", capacity: "1-2 Pax", area: "12 sqm", price: "฿6,400/mo", features: "AC, Window", status: "Available", desks: 2 },
        { id: "D4", type: "Small", capacity: "1-2 Pax", area: "12 sqm", price: "฿7,800/mo", features: "AC, Window", status: "Full", desks: 3 },
        { id: "D5", type: "Medium", capacity: "3-4 Pax", area: "18 sqm", price: "฿4,700/mo", features: "AC, Window", status: "Available", desks: 2 },
        { id: "D6", type: "Medium", capacity: "3-4 Pax", area: "18 sqm", price: "฿1,800/mo", features: "W/o AC, W/o Window", status: "Full", desks: 1 },
        { id: "D7-8", type: "Large", capacity: "4-6 Pax", area: "36 sqm", price: "฿5,400/mo", features: "AC, Window", status: "Available", desks: 2 },
        { id: "D9", type: "Large", capacity: "4-6 Pax", area: "28 sqm", price: "฿7,000/mo", features: "AC, Window", status: "Available", desks: 3 },
        { id: "D10", type: "Large", capacity: "4-6 Pax", area: "28 sqm", price: "฿2,400/mo", features: "W/o AC, W/o Window", status: "Available", desks: 1 },
        { id: "D11", type: "Large", capacity: "4-6 Pax", area: "28 sqm", price: "฿3,200/mo", features: "W/o AC, W/o Window", status: "Available", desks: 1 },
        { id: "D12", type: "Small", capacity: "1-2 Pax", area: "10 sqm", price: "฿1,500/mo", features: "W/o AC, Window", status: "Full", desks: 1 },
      ] as OfficeUnit[],
    },
    {
      num: 5,
      name: t("workspaceFloor5"),
      desc: t("workspaceFloor5Desc"),
      img: "/images/floor_5.webp",
      units: [
        { id: "E1", type: "Large", capacity: "6-8 Pax", area: "35 sqm", price: "฿11,200/mo", features: "AC, Window", status: "Full", desks: 4 },
        { id: "E2", type: "Large", capacity: "6-8 Pax", area: "35 sqm", price: "฿5,600/mo", features: "W/o AC, Window", status: "Available", desks: 2 },
        { id: "E3", type: "Large", capacity: "6-8 Pax", area: "35 sqm", price: "฿7,100/mo", features: "W/o AC, Window", status: "Available", desks: 3 },
        { id: "E4-5", type: "Large", capacity: "4 Pax", area: "57 sqm", price: "฿9,300/mo", features: "W/o AC, Window", status: "Available", desks: 4 },
        { id: "E6", type: "Medium", capacity: "4-5 Pax", area: "22 sqm", price: "฿3,000/mo", features: "W/o AC, W/o Window", status: "Available", desks: 1 },
        { id: "E7-8", type: "Large", capacity: "6-8 Pax", area: "44 sqm", price: "฿8,000/mo", features: "AC, Window", status: "Available", desks: 3 },
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
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
            {t("workspaceSectionTitle")} · ออฟฟิศให้เช่า เชียงใหม่
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] dark:text-white tracking-tight mb-6">
            Offices for Rent in Chiang Mai <span className="font-semibold block sm:inline text-neutral-900 dark:text-white">· 40+ Private Suites (2F–5F)</span>
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
                {getFloorTabLabel(floor.num)}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold">
                {activeFloor === 1
                  ? (language === "zh" ? "1 楼公共共享设施清单" : language === "th" ? "รายการสิ่งอำนวยความสะดวกชั้น 1" : language === "ja" ? "1階共用アメニティ一覧" : "Floor 1 Shared Amenities")
                  : t("workspaceDetails")}
              </h3>
              {activeFloor === 1 && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium">
                  {language === "zh" ? "全楼免费共享 · 不对外招租" : "Shared Amenity · Not for Lease"}
                </span>
              )}
            </div>

            {/* Clear Floor 1 Shared Space Notice */}
            {activeFloor === 1 && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-blue-950 dark:text-blue-200 text-xs leading-relaxed flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">🏛️</span>
                <div>
                  <div className="font-semibold mb-1">
                    {language === "zh"
                      ? "一楼为整栋楼宇公共共享空间 · 不对外招租"
                      : language === "th"
                      ? "ชั้น 1 เป็นพื้นที่ส่วนกลางและสิ่งอำนวยความสะดวก (ไม่เปิดให้เช่าแยก)"
                      : language === "ja"
                      ? "1階は全館共用コミュニティエリアです（個別賃貸対象外）"
                      : "Floor 1 is a dedicated shared community amenity area (not for separate lease)"}
                  </div>
                  <p className="text-blue-700 dark:text-blue-300/90 font-light">
                    {language === "zh"
                      ? "所有入驻企业及访客均可免费享用前台接待、共享会议室、社区茶水吧与休闲休息区。独立办公室租赁请切换至 2 楼至 5 楼查看。"
                      : language === "th"
                      ? "ผู้เช่าและผู้มาเยือนสามารถใช้แผนกต้อนรับ ห้องประชุม และพื้นที่พักผ่อนได้ฟรี ออฟฟิศให้เช่าโปรดเลือกชั้น 2 ถึง 5"
                      : language === "ja"
                      ? "入居企業および来訪者は、総合受付、共用会議室、パントリー、ラウンジを無料で利用可能。賃貸オフィスは2階〜5階をご覧ください。"
                      : "All resident teams and guests enjoy complimentary access to front reception, meeting rooms, pantry lounge, and visitor areas. For private offices, please explore Floors 2 through 5."}
                  </p>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800/80 text-[10px] uppercase font-mono tracking-wider text-neutral-400 pb-3">
                    <th className="py-3 font-semibold">{t("workspaceUnit") || "Unit"}</th>
                    <th className="py-3 font-semibold">{t("workspaceFeatures") || "Features"}</th>
                    <th className="py-3 font-semibold">{t("workspaceDesks") || "Desks"}</th>
                    <th className="py-3 font-semibold">
                      {activeFloor === 1 ? (language === "zh" ? "使用权限" : "Access") : t("workspacePricing")}
                    </th>
                    <th className="py-3 font-semibold text-right">
                      {activeFloor === 1 ? (language === "zh" ? "开放状态" : "Availability") : t("workspaceStatus")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900/60">
                  {currentFloorData.units.map((unit) => (
                    <tr key={unit.id} className="text-[13px] hover:bg-neutral-50/50 dark:hover:bg-[#070707] transition-colors">
                      <td className="py-3.5 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {unit.id}
                      </td>
                      <td className="py-3.5 text-neutral-500 dark:text-neutral-400 font-light">
                        {unit.features ? (
                          <div className="flex flex-wrap gap-1">
                            {unit.features.split(", ").map((f, idx) => {
                              const isNo = f.startsWith("W/o");
                              return (
                                <span
                                  key={idx}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide ${
                                    isNo
                                      ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600"
                                      : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                                  }`}
                                >
                                  {f === "AC" && (t("featureAC") || "A/C")}
                                  {f === "Window" && (t("featureWindow") || "Window")}
                                  {f === "W/o AC" && (t("featureNoAC") || "No A/C")}
                                  {f === "W/o Window" && (t("featureNoWindow") || "No Window")}
                                  {f === "Concierge" && (language === "zh" ? "前台礼宾" : f)}
                                  {f === "Lounge" && (language === "zh" ? "接待大厅" : f)}
                                  {f === "Projector" && (language === "zh" ? "投影仪" : f)}
                                  {f === "Whiteboard" && (language === "zh" ? "白板" : f)}
                                  {f === "Coffee" && (language === "zh" ? "咖啡机" : f)}
                                  {f === "Microwave" && (language === "zh" ? "微波炉" : f)}
                                  {f === "Fridge" && (language === "zh" ? "冰箱" : f)}
                                  {f === "Soft Seating" && (language === "zh" ? "沙发座" : f)}
                                  {f === "High-Speed WiFi" && (language === "zh" ? "千兆Wi-Fi" : f)}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-neutral-300 dark:text-neutral-700">—</span>
                        )}
                      </td>
                      <td className="py-3.5 text-neutral-500 dark:text-neutral-400 font-light">
                        {unit.desks !== undefined ? (
                          <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                            {unit.desks}
                          </span>
                        ) : (
                          <span className="text-neutral-300 dark:text-neutral-700">—</span>
                        )}
                      </td>
                      <td className="py-3.5 text-neutral-900 dark:text-white font-medium">
                        {unit.price}
                      </td>
                      <td className="py-3.5 text-right font-light">
                        {activeFloor === 1 ? (
                          <span className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {language === "zh" ? "免费共享配套" : language === "th" ? "บริการฟรีสำหรับผู้เช่า" : language === "ja" ? "無料共用設備" : "Shared Amenity"}
                          </span>
                        ) : (
                          getStatusDot(unit.status)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Office Rental Fact Sheet & Overview (High-Intent SEO & GEO Factual Content) */}
        <div className="mt-20 pt-16 border-t border-neutral-100 dark:border-neutral-900">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-mono tracking-widest text-[#86868b] uppercase font-semibold block mb-2">
              Office For Rent in Chiang Mai · ออฟฟิศให้เช่า เชียงใหม่
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-[#1d1d1f] dark:text-white tracking-tight mb-4">
              {t("workspaceRentalOverviewTitle")}
            </h3>
            <p className="text-sm sm:text-base text-[#515154] dark:text-[#86868b] font-light leading-relaxed">
              {t("workspaceRentalOverviewSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#070707] border border-neutral-200/50 dark:border-neutral-800/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t("workspaceHighlight1Title")}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {t("workspaceHighlight1Desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#070707] border border-neutral-200/50 dark:border-neutral-800/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t("workspaceHighlight2Title")}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {t("workspaceHighlight2Desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#070707] border border-neutral-200/50 dark:border-neutral-800/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t("workspaceHighlight3Title")}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {t("workspaceHighlight3Desc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#070707] border border-neutral-200/50 dark:border-neutral-800/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t("workspaceHighlight4Title")}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                {t("workspaceHighlight4Desc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {zoomImage && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setZoomImage(null)}
                  className="fixed inset-0 bg-black/95 backdrop-blur-md"
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
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
