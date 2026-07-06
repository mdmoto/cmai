"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = [
    { q: t("faqQ1"), a: t("faqA1"), value: "item-1" },
    { q: t("faqQ2"), a: t("faqA2"), value: "item-2" },
    { q: t("faqQ3"), a: t("faqA3"), value: "item-3" },
    { q: t("faqQ4"), a: t("faqA4"), value: "item-4" },
    { q: t("faqQ5"), a: t("faqA5"), value: "item-5" },
    { q: t("faqQ6"), a: t("faqA6"), value: "item-6" },
  ];

  return (
    <section id="faq" className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[12px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold block mb-3">
            {t("faqSectionTitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white tracking-tight">
            {t("faqSubtitle")}
          </h2>
        </div>

        <Accordion.Root type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <Accordion.Item
              key={faq.value}
              value={faq.value}
              className="bg-white dark:bg-black border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="group flex flex-1 items-center justify-between px-6 py-5 text-left text-base font-bold text-neutral-900 dark:text-white hover:bg-neutral-50/55 dark:hover:bg-neutral-900/30 transition-all cursor-pointer">
                  <span>{faq.q}</span>
                  <Plus className="w-4 h-4 text-neutral-400 group-data-[state=open]:rotate-45 transition-transform duration-200" />
                </Accordion.Trigger>
              </Accordion.Header>
              
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down">
                <div className="px-6 pb-6 text-[14px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed border-t border-neutral-100/50 dark:border-neutral-900/50 pt-4">
                  {faq.a}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
