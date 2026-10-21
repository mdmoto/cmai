"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, Language } from "@/context/LanguageContext";
import { Menu, X, Globe, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenSandbox?: () => void;
  onPreheat?: () => void;
}

export default function Navbar({ onOpenSandbox, onPreheat }: NavbarProps) {
  const { t, language, setLanguage } = useTranslation();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("navHome"), href: "/" },
    { label: t("navExploreWorkspace"), href: "/workspace" },
    { label: t("navCloudDesk"), href: "/cloud-desk" },
    { label: t("navAiSandbox"), href: "/sandbox" },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "th", label: "ไทย" },
    { code: "ja", label: "日本語" },
  ];

  const currentLanguageLabel = languages.find((l) => l.code === language)?.label || "中文";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);
    const target = document.querySelector("#contact");
    if (target) {
      e.preventDefault();
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

  const handleSandboxClick = () => {
    if (onOpenSandbox) {
      onOpenSandbox();
    } else {
      window.location.href = "https://ai.lazzor.com";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/images/logo.png"
            alt="CMAI Logo"
            className="h-9 w-auto object-contain dark:invert group-hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-200/50 dark:border-neutral-800/50">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  active
                    ? "text-neutral-950 dark:text-white bg-white dark:bg-neutral-800 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 text-[12px] font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLanguageLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1 z-50 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[12px] transition-colors ${
                          language === lang.code
                            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
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

          {/* Frosted Glass AI Decision Sandbox Button */}
          <button
            onClick={handleSandboxClick}
            onMouseEnter={onPreheat}
            onTouchStart={onPreheat}
            className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-neutral-900 dark:text-neutral-200 backdrop-blur-md rounded-full px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI 商业决策沙盘</span>
          </button>

          <Link
            href="/contract"
            className="px-3.5 py-1.5 border border-blue-500/30 hover:border-blue-500/60 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-[13px] font-semibold rounded-full transition-all shadow-sm"
          >
            {language === "zh" ? "在线签约" : language === "th" ? "สัญญาออนไลน์" : language === "ja" ? "契約書" : "Lease"}
          </Link>

          <a
            href={pathname === "/workspace" ? "#contact" : "/workspace#contact"}
            onClick={handleScrollToContact}
            className="px-4 py-1.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-[13px] font-medium rounded-full transition-colors shadow-sm"
          >
            {t("navBookVisit")}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile AI Sandbox Trigger */}
          <button
            onClick={handleSandboxClick}
            onTouchStart={onPreheat}
            className="bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-neutral-900 dark:text-neutral-200 backdrop-blur-md rounded-full px-2.5 py-1.5 text-[11px] font-medium shadow-sm cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>沙盘</span>
          </button>

          {/* Mobile Language Trigger */}
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            <Globe className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-neutral-900 dark:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Language Dropdown */}
      <AnimatePresence>
        {showLangMenu && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setShowLangMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-6 top-16 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1 z-50"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    language === lang.code
                      ? "text-neutral-900 dark:text-white font-semibold"
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800"
          >
            <div className="px-6 py-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSandboxClick();
                }}
                onTouchStart={onPreheat}
                className="w-full py-2.5 bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-neutral-900 dark:text-neutral-200 backdrop-blur-md text-center font-medium text-[14px] rounded-xl shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>AI 商业决策沙盘 (ai.lazzor.com)</span>
              </button>
              
              <Link
                href="/contract"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold text-[14px] rounded-xl shadow-sm"
              >
                {language === "zh" ? "签署在线租赁合同 (8折特惠)" : "Online Lease Agreement"}
              </Link>
              
              <div className="py-2 flex flex-col gap-1 border-t border-b border-neutral-100 dark:border-neutral-900">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-[15px] font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                        active
                          ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white font-semibold"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </Link>
                  );
                })}
              </div>

              <a
                href={pathname === "/workspace" ? "#contact" : "/workspace#contact"}
                onClick={handleScrollToContact}
                className="w-full py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-center text-[14px] font-medium rounded-full shadow-sm"
              >
                {t("navBookVisit")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
