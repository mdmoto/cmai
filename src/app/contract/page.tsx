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
  { id: "B1-2", floor: 2, defaultPrice: 9400, features: "Private A/C · Natural Light Window (Double Suite)" },
  { id: "B6", floor: 2, defaultPrice: 3700, features: "Central A/C · Interior (Quiet Focus)" },
  { id: "B7", floor: 2, defaultPrice: 3100, features: "Central A/C · Natural Light Window (Cozy Window)" },
  { id: "C1-2", floor: 3, defaultPrice: 9700, features: "Private A/C · Panoramic Window (Executive Suite)" },
  { id: "C4", floor: 3, defaultPrice: 7800, features: "Private A/C · Natural Light Window (Standard Team)" },
  { id: "C5", floor: 3, defaultPrice: 4700, features: "Private A/C · Natural Light Window (Compact Pro)" },
  { id: "C6", floor: 3, defaultPrice: 1800, features: "Central A/C · Interior (Budget Solo)" },
  { id: "C7-8", floor: 3, defaultPrice: 5800, features: "Private A/C · Natural Light Window (Team Dual)" },
  { id: "C9", floor: 3, defaultPrice: 6000, features: "Private A/C · Natural Light Window (Studio Suite)" },
  { id: "C11", floor: 3, defaultPrice: 3000, features: "Central A/C · Interior (Focus Unit)" },
  { id: "C12", floor: 3, defaultPrice: 1500, features: "Central A/C · Natural Light Window (Single Window)" },
  { id: "D1-2", floor: 4, defaultPrice: 9700, features: "Private A/C · Panoramic Window (Large Suite)" },
  { id: "D3", floor: 4, defaultPrice: 7800, features: "Private A/C · Natural Light Window (Team Room)" },
  { id: "D4", floor: 4, defaultPrice: 7800, features: "Private A/C · Natural Light Window (Team Room)" },
  { id: "D5", floor: 4, defaultPrice: 4700, features: "Private A/C · Natural Light Window (Private Pro)" },
  { id: "D7-8", floor: 4, defaultPrice: 5800, features: "Private A/C · Natural Light Window (Dual Studio)" },
  { id: "D9", floor: 4, defaultPrice: 6000, features: "Private A/C · Natural Light Window (Studio Suite)" },
  { id: "D10", floor: 4, defaultPrice: 3000, features: "Central A/C · Interior (Focus Room)" },
  { id: "D11", floor: 4, defaultPrice: 3000, features: "Central A/C · Interior (Focus Room)" },
  { id: "E2", floor: 5, defaultPrice: 7800, features: "Private A/C · Top Floor Light (Top Floor Pro)" },
  { id: "E3", floor: 5, defaultPrice: 7800, features: "Private A/C · Top Floor Light (Top Floor Pro)" },
  { id: "E4-5", floor: 5, defaultPrice: 9600, features: "Private A/C · Top Floor Combined Studio" },
  { id: "E6", floor: 5, defaultPrice: 3800, features: "Central A/C · Top Floor Interior (Quiet Studio)" },
  { id: "E7", floor: 5, defaultPrice: 3800, features: "Central A/C · Top Floor Interior (Quiet Studio)" },
  { id: "E8", floor: 5, defaultPrice: 5800, features: "Private A/C · Top Floor Window Unit" },
  { id: "E9", floor: 5, defaultPrice: 6000, features: "Private A/C · Top Floor Studio" },
  { id: "E10", floor: 5, defaultPrice: 3000, features: "Central A/C · Top Floor Interior (Focus Solo)" },
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
  const [discountRate, setDiscountRate] = useState<number>(0.8); // Default 20% OFF (0.8 rate)
  
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
      errors.push("Please enter Tenant Full Legal Name (as shown in Passport / ID).");
    }
    if (tenantType === "company") {
      if (!companyName.trim()) errors.push("Please enter Company Full Registered Legal Name.");
      if (!signatoryName.trim()) errors.push("Please enter Authorized Representative Full Name.");
    }
    if (!tenantIdNumber.trim()) {
      errors.push("Please enter a valid Passport No. / National ID / Tax ID.");
    }
    if (!tenantPhone.trim()) {
      errors.push("Please enter a valid Phone / WhatsApp Number.");
    }
    if (!tenantAddress.trim()) {
      errors.push("Please enter Legal / Registered Residential Address.");
    }
    if (!idImage) {
      errors.push("Please upload a photo of Passport Photo Page or National ID Document.");
    }
    if (!hasValidSignature) {
      errors.push("Please draw a valid handwritten digital signature in the signing pad.");
    }
    if (!agreedToTerms) {
      errors.push("Please review and check the agreement to all Lease Agreement Terms (Clauses 1 to 7).");
    }
    if (!agreedToPdpa) {
      errors.push("Please review and check the agreement to the PDPA Personal Data Privacy Protection Notice.");
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

    // Clone element and convert all images to base64 Data URLs so offline HTML is 100% self-contained
    const clone = printableDoc.cloneNode(true) as HTMLElement;
    const origImages = printableDoc.querySelectorAll("img");
    const cloneImages = clone.querySelectorAll("img");

    origImages.forEach((origImg, index) => {
      try {
        if (origImg && origImg.complete && origImg.naturalWidth > 0) {
          const canvas = document.createElement("canvas");
          canvas.width = origImg.naturalWidth;
          canvas.height = origImg.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(origImg, 0, 0);
            cloneImages[index].src = canvas.toDataURL("image/png");
          }
        }
      } catch (err) {
        console.warn("Could not inline image to base64", err);
      }
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lease_Agreement_${selectedRoomId}_${contractSerial}.html</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111;
      padding: 36px 40px;
      max-width: 820px;
      margin: 0 auto;
      line-height: 1.5;
      font-size: 12px;
      background: #ffffff;
    }
    h1, h2, h3, h4 { margin: 8px 0; color: #111; }
    p { margin: 6px 0; }
    strong { color: #000; }
    img { max-width: 100%; height: auto; display: inline-block; }
    .border-b-2 { border-bottom: 2px solid #111; }
    .border-t { border-top: 1px solid #e5e5e5; }
    .border-b { border-bottom: 1px solid #111; }
    .border { border: 1px solid #e5e5e5; }
    .rounded { border-radius: 4px; }
    .rounded-lg { border-radius: 8px; }
    .rounded-xl { border-radius: 12px; }
    .bg-neutral-50 { background-color: #f9fafb; }
    .bg-neutral-100 { background-color: #f3f4f6; }
    .bg-blue-50 { background-color: #eff6ff; }
    .bg-blue-50\\/60 { background-color: rgba(239, 246, 255, 0.6); }
    .bg-amber-50\\/50 { background-color: rgba(254, 243, 199, 0.5); }
    .text-blue-900 { color: #1e3a8a; }
    .text-blue-950 { color: #172554; }
    .text-neutral-500 { color: #6b7280; }
    .text-neutral-600 { color: #4b5563; }
    .text-neutral-700 { color: #374151; }
    .text-neutral-800 { color: #1f2937; }
    .text-neutral-900 { color: #111827; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-row { flex-direction: row; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .items-end { align-items: flex-end; }
    .justify-between { justify-content: space-between; }
    .justify-start { justify-content: flex-start; }
    .gap-1\\.5 { gap: 6px; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .gap-3\\.5 { gap: 14px; }
    .gap-4 { gap: 16px; }
    .gap-6 { gap: 24px; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .space-y-0\\.5 > * + * { margin-top: 2px; }
    .space-y-1 > * + * { margin-top: 4px; }
    .space-y-1\\.5 > * + * { margin-top: 6px; }
    .space-y-2 > * + * { margin-top: 8px; }
    .space-y-2\\.5 > * + * { margin-top: 10px; }
    .space-y-3 > * + * { margin-top: 12px; }
    .space-y-3\\.5 > * + * { margin-top: 14px; }
    .space-y-4 > * + * { margin-top: 16px; }
    .p-2 { padding: 8px; }
    .p-2\\.5 { padding: 10px; }
    .p-3 { padding: 12px; }
    .p-4 { padding: 16px; }
    .p-6 { padding: 24px; }
    .pb-4 { padding-bottom: 16px; }
    .pb-5 { padding-bottom: 20px; }
    .pt-3 { padding-top: 12px; }
    .pt-3\\.5 { padding-top: 14px; }
    .pt-4 { padding-top: 16px; }
    .pl-3 { padding-left: 12px; }
    .pl-4 { padding-left: 16px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    .h-12 { height: 48px; }
    .h-14 { height: 56px; }
    .h-16 { height: 64px; }
    .h-20 { height: 80px; }
    .h-24 { height: 96px; }
    .w-auto { width: auto; }
    .w-full { width: 100%; }
    .w-24 { width: 96px; }
    .shrink-0 { flex-shrink: 0; }
    .uppercase { text-transform: uppercase; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .text-xs { font-size: 11px; }
    .text-sm { font-size: 13px; }
    .text-base { font-size: 15px; }
    .text-lg { font-size: 17px; }
    .text-xl { font-size: 19px; }
    .text-2xl { font-size: 22px; }
    .font-bold { font-weight: 700; }
    .font-extrabold { font-weight: 800; }
    .font-black { font-weight: 900; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    @media print {
      body { padding: 0; max-width: 100%; font-size: 11px; }
      @page { margin: 1.2cm; size: A4 portrait; }
    }
  </style>
</head>
<body>
  ${clone.innerHTML}
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
      setUploadError("Only JPG, PNG, or WebP image files are supported.");
      return;
    }

    // Size limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit. Please select a smaller photo.");
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
          const wmText = "FOR CMAI / COLASOLA CO., LTD. LEASE ONLY";
          ctx.strokeText(wmText, 0, 0);
          ctx.fillText(wmText, 0, 0);
          ctx.restore();

          const watermarkedUrl = canvas.toDataURL("image/jpeg", 0.85);
          setIdImage(watermarkedUrl);
        } catch {
          setUploadError("Failed to parse image. Please upload a standard photo file.");
        }
      };
      img.onerror = () => {
        setUploadError("Unable to load the selected image file.");
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
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                  Online Office Lease Agreement
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                  LEASE AGREEMENT
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono hidden sm:block">
                Ref: {contractSerial || "CMAI-2026-LEASE"} · Chiang Mai AI Center (Colasola Co., Ltd.)
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
                  <span>Submitting Agreement...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Confirm & Sign Agreement</span>
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
              <span>Please complete the following required fields before signing:</span>
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
          
          {/* Box 1: Room & Special Discount Selector */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>1. Select Office Unit & Discount Rate</span>
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                20% OFF Deal
              </span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label htmlFor="room-select" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1.5">
                  Select Office Unit (Room Selection) *
                </label>
                <select
                  id="room-select"
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white font-medium focus:outline-none focus:border-blue-500 text-xs min-h-[44px]"
                >
                  {defaultRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Room {room.id} ({room.floor}F) - {room.features} - Standard ฿{room.defaultPrice.toLocaleString()}/mo
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-neutral-600 dark:text-neutral-400 font-medium">Approved Rent Discount</span>
                  <span className="text-neutral-400 font-mono text-[11px]">Standard Rate: ฿{standardRoomPrice.toLocaleString()}/mo</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "20% OFF", rate: 0.8, desc: "Special Deal" },
                    { label: "10% OFF", rate: 0.9, desc: "Standard Discount" },
                    { label: "Standard", rate: 1.0, desc: "Standard Rate (100%)" },
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
                  <span className="text-neutral-600 dark:text-neutral-400">Final Monthly Rent:</span>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                    ฿{finalMonthlyRent.toLocaleString()} <span className="text-[11px] font-normal text-neutral-400">/mo</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-neutral-500">
                  <span>Security Deposit (2 Months):</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">฿{securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-neutral-500">
                  <span>Total Initial Payment (1st Month + 2 Mo Deposit):</span>
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
                <span>2. Tenant Information & ID Verification (KYC)</span>
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
                  Individual
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
                  Company / Enterprise
                </button>
              </div>
            </h2>

            <div className="space-y-3.5 text-xs">
              {tenantType === "individual" ? (
                <div>
                  <label htmlFor="tenant-name" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Tenant Full Legal Name (As in Passport / ID) *
                  </label>
                  <input
                    id="tenant-name"
                    type="text"
                    required
                    placeholder="e.g., ADAM MAR / LI WEI"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="company-name" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                      Company Full Registered Legal Name *
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      required
                      placeholder="e.g., Tech Global Innovation Co., Ltd."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="signatory-name" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                        Authorized Representative Name *
                      </label>
                      <input
                        id="signatory-name"
                        type="text"
                        required
                        placeholder="Full Name of Director"
                        value={signatoryName}
                        onChange={(e) => setSignatoryName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="signatory-title" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                        Title / Position
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
                  {tenantType === "individual" ? "Passport No. / National ID No. *" : "Company Registration No. / Tax ID (DBD) *"}
                </label>
                <input
                  id="id-number"
                  type="text"
                  required
                  placeholder={tenantType === "individual" ? "e.g., EJ12345678 / 110105..." : "e.g., 0505566000000"}
                  value={tenantIdNumber}
                  onChange={(e) => setTenantIdNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone-number" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Phone / WhatsApp Number *
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
                    Email Address (Optional)
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
                  Legal / Registered Residential Address *
                </label>
                <input
                  id="legal-address"
                  type="text"
                  required
                  placeholder="e.g., 123 Sukhumvit Rd, Bangkok, Thailand"
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
                    <span>Upload Passport Photo Page / National ID Photo *</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">(Watermarked for Security)</span>
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
                      Click to take photo or choose image from gallery
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Supports JPG / PNG / WebP formats (Max 5MB)
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
                        <span>Replace</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdImage(null)}
                        className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs flex items-center gap-1 min-h-[36px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
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
              <span>3. Lease Term & Effective Dates</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor="start-date" className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Lease Start Date *
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
                  Lease Duration *
                </label>
                <select
                  id="duration-months"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                >
                  <option value={6}>6 Months (Half-Year)</option>
                  <option value={12}>1 Year (12 Months - Standard)</option>
                  <option value={24}>2 Years (24 Months - Long Term)</option>
                  <option value={36}>3 Years (36 Months - Multi-Year)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
              <div>Calculated Lease End Date: <strong className="text-neutral-900 dark:text-white font-mono">{endDate}</strong></div>
              <div>Monthly Rent Due: On or before the <strong className="text-neutral-900 dark:text-white font-mono">{rentDueDay}th</strong> of each month</div>
            </div>
          </div>

          {/* Box 4: Digital Signature Pad with Stroke Verification */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>4. Tenant Digital Signature *</span>
              </span>
              {hasValidSignature ? (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Signature Captured</span>
                </span>
              ) : (
                <span className="text-[11px] text-amber-500 font-mono">
                  {strokeCount === 0 ? "Awaiting Signature" : "Insufficient strokes, please sign clearly"}
                </span>
              )}
            </h2>

            <p className="text-[11px] text-neutral-500 mb-2">
              Please draw your handwritten digital signature in the box below:
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
                  ✍️ Sign Here (Handwritten Signature)
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
                  <span>Clear Signature</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateTypedSignature}
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-blue-500 transition-colors flex items-center gap-1 py-1 px-2 rounded min-h-[36px]"
                  title="Generate cursive signature script"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Generate Script Signature</span>
                </button>
              </div>

              <span className="text-[10px] text-neutral-400 font-mono">
                Strokes: {strokeCount} | Points: {totalPoints}
              </span>
            </div>
          </div>

          {/* Box 5: Legal Disclaimers & PDPA Consent */}
          <div className="bg-white dark:bg-[#111113] border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>5. Legal Disclaimers & PDPA Consent</span>
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
                  I have thoroughly reviewed and fully agree to all terms and conditions (Clauses 1 to 7) of this Office Lease Agreement, including payment schedules, 2-month security deposit, and termination policies.
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
                  <strong>PDPA Privacy Consent:</strong> I hereby consent to Chiang Mai AI Center (Colasola Co., Ltd.) collecting and processing my submitted identity and contact details solely for this tenancy agreement and statutory legal/tax compliance in Thailand. This data will never be disclosed to unauthorized third parties.
                </span>
              </label>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[10.5px] text-neutral-500 leading-relaxed">
                <strong>⚖️ Legal Validity Notice:</strong> This electronic agreement constitutes a legally binding contract under the Civil and Commercial Code and Section 9 of the Electronic Transactions Act (B.E. 2544) of Thailand. In the event of any discrepancies between language versions, the Thai version shall prevail in accordance with Thai legal proceedings.
              </div>
            </div>
          </div>

        </div>

        {/* Right Printable Legal Contract Document Paper */}
        <div id="printable-contract" className="lg:col-span-7 bg-white text-[#111] p-8 sm:p-12 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
          
          {/* Official Document Header with CMAI Logo & Reference */}
          <div className="border-b-2 border-black pb-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              {/* Brand Logo & Company Info */}
              <div className="flex items-center gap-3">
                <img
                  src="/images/cmai_header_logo.png"
                  alt="Chiang Mai AI Center"
                  className="h-12 sm:h-14 md:h-16 w-auto object-contain shrink-0"
                />
                <div className="border-l-2 border-neutral-300 pl-3 py-0.5">
                  <div className="font-extrabold text-xs sm:text-sm tracking-wide text-neutral-900 uppercase">
                    Chiang Mai AI Center
                  </div>
                  <div className="text-[11px] text-neutral-600 font-medium">
                    Colasola Co., Ltd. (บริษัท โคล่าโซล่า จำกัด)
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Tax ID: 0505566006478 · Chiang Mai AI Center, Chiang Mai
                  </div>
                </div>
              </div>

              {/* Document Reference, Serial & Hash */}
              <div className="text-left sm:text-right font-mono text-[11px] text-neutral-500 shrink-0">
                <div>Ref: <strong className="text-black">{contractSerial || "CMAI-CONTRACT"}</strong></div>
                <div>Hash: <strong className="text-neutral-800">{contractHash}</strong></div>
                <div>Date: <strong className="text-neutral-800">{formatEngDate(signingDateIso)}</strong></div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-neutral-900">
                  LEASE AGREEMENT / สัญญาเช่า
                </h2>
                <p className="text-[11px] text-neutral-600 font-medium">
                  Office Space & Facilities Tenancy Agreement · สัญญาเช่าพื้นที่สำนักงานและสิ่งอำนวยความสะดวก
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 text-neutral-900 px-2.5 py-1 rounded text-xs font-semibold">
                <span>Unit:</span>
                <strong className="font-mono text-sm font-bold text-blue-900">{selectedRoomId}</strong>
                <span className="text-neutral-400">|</span>
                <span>{currentRoomObj?.floor || 2}F</span>
              </div>
            </div>
          </div>

          {/* Agreement Parties */}
          <div className="space-y-3.5 text-xs sm:text-[12.5px] leading-relaxed mb-6">
            <p>
              <strong>Between / ระหว่าง:</strong> Chiang Mai AI Center (Colasola Co., Ltd. / บริษัท โคล่าโซล่า จำกัด)<br />
              <strong>Company Registration No. / Tax ID / ทะเบียนนิติบุคคลเลขที่:</strong> 0505566006478<br />
              <strong>Address / ที่อยู่:</strong> 236/105 Chiang Mai AI Center, Moo 6, Mahidol Road, Nong Hoi, Mueang Chiang Mai, Chiang Mai 50000 (บ้านเลขที่ 236/105 หมู่ 6 ถ.มหิดล ตำบลหนองหอย อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50000)<br />
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
              Room {selectedRoomId} ({currentRoomObj?.floor || 2}F), 236/105 Chiang Mai AI Center, Moo 6, Mahidol Road, Nong Hoi Subdistrict, Mueang Chiang Mai District, Chiang Mai 50000.
            </p>
            <p className="text-neutral-600 pl-4 text-[11.5px]">
              ผู้ให้เช่าตกลงให้เช่าและผู้เช่าตกลงเช่าสถานที่ รวมทั้งเฟอร์นิเจอร์ ณ ห้อง {selectedRoomId} ({currentRoomObj?.floor || 2}F) Chiang Mai AI Center บ้านเลขที่ 236/105 หมู่ 6 ถ.มหิดล ตำบลหนองหอย อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50000
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
                <span className="text-blue-950 font-semibold">Chiang Mai AI Center (Colasola Co., Ltd. / บริษัท โคล่าโซล่า จำกัด)</span>
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
                    (Pending Tenant Signature)
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
                Agreement Successfully Signed & Digitally Archived!
              </h3>
              <p className="text-xs text-neutral-500">
                Your contract has been cryptographically sealed and archived.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">Contract Ref:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{contractSerial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Unit & Rent:</span>
                <span className="text-blue-600 font-semibold">{selectedRoomId} (฿{finalMonthlyRent.toLocaleString()}/mo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tenant:</span>
                <span className="text-neutral-800 dark:text-neutral-200">{effectiveTenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Digital Hash:</span>
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
                <span>Download Offline Signed Contract (.html)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF Document</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSignedAndArchived(false)}
                className="w-full py-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 text-xs font-medium text-center cursor-pointer"
              >
                Close & Return to Document
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
