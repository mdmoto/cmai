"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <img
              src="/images/logo_building.png"
              alt="CMAI Logo"
              className="h-10 w-auto object-contain invert opacity-90 hover:opacity-100 transition-opacity"
            />
            <p className="text-[13px] text-neutral-500 font-light leading-relaxed max-w-sm">
              Chiang Mai AI Center is a premium business infrastructure platform, providing dedicated workspace, secure corporate networking, and local setup support for global tech teams.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-[13px] font-light">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  {t("navHome")}
                </a>
              </li>
              <li>
                <a href="#workspace" className="hover:text-white transition-colors">
                  {t("navWorkspace")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t("navServices")}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  {t("navGallery")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-300 mb-4">
              Help
            </h4>
            <ul className="space-y-2 text-[13px] font-light">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {t("navFaq")}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  {t("navContact")}
                </a>
              </li>
              <li>
                <span className="text-neutral-600 block pt-1">
                  Ver. 1.0.0 (Next.js 16)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom border & copyright info */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[12px] text-neutral-600 font-light">
            © {new Date().getFullYear()} Chiang Mai AI Center. All rights reserved.
          </div>

          {/* Scroll to Top button */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
