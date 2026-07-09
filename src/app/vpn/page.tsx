"use client";

import React, { useState } from "react";
import { useTranslation, Language } from "@/context/LanguageContext";
import { 
  Download, 
  Smartphone, 
  Laptop, 
  Key, 
  Globe, 
  ChevronDown, 
  Lock, 
  Copy, 
  Check, 
  Info, 
  ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VpnSetupPage() {
  const { language, setLanguage } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Localization Dictionary
  const localDict = {
    en: {
      title: "Corporate Network Portal",
      subtitle: "Secure remote access for Chiang Mai AI Center members and global remote teams.",
      backHome: "Back to Home",
      tabIos: "iOS (iPhone/iPad)",
      tabOthers: "Other Devices (Windows/Mac/Android)",
      
      // L2TP Section
      l2tpTitle: "Apple iOS Native Setup (L2TP)",
      l2tpDesc: "No app installation required. Configure your iPhone directly using our secure profile.",
      l2tpBtn: "Install iOS Profile",
      l2tpStepsTitle: "Installation Steps",
      l2tpStep1: "Click the button above to download the profile in Safari.",
      l2tpStep2: "Open iOS Settings. You will see a 'Profile Downloaded' banner at the top. Tap it.",
      l2tpStep3: "Tap 'Install' in the top-right corner, enter your passcode, and confirm.",
      l2tpStep4: "Go to Settings > VPN, select 'L2TP VPN', and toggle the switch to connect.",
      
      // VLESS Section
      vlessTitle: "Secure VLESS Proxy Setup",
      vlessDesc: "Recommended for Windows, Android, and macOS. Resilient to network blocks with premium speed.",
      vlessBtnCopy: "Copy Connection Link",
      vlessBtnCopied: "Copied!",
      vlessLinkTitle: "VLESS Connection Key",
      vlessClientTitle: "1. Download Client Software",
      vlessClientDesc: "Download the client directly from our company workspace and install it:",
      vlessWin: "Windows Client",
      vlessMac: "macOS Client",
      vlessAndroid: "Android Client",
      vlessImportTitle: "2. Import & Connect",
      vlessImportStep1: "Get your private VLESS connection link from the administrator.",
      vlessImportStep2: "Open your downloaded client, press Paste (Ctrl+V or Cmd+V) to import.",
      vlessImportStep3: "Start the connection. Choose 'Route: Bypass Mainland China' for optimal routing.",
      
      // Note
      securityNote: "This server is for corporate business use only. Please do not share these credentials publicly."
    },
    zh: {
      title: "企业内网连接门户",
      subtitle: "为清迈 AI 中心成员及全球远程团队提供安全的内网及海外网络接入服务。",
      backHome: "返回首页",
      tabIos: "苹果手机 (iOS)",
      tabOthers: "其他设备 (Windows/Mac/安卓)",
      
      // L2TP Section
      l2tpTitle: "iOS 免客户端极速配置 (L2TP)",
      l2tpDesc: "无需下载任何软件，通过系统自带的安全描述文件一键自动配置连接。",
      l2tpBtn: "下载并安装 iOS 描述文件",
      l2tpStepsTitle: "安装步骤说明",
      l2tpStep1: "使用 Safari 浏览器点击上方按钮下载配置文件。",
      l2tpStep2: "打开 iPhone '设置'，在顶部会看到“已下载描述文件”选项，点击进入。",
      l2tpStep3: "点击右上角“安装”，输入手机锁屏密码，确认安装。",
      l2tpStep4: "返回 '设置' -> 'VPN'，选择 'L2TP VPN'，开启连接即可。",
      
      // VLESS Section
      vlessTitle: "高性能 VLESS 加密代理配置",
      vlessDesc: "推荐 Windows、Android 及 macOS 用户使用。采用 REALITY 伪装技术，防封锁能力极强，速度更快。",
      vlessBtnCopy: "复制连接密钥",
      vlessBtnCopied: "已复制到剪贴板",
      vlessLinkTitle: "VLESS 连接密钥 (URL)",
      vlessClientTitle: "1. 下载对应客户端",
      vlessClientDesc: "请直接点击下载我们为您整理好的绿色安装包：",
      vlessWin: "Windows 客户端 (v2rayN)",
      vlessMac: "macOS 客户端 (v2rayU)",
      vlessAndroid: "安卓手机客户端 (v2rayNG)",
      vlessImportTitle: "2. 导入密钥并启动",
      vlessImportStep1: "点击上方按钮复制您的专属连接密钥。",
      vlessImportStep2: "打开已下载的客户端软件，直接按粘贴（Ctrl+V 或 Cmd+V）完成导入。",
      vlessImportStep3: "启动代理。路由模式建议选择“绕过大陆”以获得最佳国内访问速度。",
      
      // Note
      securityNote: "本服务器仅限公司内部办公及业务使用。请勿将密钥和连接信息向外公开传播。"
    },
    th: {
      title: "พอร์ทัลเครือข่ายองค์กร",
      subtitle: "การเข้าถึงระยะไกลที่ปลอดภัยสำหรับสมาชิก Chiang Mai AI Center และทีมงานระดับโลก",
      backHome: "กลับสู่หน้าแรก",
      tabIos: "iOS (iPhone/iPad)",
      tabOthers: "อุปกรณ์อื่นๆ (Windows/Mac/Android)",
      
      // L2TP Section
      l2tpTitle: "การตั้งค่าเนทีฟ Apple iOS (L2TP)",
      l2tpDesc: "ไม่ต้องติดตั้งแอปใดๆ กำหนดค่า iPhone ของคุณโดยตรงโดยใช้โปรไฟล์ที่ปลอดภัยของเรา",
      l2tpBtn: "ติดตั้งโปรไฟล์ iOS",
      l2tpStepsTitle: "ขั้นตอนการติดตั้ง",
      l2tpStep1: "คลิกปุ่มด้านบนเพื่อดาวน์โหลดโปรไฟล์ใน Safari",
      l2tpStep2: "เปิดการตั้งค่า iOS คุณจะเห็นแบนเนอร์ 'ดาวน์โหลดโปรไฟล์แล้ว' ที่ด้านบน แต้ปที่แบนเนอร์นั้น",
      l2tpStep3: "แตะ 'ติดตั้ง' ที่มุมขวาบน ป้อนรหัสผ่านของคุณ และยืนยัน",
      l2tpStep4: "ไปที่ การตั้งค่า > VPN เลือก 'L2TP VPN' และเปิดสวิตช์เพื่อเชื่อมต่อ",
      
      // VLESS Section
      vlessTitle: "การตั้งค่า VLESS Proxy",
      vlessDesc: "แนะนำสำหรับ Windows, Android และ macOS ทนต่อการบล็อกเครือข่ายด้วยความเร็วระดับพรีเมียม",
      vlessBtnCopy: "คัดลอกลิงก์การเชื่อมต่อ",
      vlessBtnCopied: "คัดลอกแล้ว!",
      vlessLinkTitle: "คีย์เชื่อมต่อ VLESS",
      vlessClientTitle: "1. ดาวน์โหลดซอฟต์แวร์ไคลเอนต์",
      vlessClientDesc: "ดาวน์โหลดไคลเอนต์โดยตรงจากพื้นที่ทำงานของบริษัทและติดตั้ง:",
      vlessWin: "ไคลเอนต์ Windows",
      vlessMac: "ไคลเอนต์ macOS",
      vlessAndroid: "ไคลเอนต์ Android",
      vlessImportTitle: "2. นำเข้าและเชื่อมต่อ",
      vlessImportStep1: "รับคีย์เชื่อมต่อ VLESS ส่วนตัวของคุณจากผู้ดูแลระบบ",
      vlessImportStep2: "เปิดไคลเอนต์ที่คุณดาวน์โหลด กดวาง (Ctrl+V หรือ Cmd+V) เพื่อนำเข้า",
      vlessImportStep3: "เริ่มการเชื่อมต่อ เลือก 'เส้นทาง: เลี่ยงผ่านจีนแผ่นดินใหญ่' เพื่อการกำหนดเส้นทางที่ดีที่สุด",
      
      // Note
      securityNote: "เซิร์ฟเวอร์นี้ใช้สำหรับการดำเนินธุรกิจขององค์กรเท่านั้น โปรดอย่าแชร์ข้อมูลประจำตัวเหล่านี้ต่อสาธารณะ"
    },
    ja: {
      title: "社内ネットワークポータル",
      subtitle: "チェンマイ AI センターのメンバーおよびグローバルリモートチームのための安全なリモートアクセス。",
      backHome: "ホームに戻る",
      tabIos: "iOS (iPhone/iPad)",
      tabOthers: "その他のデバイス (Windows/Mac/Android)",
      
      // L2TP Section
      l2tpTitle: "Apple iOS ネイティブ設定 (L2TP)",
      l2tpDesc: "アプリのインストールは不要です。安全なプロファイルを使用してiPhoneを直接設定します。",
      l2tpBtn: "iOS プロファイルをインストール",
      l2tpStepsTitle: "インストール手順",
      l2tpStep1: "上のボタンをクリックして、Safariでプロファイルをダウンロードします。",
      l2tpStep2: "iOSの「設定」を開きます。上部に「プロファイルがダウンロードされました」というバナーが表示されるので、タップします。",
      l2tpStep3: "右上の「インストール」をタップし、パスコードを入力して確認します。",
      l2tpStep4: "設定 > VPN に移動し、「L2TP VPN」を選択してスイッチをオンにします。",
      
      // VLESS Section
      vlessTitle: "セキュア VLESS プロキシ設定",
      vlessDesc: "Windows、Android、macOSに推奨。接続制限に強く、高速な通信品質を提供します。",
      vlessBtnCopy: "接続リンクをコピー",
      vlessBtnCopied: "コピー完了!",
      vlessLinkTitle: "VLESS 接続キー",
      vlessClientTitle: "1. クライアントソフトのダウンロード",
      vlessClientDesc: "社内の共有フォルダからクライアントを直接ダウンロードしてインストールします：",
      vlessWin: "Windows用クライアント",
      vlessMac: "macOS用クライアント",
      vlessAndroid: "Android用クライアント",
      vlessImportTitle: "2. インポートと接続",
      vlessImportStep1: "管理者から個別のVLESS接続キーを取得し、コピーします。",
      vlessImportStep2: "ダウンロードしたクライアントを開き、貼り付け（Ctrl+VまたはCmd+V）してインポートします。",
      vlessImportStep3: "接続を開始します。最適なルーティングのために「中国本土をバイパス」を選択してください。",
      
      // Note
      securityNote: "このサーバーは社内ビジネス専用です。接続情報を公に共有しないでください。"
    }
  };

  const t = (key: keyof typeof localDict.en): string => {
    const activeLang = (language as Language) || "en";
    const dict = localDict[activeLang] || localDict.en;
    return dict[key] || localDict.en[key];
  };

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "th", label: "ไทย" },
    { code: "ja", label: "日本語" },
  ];

  const currentLanguageLabel = languages.find((l) => l.code === language)?.label || "English";



  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans antialiased text-neutral-900 dark:text-neutral-100 animate-fadeIn">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-900 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1.5 text-neutral-900 dark:text-white font-bold tracking-widest uppercase">
            CMAI<span className="text-neutral-400 font-light">.</span>
          </a>
          
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600 text-[12px] font-medium transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLanguageLabel}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-36 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-20"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-[12px] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
                            language === lang.code
                              ? "text-neutral-950 dark:text-white font-semibold bg-neutral-50 dark:bg-neutral-900"
                              : "text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <a 
              href="/" 
              className="flex items-center gap-1 text-[13px] font-medium text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("backHome")}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Branded Section Title */}
          <div className="text-center mb-12 animate-slideUp">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3">
              <Lock className="w-3 h-3 text-neutral-500" />
              Secure Network Portal
            </div>
            <h1 className="text-3xl font-bold font-sans tracking-tight text-neutral-950 dark:text-white mb-3">
              {t("title")}
            </h1>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="space-y-10">
            {/* 1. iOS Section */}
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-950 dark:text-white">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
                    {t("l2tpTitle")}
                  </h2>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {t("l2tpDesc")}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800/60 pt-6">
                {/* Download Button */}
                <div className="flex justify-center mb-8">
                  <a 
                    href="/vpnclient.mobileconfig" 
                    download
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-full font-medium text-[14px] transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {t("l2tpBtn")}
                  </a>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4">
                    {t("l2tpStepsTitle")}
                  </h3>
                  <ol className="space-y-4">
                    {[t("l2tpStep1"), t("l2tpStep2"), t("l2tpStep3"), t("l2tpStep4")].map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-350">
                        <span className="flex-shrink-0 flex items-center justify-center w-5.5 h-5.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* 2. Others Section */}
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-950 dark:text-white">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
                    {t("vlessTitle")}
                  </h2>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {t("vlessDesc")}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800/60 pt-6 space-y-6">
                {/* VLESS Key Notice */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    {t("vlessLinkTitle")}
                  </label>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800">
                    <Info className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {language === "zh" && "为保障安全及实行设备数/流量限制，连接密钥已改为单人单号分发，请直接联系 IT 负责人或 HR 索取您的专属 VLESS 连接密钥。"}
                      {language === "en" && "To ensure security and enforce device limits, connection keys are issued individually. Please contact the IT administrator or HR to request your personal VLESS connection link."}
                      {language === "th" && "เพื่อความปลอดภัยและการจำกัดจำนวนอุปกรณ์ คีย์เชื่อมต่อจะถูกแจกจ่ายแบบรายบุคคล โปรดติดต่อผู้ดูแลระบบ IT หรือฝ่ายบุคคลเพื่อขอลิงก์ VLESS ส่วนตัวของคุณ"}
                      {language === "ja" && "セキュリティとデバイス数制限を確保するため、接続キーは個別に発行されます。個人用VLESS接続リンクを取得するには、IT管理者または人事（HR）にお問い合わせください。"}
                    </div>
                  </div>
                </div>

                {/* Clients Download */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                    {t("vlessClientTitle")}
                  </h3>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-4">
                    {t("vlessClientDesc")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href="https://github.com/2dust/v2rayN/releases/download/6.53/v2rayN-With-Core.zip"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-[13px] font-medium transition-all hover:shadow-sm"
                    >
                      <span>{t("vlessWin")}</span>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                    <a
                      href="https://github.com/yanue/V2rayU/releases/download/v3.8.0/V2rayU-64.dmg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-[13px] font-medium transition-all hover:shadow-sm"
                    >
                      <span>{t("vlessMac")}</span>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                    <a
                      href="https://github.com/2dust/v2rayNG/releases/download/1.9.1/v2rayNG_1.9.1_arm64-v8a.apk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-[13px] font-medium transition-all hover:shadow-sm"
                    >
                      <span>{t("vlessAndroid")}</span>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                  </div>
                </div>

                {/* Import Instructions */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                    {t("vlessImportTitle")}
                  </h3>
                  <ol className="space-y-3">
                    {[t("vlessImportStep1"), t("vlessImportStep2"), t("vlessImportStep3")].map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-350">
                        <span className="flex-shrink-0 flex items-center justify-center w-5.5 h-5.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Banner */}
          <div className="mt-10 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-600/90 dark:text-amber-400/90 text-xs flex gap-3 leading-relaxed">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{t("securityNote")}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-neutral-200/50 dark:border-neutral-900 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center text-[12px] text-neutral-400">
          &copy; {new Date().getFullYear()} Chiang Mai AI Center. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
