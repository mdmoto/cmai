"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/context/LanguageContext";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Sliders,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Coins,
  Store,
  MapPin,
  Target,
  Compass,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Layers
} from "lucide-react";

interface AiSandboxPortalProps {
  onClose: () => void;
}

export default function AiSandboxPortal({ onClose }: AiSandboxPortalProps) {
  const { language } = useTranslation();

  // Interactive Sandbox Simulation State
  const [category, setCategory] = useState<string>("fmcg");
  const [province, setProvince] = useState<string>("cmai");
  const [price, setPrice] = useState<number>(590);
  const [sampleSize, setSampleSize] = useState<number>(10000);
  const [competitorCount, setCompetitorCount] = useState<number>(3);

  // Dynamic simulation calculation (deterministic mock logic based on inputs)
  const baseProb = Math.max(12, Math.min(68, Math.round(52 - (price / 80) + (province === "cmai" ? 6 : province === "bkk" ? 10 : 2) - (competitorCount * 4))));
  const p10 = Math.max(8, baseProb - 6);
  const p90 = Math.min(85, baseProb + 7);
  const compShare1 = Math.round((100 - baseProb) * 0.45);
  const compShare2 = Math.round((100 - baseProb) * 0.32);
  const noPurchase = 100 - baseProb - compShare1 - compShare2;
  const elasticity = price > 1200 ? "高价格敏感 (High Elasticity)" : price > 600 ? "中度价格敏感 (Moderate)" : "刚需低价格敏感 (Inelastic)";

  return (
    <div className="w-full min-h-screen bg-[#070709] text-neutral-100 font-sans pb-32">
      {/* Top Floating Control Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#070709]/90 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-[13px] font-medium transition-all flex items-center gap-2 shadow-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{language === "zh" ? "翻转返回官网" : language === "th" ? "พลิกกลับสู่หน้าหลัก" : language === "ja" ? "公式サイトへ戻る" : "Flip Back to Hub"}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-800">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-xs text-neutral-400 font-mono tracking-wider">
                THAILAND MARKET TWIN · 3D REVOLVING MODE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://ai.lazzor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>{language === "zh" ? "在独立窗口打开 ai.lazzor.com" : "Open ai.lazzor.com"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header of Sandbox */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CMAI Discrete Choice & Simulation Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
            {language === "zh" ? "泰国消费市场" : "Thailand Market"}{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white">
              {language === "zh" ? "AI 商业决策沙盘系统" : "AI Simulation Sandbox"}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            {language === "zh"
              ? "进入泰国市场前，无需盲目猜测。利用版本化人口模型、离散选择算法（MNL）和蒙特卡洛随机模拟，实时推演消费者购买概率、价格弹性及竞品分流。"
              : "Before entering Thailand, test and simulate customer choice probabilities, price elasticity, and substitution effects with our versioned demographic calibration model."}
          </p>
        </div>
      </section>

      {/* Main Interactive Sandbox Console */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-neutral-950/80 border border-neutral-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Left Column: Parameter Controls */}
          <div className="lg:col-span-5 space-y-6 border-b lg:border-b-0 lg:border-r border-neutral-800/80 pb-8 lg:pb-0 lg:pr-8">
            <div className="flex items-center gap-2 text-white font-semibold text-[15px]">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>{language === "zh" ? "推演参数设定 (Inputs)" : "Simulation Parameters"}</span>
            </div>

            {/* Target Category */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                {language === "zh" ? "1. 目标业务品类 (Industry)" : "1. Business Category"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "fmcg", label: language === "zh" ? "消费品零售 (FMCG)" : "FMCG Products" },
                  { id: "fnb", label: language === "zh" ? "餐饮茶饮 (F&B)" : "Food & Beverage" },
                  { id: "pet", label: language === "zh" ? "宠物智能 (Pet Care)" : "Pet Hardware" },
                  { id: "beauty", label: language === "zh" ? "美妆个护 (Beauty)" : "Beauty & Care" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-medium border transition-all ${
                      category === cat.id
                        ? "bg-white text-neutral-950 border-white font-semibold"
                        : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Province */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                {language === "zh" ? "2. 目标城市 / 府份 (Province)" : "2. Target Region"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "cmai", label: language === "zh" ? "清迈府 (CMAI)" : "Chiang Mai" },
                  { id: "bkk", label: language === "zh" ? "曼谷都会区 (BKK)" : "Bangkok" },
                  { id: "phuket", label: language === "zh" ? "普吉岛 (Phuket)" : "Phuket" }
                ].map((prov) => (
                  <button
                    key={prov.id}
                    onClick={() => setProvince(prov.id)}
                    className={`px-3 py-2 rounded-xl text-center text-xs font-medium border transition-all ${
                      province === prov.id
                        ? "bg-white text-neutral-950 border-white font-semibold"
                        : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    {prov.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-mono uppercase tracking-wider">
                  {language === "zh" ? "3. 拟定售价 (Target Price)" : "3. Target Price"}
                </span>
                <span className="font-mono text-base text-blue-400 font-semibold">
                  ฿{price.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={3500}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* Competitor Set Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-mono uppercase tracking-wider">
                  {language === "zh" ? "4. 竞品选择集规模 (Competitors)" : "4. Competitors Count"}
                </span>
                <span className="font-mono text-xs text-neutral-300">
                  {competitorCount} {language === "zh" ? "款主流竞品" : "Brands"}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setCompetitorCount(cnt)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      competitorCount === cnt
                        ? "bg-white text-neutral-950 border-white font-semibold"
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Output & Probability Breakdown */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white font-semibold text-[15px]">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>{language === "zh" ? "沙盘推演结果 (Real-time Simulation)" : "Simulation Results"}</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                  10,000 Synthetic Consumers · 80 Rounds
                </span>
              </div>

              {/* Main Probability Hero Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">
                    {language === "zh" ? "预测选择概率" : "Choice Prob."}
                  </span>
                  <div className="text-3xl font-semibold text-white tracking-tight">
                    {baseProb}%
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">
                    P10: {p10}% ~ P90: {p90}%
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">
                    {language === "zh" ? "价格弹性状态" : "Price Elasticity"}
                  </span>
                  <div className="text-sm font-semibold text-neutral-200 pt-2">
                    {elasticity}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">
                    {language === "zh" ? "目标受众画像" : "Target Segment"}
                  </span>
                  <div className="text-[11px] text-neutral-300 pt-1 leading-snug">
                    25-38岁 · 都会白领 · 月均收入 ฿30,000+
                  </div>
                </div>
              </div>

              {/* Market Share Distribution Breakdown */}
              <div className="space-y-3 bg-neutral-900/30 p-4 rounded-2xl border border-neutral-800/60">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                  {language === "zh" ? "模拟市场份额拆解 (Share of Choice)" : "Share of Choice Distribution"}
                </span>

                {/* Our Brand */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {language === "zh" ? "本品 (Our Product)" : "Our Product"}
                    </span>
                    <span className="font-mono text-blue-400">{baseProb}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${baseProb}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Competitor 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {language === "zh" ? "泰国本土龙头竞品 A" : "Local Brand A"}
                    </span>
                    <span className="font-mono text-neutral-400">{compShare1}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${compShare1}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Competitor 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      {language === "zh" ? "进口大牌竞品 B" : "Imported Brand B"}
                    </span>
                    <span className="font-mono text-neutral-400">{compShare2}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${compShare2}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>

                {/* No Purchase */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-600" />
                      {language === "zh" ? "选择不购买 (None Option)" : "None Option"}
                    </span>
                    <span className="font-mono text-neutral-500">{noPurchase}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${noPurchase}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-neutral-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Studio Link Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800/80">
              <div className="text-xs text-neutral-400">
                {language === "zh" ? "需要生成包含 77 府真实人口校准的完整决策报告？" : "Need complete official decision reports for 77 provinces?"}
              </div>
              <a
                href="https://ai.lazzor.com/studies/new/?type=PRODUCT_VALIDATION"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-md"
              >
                <span>{language === "zh" ? "进入 Studio 开始正式测试" : "Launch Official Studio"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Six Deep Decision Modules */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold block mb-2">
            RESEARCH MODULES
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white">
            {language === "zh" ? "直通 6 大专项研究工作流" : "Six Dedicated AI Research Workflows"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: language === "zh" ? "消费品验证 (Product Validation)" : "Product Validation",
              desc: language === "zh" ? "比较新品的购买概率、目标人群、价格弹性与竞品替代。" : "Compare purchase probabilities and substitution effects.",
              icon: <Package className="w-5 h-5 text-blue-400" />,
              link: "https://ai.lazzor.com/studies/new/?type=PRODUCT_VALIDATION"
            },
            {
              title: language === "zh" ? "消费品定价 (Pricing Study)" : "Pricing Studies",
              desc: language === "zh" ? "比较不同价格对选择概率、相对收入和利润的影响。" : "Compare pricing tiers against demand curves.",
              icon: <Coins className="w-5 h-5 text-emerald-400" />,
              link: "https://ai.lazzor.com/studies/new/?type=PRICING_STUDY"
            },
            {
              title: language === "zh" ? "线下门店验证 (Venue Study)" : "Venue Studies",
              desc: language === "zh" ? "评估餐厅、咖啡馆、酒吧和零售门店的到店意向与客群。" : "Evaluate foot traffic intent and physical capacity limits.",
              icon: <Store className="w-5 h-5 text-purple-400" />,
              link: "https://ai.lazzor.com/studies/new/?type=VENUE_STUDY"
            },
            {
              title: language === "zh" ? "商圈与选址比较 (Site Comparison)" : "Site Selection",
              desc: language === "zh" ? "对比候选点位的目标客群覆盖、出行阻力与竞争强度。" : "Analyze location choices, travel impedance, and competitor density.",
              icon: <MapPin className="w-5 h-5 text-amber-400" />,
              link: "https://ai.lazzor.com/studies/new/?type=SITE_COMPARISON"
            },
            {
              title: language === "zh" ? "广告与素材测试 (Creative Test)" : "Creative Tests",
              desc: language === "zh" ? "比较广告图片、文案、视频脚本或落地页的转化倾向。" : "A/B test ad creatives, copy layouts, and landing conversions.",
              icon: <Target className="w-5 h-5 text-rose-400" />,
              link: "https://ai.lazzor.com/studies/new/?type=CREATIVE_TEST"
            },
            {
              title: language === "zh" ? "门店经营情景 (Operating Scenario)" : "Operating Scenarios",
              desc: language === "zh" ? "比较营业时间、容量、活动、客单价对结果的影响。" : "Simulate open hours, promotions, and average ticket yields.",
              icon: <Compass className="w-5 h-5 text-cyan-400" />,
              link: "https://ai.lazzor.com/studies/new/?type=OPERATING_SCENARIO"
            }
          ].map((mod, i) => (
            <a
              key={i}
              href={mod.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-600 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-xl bg-neutral-900">
                    {mod.icon}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-white">
                  {mod.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-2 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Bottom Floating Bar to Return */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 text-[13px] font-semibold transition-all shadow-2xl flex items-center gap-2 border border-neutral-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "zh" ? "翻转返回 CMAI 官网" : "Flip Back to Main Site"}</span>
        </button>
      </div>
    </div>
  );
}
