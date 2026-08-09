"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  Rocket,
  Globe,
  Cpu,
  Zap,
  Sparkles,
  Target
} from "lucide-react";

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

  const pillars = [
    {
      title: t("aboutPillar1Title"),
      desc: t("aboutPillar1Desc"),
      icon: <Rocket className="w-4 h-4 text-blue-500" />,
      accent: "border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/10",
    },
    {
      title: t("aboutPillar2Title"),
      desc: t("aboutPillar2Desc"),
      icon: <Globe className="w-4 h-4 text-indigo-500" />,
      accent: "border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/10",
    },
    {
      title: t("aboutPillar3Title"),
      desc: t("aboutPillar3Desc"),
      icon: <Cpu className="w-4 h-4 text-emerald-500" />,
      accent: "border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10",
    },
    {
      title: t("aboutPillar4Title"),
      desc: t("aboutPillar4Desc"),
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      accent: "border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10",
    },
  ];

  return (
    <section id="about" className="py-28 bg-[#fafafa] dark:bg-[#070707] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
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

          <div className="lg:col-span-8 space-y-8">
            {/* Intro Lead */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg text-[#1d1d1f] dark:text-[#f5f5f7] font-normal leading-relaxed max-w-3xl"
            >
              <p>{t("aboutLead")}</p>
            </motion.div>

            {/* Synergy Highlight Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/[0.04] via-indigo-500/[0.04] to-emerald-500/[0.04] border border-neutral-200/80 dark:border-neutral-800/80 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {t("aboutSynergyTitle")}
                </span>
              </div>
              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                {t("aboutSynergySub")}
              </p>
            </motion.div>

            {/* 4 Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                  className={`p-5 rounded-xl border ${pillar.accent} hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 shadow-2xs">
                      {pillar.icon}
                    </div>
                    <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed pl-8">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Mission Callout */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/90 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-semibold text-[13px]">
                <Target className="w-4 h-4 text-blue-500" />
                <span>{t("aboutMissionTitle")}</span>
              </div>
              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                {t("aboutMissionDesc")}
              </p>
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
