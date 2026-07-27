"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  Brain,
  ArrowUpRight,
  Package,
  Coins,
  Store,
  MapPin,
  Target,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function AiCenter() {
  const { language } = useTranslation();

  const localT = {
    zh: {
      sectionTitle: "AI 决策系统",
      titlePre: "进入泰国市场前",
      titlePost: "先比较产品、价格与竞品情景",
      desc: "Chiang Mai AI Center 专门面向进入泰国市场的出海品牌与线下商业。利用版本化人口模型、离散选择算法和蒙特卡洛情景模拟，精准预判商业选择概率，规避盲目投资风险。",
      ctaLaunch: "启动 AI 决策平台",
      ctaMethod: "方法与数据说明",
      badgePop: "泰国 77 府宏观校准",
      badgeModel: "离散选择情景模拟",
      badgeVerify: "数据真实可追溯",
      studyTitle: "核心研究模型",
      studyDesc: "针对不同商业场景优化，为商业决策提供严谨的科学量化预测。",
      trustTitle: "严谨的预测，拒绝盲目猜测",
      trustDesc: "当前系统适合新品筛选、价格比较和竞品情景分析。在未接入真实销售或选择实验前，报告会将购买率、支付意愿（WTP）和品类渗透率明确标记为先验预测结果，不隐瞒模型边界。",
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
      desc: "Tailored for international brands and offline venues entering the Thai market. CMAI uses versioned demographic calibration, discrete choice algorithms, and Monte Carlo simulations to quantify decision probabilities and reduce investment risks.",
      ctaLaunch: "Launch AI Platform",
      ctaMethod: "Methodology & Data",
      badgePop: "77 Provinces Calibrated",
      badgeModel: "Discrete Choice Simulation",
      badgeVerify: "Verifiable Data Tracing",
      studyTitle: "Core Decision Modules",
      studyDesc: "Optimized for varying business landscapes to provide rigorous, quantitative forecasts.",
      trustTitle: "Scientific forecasting, no black box",
      trustDesc: "Suitable for product screening, price testing, and scenario analysis. Prior to onboarding real transaction loops, prior probabilities (WTP and penetration rate) are explicitly flagged to preserve statistical boundaries.",
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
      desc: "ออกแบบมาสำหรับแบรนด์ต่างประเทศและธุรกิจออฟไลน์ที่กำลังเข้าสู่ตลาดไทย CMAI ใช้แบบจำลองประชากรตามเวอร์ชัน อัลกอริทึมการเลือกแบบไม่ต่อเนื่อง และการจำลองมอนเตการ์โล เพื่อวัดความน่าจะเป็นในการตัดสินใจและลดความเสี่ยงในการลงทุน",
      ctaLaunch: "เปิดตัวแพลตฟอร์ม AI",
      ctaMethod: "ระเบียบวิธีและข้อมูล",
      badgePop: "ปรับเทียบ 77 จังหวัด",
      badgeModel: "การจำลองการเลือกที่ไม่ต่อเนื่อง",
      badgeVerify: "การติดตามข้อมูลที่ตรวจสอบได้",
      studyTitle: "โมดูลการตัดสินใจหลัก",
      studyDesc: "เพิ่มประสิทธิภาพสำหรับภูมิทัศน์ธุรกิจที่แตกต่างกันเพื่อให้การคาดการณ์เชิงปริมาณที่เข้มงวด",
      trustTitle: "การคาดการณ์ทางวิทยาศาสตร์ ไม่มีกล่องดำ",
      trustDesc: "เหมาะสำหรับการคัดกรองผลิตภัณฑ์ การทดสอบราคา และการวิเคราะห์สถานการณ์ ก่อนการทำธุรกรรมจริง ความน่าจะเป็นก่อนหน้า (WTP และอัตราการเจาะตลาด) จะถูกตั้งค่าสถานะอย่างชัดเจนเพื่อรักษาขอบเขตทางสถิติ",
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
      desc: "タイ市場への参入を図るグローバルブランドや店舗ビジネスに。統計的ユーザーモデル、離散選択アルゴリズム、モンテカルロシミュレーションを通じて、不確実な参入リスクを科学的に評価します。",
      ctaLaunch: "AI プラットフォームを起動",
      ctaMethod: "手法とデータ解説",
      badgePop: "タイ77県人口モデル構築",
      badgeModel: "離散選択モデル適用",
      badgeVerify: "検証可能なデータ構造",
      studyTitle: "コア分析モジュール",
      studyDesc: "タイ進出の主要な意思決定プロセスを数値化し、失敗予測モデルを提供します。",
      trustTitle: "厳格な予測モデル、ブラックボックスの排除",
      trustDesc: "新規プロダクトの受容性、最適な価格帯、広告コピーの訴求力、出店候補地の選定を網羅。統計的バイアスを最小化するため、分析プロセスとデータの限界を透明に開示します。",
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

  const text = localT[language as keyof typeof localT] || localT.en;

  const cardData = [
    { title: text.card1Title, desc: text.card1Desc, icon: <Package className="w-5 h-5" />, color: "border-blue-500/20 hover:border-blue-500 text-blue-500" },
    { title: text.card2Title, desc: text.card2Desc, icon: <Coins className="w-5 h-5" />, color: "border-emerald-500/20 hover:border-emerald-500 text-emerald-500" },
    { title: text.card3Title, desc: text.card3Desc, icon: <Store className="w-5 h-5" />, color: "border-purple-500/20 hover:border-purple-500 text-purple-500" },
    { title: text.card4Title, desc: text.card4Desc, icon: <MapPin className="w-5 h-5" />, color: "border-amber-500/20 hover:border-amber-500 text-amber-500" },
    { title: text.card5Title, desc: text.card5Desc, icon: <Target className="w-5 h-5" />, color: "border-rose-500/20 hover:border-rose-500 text-rose-500" },
    { title: text.card6Title, desc: text.card6Desc, icon: <Compass className="w-5 h-5" />, color: "border-cyan-500/20 hover:border-cyan-500 text-cyan-500" }
  ];

  return (
    <section id="ai-platform" className="relative py-28 bg-[#030303] text-white overflow-hidden border-t border-b border-neutral-900/50">
      {/* Dynamic Background Mesh Effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.06),transparent_50%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.04),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        
        {/* Top Intro Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 animate-pulse" />
                {text.sectionTitle}
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-light leading-[1.1] tracking-tight">
              {text.titlePre}，<br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-white">
                {text.titlePost}
              </span>
            </h2>
            
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-lg">
              {text.desc}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://ai.lazzor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[13px] font-medium rounded-full shadow-lg shadow-blue-500/10 flex items-center gap-2 transition-all group"
              >
                <span>{text.ctaLaunch}</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="https://ai.lazzor.com/methodology/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[13px] font-medium rounded-full flex items-center gap-2 transition-all"
              >
                <span>{text.ctaMethod}</span>
              </a>
            </div>

            {/* Verification Pills */}
            <div className="flex flex-wrap gap-3 pt-6 text-[11px] text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5 bg-neutral-900/60 px-3 py-1 rounded-full border border-neutral-900">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                {text.badgePop}
              </span>
              <span className="flex items-center gap-1.5 bg-neutral-900/60 px-3 py-1 rounded-full border border-neutral-900">
                <div className="w-1 h-1 rounded-full bg-indigo-500" />
                {text.badgeModel}
              </span>
              <span className="flex items-center gap-1.5 bg-neutral-900/60 px-3 py-1 rounded-full border border-neutral-900">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                {text.badgeVerify}
              </span>
            </div>
          </div>

          {/* Right Side: Grid of 6 Analysis Modules */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cardData.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`p-6 rounded-2xl bg-neutral-950/40 hover:bg-neutral-950 border ${card.color} transition-all group`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-neutral-900 text-neutral-300 group-hover:text-inherit transition-colors">
                    {card.icon}
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-inherit opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-200 mt-6 group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lower Banner: Trust & Limits Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-950 to-neutral-900/50 border border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-12"
        >
          <div className="space-y-2 max-w-3xl">
            <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              {text.trustTitle}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {text.trustDesc}
            </p>
          </div>
          <div className="shrink-0 flex items-center">
            <a
              href="https://ai.lazzor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group"
            >
              <span>{language === "zh" ? "进入系统报告 Demo" : "View Live Report Demo"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
