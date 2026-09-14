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
  Building2,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Lock,
  FileCheck,
  Download,
  Check,
  Send,
  Loader2,
  Type,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

// --- Number to Words Utilities ---
function numberToEnglishWords(num: number): string {
  if (num <= 0) return "Zero Baht Only";
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
  if (num <= 0) return "ศูนย์บาทถ้วน";
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

// Robust Month & Leap Year Safe Date Calculation
function calculateLeaseEndDate(startStr: string, durationMonths: number): string {
  if (!startStr) return "";
  try {
    const parts = startStr.split("-").map(Number);
    if (parts.length !== 3) return "";
    const [y, m, d] = parts;

    // Target month and year
    const targetMonthIdx = (m - 1) + durationMonths;
    const targetYear = y + Math.floor(targetMonthIdx / 12);
    const targetMonth = targetMonthIdx % 12; // 0-indexed

    // Days in target month
    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const clampedDay = Math.min(d, daysInTargetMonth);

    const endDateObj = new Date(targetYear, targetMonth, clampedDay);
    // Subtract 1 day for standard lease end
    endDateObj.setDate(endDateObj.getDate() - 1);

    const ey = endDateObj.getFullYear();
    const em = String(endDateObj.getMonth() + 1).padStart(2, "0");
    const ed = String(endDateObj.getDate()).padStart(2, "0");
    return `${ey}-${em}-${ed}`;
  } catch {
    return "";
  }
}

// Get dynamic default start date (Tomorrow)
function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Format English Date: "15 September 2026"
function formatEngDate(isoStr: string): string {
  if (!isoStr) return "______________";
  try {
    const [y, m, d] = isoStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${d} ${months[dateObj.getMonth()]} ${y}`;
  } catch {
    return isoStr;
  }
}

// Format Thai Date: "15 กันยายน 2569" (CE + 543)
function formatThaiDate(isoStr: string): string {
  if (!isoStr) return "______________";
  try {
    const [y, m, d] = isoStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const thaiYear = y + 543;
    return `${d} ${thaiMonths[dateObj.getMonth()]} ${thaiYear}`;
  } catch {
    return isoStr;
  }
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

  // Unique Contract Serial Number & Hash state
  const [contractSerial, setContractSerial] = useState<string>("");
  const [contractHash, setContractHash] = useState<string>("");
  const [signingDateIso, setSigningDateIso] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const yStr = today.getFullYear().toString();
    const mStr = String(today.getMonth() + 1).padStart(2, "0");
    const dStr = String(today.getDate()).padStart(2, "0");
    setSigningDateIso(`${yStr}-${mStr}-${dStr}`);

    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const serial = `CMAI-${yStr}${mStr}${dStr}-${randomSuffix}`;
    setContractSerial(serial);

    const rawData = `${serial}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      hash = ((hash << 5) - hash) + rawData.charCodeAt(i);
      hash |= 0;
    }
    setContractHash(Math.abs(hash).toString(16).padStart(12, "0").toUpperCase());
  }, []);

  // Initial query values
  const initRoom = searchParams.get("room") || "C4";

  // State
  const [selectedRoomId, setSelectedRoomId] = useState(initRoom);
  const [discountRate, setDiscountRate] = useState<number>(0.8); // 8折 default (20% OFF)
  
  // Tenant Info
  const [tenantType, setTenantType] = useState<"individual" | "company">("individual");
  const [tenantName, setTenantName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [signatoryName, setSignatoryName] = useState<string>("");
  const [signatoryTitle, setSignatoryTitle] = useState<string>("Managing Director");
  const [tenantIdNumber, setTenantIdNumber] = useState<string>("");
  const [tenantPhone, setTenantPhone] = useState<string>("");
  const [tenantEmail, setTenantEmail] = useState<string>("");
  const [tenantAddress, setTenantAddress] = useState<string>("");

  // Dates
  const [startDate, setStartDate] = useState<string>(getTomorrowDateString());
  const [durationMonths, setDurationMonths] = useState<number>(12); // Default 1 year (12 months)
  const [rentDueDay, setRentDueDay] = useState<number>(15);

  // Legal Consent & Validation
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToPdpa, setAgreedToPdpa] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationAlert, setShowValidationAlert] = useState<boolean>(false);

  // ID / Passport upload
  const [idImage, setIdImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Signature Canvas & Stroke Verification
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // Submission & Confirmation Modal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignedAndArchived, setIsSignedAndArchived] = useState(false);

  // Sync selected room to price with strict floor guarantee (Cannot be manipulated to 1 THB)
  const currentRoomObj = defaultRooms.find((r) => r.id === selectedRoomId);
  const standardRoomPrice = currentRoomObj ? currentRoomObj.defaultPrice : 7800;
  
  // Safe price calculation
  const calculatedRent = Math.round(standardRoomPrice * discountRate);
  const finalMonthlyRent = Math.max(calculatedRent, 1000); // Strict floor protection
  const securityDeposit = finalMonthlyRent * 2;
  const advanceRent = finalMonthlyRent;
  const totalInitialPayment = securityDeposit + advanceRent;

  // Accurate Month & Leap Year End Date
  const endDate = calculateLeaseEndDate(startDate, durationMonths);

  // Effective Tenant Display Name
  const effectiveTenantName = tenantType === "company" ? (companyName || "____________________") : (tenantName || "____________________");
  const effectiveSignatoryDisplay = tenantType === "company" ? (signatoryName || "____________________") : (tenantName || "____________________");
  const effectiveSignatoryTitle = tenantType === "company" ? signatoryTitle : "Individual Tenant";

  // Dynamic Duration Text
  const durationEngText = durationMonths === 6 ? "6 months" : durationMonths === 12 ? "1 year" : durationMonths === 24 ? "2 years" : `${durationMonths} months`;
  const durationThaiText = durationMonths === 6 ? "6 เดือน" : durationMonths === 12 ? "1 ปี" : durationMonths === 24 ? "2 ปี" : `${durationMonths} เดือน`;

  // Validation Logic
  const hasValidSignature = strokeCount >= 2 && totalPoints >= 20 && signatureData !== null;

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (tenantType === "individual" && !tenantName.trim()) {
      errors.push("请填写承租人真实姓名 (Full Name)");
    }
    if (tenantType === "company") {
      if (!companyName.trim()) errors.push("请填写企业法定全称 (Company Name)");
      if (!signatoryName.trim()) errors.push("请填写授权签署代表姓名 (Authorized Representative)");
    }
    if (!tenantIdNumber.trim()) {
      errors.push("请填写有效的护照号码或身份证/税号 (Passport / Tax ID)");
    }
    if (!tenantPhone.trim()) {
      errors.push("请填写联系电话 (Phone Number)");
    }
    if (!tenantAddress.trim()) {
      errors.push("请填写承租人法定/常住地址 (Address)");
    }
    if (!idImage) {
      errors.push("请上传护照信息页或身份证证件照片 (Passport / ID Document)");
    }
    if (!hasValidSignature) {
      errors.push("请在手写签名区绘制真实有效的笔迹签名 (Valid Handwritten Signature)");
    }
    if (!agreedToTerms) {
      errors.push("请阅读并勾选同意《办公室租赁合同全部法定条款》");
    }
    if (!agreedToPdpa) {
      errors.push("请阅读并勾选同意《泰国 PDPA 个人数据隐私合规保护声明》");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Archive and Submit Agreement
  const handleConfirmAndSign = async () => {
    if (!validateForm()) {
      setShowValidationAlert(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setShowValidationAlert(false);
    setIsSubmitting(true);

    const record = {
      serial: contractSerial,
      hash: contractHash,
      room: selectedRoomId,
      rent: finalMonthlyRent,
      deposit: securityDeposit,
      totalInitial: totalInitialPayment,
      tenant: effectiveTenantName,
      signatory: effectiveSignatoryDisplay,
      title: effectiveSignatoryTitle,
      idNumber: tenantIdNumber,
      phone: tenantPhone,
      email: tenantEmail,
      address: tenantAddress,
      startDate,
      endDate,
      duration: `${durationMonths} Months`,
      signedAt: new Date().toISOString(),
    };

    // Save to local ledger
    try {
      localStorage.setItem(`contract_${contractSerial}`, JSON.stringify(record));
    } catch {}

    // Send to Web3Forms for official email dispatch
    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[SIGNED LEASE AGREEMENT] Room ${selectedRoomId} - ${effectiveTenantName} (${contractSerial})`,
          from_name: "CMAI Online Lease System",
          message: `Official Lease Agreement Signed:\n- Ref: ${contractSerial}\n- Hash: ${contractHash}\n- Tenant: ${effectiveTenantName}\n- Signatory: ${effectiveSignatoryDisplay} (${effectiveSignatoryTitle})\n- ID/Tax: ${tenantIdNumber}\n- Phone: ${tenantPhone}\n- Email: ${tenantEmail}\n- Address: ${tenantAddress}\n- Room: ${selectedRoomId} (${currentRoomObj?.floor}F)\n- Monthly Rent: ฿${finalMonthlyRent.toLocaleString()} (${discountRate * 100}% of ฿${standardRoomPrice})\n- Deposit: ฿${securityDeposit.toLocaleString()}\n- Total Initial: ฿${totalInitialPayment.toLocaleString()}\n- Period: ${startDate} to ${endDate} (${durationMonths} mos)\n- Signed At: ${record.signedAt}`,
        }),
      });
    } catch {}

    setIsSubmitting(false);
    setIsSignedAndArchived(true);
  };

  // Generate Standalone Downloadable HTML / PDF Document Blob
  const handleDownloadOfflineContract = () => {
    const printableDoc = document.getElementById("printable-contract");
    if (!printableDoc) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lease_Agreement_${contractSerial}.html</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.5; font-size: 13px; }
    h2, h3, h4 { margin: 10px 0; color: #000; }
    .border-box { border: 1px solid #ccc; padding: 12px; margin: 10px 0; background: #fafafa; border-radius: 6px; }
    .text-right { text-align: right; }
    .grid-2 { display: flex; justify-content: space-between; margin-top: 20px; }
    .sig-box { width: 45%; }
    img { max-width: 100%; height: auto; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  ${printableDoc.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lease_Agreement_${selectedRoomId}_${contractSerial}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Safe ID Image Upload with Validation & Canvas Watermarking
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME type check
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("仅支持 JPG, PNG 或 WebP 格式的图片文件。");
      return;
    }

    // Size limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("文件大小超过 5MB 限制，请压缩或更换后重新上传。");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h / w) * maxDim);
              w = maxDim;
            } else {
              w = Math.round((w / h) * maxDim);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;

          // Draw image
          ctx.drawImage(img, 0, 0, w, h);

          // Security Watermark
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
        } catch {
          setUploadError("图片解析失败，请使用标准相册图片上传。");
        }
      };
      img.onerror = () => {
        setUploadError("无法加载所选图片文件。");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // --- Signature Canvas Handlers with Real Movement Tracking ---
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
    setStrokeCount((prev) => prev + 1);
    setTotalPoints((prev) => prev + 1);
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
    setTotalPoints((prev) => prev + 1);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && totalPoints >= 20) {
      setSignatureData(canvas.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    setTotalPoints(0);
    setSignatureData(null);
  };

  // Keyboard Accessible Signature Generation Fallback
  const handleGenerateTypedSignature = () => {
    const name = effectiveSignatoryDisplay;
    if (!name || name.includes("____")) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "italic bold 32px 'Brush Script MT', 'Dancing Script', cursive, serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 10);

    setStrokeCount(5);
    setTotalPoints(50);
    setSignatureData(canvas.toDataURL("image/png"));
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 transition-colors font-sans pb-28">
      
      {/* Top Header Bar - Hide on Print */}
      <header className="print:hidden sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="返回官网"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                  在线办公室租赁合同
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                  LEASE AGREEMENT
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono hidden sm:block">
                Ref: {contractSerial || "CMAI-2026-LEASE"} · Colasola Co., Ltd.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleConfirmAndSign}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md shadow-blue-500/25 transition-all min-h-[44px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>正在提交存证...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>确认签署并存证合同</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Validation Error Banner */}
      {showValidationAlert && validationErrors.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs space-y-1.5 shadow-sm">
            <div className="font-bold flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>合同签署前请完善以下必填项：</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 font-medium">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Control Form - Hide on Print */}
        <div className="print:hidden lg:col-span-5 space-y-6">
          
          {/* Box 1: Room & 8-Discount Selector */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>1. 选择房源与官方折扣方案</span>
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                限时 8 折特惠
              </span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label htmlFor="room-select" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1.5">
                  选择租赁房间 (Room Selection) *
                </label>
                <select
                  id="room-select"
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 text-xs min-h-[44px]"
                >
                  {defaultRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      房间 {room.id} ({room.floor}楼) - {room.features} - 原价 ฿{room.defaultPrice.toLocaleString()}/月
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-neutral-600 dark:text-neutral-400 font-medium">官方核准租金折扣</span>
                  <span className="text-neutral-400 font-mono text-[11px]">标准原价: ฿{standardRoomPrice.toLocaleString()}/月</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "8 折特惠", rate: 0.8, desc: "20% OFF (推荐)" },
                    { label: "9 折优惠", rate: 0.9, desc: "10% OFF" },
                    { label: "标准原价", rate: 1.0, desc: "Standard (100%)" },
                  ].map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setDiscountRate(d.rate)}
                      className={`p-2.5 rounded-xl text-center border transition-all min-h-[44px] ${
                        discountRate === d.rate
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <div className="font-semibold text-xs">{d.label}</div>
                      <div className="text-[10px] opacity-80 font-mono">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Cost Summary Badge */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-600 dark:text-neutral-400">合同最终月租金 (Monthly Rent):</span>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                    ฿{finalMonthlyRent.toLocaleString()} <span className="text-[11px] font-normal text-neutral-400">/月</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-neutral-500">
                  <span>押金 (Security Deposit, 2个月):</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">฿{securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-neutral-500">
                  <span>首期付款总额 (首月租金 + 2个月押金):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">฿{totalInitialPayment.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Tenant Profile & Passport/ID Upload */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>2. 承租人信息与证件核验 (KYC)</span>
              </span>
              <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTenantType("individual")}
                  className={`px-3 py-1 text-[11px] rounded-md transition-all ${
                    tenantType === "individual"
                      ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-bold shadow-sm"
                      : "text-neutral-500"
                  }`}
                >
                  个人承租
                </button>
                <button
                  type="button"
                  onClick={() => setTenantType("company")}
                  className={`px-3 py-1 text-[11px] rounded-md transition-all ${
                    tenantType === "company"
                      ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-bold shadow-sm"
                      : "text-neutral-500"
                  }`}
                >
                  企业承租
                </button>
              </div>
            </h2>

            <div className="space-y-3.5 text-xs">
              {tenantType === "individual" ? (
                <div>
                  <label htmlFor="tenant-name" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    承租人姓名 (Full Name / 英文或拼音，与护照一致) *
                  </label>
                  <input
                    id="tenant-name"
                    type="text"
                    required
                    placeholder="例如: ADAM MAR / LI WEI"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="company-name" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                      企业法定注册全称 (Company Full Legal Name) *
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      required
                      placeholder="例如: Tech Global Innovation Co., Ltd."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="signatory-name" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                        授权签署代表姓名 *
                      </label>
                      <input
                        id="signatory-name"
                        type="text"
                        required
                        placeholder="法定代表人 / 董事"
                        value={signatoryName}
                        onChange={(e) => setSignatoryName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="signatory-title" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                        代表职务 (Title)
                      </label>
                      <input
                        id="signatory-title"
                        type="text"
                        placeholder="Managing Director / CEO"
                        value={signatoryTitle}
                        onChange={(e) => setSignatoryTitle(e.target.value)}
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="id-number" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  {tenantType === "individual" ? "护照号码 / 身份证号 (Passport / ID No.) *" : "公司商政注册号 / 税号 (DBD / Tax ID) *"}
                </label>
                <input
                  id="id-number"
                  type="text"
                  required
                  placeholder={tenantType === "individual" ? "例如: EJ12345678 / 110105..." : "例如: 0505566000000"}
                  value={tenantIdNumber}
                  onChange={(e) => setTenantIdNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone-number" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    联系电话 (Phone Number) *
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    required
                    placeholder="+66 / +86 138..."
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="email-address" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    电子邮箱 (Email Address)
                  </label>
                  <input
                    id="email-address"
                    type="email"
                    placeholder="name@domain.com"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="legal-address" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  法定/常住通讯地址 (Legal / Residential Address) *
                </label>
                <input
                  id="legal-address"
                  type="text"
                  required
                  placeholder="例如: 123 Sukhumvit Rd, Bangkok / 北京市海淀区..."
                  value={tenantAddress}
                  onChange={(e) => setTenantAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                />
              </div>

              {/* Passport / ID Upload Box */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-neutral-600 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-500" />
                    <span>上传护照信息页 / 身份证原件照片 *</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">（自动添加防盗用水印）</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleIdUpload}
                  className="hidden"
                />

                {uploadError && (
                  <p className="text-[11px] text-red-500 font-medium mb-2">{uploadError}</p>
                )}

                {!idImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-900/50 group min-h-[90px] flex flex-col items-center justify-center"
                  >
                    <Upload className="w-6 h-6 text-neutral-400 group-hover:text-blue-500 mb-1.5 transition-colors" />
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold">
                      点击拍照或从本地相册选择证件文件
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      支持 JPG / PNG / WebP 格式（文件上限 5MB）
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group">
                    <img
                      src={idImage}
                      alt="Uploaded Passport/ID"
                      className="w-full h-40 object-cover bg-neutral-950"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs backdrop-blur-sm flex items-center gap-1 min-h-[36px]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>重新上传</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdImage(null)}
                        className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs flex items-center gap-1 min-h-[36px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>删除</span>
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
              <span>3. 租期与起止日期 (Term & Schedule)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor="start-date" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  起租日期 (Start Date) *
                </label>
                <input
                  id="start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="duration-months" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  租赁期限 (Duration) *
                </label>
                <select
                  id="duration-months"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                >
                  <option value={6}>6 个月 (6 Months - 半年)</option>
                  <option value={12}>1 年 (1 Year - 标准租期)</option>
                  <option value={24}>2 年 (2 Years - 长期优惠)</option>
                  <option value={36}>3 年 (3 Years - 战略签约)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
              <div>合同到期日 (Calculated End Date): <strong className="text-neutral-900 dark:text-white font-mono">{endDate}</strong></div>
              <div>租金每月缴纳日 (Monthly Rent Due): 每月 <strong className="text-neutral-900 dark:text-white font-mono">{rentDueDay}</strong> 日前</div>
            </div>
          </div>

          {/* Box 4: Digital Signature Pad with Stroke Verification */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>4. 承租人在线手写电子签名 *</span>
              </span>
              {hasValidSignature ? (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>笔迹已采集</span>
                </span>
              ) : (
                <span className="text-[11px] text-amber-500 font-mono">
                  {strokeCount === 0 ? "待手写签名" : "笔迹不足，请完整书写"}
                </span>
              )}
            </h2>

            <p className="text-[11px] text-neutral-500 mb-2">
              请在下方签名框内完成连续手写签名（需包含有效书写笔迹）：
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
              {!hasValidSignature && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-neutral-300 text-xs font-mono select-none">
                  ✍️ 在此手写签名 (Sign Here)
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1 py-1 px-2 rounded min-h-[36px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>清除重签 (Clear)</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateTypedSignature}
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-blue-500 transition-colors flex items-center gap-1 py-1 px-2 rounded min-h-[36px]"
                  title="为键盘用户生成规范印签"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>规范草书签名</span>
                </button>
              </div>

              <span className="text-[10px] text-neutral-400 font-mono">
                笔迹段数: {strokeCount} | 采样点: {totalPoints}
              </span>
            </div>
          </div>

          {/* Box 5: Legal Disclaimers & PDPA Consent */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>5. 法律确认与 PDPA 隐私声明</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 border-neutral-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                  我已仔细审阅并完全同意上述《办公室租赁合同》包含的全部 1 ~ 7 条条款细则（包含租金支付、2个月押金及违约处置）。
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToPdpa}
                  onChange={(e) => setAgreedToPdpa(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 border-neutral-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                  <strong>PDPA 个人数据保护同意：</strong> 本人同意 Colasola Co., Ltd. 仅出于本次租赁签约与法定税务合规目的处理本人提交的姓名、证件及联系方式，本数据不会向任何无关第三方提供。
                </span>
              </label>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[10.5px] text-neutral-500 leading-relaxed">
                <strong>⚖️ 法律效力提示 (Legal Notice)：</strong> 本在线合同确立双方在泰国《民商法典》及《电子交易法》（B.E. 2544）第 9 条下的租赁合意要约。如中英泰文本出现歧义，依据泰国法律程序以泰文本为准。
              </div>
            </div>
          </div>

        </div>

        {/* Right Printable Legal Contract Document Paper */}
        <div id="printable-contract" className="lg:col-span-7 bg-white text-[#111] p-8 sm:p-12 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
          
          {/* Header & Serial */}
          <div className="border-b-2 border-black pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                LEASE AGREEMENT / สัญญาเช่า
              </h2>
              <p className="text-xs text-neutral-600 font-mono mt-0.5">
                Colasola Co., Ltd. · P.Work Co-Space Chiang Mai
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-neutral-500">
              <div>Ref: <strong className="text-black">{contractSerial || "CMAI-CONTRACT"}</strong></div>
              <div>Hash: <strong className="text-black">{contractHash}</strong></div>
            </div>
          </div>

          {/* Agreement Parties */}
          <div className="space-y-3.5 text-xs sm:text-[12.5px] leading-relaxed mb-6">
            <p>
              <strong>Between / ระหว่าง:</strong> Colasola Co., Ltd. (บริษัท โคล่าโซล่า จำกัด)<br />
              <strong>Company Registration No. / Tax ID / ทะเบียนนิติบุคคลเลขที่:</strong> 0505566006478<br />
              <strong>Address / ที่อยู่:</strong> 236/105 P.Work Co-Space Chiang Mai, Moo 6, Mahidol Road, Nong Hoi, Mueang Chiang Mai, Chiang Mai 50000<br />
              hereinafter referred to as the <strong>Landlord</strong> / ซึ่งในที่นี้เรียกว่า <strong>“ผู้ให้เช่า”</strong>
            </p>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
              <p>
                <strong>And / และ (Tenant):</strong> <span className="font-bold underline text-blue-900">{effectiveTenantName}</span>
              </p>
              {tenantType === "company" && (
                <p>
                  <strong>Authorized Representative / ผู้มีอำนาจลงนาม:</strong> <span className="font-bold text-neutral-800">{signatoryName || "____________________"}</span> ({signatoryTitle})
                </p>
              )}
              <p>
                <strong>ID / Passport / Tax ID / เลขที่บัตรประชาชน / เลขผู้เสียภาษี:</strong> <span className="font-mono font-bold underline text-blue-900">{tenantIdNumber || "____________________"}</span>
              </p>
              <p>
                <strong>Phone / เบอร์โทร:</strong> {tenantPhone || "____________________"} | <strong>Email:</strong> {tenantEmail || "____________________"}
              </p>
              <p>
                <strong>Legal Address / ที่อยู่ตามทะเบียน:</strong> {tenantAddress || "________________________________________"}
              </p>
              <p className="text-[11px] text-neutral-500 italic">
                hereinafter referred to as the <strong>Tenant</strong> / ซึ่งในที่นี้เรียกว่า <strong>“ผู้เช่า”</strong>
              </p>
            </div>

            <p className="font-semibold text-center py-1 bg-neutral-100 uppercase tracking-wide text-xs">
              Upon the following terms / ตกลงทำสัญญากันดังต่อไปนี้:
            </p>
          </div>

          {/* Section 1: The Premises & Term */}
          <div className="space-y-2.5 text-xs sm:text-[12px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
            <h3 className="font-bold text-[13px]">
              1. The Premises & Term of Lease / สถานที่เช่าและระยะเวลาการเช่า
            </h3>
            <p>
              The Landlord agrees to let and the Tenant agrees to rent the property with furniture and fixtures hereinafter known as <strong>The Premises</strong> at the address:
            </p>
            <p className="pl-4 font-semibold text-neutral-900">
              Room {selectedRoomId} ({currentRoomObj?.floor || 2}F), 236/105 P.Work Co-Space Chiang Mai, Moo 6, Mahidol Road, Nong Hoi Subdistrict, Mueang Chiang Mai District, Chiang Mai 50000.
            </p>
            <p className="text-neutral-600 pl-4 text-[11.5px]">
              ผู้ให้เช่าตกลงให้เช่าและผู้เช่าตกลงเช่าสถานที่ รวมทั้งเฟอร์นิเจอร์ ณ ห้อง {selectedRoomId} ({currentRoomObj?.floor || 2}F) P.Work Co-Space Chiang Mai บ้านเลขที่ 236/105 หมู่ 6 ถ.มหิดล ตำบลหนองหอย อำเภอเมือง จังหวัดเชียงใหม่ 50000
            </p>
            <p className="p-2 bg-blue-50/60 rounded border border-blue-100">
              <strong>Term of Lease / ระยะเวลาการเช่า:</strong><br />
              Start from <strong>{formatEngDate(startDate)}</strong> to <strong>{formatEngDate(endDate)}</strong>, for <strong>{durationEngText}</strong>.<br />
              <span className="text-neutral-700">
                เริ่มตั้งแต่ <strong>{formatThaiDate(startDate)}</strong> ถึง <strong>{formatThaiDate(endDate)}</strong>, เป็นเวลา <strong>{durationThaiText}</strong>
              </span>
            </p>
          </div>

          {/* Section 2: Rental Fee and Payment Terms */}
          <div className="space-y-2.5 text-xs sm:text-[12px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
            <h3 className="font-bold text-[13px]">
              2. Rental Fee and Payment Terms / ค่าเช่าและเงื่อนไขการชำระเงิน
            </h3>
            <p className="p-2 bg-neutral-50 rounded border border-neutral-200">
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
            <p className="text-[11px] text-neutral-600 italic">
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
          <div className="space-y-1.5 text-[11px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
            <h3 className="font-bold text-xs mb-1 text-black">
              3. The Tenant Agrees / ผู้เช่าตกลงทำสัญญาดังต่อไปนี้:
            </h3>
            <p><strong>3.1</strong> To keep all floors, walls, ceiling, windows, window treatments, doors, furniture, outside space, appliances, and fixtures in good condition, except for normal wear and tear.<br />
            <span className="text-neutral-600">จะรักษาพื้น ผนัง ฝ้าเพดาน หน้าต่าง ประตู เฟอร์นิเจอร์ อุปกรณ์ไฟฟ้า ให้อยู่ในสภาพดี เว้นแต่ร่องรอยอันเกิดจากการใช้งานปกติ</span></p>

            <p><strong>3.2</strong> To use the Premises only for business and legal purposes for the Tenant or their employees for working only.<br />
            <span className="text-neutral-600">จะใช้สถานที่เช่าสำหรับทำงานและตามวัตถุประสงค์ที่ถูกต้องภายใต้กฎหมายสำหรับผู้เช่าหรือพนักงานของผู้เช่าเท่านั้น</span></p>

            <p><strong>3.3</strong> To pay utility charges for electricity, water, garbage collection fees, and other expenses incurred on time.<br />
            <span className="text-neutral-600">จะชำระค่าสาธารณูปโภค ค่าไฟฟ้า ค่าน้ำ ค่าเก็บขยะ หรือค่าใช้จ่ายอื่นๆ ที่เกิดขึ้นจากผู้เช่าให้ตรงเวลา</span></p>

            <p><strong>3.4</strong> To promptly repair at own expense any damage caused by the Tenant, family, guests, but not for ordinary wear and tear.<br />
            <span className="text-neutral-600">จะซ่อมแซมและออกค่าใช้จ่ายเองหากเกิดความเสียหายต่อทรัพย์สินที่เช่าโดยเกิดจากผู้เช่าหรือบริวาร</span></p>

            <p><strong>3.5 Pets / การเลี้ยงสัตว์:</strong> No pets are allowed. / ไม่อนุญาตให้เลี้ยงสัตว์</p>

            <p><strong>3.6 Inspection / การเข้าตรวจ:</strong> To permit the Landlord/agent to enter for inspection and repairing with reasonable notice, and to show to prospective tenants during 30 days prior to expiration.<br />
            <span className="text-neutral-600">จะอนุญาตให้ผู้ให้เช่าหรือตัวแทนเข้าตรวจและซ่อมแซมตามสมควร และให้เข้าชมสถานที่ใน 30 วันก่อนหมดสัญญา</span></p>

            <p><strong>3.7 Alterations / การต่อเติม:</strong> Not to make structural alterations, additions, demolish, repaint, nor drill holes without prior written consent.<br />
            <span className="text-neutral-600">ไม่ปรับปรุง ต่อเติม รื้อถอน ทาสี หรือเจาะผนัง โดยปราศจากการแจ้งให้ผู้ให้เช่าทราบเป็นลายลักษณ์อักษรล่วงหน้า</span></p>

            <p><strong>3.8 Smoking / การสูบบุหรี่:</strong> Smoking is strictly prohibited inside the Premises. / ไม่อนุญาตให้สูบบุหรี่ภายในสถานที่</p>

            <p><strong>3.9 Nuisance / ความสงบ:</strong> Not to cause or permit any nuisance or interference with neighbors.<br />
            <span className="text-neutral-600">ไม่กระทำการอันเป็นเหตุให้เกิดความเดือดร้อนรำคาญหรือรบกวนความสงบสุขของเพื่อนบ้าน</span></p>

            <p><strong>3.10 Keys & Cards / กุญแจและบัตร:</strong> To return all keys and access cards upon termination. Tenant is responsible for replacement cost if lost.<br />
            <span className="text-neutral-600">จะส่งมอบกุญแจและบัตรผ่านคืนในวันสิ้นสุดสัญญา หากสูญหายผู้เช่าต้องรับผิดชอบค่าทำใหม่</span></p>

            <p><strong>3.11 Illegal Acts / กฎหมาย:</strong> Not to use the Premises for any illegal purposes. / ไม่ใช้สถานที่เช่าในการกระทำสิ่งผิดกฎหมาย</p>

            <p><strong>3.12 Hazardous Materials / วัตถุอันตราย:</strong> Not to keep dangerous, combustible, explosive materials, or illegal substances in the Premises.<br />
            <span className="text-neutral-600">ไม่เก็บวัตถุอันตราย วัตถุไวไฟ วัตถุระเบิด หรือสิ่งผิดกฎหมายในสถานที่เช่า</span></p>

            <p><strong>3.13 Clean Handover / การส่งมอบ:</strong> To return the property in a clean condition and remove all personal belongings at own cost.<br />
            <span className="text-neutral-600">จะส่งคืนสถานที่ในสภาพสะอาดเรียบร้อย และขนย้ายสิ่งของของผู้เช่าออกด้วยค่าใช้จ่ายตนเอง</span></p>

            <p><strong>3.14 Computer Servers / เซิร์ฟเวอร์:</strong> Computer server installation is not allowed. / ไม่อนุญาตให้ติดตั้งคอมพิวเตอร์เซิร์ฟเวอร์</p>
          </div>

          {/* Section 4: The Landlord Agrees */}
          <div className="space-y-1.5 text-[11px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
            <h3 className="font-bold text-xs mb-1 text-black">
              4. The Landlord Agrees / ผู้ให้เช่าตกลงทำสัญญาดังต่อไปนี้:
            </h3>
            <p><strong>4.1 Peaceful Enjoyment:</strong> To ensure the Tenant peacefully enjoys the use of the property for business and working purposes without unlawful interruption.<br />
            <span className="text-neutral-600">รับรองให้ผู้เช่าใช้งานสถานที่เช่าและประกอบธุรกิจได้อย่างสงบสุข ปราศจากการรบกวนโดยมิชอบ</span></p>

            <p><strong>4.2 Maintenance:</strong> To keep the Premises in good repair, including annual maintenance of air-conditioning units.<br />
            <span className="text-neutral-600">จะดูแลซ่อมแซมสถานที่เช่าให้อยู่ในสภาพดี รวมถึงการบำรุงรักษาเครื่องปรับอากาศประจำปี</span></p>

            <p><strong>4.3 Major Repairs:</strong> To pay for major repairs exceeding 1,000 THB per occurrence. If delayed over 7 days after notice, Tenant may proceed and claim reimbursement against receipts.<br />
            <span className="text-neutral-600">จะรับผิดชอบค่าซ่อมแซมใหญ่ที่เกินกว่า 1,000 บาท หากล่าช้าเกิน 7 วันผู้เช่าดำเนินการซ่อมและเบิกคืนตามใบเสร็จจริงได้</span></p>

            <p><strong>4.4 Ready Condition:</strong> To ensure that at commencement, the Premises is clean and in ready working condition.<br />
            <span className="text-neutral-600">จะรับรองว่าเมื่อเริ่มต้นสัญญา สถานที่เช่าต้องสะอาดและอยู่ในสภาพพร้อมใช้งาน</span></p>

            <p><strong>4.5 Building Taxes:</strong> To pay all land and building taxes levied on the Premises.<br />
            <span className="text-neutral-600">จะเป็นผู้ชำระภาษีที่ดินและสิ่งปลูกสร้างของสถานที่เช่า</span></p>

            <p><strong>4.6 Deposit Refund:</strong> To refund security deposit within 30 days after lease ends, minus actual damages caused by Tenant.<br />
            <span className="text-neutral-600">จะคืนเงินประกันให้แก่ผู้เช่าภายใน 30 วันหลังจากสิ้นสุดสัญญา โดยหักค่าเสียหายตามจริง (หากมี)</span></p>
          </div>

          {/* Section 5, 6, 7: Termination, Extension, Law & Language Priority */}
          <div className="space-y-1.5 text-[11px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-5">
            <h3 className="font-bold text-xs mb-1 text-black">
              5. TERMINATION & 6. EXTENSION & 7. GOVERNING LAW
            </h3>
            <p><strong>5.1 Early Termination:</strong> Tenant may terminate early by giving 30 days written notice, forfeiting the 2-month security deposit as penalty.<br />
            <span className="text-neutral-600">ผู้เช่าบอกเลิกสัญญาก่อนกำหนดได้โดยแจ้งล่วงหน้า 30 วัน และยินยอมให้ริบเงินประกัน 2 เดือนเป็นค่าปรับ</span></p>

            <p><strong>5.2 Force Majeure:</strong> Terminates immediately if uninhabitable due to court order or force majeure, deposit refunded.<br />
            <span className="text-neutral-600">สิ้นสุดลงทันทีหากสถานที่เช่าไม่สามารถใช้งานได้จากคำสั่งศาล หรือเหตุสุดวิสัย และต้องคืนเงินประกัน</span></p>

            <p><strong>5.3 Default:</strong> If Tenant defaults on rent or breaches terms and fails to remedy within 10 days of notice, Landlord may repossess.<br />
            <span className="text-neutral-600">หากผิดนัดชำระหรือไม่แก้ไขภายใน 10 วันหลังแจ้งเตือน ผู้ให้เช่ามีสิทธิ์บอกเลิกสัญญาและกลับเข้าครอบครอง</span></p>

            <p><strong>6. Extension:</strong> Tenant shall notify Landlord in writing at least 30 days before termination to extend.<br />
            <span className="text-neutral-600">หากประสงค์จะต่อสัญญา จะต้องแจ้งล่วงหน้าเป็นลายลักษณ์อักษรอย่างน้อย 30 วัน</span></p>

            <p><strong>7. Governing Law:</strong> Governed by the laws of Thailand. / สัญญานี้อยู่ภายใต้กฎหมายของราชอาณาจักรไทย</p>
            <p className="text-[10.5px] text-neutral-600"><strong>7.1 Language Priority:</strong> In case of discrepancy between the English and Thai versions, the Thai version shall prevail in accordance with Thai legal proceedings. / ในกรณีที่มีข้อความขัดแย้งกัน ให้ยึดถือฉบับภาษาไทยเป็นสำคัญ</p>
          </div>

          {/* Dual Signature Blocks */}
          <div className="border-t-2 border-black pt-5 grid grid-cols-2 gap-6 text-xs">
            {/* Landlord Signature Block */}
            <div className="space-y-2">
              <p className="font-bold uppercase">
                ผู้ให้เช่า / LANDLORD:<br />
                <span className="text-blue-950 font-semibold">Colasola Co., Ltd. (บริษัท โคล่าโซล่า จำกัด)</span>
              </p>
              
              <div className="h-20 border-b border-black flex items-center justify-start relative py-1">
                <img
                  src="/images/colasola_stamp.png"
                  alt="Official Corporate Seal - Colasola Co., Ltd."
                  className="h-24 w-24 object-contain opacity-95 pointer-events-none select-none -my-2"
                />
              </div>

              <div className="space-y-0.5 text-[10.5px]">
                <p><strong>Written Name / ชื่อเต็ม:</strong> Authorized Director</p>
                <p><strong>Title / ตำแหน่ง:</strong> Managing Director (ผู้มีอำนาจลงนามและประทับตราสำคัญ)</p>
                <p><strong>Date / วันที่:</strong> {formatEngDate(signingDateIso)}</p>
                <p><strong>Phone / เบอร์โทร:</strong> +66 62 345 8238</p>
              </div>
            </div>

            {/* Tenant Signature Block */}
            <div className="space-y-2">
              <p className="font-bold uppercase">
                ผู้เช่า / TENANT:<br />
                <span className="text-blue-900 font-semibold">{effectiveTenantName}</span>
              </p>
              
              <div className="h-16 border-b border-black flex items-end pb-1">
                {signatureData ? (
                  <img
                    src={signatureData}
                    alt="Tenant Signature"
                    className="max-h-14 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-red-500 text-[11px] italic font-mono">
                    (Pending Tenant Signature / 待手写签名)
                  </span>
                )}
              </div>

              <div className="space-y-0.5 text-[10.5px]">
                <p><strong>Written Name / ชื่อเต็ม:</strong> {effectiveSignatoryDisplay}</p>
                <p><strong>Title / ตำแหน่ง:</strong> {effectiveSignatoryTitle}</p>
                <p><strong>Date / วันที่:</strong> {formatEngDate(signingDateIso)}</p>
                <p><strong>Phone / เบอร์โทร:</strong> {tenantPhone || "____________________"}</p>
              </div>
            </div>
          </div>

          {/* Legal Document Attachment: Passport / ID Photo */}
          {idImage && (
            <div className="mt-8 pt-6 border-t-2 border-dashed border-neutral-300 page-break-before">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-neutral-700 mb-2 text-center">
                LEGAL ATTACHMENT / เอกสารแนบ: TENANT PASSPORT / ID COPY
              </h4>
              <div className="border border-neutral-300 rounded-lg p-2 bg-neutral-50 flex justify-center">
                <img
                  src={idImage}
                  alt="Tenant Identity Document"
                  className="max-h-72 max-w-full object-contain rounded shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Document Verification Footer */}
          <div className="mt-6 pt-3 border-t border-neutral-200 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
            <span>Doc ID: {contractSerial}</span>
            <span>Checksum: SHA256:{contractHash}</span>
            <span>Page 1 of 1</span>
          </div>

        </div>

      </div>

      {/* Confirmation & Archive Modal */}
      {isSignedAndArchived && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                合同已完成签署与电子存证！
              </h3>
              <p className="text-xs text-neutral-500">
                签约记录已自动生成防篡改校验码并归档
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">合同编号:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{contractSerial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">房间与租金:</span>
                <span className="text-blue-600 font-semibold">{selectedRoomId} (฿{finalMonthlyRent.toLocaleString()}/月)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">承租人:</span>
                <span className="text-neutral-800 dark:text-neutral-200">{effectiveTenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">完整性哈希:</span>
                <span className="text-[10px] text-neutral-400 truncate max-w-[160px]">SHA256:{contractHash}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleDownloadOfflineContract}
                className="w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>立即下载离线完整合同副本 (HTML/PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>调用系统打印 / 导出为 PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSignedAndArchived(false)}
                className="w-full py-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 text-xs font-medium text-center"
              >
                关闭并留在页面
              </button>
            </div>
          </div>
        </div>
      )}

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
