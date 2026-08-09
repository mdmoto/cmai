"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  Package,
  Coins,
  Store,
  MapPin,
  Target,
  Compass,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";

interface AiCenterProps {
  onOpenSandbox?: () => void;
}

export default function AiCenter({ onOpenSandbox }: AiCenterProps) {
  const { language } = useTranslation();

  const localT = {
    zh: {
      sectionTitle: "AI 决策系统",
      titlePre: "进入泰国市场前",
      titlePost: "先比较产品、价格与竞品情景",
      desc: "Chiang Mai AI Center 专门面向进入泰国市场的品牌与线下商业。利用版本化人口模型、离散选择算法和情景模拟，科学预判商业选择概率，规避盲目投资风险。",
      ctaLaunch: "AI决策商业沙盘",
      ctaMethod: "查看方法与数据",
      card1Title: "消费品验证",
      card1Desc: "比较新品的购买概率、目标人群、价格弹性与竞品替代。",
      card2Title: "消费品定价",
      card2Desc: "分析不同价格对选择概率、相对收入和利润率的影响。",
      card3Title: "线下门店验证",
      card3Desc: "评估餐饮、零售等门店的到店意愿、客群分布与经营约束。",
      card4Title: "商圈与选址比较",
      card4Desc: "对比候选位置的目标人群覆盖、出行阻力与竞争强度。",
      card5Title: "广告与素材测试",
      card5Desc: "比较海报、视频脚本、文案对受众的吸引力与转化倾向。",
      card6Title: "门店经营情景",
      card6Desc: "模拟营业时间、客单价及服务模式对最终业绩的异质性影响。"
    },
    en: {
      sectionTitle: "AI Decision Platform",
      titlePre: "Before entering Thailand",
      titlePost: "Compare products, pricing, and scenarios first",
      desc: "Tailored for brands and offline businesses entering Thailand. CMAI uses demographic calibration, discrete choice models, and scenario simulations to quantify decision probabilities and reduce investment risks.",
      ctaLaunch: "AI决策商业沙盘",
      ctaMethod: "Methodology & Data",
      card1Title: "Product Validation",
      card1Desc: "Compare purchase probabilities, target demographics, and substitution effects.",
      card2Title: "Pricing Studies",
      card2Desc: "Analyze price elasticity, demand curves, and relative revenue yields.",
      card3Title: "Offline Venue Testing",
      card3Desc: "Evaluate foot traffic intent, customer mix, and physical capacity constraints.",
      card4Title: "Site Selection & Compare",
      card4Desc: "Evaluate locations against demographics, travel friction, and competitor densities.",
      card5Title: "Ad Creative & Copy Testing",
      card5Desc: "A/B test graphic assets, video scripts, and landing page conversion triggers.",
      card6Title: "Operating Scenarios",
      card6Desc: "Simulate service configurations, open hours, and ticket averages."
    },
    th: {
      sectionTitle: "แพลตฟอร์มการตัดสินใจ AI",
      titlePre: "ก่อนเข้าสู่ตลาดประเทศไทย",
      titlePost: "เปรียบเทียบผลิตภัณฑ์ ราคา และคู่แข่งก่อน",
      desc: "ออกแบบมาสำหรับแบรนด์และธุรกิจออฟไลน์ที่กำลังเข้าสู่ตลาดไทย CMAI ใช้แบบจำลองประชากร อัลกอริทึมการเลือก และการจำลองสถานการณ์ เพื่อวัดความน่าจะเป็นในการตัดสินใจและลดความเสี่ยงในการลงทุน",
      ctaLaunch: "AI决策商业沙盘",
      ctaMethod: "ระเบียบวิธีและข้อมูล",
      card1Title: "การตรวจสอบผลิตภัณฑ์",
      card1Desc: "เปรียบเทียบความน่าจะเป็นในการซื้อ ประชากรเป้าหมาย และผลกระทบของการทดแทน",
      card2Title: "การศึกษาด้านราคา",
      card2Desc: "วิเคราะห์ความยืดหยุ่นของราคา เส้นอุปสงค์ และผลตอบแทนรายได้สัมพัทธ์",
      card3Title: "การทดสอบสถานที่ออฟไลน์",
      card3Desc: "ประเมินเจตนาการสัญจรทางเท้า ส่วนผสมลูกค้า และข้อจำกัดด้านความจุทางกายภาพ",
      card4Title: "การเปรียบเทียบการเลือกไซต์",
      card4Desc: "ประเมินสถานที่เทียบกับข้อมูลประชากร ความเสียดทานในการเดินทาง และความหนาแน่นของคู่แข่ง",
      card5Title: "การทดสอบโฆษณาและความคิดสร้างสรรค์",
      card5Desc: "การทดสอบ A/B สินทรัพย์กราฟิก สคริปต์วิดีโอ และทริกเกอร์การแปลงหน้า Landing Page",
      card6Title: "สถานการณ์การดำเนินงาน",
      card6Desc: "จำลองการกำหนดค่าบริการ เวลาทำการ และค่าเฉลี่ยตั๋ว"
    },
    ja: {
      sectionTitle: "AI意思決定プラットフォーム",
      titlePre: "タイ市場に参入する前に",
      titlePost: "製品・価格・競合シナリオを事前シミュレーション",
      desc: "タイ市場への参入を図るブランドや店舗ビジネスに。統計的ユーザーモデル、離散選択アルゴリズム、シナリオシミュレーションを通じて、不確実な参入リスクを科学的に評価します。",
      ctaLaunch: "AI决策商业沙盘",
      ctaMethod: "手法とデータ解説",
      card1Title: "消費財プロダクト検証",
      card1Desc: "製品の購入確率、ペルソナ分析、価格弾力性、競合スイッチを比較。",
      card2Title: "価格戦略・シミュレーション",
      card2Desc: "価格改定がシェア、予測売上、および期待利益率に与える影響を分析。",
      card3Title: "店舗出店・来客予測",
      card3Desc: "飲食・小売店の来客意向、顧客属性、およびキャパシティ制限をシミュレート。",
      card4Title: "商圏選址・エリア比較",
      card4Desc: "出店候補地の人口カバレッジ、交通利便性、および競合出店状況をデータ比較。",
      card5Title: "広告・マーケティングテスト",
      card5Desc: "バナー、動画スクリプト、ランディングページの説得力とコンバージョン率を検証。",
      card6Title: "店舗オペレーション設計",
      card6Desc: "営業時間、平均客単価、およびサービス形態が売上に与える変化をシミュレート。"
    }
  };

  const text = localT[language as keyof typeof localT] || localT.zh;

  const handleSandboxClick = (targetUrl?: string) => {
    if (onOpenSandbox) {
      onOpenSandbox();
    } else {
      window.location.href = targetUrl || "https://ai.lazzor.com";
    }
  };

  const cardData = [
    { title: text.card1Title, desc: text.card1Desc, icon: <Package className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />, href: "https://ai.lazzor.com/studies/new/?type=PRODUCT_VALIDATION" },
    { title: text.card2Title, desc: text.card2Desc, icon: <Coins className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />, href: "https://ai.lazzor.com/studies/new/?type=PRICING_STUDY" },
    { title: text.card3Title, desc: text.card3Desc, icon: <Store className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />, href: "https://ai.lazzor.com/studies/new/?type=VENUE_STUDY" },
    { title: text.card4Title, desc: text.card4Desc, icon: <MapPin className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />, href: "https://ai.lazzor.com/studies/new/?type=SITE_COMPARISON" },
    { title: text.card5Title, desc: text.card5Desc, icon: <Target className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />, href: "https://ai.lazzor.com/studies/new/?type=CREATIVE_TEST" },
    { title: text.card6Title, desc: text.card6Desc, icon: <Compass className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />, href: "https://ai.lazzor.com/studies/new/?type=OPERATING_SCENARIO" }
  ];

  return (
    <section id="ai-platform" className="py-28 bg-[#fafafa] dark:bg-[#070707] transition-colors duration-300 border-t border-neutral-200 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Top Intro Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
                {text.sectionTitle}
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] dark:text-white leading-[1.15] tracking-tight">
                {text.titlePre} <br />
                <span className="font-semibold text-black dark:text-[#f5f5f7]">{text.titlePost}</span>
              </h2>
            </motion.div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg text-[#515154] dark:text-[#86868b] font-light leading-relaxed max-w-3xl"
            >
              {text.desc}
            </motion.p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleSandboxClick()}
                className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[13px] font-semibold rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{text.ctaLaunch}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </button>
              <a
                href="https://ai.lazzor.com/methodology/"
                className="px-6 py-2.5 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-[13px] font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{text.ctaMethod}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Clean 6 Study Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800/80">
          {cardData.map((card, idx) => (
            <motion.div
              key={idx}
              onClick={() => handleSandboxClick(card.href)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    {card.icon}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
                  {card.title}
                </h3>
                <p className="text-[12px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mt-2">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
