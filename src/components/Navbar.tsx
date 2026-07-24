"use client";

import React, { useState, useEffect } from "react";
import { useTranslation, Language } from "@/context/LanguageContext";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("navHome"), href: "#home" },
    { label: t("navWorkspace"), href: "#workspace" },
    { label: t("navServices"), href: "#services" },
    { label: t("pricingSectionTitle"), href: "#pricing" },
    { label: t("navGallery"), href: "#gallery" },
    { label: t("navFaq"), href: "#faq" },
    { label: t("navContact"), href: "#contact" },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "th", label: "ไทย" },
    { code: "ja", label: "日本語" },
  ];

  const currentLanguageLabel = languages.find((l) => l.code === language)?.label || "English";

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offset = 80; // height of navbar
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="flex items-center">
          <img
            src="/images/logo.png"
            alt="CMAI Logo"
            className="h-10 w-auto object-contain dark:invert"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleScrollTo(e, item.href)}
              className="text-[14px] font-medium text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600 text-[13px] font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLanguageLabel}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <>
                  {/* Backdrop to close */}
                  <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-20"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${
                          language === lang.code
                            ? "text-neutral-900 dark:text-white font-semibold bg-neutral-50 dark:bg-neutral-900"
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
            href="#contact"
            onClick={(e) => handleScrollTo(e, "#contact")}
            className="px-5 py-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-[13px] font-medium rounded-full transition-colors shadow-sm"
          >
            {t("navBookVisit")}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobile Language Trigger */}
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            <Globe className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-neutral-900 dark:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Language Dropdown Overlay */}
      <AnimatePresence>
        {showLangMenu && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setShowLangMenu(false)} />
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
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="text-[16px] font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white py-1 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, "#contact")}
                className="mt-2 w-full py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-center text-[14px] font-medium rounded-full shadow-sm"
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
