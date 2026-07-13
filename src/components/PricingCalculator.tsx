"use client";

import React, { useState, useEffect } from "react";
import { useTranslation, Language } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Calculator,
  ArrowRight,
  Shield,
  Building,
  Wifi,
  Scale,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  UserCheck,
} from "lucide-react";

interface ServiceItem {
  id: string;
  nameKey: string;
  basePrice: number; // For Private Office or Meeting Room, this is S size
  mPrice?: number;
  lPrice?: number;
  confPrice?: number; // For Conference Room
  unitKey: string;
  isMonthly: boolean;
  notesKey: string;
  icon: React.ReactNode;
}

export default function PricingCalculator() {
  const { t, language } = useTranslation();

  // State management
  const [selected, setSelected] = useState<Record<string, boolean>>({
    private_office: false,
    shared_office: false,
    dedicated_vpn: false,
    shared_vpn: false,
    virtual_address: false,
    mail_handling: false,
    company_registration: false,
    shareholder_matching: false,
    bank_account: false,
    accounting_agent: false,
    annual_audit: false,
    visa_support: false,
    meeting_rental: false,
    corporate_affiliation: false,
  });

  const [officeSize, setOfficeSize] = useState<"s" | "m" | "l">("s");
  const [meetingRoomType, setMeetingRoomType] = useState<"s" | "m" | "l" | "conf">("s");
  const [meetingHours, setMeetingHours] = useState<number>(1);
  const [visaEmployees, setVisaEmployees] = useState<number>(1);
  const [duration, setDuration] = useState<number>(1);
  const [warningMessage, setWarningMessage] = useState<string>("");

  const items: ServiceItem[] = [
    {
      id: "private_office",
      nameKey: "servicesPrivateOffices",
      basePrice: 5000,
      mPrice: 7500,
      lPrice: 10000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "尊享独立高档办公空间。租用即免费赠送专属 IP VPN（支持 2 台设备）。",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "shared_office",
      nameKey: "servicesSharedOffice",
      basePrice: 3000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "共享移动办公工位。租用即免费赠送专属 IP VPN（支持 1 台设备）。",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "virtual_address",
      nameKey: "servicesBusinessAddress",
      basePrice: 1000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "提供合规的清迈核心商区注册地址。租用即免费赠送共享 IP VPN。",
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: "dedicated_vpn",
      nameKey: "servicesDedicatedIp",
      basePrice: 600,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "专为 TikTok、Lazada、Facebook 等跨境电商业务防封定制的独立住宅 IP。办公空间租户免费享用。",
      icon: <Wifi className="w-4 h-4" />,
    },
    {
      id: "shared_vpn",
      nameKey: "servicesSharedVpn",
      basePrice: 200,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "高速共享 IP 安全上网通道。虚拟办公室租户免费享用。",
      icon: <Wifi className="w-4 h-4" />,
    },
    {
      id: "mail_handling",
      nameKey: "servicesMailHandling",
      basePrice: 500,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "代收商业信件与快递包裹并提供通知。办公空间或虚拟地址租户免费尊享。",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "company_registration",
      nameKey: "servicesRegistration",
      basePrice: 30000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "泰国合规公司设立注册一站式代办。需租赁独立/共享/虚拟办公空间（租期 12 个月起），服务费享 7 折特惠。",
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: "shareholder_matching",
      nameKey: "servicesShareholder",
      basePrice: 50000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "依照泰国法律，为合资企业依法合规撮合泰国本土合作股东。",
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: "bank_account",
      nameKey: "servicesBankAccount",
      basePrice: 20000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "泰国主流商业银行公司开户认证代办。需租用独立办公室或共享办公室（租期 12 个月起），代办费享 7 折特惠。",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "accounting_agent",
      nameKey: "servicesAccounting",
      basePrice: 3000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "包含每月发票账目整理、代账以及合规税务申报申报代办。",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "annual_audit",
      nameKey: "servicesAudit",
      basePrice: 15000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "包含年度审计报告出具，以及官方公司年审申报代办。",
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: "visa_support",
      nameKey: "servicesVisaSupport",
      basePrice: 20000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "协助外籍团队成员办理在泰合法的 Non-B 工作签证与全套工作准证（按人数计费）。",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: "meeting_rental",
      nameKey: "servicesMeetingRental",
      basePrice: 200, // S
      mPrice: 400,   // M
      lPrice: 600,   // L
      confPrice: 1000, // Conference
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "独立会客空间及中大型会议厅临时小时预约租用（本服务与长期办公及公司注册等入驻服务互斥）。",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "corporate_affiliation",
      nameKey: "servicesAffiliation",
      basePrice: 23000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "挂靠我们已成立的泰国合规本土公司开展本地业务与电商开店（如 TikTok, Lazada 等）。月租 ฿23,000，押金 2 个月，支持按月结束挂靠，机动灵活。",
      icon: <Building className="w-4 h-4" />,
    },
  ];

  // Translations for new items
  const customTranslations: Record<string, Record<Language, string>> = {
    servicesSharedOffice: {
      en: "Shared Workspace (Hot Desk)",
      zh: "共享办公室 (热租工位)",
      th: "พื้นที่ทำงานร่วมกัน (Hot Desk)",
      ja: "コワーキングスペース (フリーアドレス)",
    },
    servicesSharedVpn: {
      en: "Shared IP VPN Service",
      zh: "共享 IP 的 VPN 服务",
      th: "บริการ VPN แบบ IP ร่วม",
      ja: "共有IPのVPNサービス",
    },
    servicesShareholder: {
      en: "Thai Shareholder Matching",
      zh: "泰国股东配套撮合",
      th: "บริการจัดหาผู้ถือหุ้นไทย",
      ja: "タイ人株主マッチングサービス",
    },
    servicesBankAccount: {
      en: "Bank Account Certification",
      zh: "商业银行开户认证",
      th: "บริการเปิดบัญชีธนาคาร",
      ja: "法人銀行口座開設サポート",
    },
    servicesAccounting: {
      en: "Corporate Bookkeeping / Tax",
      zh: "财务代理服务",
      th: "บริการทำบัญชีและยื่นภาษีรายเดือน",
      ja: "財務・会計代理業務",
    },
    servicesAudit: {
      en: "Annual Fiscal Review / Audit",
      zh: "公司年度审计与年审",
      th: "การตรวจสอบและยื่นงบการเงินประจำปี",
      ja: "年次決算監査・年審業務",
    },
  };

  const getItemName = (item: ServiceItem) => {
    if (customTranslations[item.nameKey]) {
      return customTranslations[item.nameKey][language as Language] || customTranslations[item.nameKey].en;
    }
    return t(item.nameKey);
  };

  // Helper to handle selection changes incorporating all business logic rules
  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      setWarningMessage("");

      // 0. Hourly Meeting & Lounge Rental Mutex (Item 13)
      if (id === "meeting_rental" && next.meeting_rental) {
        // If hourly rental is selected, deselect all other long-term/one-time items
        Object.keys(next).forEach((key) => {
          if (key !== "meeting_rental") {
            next[key] = false;
          }
        });
      } else if (id !== "meeting_rental" && next[id]) {
        // If any other service is selected, deselect hourly meeting rental
        next.meeting_rental = false;
      }

      // 0.1 Corporate Affiliation Mutex
      if (id === "corporate_affiliation" && next.corporate_affiliation) {
        // Affiliation is mutually exclusive with registering one's own company items
        next.company_registration = false;
        next.shareholder_matching = false;
        next.bank_account = false;
        next.accounting_agent = false;
        next.annual_audit = false;
        next.virtual_address = false;
      } else if (next.corporate_affiliation && (
        id === "company_registration" ||
        id === "shareholder_matching" ||
        id === "bank_account" ||
        id === "accounting_agent" ||
        id === "annual_audit" ||
        id === "virtual_address"
      )) {
        if (next[id]) {
          next.corporate_affiliation = false;
        }
      }

      // 1. Group A Workspace Mutual Exclusion (1, 2, 5)
      if (id === "private_office" && next.private_office) {
        next.shared_office = false;
        next.virtual_address = false;
      }
      if (id === "shared_office" && next.shared_office) {
        next.private_office = false;
        next.virtual_address = false;
      }
      if (id === "virtual_address" && next.virtual_address) {
        next.private_office = false;
        next.shared_office = false;
      }

      // 2. Group B VPN Mutual Exclusion (3, 4)
      if (id === "dedicated_vpn" && next.dedicated_vpn) {
        next.shared_vpn = false;
      }
      if (id === "shared_vpn" && next.shared_vpn) {
        next.dedicated_vpn = false;
      }

      // 3. Auto-bundle logic for VPN based on workspace selection (Rule 3)
      if (next.private_office || next.shared_office) {
        // Renting 1 or 2 grants free Dedicated VPN (3)
        next.dedicated_vpn = true;
        next.shared_vpn = false;
      } else if (next.virtual_address) {
        // Renting 5 grants free Shared VPN (4)
        next.shared_vpn = true;
        next.dedicated_vpn = false;
      }

      // 4. Company Registration (Item 7) constraints
      if (next.company_registration) {
        // Must select one of workspace 1, 2, or 5
        if (!next.private_office && !next.shared_office && !next.virtual_address) {
          // Auto-select Private Office as default workspace
          next.private_office = true;
          next.shared_office = false;
          next.virtual_address = false;
          // Apply its free VPN bundle
          next.dedicated_vpn = true;
          next.shared_vpn = false;
          setWarningMessage(t("pricingOfficeSelectionRequired"));
        }
        setDuration((prevD) => Math.max(12, prevD));
      }

      // 5. Bank Account (Item 9) constraints
      if (next.bank_account) {
        // Must select one of workspace 1 or 2 (virtual address not allowed)
        if (!next.private_office && !next.shared_office) {
          next.private_office = true;
          next.shared_office = false;
          next.virtual_address = false;
          // Apply its free VPN bundle
          next.dedicated_vpn = true;
          next.shared_vpn = false;
          setWarningMessage(t("pricingOfficeRequiredForBank"));
        }
        setDuration((prevD) => Math.max(12, prevD));
      }

      return next;
    });
  };

  // Keep constraints in sync when workspace selections change or duration slider is moved
  useEffect(() => {
    if (selected.company_registration || selected.bank_account) {
      if (duration < 12) {
        setDuration(12);
      }
    }
  }, [selected.company_registration, selected.bank_account, duration]);

  // Calculations
  const hasWorkspaceSelected = selected.private_office || selected.shared_office || selected.virtual_address;
  const hasOfficeSelected = selected.private_office || selected.shared_office;

  // 1. Mail Handling (6) is free if 1, 2, or 5 is selected
  const isMailFree = selected.mail_handling && hasWorkspaceSelected;

  // 2. Company Registration (7) Discounted if 1, 2, 5 selected
  const registrationCost = selected.company_registration
    ? 30000 * (hasWorkspaceSelected ? 0.7 : 1)
    : 0;

  // 3. Bank Account (9) Discounted if 1 or 2 selected
  const bankAccountCost = selected.bank_account
    ? 20000 * (hasOfficeSelected ? 0.7 : 1)
    : 0;

  // 4. VPN Bundling discounts (Revised logic):
  // - Private office (1) -> Dedicated VPN (3) is FREE (includes 2 devices)
  // - Shared office (2) -> Dedicated VPN (3) is FREE (includes 1 device)
  // - Virtual address (5) -> Shared VPN (4) is FREE (includes 1 connection)
  // - Under Company Reg (7) or Bank (9): bundles Shared VPN for free, or Dedicated VPN for 300.
  //   But if they already rent office 1 or 2, they get Dedicated VPN for FREE (which is even better!).
  const hasVpnPromo = selected.company_registration || selected.bank_account;
  let vpnCost = 0;

  if (selected.shared_vpn) {
    if (selected.virtual_address || hasVpnPromo) {
      vpnCost = 0; // Free
    } else {
      vpnCost = 200;
    }
  } else if (selected.dedicated_vpn) {
    if (selected.private_office || selected.shared_office) {
      vpnCost = 0; // Free
    } else if (hasVpnPromo) {
      vpnCost = 300; // Promo price under registration/banking bundle
    } else {
      vpnCost = 600;
    }
  }

  // 5. Private Office Pricing based on size S, M, L
  let officeCost = 0;
  if (selected.private_office) {
    if (officeSize === "s") officeCost = 5000;
    else if (officeSize === "m") officeCost = 7500;
    else if (officeSize === "l") officeCost = 10000;
  }

  // 6. Meeting Room Hour-based pricing
  let hourlyRate = 200;
  if (meetingRoomType === "m") hourlyRate = 400;
  else if (meetingRoomType === "l") hourlyRate = 600;
  else if (meetingRoomType === "conf") hourlyRate = 1000;

  const meetingTotalCost = selected.meeting_rental ? hourlyRate * meetingHours : 0;

  // 7. Visa Support calculations based on number of employees
  const visaTotalCost = selected.visa_support ? 20000 * visaEmployees : 0;

  // Calculate Subtotals
  let monthlySubtotal = 0;
  monthlySubtotal += officeCost;
  if (selected.shared_office) monthlySubtotal += 3000;
  if (selected.virtual_address) monthlySubtotal += 1000;
  monthlySubtotal += vpnCost;
  if (selected.mail_handling && !isMailFree) monthlySubtotal += 500;
  if (selected.accounting_agent) monthlySubtotal += 3000;
  if (selected.corporate_affiliation) monthlySubtotal += 23000;

  let oneTimeSubtotal = 0;
  oneTimeSubtotal += registrationCost;
  if (selected.shareholder_matching) oneTimeSubtotal += 50000;
  oneTimeSubtotal += bankAccountCost;
  if (selected.annual_audit) oneTimeSubtotal += 15000;
  oneTimeSubtotal += visaTotalCost;
  oneTimeSubtotal += meetingTotalCost;

  // Total Estimate calculation (Monthly multiplied by lease duration + One-Time Fees)
  const totalEstimate = (monthlySubtotal * duration) + oneTimeSubtotal;

  // Active savings list
  const activeDiscounts: string[] = [];
  if (selected.company_registration && hasWorkspaceSelected) {
    activeDiscounts.push(language === "zh" ? "公司注册服务 7 折优惠 (-¥9,000)" : "30% Discount on Company Registration");
  }
  if (selected.bank_account && hasOfficeSelected) {
    activeDiscounts.push(language === "zh" ? "银行开户认证 7 折优惠 (-¥6,000)" : "30% Discount on Bank Account");
  }
  if (isMailFree) {
    activeDiscounts.push(language === "zh" ? "邮件代收服务免费优惠 (-¥500/月)" : "Free Mail Handling Service");
  }
  if (selected.dedicated_vpn && (selected.private_office || selected.shared_office)) {
    const devNum = selected.private_office ? 2 : 1;
    activeDiscounts.push(
      language === "zh"
        ? `租用办公室免费享用专项 IP VPN (${devNum}台设备) (-¥600/月)`
        : `Free Dedicated VPN (${devNum} Dev) with Office`
    );
  } else if (selected.shared_vpn && selected.virtual_address) {
    activeDiscounts.push(
      language === "zh" ? "租虚拟地址免费享用共享 IP VPN (-¥200/月)" : "Free Shared VPN with Virtual Address"
    );
  } else if (hasVpnPromo) {
    if (selected.shared_vpn) {
      activeDiscounts.push(language === "zh" ? "赠送共享 IP VPN 免费服务 (-¥200/月)" : "Bundled Free Shared VPN");
    } else if (selected.dedicated_vpn) {
      activeDiscounts.push(language === "zh" ? "专属 IP VPN 升级特惠 300/月 (-¥300/月)" : "Upgraded Dedicated VPN Promo Price");
    }
  }

  // Pre-fill contact form with quote details
  const handleInquireQuote = () => {
    let quoteText = ``;
    if (language === "zh") {
      quoteText = `您好，我从网站估算了配置报价，预算详情如下：\n`;
      quoteText += `-------------------------------------\n`;
      if (selected.private_office) quoteText += `- 独立办公室 (${officeSize.toUpperCase()} 户型): ฿${officeCost}/月\n`;
      if (selected.shared_office) quoteText += `- 共享办公室 (热租工位): ฿3,000/月\n`;
      if (selected.virtual_address) quoteText += `- 虚拟商区地址: ฿1,000/月\n`;
      if (selected.corporate_affiliation) quoteText += `- 泰国公司资质挂靠与托管运营: ฿23,000/月\n`;
      if (selected.shared_vpn) quoteText += `- 共享 IP VPN 服务: ฿${selected.virtual_address || hasVpnPromo ? "0 (赠送)" : "200"}/月\n`;
      if (selected.dedicated_vpn) {
        const devNum = selected.private_office ? "2台设备, 赠送" : selected.shared_office ? "1台设备, 赠送" : hasVpnPromo ? "特惠 300" : "600";
        quoteText += `- 专属 IP VPN 服务: ฿${devNum}/月\n`;
      }
      if (selected.mail_handling) quoteText += `- 邮件包裹代收: ฿${isMailFree ? "0 (赠送)" : "500"}/月\n`;
      if (selected.company_registration) quoteText += `- 泰国公司设立注册: ฿${registrationCost} (已折)\n`;
      if (selected.shareholder_matching) quoteText += `- 泰国股东配套撮合: ฿50,000 (一次性)\n`;
      if (selected.bank_account) quoteText += `- 商业银行开户认证: ฿${bankAccountCost} (已折)\n`;
      if (selected.accounting_agent) quoteText += `- 财务代理报税服务: ฿3,000/月\n`;
      if (selected.annual_audit) quoteText += `- 公司年审审计服务: ฿15,000 (一次性)\n`;
      if (selected.visa_support) quoteText += `- 泰国工作签证与工作准证 (${visaEmployees} 人): ฿${visaTotalCost} (一次性)\n`;
      if (selected.meeting_rental) {
        const typeLabel = meetingRoomType === "conf" ? "智能会议室" : `独立会客室 ${meetingRoomType.toUpperCase()}`;
        quoteText += `- ${typeLabel} 租用 (${meetingHours} 小时): ฿${meetingTotalCost} (一次性)\n`;
      }
      quoteText += `-------------------------------------\n`;
      quoteText += `租期时长: ${duration} 个月\n`;
      quoteText += `月度租金总计: ฿${monthlySubtotal.toLocaleString()}/月\n`;
      quoteText += `一次性设立费用小计: ฿${oneTimeSubtotal.toLocaleString()}\n`;
      quoteText += `预估报价合计金额: ฿${totalEstimate.toLocaleString()}\n`;
    } else {
      quoteText = `Hello, I've generated an estimate from the pricing tool. Details below:\n`;
      quoteText += `-------------------------------------\n`;
      if (selected.private_office) quoteText += `- Private Office (Size ${officeSize.toUpperCase()}): ฿${officeCost}/mo\n`;
      if (selected.shared_office) quoteText += `- Shared Workspace: ฿3,000/mo\n`;
      if (selected.virtual_address) quoteText += `- Virtual Business Address: ฿1,000/mo\n`;
      if (selected.corporate_affiliation) quoteText += `- Corporate Affiliation & Credentials Hosting: ฿23,000/mo\n`;
      if (selected.shared_vpn) quoteText += `- Shared IP VPN: ฿${selected.virtual_address || hasVpnPromo ? "0 (Bundled)" : "200"}/mo\n`;
      if (selected.dedicated_vpn) {
        const descStr = selected.private_office ? "0 (Bundled 2 Dev)" : selected.shared_office ? "0 (Bundled 1 Dev)" : hasVpnPromo ? "300 (Promo)" : "600";
        quoteText += `- Dedicated IP VPN: ฿${descStr}/mo\n`;
      }
      if (selected.mail_handling) quoteText += `- Mail Handling: ฿${isMailFree ? "0 (Free)" : "500"}/mo\n`;
      if (selected.company_registration) quoteText += `- Thai Company Registration: ฿${registrationCost} (One-time)\n`;
      if (selected.shareholder_matching) quoteText += `- Shareholder Matching: ฿50,000 (One-time)\n`;
      if (selected.bank_account) quoteText += `- Bank Account Setup: ฿${bankAccountCost} (One-time)\n`;
      if (selected.accounting_agent) quoteText += `- Bookkeeping & Accounting: ฿3,000/mo\n`;
      if (selected.annual_audit) quoteText += `- Annual Audit / Review: ฿15,000 (One-time)\n`;
      if (selected.visa_support) quoteText += `- Visas & Work Permits (${visaEmployees} Pax): ฿${visaTotalCost} (One-time)\n`;
      if (selected.meeting_rental) {
        const typeLabel = meetingRoomType === "conf" ? "Conference Room" : `Guest Lounge ${meetingRoomType.toUpperCase()}`;
        quoteText += `- ${typeLabel} Rental (${meetingHours} Hr): ฿${meetingTotalCost} (One-time)\n`;
      }
      quoteText += `-------------------------------------\n`;
      quoteText += `Lease Term: ${duration} Months\n`;
      quoteText += `Monthly Fee Subtotal: ฿${monthlySubtotal.toLocaleString()}/mo\n`;
      quoteText += `One-time Fees Subtotal: ฿${oneTimeSubtotal.toLocaleString()}\n`;
      quoteText += `Total Estimate: ฿${totalEstimate.toLocaleString()}\n`;
    }

    // Insert into contact form
    const textarea = document.querySelector("#form-message") as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = quoteText;
      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    }

    // Scroll to contact form
    const target = document.querySelector("#contact");
    if (target) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="pricing" className="py-28 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="max-w-2xl mb-20">
          <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
            {t("pricingSectionTitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] dark:text-white tracking-tight">
            {t("pricingSubtitle")}
          </h2>
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400 font-light mt-3">
            {t("pricingDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Toggles & Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {warningMessage && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300 text-[13px] font-light flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}

            <div className="border border-neutral-100 dark:border-neutral-900/80 rounded-2xl overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-900/80 bg-[#fafafa] dark:bg-[#080808]">
              {items.map((item) => {
                const isSelected = selected[item.id];
                let displayPrice = item.basePrice;
                if (item.id === "private_office") {
                  if (officeSize === "s") displayPrice = 5000;
                  else if (officeSize === "m") displayPrice = 7500;
                  else if (officeSize === "l") displayPrice = 10000;
                } else if (item.id === "meeting_rental") {
                  if (meetingRoomType === "s") displayPrice = 200;
                  else if (meetingRoomType === "m") displayPrice = 400;
                  else if (meetingRoomType === "l") displayPrice = 600;
                  else if (meetingRoomType === "conf") displayPrice = 1000;
                }

                // Inline bundle pricing adjustments for display
                let adjustedPrice = displayPrice;
                let originalPrice = null;
                if (item.id === "mail_handling" && hasWorkspaceSelected && isSelected) {
                  originalPrice = 500;
                  adjustedPrice = 0;
                }
                if (item.id === "company_registration" && hasWorkspaceSelected && isSelected) {
                  originalPrice = 30000;
                  adjustedPrice = 21000;
                }
                if (item.id === "bank_account" && hasOfficeSelected && isSelected) {
                  originalPrice = 20000;
                  adjustedPrice = 14000;
                }
                if (item.id === "shared_vpn" && (selected.virtual_address || hasVpnPromo) && isSelected) {
                  originalPrice = 200;
                  adjustedPrice = 0;
                }
                if (item.id === "dedicated_vpn" && isSelected) {
                  if (selected.private_office || selected.shared_office) {
                    originalPrice = 600;
                    adjustedPrice = 0;
                  } else if (hasVpnPromo) {
                    originalPrice = 600;
                    adjustedPrice = 300;
                  }
                }

                return (
                  <div
                    key={item.id}
                    className={`p-6 transition-colors ${
                      isSelected
                        ? "bg-white dark:bg-[#121212]"
                        : "hover:bg-white/50 dark:hover:bg-[#121212]/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Checkbox and details */}
                      <div className="flex items-start gap-4 w-full">
                        <button
                          onClick={() => handleToggle(item.id)}
                          className={`mt-1 size-5 rounded-md border flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-neutral-950 dark:bg-white border-neutral-950 dark:border-white text-white dark:text-neutral-950"
                              : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="space-y-1 w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
                              {item.icon}
                            </span>
                            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                              {getItemName(item)}
                            </h4>
                          </div>

                          {/* Private Office Sub-Selector */}
                          {item.id === "private_office" && isSelected && (
                            <div className="flex items-center gap-2 pt-2">
                              {(["s", "m", "l"] as const).map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setOfficeSize(size)}
                                  className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-all ${
                                    officeSize === size
                                      ? "bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-neutral-950"
                                      : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                                  }`}
                                >
                                  {size === "s" && t("pricingOfficeSizeS")}
                                  {size === "m" && t("pricingOfficeSizeM")}
                                  {size === "l" && t("pricingOfficeSizeL")}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Visa Support Sub-Selector */}
                          {item.id === "visa_support" && isSelected && (
                            <div className="flex items-center gap-3 pt-2">
                              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                {language === "zh" ? "办理人数:" : "Number of People:"}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setVisaEmployees((prev) => Math.max(1, prev - 1))}
                                  className="w-5 h-5 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                                >
                                  -
                                </button>
                                <span className="text-xs font-semibold px-2 w-6 text-center text-neutral-800 dark:text-white">
                                  {visaEmployees}
                                </span>
                                <button
                                  onClick={() => setVisaEmployees((prev) => Math.min(20, prev + 1))}
                                  className="w-5 h-5 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Meeting Room Sub-Selector */}
                          {item.id === "meeting_rental" && isSelected && (
                            <div className="space-y-3 pt-2">
                              <div className="flex flex-wrap gap-2">
                                {(["s", "m", "l", "conf"] as const).map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setMeetingRoomType(size)}
                                    className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-all ${
                                      meetingRoomType === size
                                        ? "bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-neutral-950"
                                        : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                                    }`}
                                  >
                                    {size === "s" && `${language === "zh" ? "会客室 S" : "Lounge S"} (฿200)`}
                                    {size === "m" && `${language === "zh" ? "会客室 M" : "Lounge M"} (฿400)`}
                                    {size === "l" && `${language === "zh" ? "会客室 L" : "Lounge L"} (฿600)`}
                                    {size === "conf" && `${language === "zh" ? "会议厅" : "Conference"} (฿1000)`}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                  {language === "zh" ? "租用时长 (小时):" : "Hours to Rent:"}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setMeetingHours((prev) => Math.max(1, prev - 1))}
                                    className="w-5 h-5 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-semibold px-2 w-8 text-center text-neutral-800 dark:text-white">
                                    {meetingHours}
                                  </span>
                                  <button
                                    onClick={() => setMeetingHours((prev) => Math.min(100, prev + 1))}
                                    className="w-5 h-5 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {item.notesKey && (
                            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-light max-w-md pt-0.5 leading-relaxed">
                              {language === "zh"
                                ? item.notesKey
                                : item.id === "private_office"
                                ? "Premium private office spaces. Includes free Dedicated IP VPN (supports 2 devices)."
                                : item.id === "shared_office"
                                ? "Shared workspace hot desks. Includes free Dedicated IP VPN (supports 1 device)."
                                : item.id === "virtual_address"
                                ? "Registered corporate address in prime business district. Includes free Shared IP VPN."
                                : item.id === "dedicated_vpn"
                                ? "Dedicated clean residential IP for account protection on TikTok, Lazada, and Facebook. Included free for physical office tenants."
                                : item.id === "shared_vpn"
                                ? "High-speed shared IP secure networking channel. Included free for virtual office tenants."
                                : item.id === "mail_handling"
                                ? "Receiving and managing corporate letters/parcels with notification. Free for physical and virtual office tenants."
                                : item.id === "company_registration"
                                ? "One-stop Thai company incorporation service. Requires office rental (12-month min lease), service fee discounted by 30%."
                                : item.id === "shareholder_matching"
                                ? "Legal matching of local Thai partnership shareholders for joint ventures."
                                : item.id === "bank_account"
                                ? "Thai commercial corporate bank account setup. Requires physical office rental (12-month min lease), setup fee discounted by 30%."
                                : item.id === "accounting_agent"
                                ? "Includes monthly bookkeeping, corporate tax preparation, and local VAT filings."
                                : item.id === "annual_audit"
                                ? "Includes corporate annual audit report compilation and renewal filings."
                                : item.id === "visa_support"
                                ? "Visa and work permit applications for foreign team members in Thailand (priced per person)."
                                : item.id === "meeting_rental"
                                ? "Hourly rental of executive lounges and training conference rooms (mutually exclusive with long-term rentals)."
                                : ""}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Pricing Tag */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 justify-end">
                          {originalPrice !== null && (
                            <span className="text-[12px] text-neutral-400 dark:text-neutral-600 line-through">
                              ฿{originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                            ฿{(item.id === "visa_support" && isSelected ? visaTotalCost : item.id === "meeting_rental" && isSelected ? meetingTotalCost : adjustedPrice).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block font-light">
                          {item.id === "visa_support" && isSelected
                            ? `${visaEmployees} ${t("pricingOnce")}`
                            : item.id === "meeting_rental" && isSelected
                            ? `${meetingHours} ${t("pricingHoursUnit")}`
                            : t(item.unitKey)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Receipt */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#f5f5f7] dark:bg-[#0c0c0e] border border-neutral-200/40 dark:border-neutral-800/40 rounded-3xl p-8 shadow-sm space-y-8">
              {/* Receipt Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <Calculator className="w-5 h-5 text-neutral-800 dark:text-white" />
                <h3 className="text-base font-semibold text-neutral-800 dark:text-white tracking-tight">
                  {t("pricingTotalCost")}
                </h3>
              </div>

              {/* Lease Duration Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
                  <span>{t("pricingDuration")}</span>
                  <span className="text-neutral-900 dark:text-white normal-case font-bold">
                    {duration} {t("pricingMonthsUnit")}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  disabled={selected.company_registration || selected.bank_account}
                  className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {(selected.company_registration || selected.bank_account) && (
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light leading-none">
                    * Lease locked to 12 months minimum due to company registration / banking requirements.
                  </p>
                )}
              </div>

              {/* Bill Breakdown Items */}
              <div className="space-y-4 pt-2">
                <div className="text-[10px] font-sans tracking-widest uppercase font-bold text-neutral-400">
                  Bill Breakdown
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => {
                    if (!selected[item.id]) return null;
                    let displayPrice = item.basePrice;
                    if (item.id === "private_office") {
                      if (officeSize === "s") displayPrice = 5000;
                      else if (officeSize === "m") displayPrice = 7500;
                      else if (officeSize === "l") displayPrice = 10000;
                    }

                    // Apply discounts on receipt list
                    let finalPrice = displayPrice;
                    if (item.id === "mail_handling" && hasWorkspaceSelected) finalPrice = 0;
                    if (item.id === "company_registration" && hasWorkspaceSelected) finalPrice = 21000;
                    if (item.id === "bank_account" && hasOfficeSelected) finalPrice = 14000;
                    if (item.id === "shared_vpn" && (selected.virtual_address || hasVpnPromo)) finalPrice = 0;
                    if (item.id === "dedicated_vpn") {
                      if (selected.private_office || selected.shared_office) {
                        finalPrice = 0;
                      } else if (hasVpnPromo) {
                        finalPrice = 300;
                      }
                    }

                    const lineCost = item.isMonthly ? finalPrice * duration : item.id === "visa_support" ? visaTotalCost : item.id === "meeting_rental" ? meetingTotalCost : finalPrice;

                    return (
                      <div key={item.id} className="flex justify-between items-start text-[13px] font-light">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {getItemName(item)}{" "}
                          {item.id === "private_office" && `(${officeSize.toUpperCase()})`}{" "}
                          {item.id === "meeting_rental" && `(${meetingHours}h)`}{" "}
                          {item.id === "visa_support" && `(${visaEmployees} pax)`}{" "}
                          {item.isMonthly && `(x${duration} mo)`}
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                          ฿{lineCost.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Applied Discounts section */}
              {activeDiscounts.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-950/10 border border-green-200/50 dark:border-green-900/30 rounded-xl space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-green-700 dark:text-green-400 tracking-wider">
                    {t("pricingDiscounts")}
                  </div>
                  <ul className="text-[11px] text-green-600 dark:text-green-400 font-light list-disc list-inside space-y-0.5">
                    {activeDiscounts.map((discount, i) => (
                      <li key={i}>{discount}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subtotals & Grand Total */}
              <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between text-xs font-light text-neutral-600 dark:text-neutral-400">
                  <span>{t("pricingMonthlySubtotal")}</span>
                  <span>฿{monthlySubtotal.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between text-xs font-light text-neutral-600 dark:text-neutral-400">
                  <span>{t("pricingOneTimeSubtotal")}</span>
                  <span>฿{oneTimeSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-[13px] font-semibold text-neutral-800 dark:text-white uppercase tracking-wider">
                    {t("pricingTotalCost")}
                  </span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight">
                      ฿{totalEstimate.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Deposit Note */}
              {(selected.private_office || selected.shared_office || selected.corporate_affiliation) && (
                <p className="text-[11px] text-amber-600/90 dark:text-amber-400/90 font-light text-center leading-relaxed bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                  {t("pricingDepositNote")}
                </p>
              )}

              {/* Inquire Quote Action */}
              <button
                onClick={handleInquireQuote}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-[13px] font-semibold rounded-full transition-all shadow-sm group"
              >
                <span>{t("pricingInquireQuote")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
