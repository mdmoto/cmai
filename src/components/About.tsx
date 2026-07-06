"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    {
      number: "1600㎡",
      label: t("aboutStatArea"),
      sub: "Total workspace area",
    },
    {
      number: "5 Floors",
      label: t("aboutStatFloors"),
      sub: t("aboutStatFloorsSub"),
    },
    {
      number: "40+ Units",
      label: t("aboutStatOffices"),
      sub: t("aboutStatOfficesSub"),
    },
    {
      number: "Enterprise",
      label: t("aboutStatInternet"),
      sub: t("aboutStatInternetSub"),
    },
    {
      number: "Prime Hub",
      label: t("aboutStatLocation"),
      sub: "Huay Kaew Center Road",
    },
    {
      number: "5 km",
      label: t("aboutStatAirport"),
      sub: t("aboutStatAirportSub"),
    },
  ];

  return (
    <section id="about" className="py-28 bg-[#fafafa] dark:bg-[#070707] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
                {t("aboutSectionTitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] dark:text-white leading-[1.15] tracking-tight">
                More Than <br />
                <span className="font-semibold text-black dark:text-[#f5f5f7]">Workspace.</span>
              </h2>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg text-[#515154] dark:text-[#86868b] font-light leading-relaxed max-w-3xl"
            >
              <p>{t("aboutDesc")}</p>
            </motion.div>
          </div>
        </div>

        {/* Minimal Stats Row (Editorial Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 border-t border-neutral-200 dark:border-neutral-800/80 pt-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="space-y-1 flex flex-col justify-start"
            >
              <div className="text-[26px] font-semibold text-black dark:text-white tracking-tight">
                {stat.number}
              </div>
              <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
                {stat.label}
              </div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-light leading-none">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
