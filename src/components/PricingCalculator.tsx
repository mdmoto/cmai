"use client";

import React, { useState, useEffect } from "react";
import { useTranslation, Language } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Calculator,
  ArrowRight,
  Shield,
  HelpCircle,
  Building,
  Wifi,
  Scale,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

interface ServiceItem {
  id: string;
  nameKey: string;
  basePrice: number; // For Private Office, this is S size
  mPrice?: number;   // For M size
  lPrice?: number;   // For L size
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
  });

  const [officeSize, setOfficeSize] = useState<"s" | "m" | "l">("s");
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
      notesKey: "1、2、5三项互斥，方向s, m, l对应3个价格",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "shared_office",
      nameKey: "servicesSharedOffice", // Fallback helper key
      basePrice: 3000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "1、2、5三项互斥",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "virtual_address",
      nameKey: "servicesBusinessAddress",
      basePrice: 1000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "1、2、5三项互斥",
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: "dedicated_vpn",
      nameKey: "servicesDedicatedIp",
      basePrice: 600,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "3、4两项互斥",
      icon: <Wifi className="w-4 h-4" />,
    },
    {
      id: "shared_vpn",
      nameKey: "servicesSharedVpn",
      basePrice: 200,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "3、4两项互斥",
      icon: <Wifi className="w-4 h-4" />,
    },
    {
      id: "mail_handling",
      nameKey: "servicesMailHandling",
      basePrice: 500,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "1、2、5三项选择任何一项这项免费",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "company_registration",
      nameKey: "servicesRegistration",
      basePrice: 30000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "选择这个必须选择1、2、5三项中的一项，价格打折为7折，免费包4，可升级3（300/月），租期默认12月起",
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: "shareholder_matching",
      nameKey: "servicesShareholder",
      basePrice: 50000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "",
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: "bank_account",
      nameKey: "servicesBankAccount",
      basePrice: 20000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "选择这个必须选择1、2项中的一项，价格打折为7折，免费包4，可升级3（300/月），租期默认12月起",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "accounting_agent",
      nameKey: "servicesAccounting",
      basePrice: 3000,
      unitKey: "pricingMonth",
      isMonthly: true,
      notesKey: "",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "annual_audit",
      nameKey: "servicesAudit",
      basePrice: 15000,
      unitKey: "pricingOnce",
      isMonthly: false,
      notesKey: "",
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
  ];

  // Specific translations mapping for items missing in default context
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
      zh: "泰国股东撮合服务",
      th: "บริการจัดหาผู้ถือหุ้นไทย",
      ja: "タイ人株主マッチングサービス",
    },
    servicesBankAccount: {
      en: "Bank Account Certification",
      zh: "银行开户认证支持",
      th: "บริการเปิดบัญชีธนาคาร",
      ja: "法人銀行口座開設サポート",
    },
    servicesAccounting: {
      en: "Corporate Bookkeeping / Tax",
      zh: "每月财务记账代理",
      th: "บริการทำบัญชีและยื่นภาษีรายเดือน",
      ja: "月次財務・会計代理業務",
    },
    servicesAudit: {
      en: "Annual Fiscal Review / Audit",
      zh: "年度审计与公司年审",
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

      // 3. Company Registration (Item 7) constraints
      if (next.company_registration) {
        // Must select one of workspace 1, 2, or 5
        if (!next.private_office && !next.shared_office && !next.virtual_address) {
          // Auto-select Private Office as default workspace
          next.private_office = true;
          next.shared_office = false;
          next.virtual_address = false;
          setWarningMessage(t("pricingOfficeSelectionRequired"));
        }
        // Force minimum duration of 12 months
        setDuration((prevD) => Math.max(12, prevD));
      }

      // 4. Bank Account (Item 9) constraints
      if (next.bank_account) {
        // Must select one of workspace 1 or 2 (virtual address not allowed)
        if (!next.private_office && !next.shared_office) {
          next.private_office = true;
          next.shared_office = false;
          next.virtual_address = false;
          setWarningMessage(t("pricingOfficeRequiredForBank"));
        }
        // Force minimum duration of 12 months
        setDuration((prevD) => Math.max(12, prevD));
      }

      // 5. Automatic bundles when company registration or bank account is selected
      if (next.company_registration || next.bank_account) {
        // Bundles shared VPN (4) by default if dedicated VPN (3) is not chosen
        if (!next.dedicated_vpn) {
          next.shared_vpn = true;
        }
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

  // 4. VPN Bundling discounts (under 7 or 9)
  const hasVpnBundle = selected.company_registration || selected.bank_account;
  let vpnCost = 0;
  if (selected.shared_vpn) {
    vpnCost = hasVpnBundle ? 0 : 200; // Free under bundle
  } else if (selected.dedicated_vpn) {
    vpnCost = hasVpnBundle ? 300 : 600; // Discounted to 300 under bundle
  }

  // 5. Private Office Pricing based on size S, M, L
  let officeCost = 0;
  if (selected.private_office) {
    if (officeSize === "s") officeCost = 5000;
    else if (officeSize === "m") officeCost = 7500;
    else if (officeSize === "l") officeCost = 10000;
  }

  // Calculate Subtotals
  let monthlySubtotal = 0;
  // Office cost
  monthlySubtotal += officeCost;
  // Shared office
  if (selected.shared_office) monthlySubtotal += 3000;
  // Virtual address
  if (selected.virtual_address) monthlySubtotal += 1000;
  // VPN Cost
  monthlySubtotal += vpnCost;
  // Mail Handling (if selected and not free)
  if (selected.mail_handling && !isMailFree) monthlySubtotal += 500;
  // Accounting Agent
  if (selected.accounting_agent) monthlySubtotal += 3000;

  let oneTimeSubtotal = 0;
  oneTimeSubtotal += registrationCost;
  // Shareholder Matching
  if (selected.shareholder_matching) oneTimeSubtotal += 50000;
  oneTimeSubtotal += bankAccountCost;
  // Annual Review Audit
  if (selected.annual_audit) oneTimeSubtotal += 15000;

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
  if (hasVpnBundle) {
    if (selected.shared_vpn) {
      activeDiscounts.push(language === "zh" ? "赠送共享 IP VPN 免费服务 (-¥200/月)" : "Bundled Free Shared VPN");
    } else if (selected.dedicated_vpn) {
      activeDiscounts.push(language === "zh" ? "专享 IP VPN 升级特惠 300/月 (-¥300/月)" : "Upgraded Dedicated VPN Promo Price");
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
      if (selected.shared_vpn) quoteText += `- 共享 IP VPN 服务: ฿${hasVpnBundle ? "0 (赠送)" : "200"}/月\n`;
      if (selected.dedicated_vpn) quoteText += `- 专属 IP VPN 服务: ฿${hasVpnBundle ? "300 (特惠)" : "600"}/月\n`;
      if (selected.mail_handling) quoteText += `- 邮件包裹代收: ฿${isMailFree ? "0 (赠送)" : "500"}/月\n`;
      if (selected.company_registration) quoteText += `- 泰国公司设立注册: ฿${registrationCost} (已折)\n`;
      if (selected.shareholder_matching) quoteText += `- 泰国股东配套撮合: ฿50,000 (一次性)\n`;
      if (selected.bank_account) quoteText += `- 商业银行开户认证: ฿${bankAccountCost} (已折)\n`;
      if (selected.accounting_agent) quoteText += `- 财务代理报税服务: ฿3,000/月\n`;
      if (selected.annual_audit) quoteText += `- 年度审计年审服务: ฿15,000 (一次性)\n`;
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
      if (selected.shared_vpn) quoteText += `- Shared IP VPN: ฿${hasVpnBundle ? "0 (Bundled)" : "200"}/mo\n`;
      if (selected.dedicated_vpn) quoteText += `- Dedicated IP VPN: ฿${hasVpnBundle ? "300 (Promo)" : "600"}/mo\n`;
      if (selected.mail_handling) quoteText += `- Mail Handling: ฿${isMailFree ? "0 (Free)" : "500"}/mo\n`;
      if (selected.company_registration) quoteText += `- Thai Company Registration: ฿${registrationCost} (One-time)\n`;
      if (selected.shareholder_matching) quoteText += `- Shareholder Matching: ฿50,000 (One-time)\n`;
      if (selected.bank_account) quoteText += `- Bank Account Setup: ฿${bankAccountCost} (One-time)\n`;
      if (selected.accounting_agent) quoteText += `- Bookkeeping & Accounting: ฿3,000/mo\n`;
      if (selected.annual_audit) quoteText += `- Annual Audit / Review: ฿15,000 (One-time)\n`;
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
      // Trigger native react state updates
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
                if (item.id === "shared_vpn" && hasVpnBundle && isSelected) {
                  originalPrice = 200;
                  adjustedPrice = 0;
                }
                if (item.id === "dedicated_vpn" && hasVpnBundle && isSelected) {
                  originalPrice = 600;
                  adjustedPrice = 300;
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
                      {/* Checkbox and icon/details */}
                      <div className="flex items-start gap-4">
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

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
                              {item.icon}
                            </span>
                            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                              {getItemName(item)}
                            </h4>
                          </div>

                          {/* Sub-selectors (e.g. office size) */}
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

                          {item.notesKey && (
                            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-light max-w-md pt-0.5 leading-relaxed">
                              {/* Display descriptive English version of complex pricing logic for notes */}
                              {language === "zh"
                                ? item.notesKey
                                : item.id === "private_office"
                                ? "Mutually exclusive with shared office / virtual address. Price varies by S, M, L size selection."
                                : item.id === "shared_office" || item.id === "virtual_address"
                                ? "Mutually exclusive with other workspace options."
                                : item.id === "dedicated_vpn" || item.id === "shared_vpn"
                                ? "Mutually exclusive with other VPN routing setups."
                                : item.id === "mail_handling"
                                ? "Free if renting any Private Office, Shared Office, or Virtual Address."
                                : item.id === "company_registration"
                                ? "Requires office/virtual address setup. 30% discount on setup. Bundles free Shared VPN, with Dedicated VPN upgrade for ฿300/mo. Duration commits to 12 months."
                                : item.id === "bank_account"
                                ? "Requires office setup (Private/Shared). 30% discount on registration. Bundles free Shared VPN, with Dedicated VPN upgrade for ฿300/mo. Duration commits to 12 months."
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
                            ฿{adjustedPrice.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block font-light">
                          {t(item.unitKey)}
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
                    if (item.id === "shared_vpn" && hasVpnBundle) finalPrice = 0;
                    if (item.id === "dedicated_vpn" && hasVpnBundle) finalPrice = 300;

                    const lineCost = item.isMonthly ? finalPrice * duration : finalPrice;

                    return (
                      <div key={item.id} className="flex justify-between items-start text-[13px] font-light">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {getItemName(item)}{" "}
                          {item.id === "private_office" && `(${officeSize.toUpperCase()})`}{" "}
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
