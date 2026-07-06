"use client";

import React, { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MessageSquare, MapPin, Send, MessageCircle } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorState, setErrorState] = useState("");

  const googleMapUrl = "https://maps.app.goo.gl/PNLcvHKEghmaVNmy6?g_st=ic";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorState("");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: "New Booking Inquiry - Chiang Mai AI Center",
          from_name: "CMAI Website",
        }),
      });

      const result = await response.json();
      if (result.success || accessKey === "YOUR_ACCESS_KEY_HERE") {
        setIsSuccess(true);
        setFormState({ name: "", email: "", message: "" });
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorState(result.message || "Failed to submit form.");
      }
    } catch (error) {
      if (accessKey === "YOUR_ACCESS_KEY_HERE") {
        // Safe simulated fallback if token not configured yet
        setIsSuccess(true);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorState("Network error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactLinks = [
    {
      name: "LINE",
      val: "@cmai_center",
      href: "https://line.me",
      icon: <MessageCircle className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />,
    },
    {
      name: "WhatsApp",
      val: "+66 62 345 8238",
      href: "https://wa.me/66623458238",
      icon: <Phone className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />,
    },
    {
      name: "WeChat",
      val: "cmai_support",
      href: "https://weixin.qq.com",
      icon: <MessageSquare className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />,
    },
    {
      name: "Email",
      val: "mdmoto@gmail.com",
      href: "mailto:mdmoto@gmail.com",
      icon: <Mail className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white" />,
    },
  ];

  return (
    <section id="contact" className="py-28 bg-[#fafafa] dark:bg-[#070707] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Contact Info & Map */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
                {t("contactSectionTitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] dark:text-white tracking-tight leading-tight">
                Start Your Business <br />
                <span className="font-semibold text-black dark:text-[#f5f5f7]">in Thailand</span>
              </h2>
            </div>

            {/* Quick text links */}
            <div className="space-y-6">
              <h3 className="text-[12px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {t("contactChat")}
              </h3>

              <div className="space-y-4">
                {contactLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-900 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {link.name}
                      </span>
                    </div>
                    <span className="text-[13px] text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {link.val}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map panel */}
            <div className="space-y-4">
              <h3 className="text-[12px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold border-b border-neutral-200 dark:border-neutral-800 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span>{t("contactLocation")}</span>
              </h3>
              <p className="text-[13px] text-neutral-500 dark:text-[#86868b] leading-relaxed font-light">
                Chiang Mai AI Center Building, 202 Huay Kaew Rd, Chang Phueak, Mueang Chiang Mai District, Chiang Mai 50300, Thailand.
              </p>
              
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-black dark:text-white hover:underline pt-2"
              >
                <span>{t("contactMapButton")} →</span>
              </a>
            </div>
          </div>

          {/* Right: Underline Visit Booking Form */}
          <div className="lg:col-span-7 bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/40 rounded-2xl p-8 sm:p-12 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-10">
              {t("navBookVisit")}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="peer w-full py-2 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white text-sm outline-none transition-all placeholder-transparent"
                  id="form-name"
                  placeholder="Name"
                />
                <label
                  htmlFor="form-name"
                  className="absolute left-0 -top-4 text-[10px] font-sans tracking-[0.15em] text-[#86868b] uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px]"
                >
                  {t("contactName")}
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="peer w-full py-2 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white text-sm outline-none transition-all placeholder-transparent"
                  id="form-email"
                  placeholder="Email"
                />
                <label
                  htmlFor="form-email"
                  className="absolute left-0 -top-4 text-[10px] font-sans tracking-[0.15em] text-[#86868b] uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px]"
                >
                  {t("contactEmail")}
                </label>
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="peer w-full py-2 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white text-sm outline-none transition-all placeholder-transparent resize-none"
                  id="form-message"
                  placeholder="Message"
                />
                <label
                  htmlFor="form-message"
                  className="absolute left-0 -top-4 text-[10px] font-sans tracking-[0.15em] text-[#86868b] uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px]"
                >
                  {t("contactMessage")}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:bg-neutral-400 text-white dark:text-neutral-950 text-[13px] font-semibold rounded-full transition-all shadow-sm"
              >
                {isSubmitting ? "Submitting..." : t("contactSubmit")}
              </button>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl text-neutral-800 dark:text-neutral-200 text-[13px] font-light text-center"
                  >
                    {t("contactSuccess")}
                  </motion.div>
                )}
                {errorState && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-[13px] font-light text-center"
                  >
                    {errorState}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
