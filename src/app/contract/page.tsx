"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Printer,
  ArrowLeft,
  Upload,
  Camera,
  Trash2,
  PenTool,
  RotateCcw,
  Sparkles,
  Building2,
  ShieldCheck,
  Calendar,
  Percent,
  Download,
  Eye,
  AlertCircle
} from "lucide-react";

// --- Number to Words Utilities ---
function numberToEnglishWords(num: number): string {
  if (num === 0) return "Zero Baht Only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertChunk(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  }

  let words = "";
  if (num >= 1000000) {
    words += convertChunk(Math.floor(num / 1000000)) + " Million ";
    num %= 1000000;
  }
  if (num >= 1000) {
    words += convertChunk(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }
  if (num > 0) {
    words += convertChunk(num);
  }

  return words.trim() + " Baht Only";
}

function numberToThaiWords(num: number): string {
  if (num === 0) return "ศูนย์บาทถ้วน";
  const digits = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const units = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  let strNum = Math.floor(num).toString();
  let len = strNum.length;
  let text = "";

  for (let i = 0; i < len; i++) {
    let digit = parseInt(strNum.charAt(i), 10);
    let unitPos = len - i - 1;

    if (digit !== 0) {
      if (unitPos === 1 && digit === 1) {
        text += "";
      } else if (unitPos === 1 && digit === 2) {
        text += "ยี่";
      } else if (unitPos === 0 && digit === 1 && len > 1 && parseInt(strNum.charAt(i - 1), 10) !== 0) {
        text += "เอ็ด";
      } else {
        text += digits[digit];
      }
      text += units[unitPos];
    }
  }

  return text + "บาทถ้วน";
}

const defaultRooms = [
  { id: "B1-2", floor: 2, defaultPrice: 9400, features: "独立空调 · 带采光窗 (Double Room)" },
  { id: "B6", floor: 2, defaultPrice: 3700, features: "公共空调 · 无窗 (Quiet Focus)" },
  { id: "B7", floor: 2, defaultPrice: 3100, features: "公共空调 · 带采光窗 (Cozy Window)" },
  { id: "C1-2", floor: 3, defaultPrice: 9700, features: "独立空调 · 采光大窗 (Executive Suite)" },
  { id: "C4", floor: 3, defaultPrice: 7800, features: "独立空调 · 采光窗 (Standard Team)" },
  { id: "C5", floor: 3, defaultPrice: 4700, features: "独立空调 · 采光窗 (Compact Pro)" },
  { id: "C6", floor: 3, defaultPrice: 1800, features: "公共空调 · 无窗 (Budget Solo)" },
  { id: "C7-8", floor: 3, defaultPrice: 5800, features: "独立空调 · 采光窗 (Team Dual)" },
  { id: "C9", floor: 3, defaultPrice: 6000, features: "独立空调 · 采光窗 (Studio Suite)" },
  { id: "C11", floor: 3, defaultPrice: 3000, features: "公共空调 · 无窗 (Focus Unit)" },
  { id: "C12", floor: 3, defaultPrice: 1500, features: "公共空调 · 采光窗 (Single Window)" },
  { id: "D1-2", floor: 4, defaultPrice: 9700, features: "独立空调 · 采光窗 (Large Suite)" },
  { id: "D3", floor: 4, defaultPrice: 7800, features: "独立空调 · 采光窗 (Team Room)" },
  { id: "D4", floor: 4, defaultPrice: 7800, features: "独立空调 · 采光窗 (Team Room)" },
  { id: "D5", floor: 4, defaultPrice: 4700, features: "独立空调 · 采光窗 (Private Pro)" },
  { id: "D7-8", floor: 4, defaultPrice: 5800, features: "独立空调 · 采光窗 (Dual Studio)" },
  { id: "D9", floor: 4, defaultPrice: 6000, features: "独立空调 · 采光窗 (Studio Suite)" },
  { id: "D10", floor: 4, defaultPrice: 3000, features: "公共空调 · 无窗 (Focus Room)" },
  { id: "D11", floor: 4, defaultPrice: 3000, features: "公共空调 · 无窗 (Focus Room)" },
  { id: "E2", floor: 5, defaultPrice: 7800, features: "独立空调 · 顶层采光 (Top Floor Pro)" },
  { id: "E3", floor: 5, defaultPrice: 7800, features: "独立空调 · 顶层采光 (Top Floor Pro)" },
  { id: "E4-5", floor: 5, defaultPrice: 9600, features: "独立空调 · 打通大开间 (Combined Studio)" },
  { id: "E6", floor: 5, defaultPrice: 3800, features: "公共空调 · 顶层无窗 (Quiet Studio)" },
  { id: "E7", floor: 5, defaultPrice: 3800, features: "公共空调 · 顶层无窗 (Quiet Studio)" },
  { id: "E8", floor: 5, defaultPrice: 5800, features: "独立空调 · 顶层采光 (Top Window Unit)" },
  { id: "E9", floor: 5, defaultPrice: 6000, features: "独立空调 · 顶层采光 (Top Studio)" },
  { id: "E10", floor: 5, defaultPrice: 3000, features: "公共空调 · 顶层无窗 (Focus Solo)" },
];

function ContractContent() {
  const searchParams = useSearchParams();

  // Initial query values
  const initRoom = searchParams.get("room") || "C4";
  const initPrice = searchParams.get("price") ? parseInt(searchParams.get("price")!, 10) : 7800;

  // State
  const [selectedRoomId, setSelectedRoomId] = useState(initRoom);
  const [discountRate, setDiscountRate] = useState<number>(0.8); // 8折 default (20% OFF)
  const [customPrice, setCustomPrice] = useState<number>(initPrice ? Math.round(initPrice * 0.8) : 6240);
  const [isCustomPriceMode, setIsCustomPriceMode] = useState<boolean>(false);

  // Tenant Info
  const [tenantType, setTenantType] = useState<"individual" | "company">("individual");
  const [tenantName, setTenantName] = useState<string>("");
  const [tenantIdNumber, setTenantIdNumber] = useState<string>("");
  const [tenantPhone, setTenantPhone] = useState<string>("");
  const [tenantEmail, setTenantEmail] = useState<string>("");
  const [tenantAddress, setTenantAddress] = useState<string>("");

  // Dates
  const [startDate, setStartDate] = useState<string>("2026-09-15");
  const [leaseDurationYears, setLeaseDurationYears] = useState<number>(1);
  const [rentDueDay, setRentDueDay] = useState<number>(15);

  // ID / Passport upload
  const [idImage, setIdImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // Sync selected room to price
  const currentRoomObj = defaultRooms.find((r) => r.id === selectedRoomId);
  const standardRoomPrice = currentRoomObj ? currentRoomObj.defaultPrice : 7800;

  useEffect(() => {
    if (!isCustomPriceMode) {
      setCustomPrice(Math.round(standardRoomPrice * discountRate));
    }
  }, [standardRoomPrice, discountRate, isCustomPriceMode]);

  // Derived Calculations
  const finalMonthlyRent = customPrice > 0 ? customPrice : 6240;
  const securityDeposit = finalMonthlyRent * 2;
  const advanceRent = finalMonthlyRent;
  const totalInitialPayment = securityDeposit + advanceRent;

  // Date calculations
  const calculateEndDate = (startStr: string, years: number): string => {
    try {
      const d = new Date(startStr);
      d.setFullYear(d.getFullYear() + years);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    } catch {
      return "2027-09-14";
    }
  };

  const endDate = calculateEndDate(startDate, leaseDurationYears);

  // Format English Date: "15 September 2026"
  const formatEngDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return isoStr;
    }
  };

  // Format Thai Date: "15 กันยายน 2569" (CE + 543)
  const formatThaiDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      const thaiYear = d.getFullYear() + 543;
      return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${thaiYear}`;
    } catch {
      return isoStr;
    }
  };

  // Handle ID Image Upload with Watermarking
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = (h / w) * maxDim;
            w = maxDim;
          } else {
            w = (w / h) * maxDim;
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;

        // Draw image
        ctx.drawImage(img, 0, 0, w, h);

        // Watermark
        ctx.save();
        ctx.font = `bold ${Math.round(w / 28)}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
        ctx.lineWidth = 2;
        ctx.textAlign = "center";
        ctx.translate(w / 2, h / 2);
        ctx.rotate(-Math.PI / 6);
        const wmText = "FOR COLASOLA CO., LTD. LEASE ONLY";
        ctx.strokeText(wmText, 0, 0);
        ctx.fillText(wmText, 0, 0);
        ctx.restore();

        const watermarkedUrl = canvas.toDataURL("image/jpeg", 0.85);
        setIdImage(watermarkedUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // --- Signature Canvas Handlers ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSignatureData(null);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 transition-colors font-sans pb-24">
      {/* Top Header Bar - Hide on Print */}
      <header className="print:hidden sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              title="返回官网"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <span>在线办公室租赁合同</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                  LEASE AGREEMENT
                </span>
              </h1>
              <p className="text-[11px] text-neutral-500 font-light hidden sm:block">
                Colasola Co., Ltd. · P.Work Co-Space Chiang Mai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              disabled={!tenantName || !hasSignature}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-md transition-all ${
                tenantName && hasSignature
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white cursor-pointer shadow-blue-500/20"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>打印 / 导出 PDF 合同</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Control Panel - Hide on Print */}
        <div className="print:hidden lg:col-span-5 space-y-6">
          
          {/* Box 1: Room & 8-Discount Selector */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>1. 选择房源与租金优惠</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                限时 8 折特惠中
              </span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 font-medium mb-1.5">
                  选择租赁房间（关联当前可租用房源）
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => {
                    setSelectedRoomId(e.target.value);
                    setIsCustomPriceMode(false);
                  }}
                  className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 text-xs"
                >
                  {defaultRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.id} （{room.floor}楼）- {room.features} - 原价 ฿{room.defaultPrice.toLocaleString()}/月
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Selector */}
              <div>
                <label className="block text-neutral-500 font-medium mb-1.5 flex items-center justify-between">
                  <span>租金折扣 / 优惠方案</span>
                  <span className="text-neutral-400 font-mono">原价: ฿{standardRoomPrice.toLocaleString()}/月</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "8 折特惠", rate: 0.8, desc: "20% OFF" },
                    { label: "9 折优惠", rate: 0.9, desc: "10% OFF" },
                    { label: "标准原价", rate: 1.0, desc: "Standard" },
                    { label: "自定义", rate: -1, desc: "Custom" },
                  ].map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => {
                        if (d.rate === -1) {
                          setIsCustomPriceMode(true);
                        } else {
                          setIsCustomPriceMode(false);
                          setDiscountRate(d.rate);
                        }
                      }}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        (!isCustomPriceMode && discountRate === d.rate) || (isCustomPriceMode && d.rate === -1)
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <div className="font-semibold">{d.label}</div>
                      <div className="text-[10px] opacity-75 font-mono">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Price Input */}
              {isCustomPriceMode && (
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2">
                  <label className="block text-blue-900 dark:text-blue-300 font-medium">
                    自定义最终成交月租金（THB）
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Math.max(1, parseInt(e.target.value || "0", 10)))}
                    className="w-full px-3 py-2 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-bold text-neutral-900 dark:text-white"
                  />
                </div>
              )}

              {/* Final Cost Summary Badge */}
              <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">最终合同月租金 (Monthly Rent):</span>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                    ฿{finalMonthlyRent.toLocaleString()} <span className="text-[10px] font-normal text-neutral-400">/月</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-neutral-500">
                  <span>押金 (Security Deposit, 2个月):</span>
                  <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">฿{securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-neutral-500">
                  <span>首期付款总额 (首月+押金):</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">฿{totalInitialPayment.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Tenant Profile & Passport/ID Upload */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>2. 承租人主体信息与证件核验</span>
              </span>
              <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTenantType("individual")}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${
                    tenantType === "individual"
                      ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold shadow-sm"
                      : "text-neutral-500"
                  }`}
                >
                  个人承租
                </button>
                <button
                  type="button"
                  onClick={() => setTenantType("company")}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${
                    tenantType === "company"
                      ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold shadow-sm"
                      : "text-neutral-500"
                  }`}
                >
                  企业承租
                </button>
              </div>
            </h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-500 font-medium mb-1">
                  {tenantType === "individual" ? "承租人姓名 (Full Name / 英文拼音)" : "企业全称 (Company Full Name)"} *
                </label>
                <input
                  type="text"
                  placeholder={tenantType === "individual" ? "例如: ADAM MAR / 张三" : "例如: Tech Global Co., Ltd."}
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-medium mb-1">
                  {tenantType === "individual" ? "护照号码 / 身份证号 (Passport / ID No.)" : "公司商业登记号 / 税号 (Tax ID)"} *
                </label>
                <input
                  type="text"
                  placeholder={tenantType === "individual" ? "例如: E12345678 / 110101..." : "例如: 0105566000000"}
                  value={tenantIdNumber}
                  onChange={(e) => setTenantIdNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 font-medium mb-1">
                    联系电话 (Phone Number) *
                  </label>
                  <input
                    type="text"
                    placeholder="+66 81 234 5678 / +86"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 font-medium mb-1">
                    电子邮箱 (Email)
                  </label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 font-medium mb-1">
                  法定/常住地址 (Legal / Residential Address)
                </label>
                <input
                  type="text"
                  placeholder="例如: Chiang Mai, Thailand / 北京市朝阳区..."
                  value={tenantAddress}
                  onChange={(e) => setTenantAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Passport / ID Upload Box */}
              <div className="pt-2">
                <label className="block text-neutral-500 font-medium mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-500" />
                    <span>上传护照个人页 / 身份证原件照片</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">（自动添加防盗用水印）</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleIdUpload}
                  className="hidden"
                />

                {!idImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-900/50 group"
                  >
                    <Upload className="w-6 h-6 text-neutral-400 group-hover:text-blue-500 mx-auto mb-1.5 transition-colors" />
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                      点击拍照或从相册选择证件图片
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      支持 JPG / PNG 格式，已开启智能压缩与合同附件归档
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group">
                    <img
                      src={idImage}
                      alt="Uploaded Passport/ID"
                      className="w-full h-36 object-cover bg-neutral-950"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs backdrop-blur-sm"
                        title="重新上传"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdImage(null)}
                        className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-xs"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Box 3: Lease Term & Schedule */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>3. 租期与起止日期</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-500 font-medium mb-1">
                  起租日期 (Start Date)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-medium mb-1">
                  租赁期限 (Duration)
                </label>
                <select
                  value={leaseDurationYears}
                  onChange={(e) => setLeaseDurationYears(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={0.5}>6 个月 (Half Year)</option>
                  <option value={1}>1 年 (1 Year - 标准标准)</option>
                  <option value={2}>2 年 (2 Years)</option>
                  <option value={3}>3 年 (3 Years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Box 4: Digital Signature Pad */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>4. 承租人在线手写电子签名</span>
              </span>
              {hasSignature && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>已签字</span>
                </span>
              )}
            </h2>

            <p className="text-[11px] text-neutral-500 mb-2">
              请使用手指、iPad 手写笔或鼠标在下方空白框内手写您的签名：
            </p>

            <div className="relative border-2 border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden bg-white touch-none">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 cursor-crosshair block"
              />
              {!hasSignature && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-neutral-300 text-xs font-mono select-none">
                  ✍️ 在此手写签名 (Sign Here)
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-3">
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs text-neutral-500 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>清除重签 (Clear)</span>
              </button>

              <span className="text-[10px] text-neutral-400 font-mono">
                符合泰国《电子交易法》合规标准
              </span>
            </div>
          </div>

        </div>

        {/* Right Printable Legal Contract Document Paper */}
        <div className="lg:col-span-7 bg-white text-[#111] p-8 sm:p-12 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
          
          {/* Watermark / Legal Header */}
          <div className="border-b-2 border-black pb-4 mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
              LEASE AGREEMENT / สัญญาเช่า
            </h2>
            <p className="text-xs text-neutral-600 font-mono mt-1">
              Colasola Co., Ltd. · P.Work Co-Space Chiang Mai
            </p>
          </div>

          {/* Agreement Parties */}
          <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed mb-6">
            <p>
              <strong>Between / ระหว่าง:</strong> Colasola Co., Ltd. (บริษัท โคล่าโซล่า จำกัด)<br />
              <strong>Company Registration No. / Tax ID / ทะเบียนนิติบุคคลเลขที่:</strong> 0505566006478<br />
              hereinafter referred to as the <strong>Landlord</strong> / ซึ่งในที่นี้เรียกว่า <strong>“ผู้ให้เช่า”</strong>
            </p>

            <p className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <strong>And / และ:</strong> <span className="font-bold underline text-blue-900">{tenantName || "____________________________________"}</span><br />
              <strong>ID / Passport / Tax ID / เลขที่บัตรประชาชน / เลขประจำตัวผู้เสียภาษี:</strong> <span className="font-mono font-bold underline text-blue-900">{tenantIdNumber || "____________________________________"}</span><br />
              <strong>Phone / เบอร์โทรศัพท์:</strong> {tenantPhone || "____________________"} | <strong>Email:</strong> {tenantEmail || "____________________"}<br />
              {tenantAddress && (
                <><strong>Address / ที่อยู่:</strong> {tenantAddress}<br /></>
              )}
              hereinafter referred to as the <strong>Tenant</strong> / ซึ่งในที่นี้เรียกว่า <strong>“ผู้เช่า”</strong>
            </p>

            <p className="font-semibold text-center py-1 bg-neutral-100 uppercase tracking-wide text-xs">
              Upon the following terms / ตกลงทำสัญญากันดังต่อไปนี้:
            </p>
          </div>

          {/* Section 1: The Premises & Term */}
          <div className="space-y-3 text-xs sm:text-[12.5px] leading-relaxed border-t border-neutral-200 pt-4 mb-5">
            <h3 className="font-bold text-sm">
              1. The Premises & Term of Lease / สถานที่เช่าและระยะเวลาการเช่า
            </h3>
            <p>
              The Landlord agrees to let and the Tenant agrees to rent the property with furniture and fixtures hereinafter known as <strong>The Premises</strong> at the address:
            </p>
            <p className="pl-4 font-semibold text-neutral-800">
              Room {selectedRoomId} ({currentRoomObj?.floor || 2}F), 236/105 P.Work Co-Space Chiang Mai, Moo 6, Mahidol Road, Nong Hoi Subdistrict, Mueang Chiang Mai District, Chiang Mai 50000.
            </p>
            <p className="text-neutral-600 pl-4">
              ผู้ให้เช่าตกลงให้เช่าและผู้เช่าตกลงเช่าสถานที่ รวมทั้งเฟอร์นิเจอร์ ณ ห้อง {selectedRoomId} ({currentRoomObj?.floor || 2}F) P.Work Co-Space Chiang Mai บ้านเลขที่ 236/105 หมู่ 6 ถ.มหิดล ตำบลหนองหอย อำเภอเมือง จังหวัดเชียงใหม่ 50000
            </p>
            <p className="p-2.5 bg-blue-50/60 rounded border border-blue-100">
              <strong>Term of Lease / ระยะเวลาการเช่า:</strong><br />
              Start from <strong>{formatEngDate(startDate)}</strong> to <strong>{formatEngDate(endDate)}</strong>, for <strong>{leaseDurationYears} {leaseDurationYears > 1 ? "years" : "year"}</strong>.<br />
              <span className="text-neutral-700">
                เริ่มตั้งแต่ <strong>{formatThaiDate(startDate)}</strong> ถึง <strong>{formatThaiDate(endDate)}</strong>, เป็นเวลา <strong>{leaseDurationYears} ปี</strong>
              </span>
            </p>
          </div>

          {/* Section 2: Rental Fee and Payment Terms */}
          <div className="space-y-3 text-xs sm:text-[12.5px] leading-relaxed border-t border-neutral-200 pt-4 mb-5">
            <h3 className="font-bold text-sm">
              2. Rental Fee and Payment Terms / ค่าเช่าและเงื่อนไขการชำระเงิน
            </h3>
            <p className="p-2.5 bg-neutral-50 rounded border border-neutral-200">
              The agreed rental fee per month is <strong>{finalMonthlyRent.toLocaleString()} THB</strong> ({numberToEnglishWords(finalMonthlyRent)}).<br />
              <span className="text-neutral-700">
                โดยตกลงค่าเช่าในราคาเดือนละ <strong>{finalMonthlyRent.toLocaleString()} บาท</strong> ({numberToThaiWords(finalMonthlyRent)})
              </span>
            </p>
            <p>
              <strong>2.1</strong> The monthly rent shall be payable by Tenant on or before the <strong>{rentDueDay}th date</strong> of each month.<br />
              <span className="text-neutral-600">เงินค่าเช่านั้นผู้เช่าจะต้องชำระทุกวันที่ {rentDueDay} ของเดือน</span>
            </p>
            <p>
              <strong>2.2</strong> Tenant agrees to pay the security deposit of <strong>{securityDeposit.toLocaleString()} THB</strong> ({numberToEnglishWords(securityDeposit)}) [equivalent to 2 months rent] and 1 month rental in advance for <strong>{advanceRent.toLocaleString()} THB</strong> ({numberToEnglishWords(advanceRent)}). Total initial payment sum is <strong>{totalInitialPayment.toLocaleString()} THB</strong> ({numberToEnglishWords(totalInitialPayment)}).<br />
              <span className="text-neutral-600">
                ผู้เช่าตกลงจ่ายค่าประกันจำนวน <strong>{securityDeposit.toLocaleString()} บาท</strong> ({numberToThaiWords(securityDeposit)}) [เทียบเท่าค่าเช่า 2 เดือน] และค่าเช่าล่วงหน้า 1 เดือน จำนวน <strong>{advanceRent.toLocaleString()} บาท</strong> ({numberToThaiWords(advanceRent)}) รวมเป็นเงินจำนวนจ่ายครั้งแรกทั้งหมด <strong>{totalInitialPayment.toLocaleString()} บาท</strong> ({numberToThaiWords(totalInitialPayment)})
              </span>
            </p>
            <p className="text-[11.5px] text-neutral-600 italic">
              The security deposit can neither be substituted as prepaid rent nor be treated as part of monthly rent as stipulated in this agreement on the date of signing of this lease agreement.<br />
              ค่าประกันนี้ไม่สามารถนำมาหักแทนค่าเช่าล่วงหน้าหรือบางส่วนของค่าเช่าได้ตามที่กำหนดไว้ในสัญญานี้นับแต่วันที่ได้เซ็นสัญญาฉบับนี้
            </p>
            <p>
              <strong>Payment Method / วิธีการชำระเงิน:</strong><br />
              The TENANT shall pay the rental fee, security deposit, and advance payment in cash or via authorized bank transfer.<br />
              <span className="text-neutral-600">โดยผู้เช่าต้องทำการชำระค่าเช่า เงินประกัน และค่าเช่าล่วงหน้าเป็นเงินสดหรือโอนผ่านบัญชีธนาคาร</span>
            </p>
            <p>
              <strong>2.3</strong> A separate inventory list showing items provided by the Landlord to be attached to the lease agreement or sent via PDF/image file. Both parties shall inspect and approve the inventory list on the date the rental period starts.<br />
              <span className="text-neutral-600">รายละเอียดเกี่ยวกับเฟอร์นิเจอร์ต่างๆ ที่ผู้ให้เช่าได้มอบไว้จะแนบในใบแทรกของสัญญาฉบับนี้ หรือส่งเป็นไฟล์รูปภาพ/PDF โดยคู่สัญญาได้อ่านและตรวจทานในวันที่สัญญาเช่าเริ่มต้น</span>
            </p>
          </div>

          {/* Section 3: The Tenant Agrees */}
          <div className="space-y-2 text-[11.5px] leading-relaxed border-t border-neutral-200 pt-4 mb-5">
            <h3 className="font-bold text-sm mb-2 text-black">
              3. The Tenant Agrees / ผู้เช่าตกลงทำสัญญาดังต่อไปนี้:
            </h3>
            <p><strong>3.1</strong> To keep all floors, walls, ceiling, windows, window treatments, doors, furniture, outside space, domestic appliances, and all fixtures and fittings in good condition, except for normal wear and tear.</p>
            <p className="text-neutral-600 pl-4">จะรักษาพื้น ผนัง ฝ้าเพดาน หน้าต่าง ประตู เฟอร์นิเจอร์ อุปกรณ์ไฟฟ้า ให้อยู่ในสภาพดี เว้นแต่ร่องรอยอันเกิดจากการใช้งานปกติ</p>

            <p><strong>3.2</strong> To use the Premises only for business and legal purposes for the Tenant or their employees for working only.</p>
            <p className="text-neutral-600 pl-4">จะใช้สถานที่เช่าสำหรับทำงานและตามวัตถุประสงค์ที่ถูกต้องภายใต้กฎหมายสำหรับผู้เช่าหรือพนักงานของผู้เช่าเท่านั้น</p>

            <p><strong>3.3</strong> To pay utility charges for electricity, water, garbage collection fees, and other expenses incurred on time.</p>
            <p className="text-neutral-600 pl-4">จะชำระค่าสาธารณูปโภค ค่าไฟฟ้า ค่าน้ำ ค่าเก็บขยะ หรือค่าใช้จ่ายอื่นๆ ที่เกิดขึ้นจากผู้เช่าให้ตรงเวลา</p>

            <p><strong>3.4</strong> To promptly repair at own expense any damage caused by the Tenant, family, guests, but not for ordinary wear and tear.</p>
            <p className="text-neutral-600 pl-4">จะซ่อมแซมและออกค่าใช้จ่ายเองหากเกิดความเสียหายต่อทรัพย์สินที่เช่าโดยเกิดจากผู้เช่าหรือบริวาร</p>

            <p><strong>3.5 Pets / การเลี้ยงสัตว์:</strong> No pets are allowed. / ไม่อนุญาตให้เลี้ยงสัตว์</p>

            <p><strong>3.6 Inspection / การเข้าตรวจ:</strong> To permit the Landlord/agent to enter for inspection and repairing with reasonable notice, and to show to prospective tenants during 30 days prior to expiration.</p>
            <p className="text-neutral-600 pl-4">จะอนุญาตให้ผู้ให้เช่าหรือตัวแทนเข้าตรวจและซ่อมแซมตามสมควร และให้เข้าชมสถานที่ใน 30 วันก่อนหมดสัญญา</p>

            <p><strong>3.7 Alterations / การต่อเติม:</strong> Not to make structural alterations, additions, demolish, repaint, nor drill holes without prior written consent.</p>
            <p className="text-neutral-600 pl-4">ไม่ปรับปรุง ต่อเติม รื้อถอน ทาสี หรือเจาะผนัง โดยปราศจากการแจ้งให้ผู้ให้เช่าทราบเป็นลายลักษณ์อักษรล่วงหน้า</p>

            <p><strong>3.8 Smoking / การสูบบุหรี่:</strong> Smoking is strictly prohibited inside the Premises. / ไม่อนุญาตให้สูบบุหรี่ภายในสถานที่</p>

            <p><strong>3.9 Nuisance / ความสงบ:</strong> Not to cause or permit any nuisance or interference with neighbors.</p>
            <p className="text-neutral-600 pl-4">ไม่กระทำการอันเป็นเหตุให้เกิดความเดือดร้อนรำคาญหรือรบกวนความสงบสุขของเพื่อนบ้าน</p>

            <p><strong>3.10 Keys & Cards / กุญแจและบัตร:</strong> To return all keys and access cards upon termination. Tenant is responsible for replacement cost if lost.</p>
            <p className="text-neutral-600 pl-4">จะส่งมอบกุญแจและบัตรผ่านคืนในวันสิ้นสุดสัญญา หากสูญหายผู้เช่าต้องรับผิดชอบค่าทำใหม่</p>

            <p><strong>3.11 Illegal Acts / กฎหมาย:</strong> Not to use the Premises for any illegal purposes. / ไม่ใช้สถานที่เช่าในการกระทำสิ่งผิดกฎหมาย</p>

            <p><strong>3.12 Hazardous Materials / วัตถุอันตราย:</strong> Not to keep dangerous, combustible, explosive materials, or illegal substances in the Premises.</p>
            <p className="text-neutral-600 pl-4">ไม่เก็บวัตถุอันตราย วัตถุไวไฟ วัตถุระเบิด หรือสิ่งผิดกฎหมายในสถานที่เช่า</p>

            <p><strong>3.13 Clean Handover / การส่งมอบ:</strong> To return the property in a clean condition and remove all personal belongings at own cost.</p>
            <p className="text-neutral-600 pl-4">จะส่งคืนสถานที่ในสภาพสะอาดเรียบร้อย และขนย้ายสิ่งของของผู้เช่าออกด้วยค่าใช้จ่ายตนเอง</p>

            <p><strong>3.14 Computer Servers / เซิร์ฟเวอร์:</strong> Computer server installation is not allowed. / ไม่อนุญาตให้ติดตั้งคอมพิวเตอร์เซิร์ฟเวอร์</p>
          </div>

          {/* Section 4: The Landlord Agrees */}
          <div className="space-y-2 text-[11.5px] leading-relaxed border-t border-neutral-200 pt-4 mb-5">
            <h3 className="font-bold text-sm mb-2 text-black">
              4. The Landlord Agrees / ผู้ให้เช่าตกลงทำสัญญาดังต่อไปนี้:
            </h3>
            <p><strong>4.1</strong> To ensure the Tenant peacefully enjoys the use of the property without unlawful interruption.</p>
            <p className="text-neutral-600 pl-4">รับรองให้ผู้เช่าอยู่อาศัยและใช้งานสถานที่เช่าได้อย่างสงบสุข</p>

            <p><strong>4.2</strong> To keep the Premises in good repair, including annual maintenance of air-conditioning units.</p>
            <p className="text-neutral-600 pl-4">จะดูแลซ่อมแซมสถานที่เช่าให้อยู่ในสภาพดี รวมถึงการบำรุงรักษาเครื่องปรับอากาศประจำปี</p>

            <p><strong>4.3</strong> To pay for major repairs exceeding 1,000 THB per occurrence. If delayed over 7 days, Tenant may proceed and claim reimbursement.</p>
            <p className="text-neutral-600 pl-4">จะรับผิดชอบค่าซ่อมแซมใหญ่ที่เกินกว่า 1,000 บาท หากล่าช้าเกิน 7 วันผู้เช่าดำเนินการซ่อมและเบิกคืนได้</p>

            <p><strong>4.4</strong> To ensure that at commencement, the Premises is clean and in habitable condition.</p>
            <p className="text-neutral-600 pl-4">จะรับรองว่าเมื่อเริ่มต้นสัญญา สถานที่เช่าต้องสะอาดและอยู่ในสภาพพร้อมใช้งาน</p>

            <p><strong>4.5</strong> To pay all land and building taxes levied on the Premises.</p>
            <p className="text-neutral-600 pl-4">จะเป็นผู้ชำระภาษีที่ดินและสิ่งปลูกสร้างของสถานที่เช่า</p>

            <p><strong>4.6 Deposit Refund:</strong> To refund security deposit within 30 days after lease ends, minus actual damages.</p>
            <p className="text-neutral-600 pl-4">จะคืนเงินประกันให้แก่ผู้เช่าภายใน 30 วันหลังจากสิ้นสุดสัญญา โดยหักค่าเสียหายตามจริง (หากมี)</p>
          </div>

          {/* Section 5, 6, 7: Termination, Extension, Law */}
          <div className="space-y-2 text-[11.5px] leading-relaxed border-t border-neutral-200 pt-4 mb-6">
            <h3 className="font-bold text-sm mb-2 text-black">
              5. TERMINATION & 6. EXTENSION & 7. GOVERNING LAW
            </h3>
            <p><strong>5.1 Early Termination:</strong> Tenant may terminate early by giving 30 days written notice, forfeiting the 2-month security deposit as penalty.</p>
            <p className="text-neutral-600 pl-4">ผู้เช่าบอกเลิกสัญญาก่อนกำหนดได้โดยแจ้งล่วงหน้า 30 วัน และยินยอมให้ริบเงินประกัน 2 เดือนเป็นค่าปรับ</p>

            <p><strong>5.2 Force Majeure:</strong> Terminates immediately if uninhabitable due to court order or force majeure, deposit refunded.</p>
            <p className="text-neutral-600 pl-4">สิ้นสุดลงทันทีหากสถานที่เช่าไม่สามารถใช้งานได้จากเหตุสุดวิสัย และต้องคืนเงินประกัน</p>

            <p><strong>5.3 Default:</strong> If Tenant defaults on rent or breaches terms and fails to remedy within 10 days of notice, Landlord may repossess.</p>
            <p className="text-neutral-600 pl-4">หากผิดนัดชำระหรือไม่แก้ไขภายใน 10 วันหลังแจ้งเตือน ผู้ให้เช่ามีสิทธิ์บอกเลิกสัญญาและกลับเข้าครอบครอง</p>

            <p><strong>6. Extension:</strong> Tenant shall notify Landlord in writing at least 30 days before termination to extend.</p>
            <p className="text-neutral-600 pl-4">หากประสงค์จะต่อสัญญา จะต้องแจ้งล่วงหน้าเป็นลายลักษณ์อักษรอย่างน้อย 30 วัน</p>

            <p><strong>7. Governing Law:</strong> Governed by the laws of Thailand. / อยู่ภายใต้และตีความตามกฎหมายของราชอาณาจักรไทย</p>
          </div>

          {/* Dual Signature Blocks */}
          <div className="border-t-2 border-black pt-6 grid grid-cols-2 gap-8 text-xs">
            {/* Landlord Signature Block */}
            <div className="space-y-3">
              <p className="font-bold uppercase">
                ผู้ให้เช่า / LANDLORD:<br />
                <span className="text-blue-950 font-semibold">Colasola Co., Ltd. (บริษัท โคล่าโซล่า จำกัด)</span>
              </p>
              
              <div className="h-20 border-b border-black flex items-end pb-1">
                <span className="text-neutral-400 font-serif italic text-sm">
                  [ Authorized Corporate Stamp & Signature ]
                </span>
              </div>

              <div className="space-y-1 text-[11px]">
                <p><strong>Written Name / ชื่อเต็ม:</strong> Authorized Signatory</p>
                <p><strong>Title / ตำแหน่ง:</strong> Managing Director</p>
                <p><strong>Date / วันที่:</strong> {formatEngDate(startDate)}</p>
                <p><strong>Phone Number / เบอร์โทรศัพท์:</strong> +66 (0) 53 000 000</p>
              </div>
            </div>

            {/* Tenant Signature Block */}
            <div className="space-y-3">
              <p className="font-bold uppercase">
                ผู้เช่า / TENANT:<br />
                <span className="text-blue-900 font-semibold">{tenantName || "____________________"}</span>
              </p>
              
              <div className="h-20 border-b border-black flex items-end pb-1">
                {signatureData ? (
                  <img
                    src={signatureData}
                    alt="Tenant Signature"
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-red-400 text-xs italic font-mono">
                    (Pending Tenant Digital Signature / 待承租人手写签名)
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[11px]">
                <p><strong>Written Name / ชื่อเต็ม:</strong> {tenantName || "____________________"}</p>
                <p><strong>Title / ตำแหน่ง:</strong> {tenantType === "company" ? "Authorized Representative" : "Individual Tenant"}</p>
                <p><strong>Date / วันที่:</strong> {new Date().toISOString().split("T")[0]}</p>
                <p><strong>Phone Number / เบอร์โทรศัพท์:</strong> {tenantPhone || "____________________"}</p>
              </div>
            </div>
          </div>

          {/* Legal Document Attachment: Passport / ID Photo */}
          {idImage && (
            <div className="mt-12 pt-8 border-t-2 border-dashed border-neutral-300 page-break-before">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700 mb-3 text-center">
                LEGAL ATTACHMENT / เอกสารแนบ: TENANT PASSPORT / ID COPY
              </h4>
              <div className="border border-neutral-300 rounded-lg p-2 bg-neutral-50 flex justify-center">
                <img
                  src={idImage}
                  alt="Tenant Identity Document"
                  className="max-h-80 max-w-full object-contain rounded shadow-sm"
                />
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default function ContractPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-500 font-mono">Loading Lease Agreement...</div>}>
      <ContractContent />
    </Suspense>
  );
}
