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
      
      // Cisco AnyConnect Section
      ciscoTitle: "Apple iOS Setup (Cisco AnyConnect)",
      ciscoDesc: "Directly download the official client from the China App Store. No foreign Apple ID required.",
      ciscoBtn: "Search on App Store",
      ciscoStepsTitle: "Setup & Connection Steps",
      ciscoStep1: "Click the button above to go to the App Store, or search and download 'Cisco Secure Client'.",
      ciscoStep2: "Open the app, go to the 'Settings' (设置) tab, and turn OFF 'Block Untrusted Servers' (阻止不受信任的服务器). This is required to allow our secure self-signed connection.",
      ciscoStep3: "Go to the 'Home' (主页) tab, tap 'Connections' → 'Add VPN Connection'. Set Description to 'CMAI' and Server Address to: 52.220.132.229:4443.",
      ciscoStep4: "Go back to Home and toggle the 'AnyConnect VPN' switch. Tap 'Continue' on the certificate prompt, then enter the username and password provided by the administrator.",
      
      // VLESS Section
      vlessTitle: "Secure VLESS Proxy Setup",
      vlessDesc: "Recommended for Windows, Android, and macOS. Resilient to network blocks with premium speed.",
      vlessBtnCopy: "Copy Connection Link",
      vlessBtnCopied: "Copied!",
      vlessLinkTitle: "VLESS Connection Key",
      vlessClientTitle: "1. Download Client Software",
      vlessClientDesc: "Download the client directly from our company workspace and install it:",
      vlessWin: "Windows Client",
      vlessMacSilicon: "macOS (Apple Silicon M1/M2/M3)",
      vlessMacIntel: "macOS (Intel Chip)",
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
      
      // Cisco AnyConnect Section
      ciscoTitle: "苹果 iOS 系统配置指南 (思科 AnyConnect)",
      ciscoDesc: "免换号！直接在国区 App Store 下载思科官方客户端，使用个人账号密码极速连接。",
      ciscoBtn: "在 App Store 中查看",
      ciscoStepsTitle: "配置与连接步骤说明",
      ciscoStep1: "点击上方按钮（或在 App Store 中搜索）下载官方「Cisco Secure Client」客户端。",
      ciscoStep2: "打开 App，点击底部的「设置」选项卡，务必将「阻止不受信任的服务器」关闭（设为灰色）。这是连接自签安全证书的必要操作。",
      ciscoStep3: "点击底部的「主页」选项卡，点击「连接」 → 「添加 VPN 连接」，说明填写「CMAI」，服务器地址填写：52.220.132.229:4443 并保存。",
      ciscoStep4: "返回主页，开启「AnyConnect VPN」开关。若弹出证书警告请选择「继续 (Continue)」，然后依次输入您的用户名和密码即可连接成功！",
      
      // VLESS Section
      vlessTitle: "高性能 VLESS 加密代理配置",
      vlessDesc: "推荐 Windows、Android 及 macOS 用户使用。采用 REALITY 伪装技术，防封锁能力极强，速度更快。",
      vlessBtnCopy: "复制连接密钥",
      vlessBtnCopied: "已复制到剪贴板",
      vlessLinkTitle: "VLESS 连接密钥 (URL)",
      vlessClientTitle: "1. 下载对应客户端",
      vlessClientDesc: "请直接点击下载我们为您整理好的绿色安装包：",
      vlessWin: "Windows 客户端 (v2rayN)",
      vlessMacSilicon: "macOS 客户端 (Apple M芯片)",
      vlessMacIntel: "macOS 客户端 (Intel芯片)",
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
      
      // Cisco AnyConnect Section
      ciscoTitle: "การตั้งค่า iOS (Cisco AnyConnect)",
      ciscoDesc: "ดาวน์โหลดจาก App Store ไทยได้โดยตรง ไม่ต้องเปลี่ยน Apple ID ใช้รหัสผ่านส่วนตัวเชื่อมต่อได้ทันที",
      ciscoBtn: "ดูบน App Store",
      ciscoStepsTitle: "ขั้นตอนการตั้งค่าและการเชื่อมต่อ",
      ciscoStep1: "คลิกปุ่มด้านบนหรือค้นหา 'Cisco Secure Client' ใน App Store เพื่อดาวน์โหลด",
      ciscoStep2: "เปิดแอป แตะแท็บ 'การตั้งค่า' (Settings) และปิด 'Block Untrusted Servers' (บล็อกเซิร์ฟเวอร์ที่ไม่น่าเชื่อถือ) ซึ่งจำเป็นสำหรับการอนุญาตใบรับรองความปลอดภัย",
      ciscoStep3: "แตะแท็บ 'หน้าแรก' (Home) คลิก 'Connections' → 'Add VPN Connection' ตั้งชื่อเป็น 'CMAI' และกรอก Server Address: 52.220.132.229:4443",
      ciscoStep4: "กลับไปที่หน้าแรกและเปิดสวิตช์ 'AnyConnect VPN' คลิก 'Continue' เมื่อมีคำเตือนใบรับรอง จากนั้นป้อนชื่อผู้ใช้และรหัสผ่านของคุณ",
      
      // VLESS Section
      vlessTitle: "การตั้งค่า VLESS Proxy",
      vlessDesc: "แนะนำสำหรับ Windows, Android และ macOS ทนต่อการบล็อกเครือข่ายด้วยความเร็วระดับพรีเมียม",
      vlessBtnCopy: "คัดลอกลิงก์การเชื่อมต่อ",
      vlessBtnCopied: "คัดลอกแล้ว!",
      vlessLinkTitle: "คีย์เชื่อมต่อ VLESS",
      vlessClientTitle: "1. ดาวน์โหลดซอฟต์แวร์ไคลเอนต์",
      vlessClientDesc: "ดาวน์โหลดไคลเอนต์โดยตรงจากพื้นที่ทำงานของบริษัทและติดตั้ง:",
      vlessWin: "ไคลเอนต์ Windows",
      vlessMacSilicon: "macOS (Apple Silicon M1/M2/M3)",
      vlessMacIntel: "macOS (Intel Chip)",
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
      
      // Cisco AnyConnect Section
      ciscoTitle: "iOS 設定ガイド (Cisco AnyConnect)",
      ciscoDesc: "日本の App Store から直接ダウンロード可能！海外の Apple ID 不要、ユーザー名とパスワードで即座に接続できます。",
      ciscoBtn: "App Store で表示",
      ciscoStepsTitle: "セットアップと接続手順",
      ciscoStep1: "上のボタンをクリックするか、App Store で「Cisco Secure Client」を検索してダウンロードします。",
      ciscoStep2: "アプリを開き、下部の「設定」タブで「信頼されていないサーバーをブロック」をオフ（無効）にしてください。自己署名証明書での接続に必要です。",
      ciscoStep3: "「ホーム」タブに戻り、「接続」 → 「VPN接続の追加」をタップします。説明に「CMAI」、サーバーアドレスに「52.220.132.229:4443」を入力して保存します。",
      ciscoStep4: "ホーム画面に戻り、「AnyConnect VPN」のスイッチをオンにします。証明書の警告が表示されたら「続行」をタップし、ユーザー名とパスワードを入力します。",
      
      // VLESS Section
      vlessTitle: "セキュア VLESS プロキシ設定",
      vlessDesc: "Windows、Android、macOSに推奨。接続制限に強く、高速な通信品質を提供します。",
      vlessBtnCopy: "接続リンクをコピー",
      vlessBtnCopied: "コピー完了!",
      vlessLinkTitle: "VLESS 接続キー",
      vlessClientTitle: "1. クライアントソフトのダウンロード",
      vlessClientDesc: "社内の共有フォルダからクライアントを直接ダウンロードしてインストールします：",
      vlessWin: "Windows用クライアント",
      vlessMacSilicon: "macOS用 (Apple Silicon M芯片)",
      vlessMacIntel: "macOS用 (Intel芯片)",
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
          <a href="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="CMAI Logo"
              className="h-8 w-auto object-contain dark:invert"
            />
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
                    {t("ciscoTitle")}
                  </h2>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {t("ciscoDesc")}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800/60 pt-6">
                {/* App Store & Android Download Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <a 
                    href="https://apps.apple.com/app/cisco-secure-client/id1135134354" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-full font-medium text-[14px] transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {t("ciscoBtn")}
                  </a>
                  <a 
                    href="https://ghproxy.net/https://raw.githubusercontent.com/mdmoto/cmai/main/installers/openconnect.apk" 
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-full font-medium text-[14px] transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {language === "zh" ? "安卓思科兼容客户端下载 (OpenConnect APK)" : "Download Android OpenConnect APK"}
                  </a>
                </div>

                {/* Steps */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4">
                    {t("ciscoStepsTitle")}
                  </h3>
                  <ol className="space-y-4">
                    {[t("ciscoStep1"), t("ciscoStep2"), t("ciscoStep3"), t("ciscoStep4")].map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-350">
                        <span className="flex-shrink-0 flex items-center justify-center w-5.5 h-5.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Visual Guide Screenshots */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-neutral-100 dark:border-neutral-800/60 pt-8">
                  <div className="space-y-3">
                    <p className="text-[12px] font-semibold text-neutral-500 text-center">步骤 2：关闭「阻止不受信任的服务器」 / Turn OFF Untrusted Blocker</p>
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-[240px] mx-auto bg-neutral-50 dark:bg-neutral-950 p-1">
                      <img src="/cisco_settings.png" alt="Settings Guide" className="w-full h-auto rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[12px] font-semibold text-neutral-500 text-center">步骤 4：主页开启连接并输入用户名密码 / Start Connection on Home</p>
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-[240px] mx-auto bg-neutral-50 dark:bg-neutral-950 p-1">
                      <img src="/cisco_main.png" alt="Main Guide" className="w-full h-auto rounded-xl" />
                    </div>
                  </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="https://ghproxy.net/https://github.com/2dust/v2rayN/releases/download/7.23.3/v2rayN-windows-64-desktop.zip"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-[13px] font-medium transition-all hover:shadow-sm"
                    >
                      <span>{t("vlessWin")} (Windows)</span>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                    <a
                      href="https://ghproxy.net/https://github.com/hiddify/hiddify-app/releases/download/v4.1.1/Hiddify-Android-arm64.apk"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-[13px] font-medium transition-all hover:shadow-sm"
                    >
                      <span>{t("vlessAndroid")} (Android Hiddify 推荐)</span>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                    <a
                      href="https://ghproxy.net/https://github.com/yanue/V2rayU/releases/download/v5.1.0/V2rayU-arm64.dmg"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-[13px] font-medium transition-all hover:shadow-sm"
                    >
                      <span>{t("vlessMacSilicon")}</span>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                    <a
                      href="https://ghproxy.net/https://github.com/yanue/V2rayU/releases/download/v5.1.0/V2rayU-64.dmg"
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-[13px] font-medium transition-all hover:shadow-sm"
                    >
                      <span>{t("vlessMacIntel")}</span>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                  </div>
                </div>

                {/* Import Instructions */}
                <div className="space-y-6">
                  <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {t("vlessImportTitle")}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Android Guide */}
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                      <h4 className="text-[13px] font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        安卓手机极简连接步骤 (Hiddify 推荐)
                      </h4>
                      <ol className="space-y-3 text-[12.5px] leading-relaxed text-neutral-600 dark:text-neutral-450">
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">1.</span>
                          <span>复制管理员发给您的 VLESS 链接。</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">2.</span>
                          <span>打开 **Hiddify** 软件，点击屏幕上方的 **「从剪贴板导入」** (或点击右上角「+」选择从剪贴板添加)。</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">3.</span>
                          <span>导入成功后，直接点击屏幕中央硕大的 **圆形按钮**。</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">4.</span>
                          <span>当圆形按钮变为 **绿色** 且显示 **已连接 (Connected)** 时，即代表连接成功！</span>
                        </li>
                      </ol>
                    </div>

                    {/* Windows Guide */}
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                      <h4 className="text-[13px] font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Windows 电脑连接步骤 / Windows Setup Guide
                      </h4>
                      <ol className="space-y-3 text-[12.5px] leading-relaxed text-neutral-600 dark:text-neutral-450">
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">1.</span>
                          <span>复制管理员发给您的 VLESS 链接。</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">2.</span>
                          <span>打开 **v2rayN** 软件，在主界面按 **`Ctrl+V`** 键即可导入。</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">3.</span>
                          <span>在列表中右键点击该节点，选择 **「设为活动服务器」**。</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">4.</span>
                          <span>在桌面右下角系统托盘中，右键点击 v2rayN 蓝/红图标。</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-neutral-900 dark:text-white">5.</span>
                          <span>选择 **「系统代理」** → **「自动配置系统代理」** 即可开启代理。</span>
                        </li>
                      </ol>
                    </div>
                  </div>
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
