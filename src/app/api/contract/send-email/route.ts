import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export interface ContractEmailPayload {
  contractSerial: string;
  contractHash: string;
  roomId: string;
  roomFloor: number;
  roomFeatures?: string;
  finalMonthlyRent: number;
  standardRoomPrice: number;
  discountAppliedText?: string;
  securityDeposit: number;
  advanceRent: number;
  totalInitialPayment: number;
  isThreeMonthsNoDeposit: boolean;
  rentDueDay?: number;
  startDate: string;
  endDate: string;
  durationText: string;
  tenantType: "individual" | "company";
  tenantName: string;
  companyName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  tenantIdNumber: string;
  tenantPhone: string;
  tenantEmail: string;
  tenantAddress: string;
  signedAt: string;
  bot_honeypot?: string; // Invisible anti-bot field
  pdfBase64?: string; // Optional client-generated PDF base64
  pdfEngine?: string;
  pdfError?: string;
  signatureData?: string;
  idImage?: string;
  contractHtml?: string;
}

// Allowed Room Whitelist
const VALID_ROOM_IDS = new Set([
  "B1-2", "B6", "B7", "C1-2", "C3", "C4", "C5", "C6", "C7-8", "C9", "C11", "C12",
  "D1-2", "D3", "D5", "D7-8", "D9", "D10", "D11",
  "E2", "E3", "E4-5", "E6", "E7", "E8", "E9", "E10"
]);

// Format English ordinal suffix: 1st, 2nd, 3rd, 4th, 21st, 22nd, 23rd, 24th, 31st
function getOrdinalSuffix(day: number): string {
  const j = day % 10;
  const k = day % 100;
  if (j === 1 && k !== 11) {
    return `${day}st`;
  }
  if (j === 2 && k !== 12) {
    return `${day}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${day}rd`;
  }
  return `${day}th`;
}

// Helper: Generate self-contained standalone printable HTML contract document
function generateStandaloneContractHtml(data: {
  contractSerial: string;
  contractHash: string;
  roomId: string;
  roomFloor: number | string;
  finalMonthlyRent: number;
  standardRoomPrice?: number;
  discountAppliedText?: string;
  securityDeposit: number;
  advanceRent: number;
  totalInitialPayment: number;
  isThreeMonthsNoDeposit?: boolean;
  rentDueDay?: number;
  startDate: string;
  endDate: string;
  durationText: string;
  effectiveTenant: string;
  effectiveSignatory?: string;
  tenantIdNumber: string;
  tenantPhone: string;
  tenantEmail: string;
  tenantAddress: string;
  signedAt: string;
  signatureData?: string;
  idImage?: string;
  contractHtml?: string;
}): string {
  if (data.contractHtml) return data.contractHtml;

  const isThreeMonths = data.isThreeMonthsNoDeposit || data.durationText.includes("3 months") || data.durationText.includes("3-month");
  const isSixMonths = data.durationText.includes("6 months") || data.durationText.includes("6-month");
  const rentDueDay = Number(data.rentDueDay) || (data.signedAt ? new Date(data.signedAt).getDate() : 15);
  const rentDueDayStr = getOrdinalSuffix(rentDueDay);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lease_Agreement_${data.roomId}_${data.contractSerial}.html</title>
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
    .action-bar {
      position: sticky;
      top: 12px;
      z-index: 100;
      max-width: 820px;
      margin: 0 auto 16px auto;
      background: #0f172a;
      color: #fff;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
    }
    .action-btn {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 9px 20px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    .action-btn:hover { background: #1d4ed8; }
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
      .action-bar, .no-print { display: none !important; }
      @page { margin: 1.2cm; size: A4 portrait; }

      /* Prevent slicing text and images across printed pages */
      p, h1, h2, h3, h4, .avoid-break, .grid, blockquote, figure {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      
      .page-break-before, .break-before-page {
        break-before: page !important;
        page-break-before: always !important;
      }

      .contract-page {
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
        border-bottom: none !important;
      }
      .contract-page:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }

      img {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="action-bar no-print">
    <div>
      <strong>Chiang Mai AI Center · Official Lease Agreement</strong>
      <span style="font-size: 11px; opacity: 0.8; margin-left: 8px;">Ref: ${data.contractSerial}</span>
    </div>
    <div>
      <button class="action-btn" onclick="window.print()">
        🖨️ Print Agreement / Save as PDF (一键打印 / 另存为 PDF)
      </button>
    </div>
  </div>

  <div class="border-b-2 border-black pb-4 mb-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div class="flex items-center gap-2.5 sm:gap-3">
        <img alt="Chiang Mai AI Center" class="h-10 sm:h-14 md:h-16 w-auto object-contain shrink-0" src="https://lazzor.com/images/cmai_header_logo.png">
        <div class="border-l-2 border-neutral-300 pl-2.5 sm:pl-3 py-0.5">
          <div class="font-extrabold text-xs sm:text-sm tracking-wide text-neutral-900 uppercase">Chiang Mai AI Center</div>
          <div class="text-[10px] sm:text-[11px] text-neutral-600 font-medium">Colasola Co., Ltd. (บริษัท โคล่าโซล่า จำกัด)</div>
          <div class="text-[9px] sm:text-[10px] text-neutral-500 font-mono break-all">Tax ID: 0505566006478 · Chiang Mai AI Center, Chiang Mai</div>
        </div>
      </div>
      <div class="text-left sm:text-right font-mono text-[10px] sm:text-[11px] text-neutral-500 shrink-0 w-full sm:w-auto">
        <div class="break-all">Ref: <strong class="text-black">${data.contractSerial}</strong></div>
        <div class="break-all">Hash: <strong class="text-neutral-800">${data.contractHash ? data.contractHash.slice(0, 12) : "00004E4E4295"}</strong></div>
        <div>Date: <strong class="text-neutral-800">${data.signedAt ? data.signedAt.slice(0, 10) : "14 September 2026"}</strong></div>
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <h2 class="text-xl sm:text-2xl font-black tracking-tight uppercase text-neutral-900">LEASE AGREEMENT / สัญญาเช่า</h2>
        <p class="text-[11px] text-neutral-600 font-medium">Office Space &amp; Facilities Tenancy Agreement · สัญญาเช่าพื้นที่สำนักงานและสิ่งอำนวยความสะดวก</p>
      </div>
      <div class="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 text-neutral-900 px-2.5 py-1 rounded text-xs font-semibold">
        <span>Unit:</span>
        <strong class="font-mono text-sm font-bold text-blue-900">${data.roomId}</strong>
        <span class="text-neutral-400">|</span>
        <span>${data.roomFloor}F</span>
      </div>
    </div>
  </div>

  <div class="space-y-3.5 text-xs sm:text-[12.5px] leading-relaxed mb-6">
    <p>
      <strong>Between / ระหว่าง:</strong> Chiang Mai AI Center (Colasola Co., Ltd. / บริษัท โคล่าโซล่า จำกัด)<br>
      <strong>Company Registration No. / Tax ID / ทะเบียนนิติบุคคลเลขที่:</strong> 0505566006478<br>
      <strong>Address / ที่อยู่:</strong> 236/105 Chiang Mai AI Center, Moo 6, Mahidol Road, Nong Hoi, Mueang Chiang Mai, Chiang Mai 50000 (บ้านเลขที่ 236/105 หมู่ 6 ถ.มหิดล ตำบลหนองหอย อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50000)<br>
      hereinafter referred to as the <strong>Landlord</strong> / ซึ่งในที่นี้เรียกว่า <strong>“ผู้ให้เช่า”</strong>
    </p>
    <div class="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
      <p><strong>And / และ (Tenant):</strong> <span class="font-bold underline text-blue-900">${data.effectiveTenant}</span></p>
      ${data.effectiveSignatory && data.effectiveSignatory !== data.effectiveTenant ? `<p><strong>Authorized Representative / ผู้มีอำนาจลงนาม:</strong> <span class="font-bold text-neutral-800">${data.effectiveSignatory}</span></p>` : ""}
      <p><strong>ID / Passport / Tax ID / เลขที่บัตรประชาชน / เลขผู้เสียภาษี:</strong> <span class="font-mono font-bold underline text-blue-900 break-all">${data.tenantIdNumber}</span></p>
      <p><strong>Phone / เบอร์โทร:</strong> ${data.tenantPhone} | <strong>Email:</strong> ${data.tenantEmail}</p>
      <p><strong>Legal Address / ที่อยู่ตามทะเบียน:</strong> ${data.tenantAddress}</p>
      <p class="text-[11px] text-neutral-500 italic">hereinafter referred to as the <strong>Tenant</strong> / ซึ่งในที่นี้เรียกว่า <strong>“ผู้เช่า”</strong></p>
    </div>
    <p class="font-semibold text-center py-1 bg-neutral-100 uppercase tracking-wide text-xs">Upon the following terms / ตกลงทำสัญญากันดังต่อไปนี้:</p>
  </div>

  <!-- Section 1 -->
  <div class="space-y-2.5 text-xs sm:text-[12px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
    <h3 class="font-bold text-[13px]">1. The Premises &amp; Term of Lease / สถานที่เช่าและระยะเวลาการเช่า</h3>
    <p>The Landlord agrees to let and the Tenant agrees to rent the property with furniture and fixtures hereinafter known as <strong>The Premises</strong> at the address:</p>
    <p class="pl-4 font-semibold text-neutral-900">Room ${data.roomId} (${data.roomFloor}F), 236/105 Chiang Mai AI Center, Moo 6, Mahidol Road, Nong Hoi Subdistrict, Mueang Chiang Mai District, Chiang Mai 50000.</p>
    <p class="text-neutral-600 pl-4 text-[11.5px]">ผู้ให้เช่าตกลงให้เช่าและผู้เช่าตกลงเช่าสถานที่ รวมทั้งเฟอร์นิเจอร์ ณ ห้อง ${data.roomId} (${data.roomFloor}F) Chiang Mai AI Center บ้านเลขที่ 236/105 หมู่ 6 ถ.มหิดล ตำบลหนองหอย อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50000</p>
    <p class="p-2 bg-blue-50/60 rounded border border-blue-100">
      <strong>Term of Lease / ระยะเวลาการเช่า:</strong><br>
      Start from <strong>${data.startDate}</strong> to <strong>${data.endDate}</strong>, for <strong>${data.durationText}</strong>.<br>
      <span class="text-neutral-700">เริ่มตั้งแต่ <strong>${data.startDate}</strong> ถึง <strong>${data.endDate}</strong>, เป็นเวลา <strong>${data.durationText}</strong></span>
    </p>
  </div>

  <!-- Section 2 -->
  <div class="space-y-2.5 text-xs sm:text-[12px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
    <h3 class="font-bold text-[13px]">2. Rental Fee and Payment Terms / ค่าเช่าและเงื่อนไขการชำระเงิน</h3>
    <p class="p-2 bg-neutral-50 rounded border border-neutral-200">
      The agreed rental fee per month is <strong>${Number(data.finalMonthlyRent || 0).toLocaleString()} THB</strong>.<br>
      <span class="text-neutral-700">โดยตกลงค่าเช่าในราคาเดือนละ <strong>${Number(data.finalMonthlyRent || 0).toLocaleString()} บาท</strong></span>
    </p>
    ${isThreeMonths ? `
    <p><strong>2.1</strong> The full rental fee for the entire 3-month lease term is payable in advance upon signing this agreement.<br><span class="text-neutral-600">ค่าเช่าเต็มจำนวนตลอดอายุสัญญาเช่า 3 เดือน จะต้องชำระล่วงหน้าทั้งหมดในวันทำสัญญาฉบับนี้</span></p>
    <p><strong>2.2</strong> For this 3-month lease, Tenant agrees to pay the full prepaid 3-month rental sum of <strong>${Number(data.totalInitialPayment || 0).toLocaleString()} THB</strong>. No security deposit is required for this 3-month term (0 THB Security Deposit).<br><span class="text-neutral-600">สำหรับสัญญาเช่าระยะเวลา 3 เดือนนี้ ผู้เช่าตกลงชำระค่าเช่าล่วงหน้าเต็มจำนวน 3 เดือน เป็นเงินจำนวน <strong>${Number(data.totalInitialPayment || 0).toLocaleString()} บาท</strong> โดยไม่มีการเรียกเก็บเงินประกัน (เงินประกัน 0 บาท)</span></p>
    ` : isSixMonths ? `
    <p><strong>2.1</strong> The monthly rent shall be payable by Tenant on or before the <strong>${rentDueDayStr} date</strong> of each month.<br><span class="text-neutral-600">เงินค่าเช่านั้นผู้เช่าจะต้องชำระทุกวันที่ ${rentDueDay} ของเดือน</span></p>
    <p><strong>2.2</strong> For this 6-month lease, Tenant agrees to pay an initial upfront payment of 3 months totaling <strong>${Number(data.totalInitialPayment || 0).toLocaleString()} THB</strong>, comprising a 2-month security deposit of <strong>${Number(data.securityDeposit || 0).toLocaleString()} THB</strong> and 1 month advance rent of <strong>${Number(data.advanceRent || 0).toLocaleString()} THB</strong>. Thereafter, the agreed monthly rent shall be paid monthly on or before the <strong>${rentDueDayStr} date</strong> of each subsequent month.<br><span class="text-neutral-600">สำหรับสัญญาเช่าระยะเวลา 6 เดือนนี้ ผู้เช่าตกลงชำระเงินงวดแรกจำนวน 3 เดือน รวมเป็นเงิน <strong>${Number(data.totalInitialPayment || 0).toLocaleString()} บาท</strong> ประกอบด้วยเงินประกัน 2 เดือน จำนวน <strong>${Number(data.securityDeposit || 0).toLocaleString()} บาท</strong> และค่าเช่าล่วงหน้า 1 เดือน จำนวน <strong>${Number(data.advanceRent || 0).toLocaleString()} บาท</strong> และชำระค่าเช่ารายเดือนทุกวันที่ ${rentDueDay} ของเดือนถัดไป</span></p>
    ` : `
    <p><strong>2.1</strong> The monthly rent shall be payable by Tenant on or before the <strong>${rentDueDayStr} date</strong> of each month.<br><span class="text-neutral-600">เงินค่าเช่านั้นผู้เช่าจะต้องชำระทุกวันที่ ${rentDueDay} ของเดือน</span></p>
    <p><strong>2.2</strong> Tenant agrees to pay the security deposit of <strong>${Number(data.securityDeposit || 0).toLocaleString()} THB</strong> [equivalent to 2 months rent] and 1 month rental in advance for <strong>${Number(data.advanceRent || 0).toLocaleString()} THB</strong>. Total initial payment sum is <strong>${Number(data.totalInitialPayment || 0).toLocaleString()} THB</strong>.<br><span class="text-neutral-600">ผู้เช่าตกลงจ่ายค่าประกันจำนวน <strong>${Number(data.securityDeposit || 0).toLocaleString()} บาท</strong> [เทียบเท่าค่าเช่า 2 เดือน] และค่าเช่าล่วงหน้า 1 เดือน จำนวน <strong>${Number(data.advanceRent || 0).toLocaleString()} บาท</strong> รวมเป็นเงินจำนวนจ่ายครั้งแรกทั้งหมด <strong>${Number(data.totalInitialPayment || 0).toLocaleString()} บาท</strong></span></p>
    `}
    <p class="text-[11px] text-neutral-600 italic">
      The security deposit can neither be substituted as prepaid rent nor be treated as part of monthly rent as stipulated in this agreement on the date of signing of this lease agreement.<br>
      ค่าประกันนี้ไม่สามารถนำมาหักแทนค่าเช่าล่วงหน้าหรือบางส่วนของค่าเช่าได้ตามที่กำหนดไว้ในสัญญานี้นับแต่วันที่ได้เซ็นสัญญาฉบับนี้
    </p>
    <p>
      <strong>Payment Method / วิธีการชำระเงิน:</strong><br>
      The TENANT shall pay the rental fee, security deposit, and advance payment in cash or via authorized bank transfer.<br>
      <span class="text-neutral-600">โดยผู้เช่าต้องทำการชำระค่าเช่า เงินประกัน และค่าเช่าล่วงหน้าเป็นเงินสดหรือโอนผ่านบัญชีธนาคาร</span>
    </p>
    <p>
      <strong>2.3</strong> A separate inventory list showing items provided by the Landlord to be attached to the lease agreement or sent via PDF/image file. Both parties shall inspect and approve the inventory list on the date the rental period starts.<br>
      <span class="text-neutral-600">รายละเอียดเกี่ยวกับเฟอร์นิเจอร์ต่างๆ ที่ผู้ให้เช่าได้มอบไว้จะแนบในใบแทรกของสัญญาฉบับนี้ หรือส่งเป็นไฟล์รูปภาพ/PDF โดยคู่สัญญาได้อ่านและตรวจทานในวันที่สัญญาเช่าเริ่มต้น</span>
    </p>
  </div>

  <!-- Section 3 -->
  <div class="space-y-1.5 text-[11px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
    <h3 class="font-bold text-xs mb-1 text-black">3. The Tenant Agrees / ผู้เช่าตกลงทำสัญญาดังต่อไปนี้:</h3>
    <p><strong>3.1</strong> To keep all floors, walls, ceiling, windows, window treatments, doors, furniture, outside space, appliances, and fixtures in good condition, except for normal wear and tear.<br><span class="text-neutral-600">จะรักษาพื้น ผนัง ฝ้าเพดาน หน้าต่าง ประตู เฟอร์นิเจอร์ อุปกรณ์ไฟฟ้า ให้อยู่ในสภาพดี เว้นแต่ร่องรอยอันเกิดจากการใช้งานปกติ</span></p>
    <p><strong>3.2</strong> To use the Premises only for business and legal purposes for the Tenant or their employees for working only.<br><span class="text-neutral-600">จะใช้สถานที่เช่าสำหรับทำงานและตามวัตถุประสงค์ที่ถูกต้องภายใต้กฎหมายสำหรับผู้เช่าหรือพนักงานของผู้เช่าเท่านั้น</span></p>
    <p><strong>3.3</strong> To pay utility charges for electricity, water, garbage collection fees, and other expenses incurred on time.<br><span class="text-neutral-600">จะชำระค่าสาธารณูปโภค ค่าไฟฟ้า ค่าน้ำ ค่าเก็บขยะ หรือค่าใช้จ่ายอื่นๆ ที่เกิดขึ้นจากผู้เช่าให้ตรงเวลา</span></p>
    <p><strong>3.4</strong> To promptly repair at own expense any damage caused by the Tenant, family, guests, but not for ordinary wear and tear.<br><span class="text-neutral-600">จะซ่อมแซมและออกค่าใช้จ่ายเองหากเกิดความเสียหายต่อทรัพย์สินที่เช่าโดยเกิดจากผู้เช่าหรือบริวาร</span></p>
    <p><strong>3.5 Pets / การเลี้ยงสัตว์:</strong> No pets are allowed. / ไม่อนุญาตให้เลี้ยงสัตว์</p>
    <p><strong>3.6 Inspection / การเข้าตรวจ:</strong> To permit the Landlord/agent to enter for inspection and repairing with reasonable notice, and to show to prospective tenants during 30 days prior to expiration.<br><span class="text-neutral-600">จะอนุญาตให้ผู้ให้เช่าหรือตัวแทนเข้าตรวจและซ่อมแซมตามสมควร และให้เข้าชมสถานที่ใน 30 วันก่อนหมดสัญญา</span></p>
    <p><strong>3.7 Alterations / การต่อเติม:</strong> Not to make structural alterations, additions, demolish, repaint, nor drill holes without prior written consent.<br><span class="text-neutral-600">ไม่ปรับปรุง ต่อเติม รื้อถอน ทาสี หรือเจาะผนัง โดยปราศจากการแจ้งให้ผู้ให้เช่าทราบเป็นลายลักษณ์อักษรล่วงหน้า</span></p>
    <p><strong>3.8 Smoking / การสูบบุหรี่:</strong> Smoking is strictly prohibited inside the Premises. / ไม่อนุญาตให้สูบบุหรี่ภายในสถานที่</p>
    <p><strong>3.9 Nuisance / ความสงบ:</strong> Not to cause or permit any nuisance or interference with neighbors.<br><span class="text-neutral-600">ไม่กระทำการอันเป็นเหตุให้เกิดความเดือดร้อนรำคาญหรือรบกวนความสงบสุขของเพื่อนบ้าน</span></p>
    <p><strong>3.10 Keys &amp; Cards / กุญแจและบัตร:</strong> To return all keys and access cards upon termination. Tenant is responsible for replacement cost if lost.<br><span class="text-neutral-600">จะส่งมอบกุญแจและบัตรผ่านคืนในวันสิ้นสุดสัญญา หากสูญหายผู้เช่าต้องรับผิดชอบค่าทำใหม่</span></p>
    <p><strong>3.11 Illegal Acts / กฎหมาย:</strong> Not to use the Premises for any illegal purposes. / ไม่ใช้สถานที่เช่าในการกระทำสิ่งผิดกฎหมาย</p>
    <p><strong>3.12 Hazardous Materials / วัตถุอันตราย:</strong> Not to keep dangerous, combustible, explosive materials, or illegal substances in the Premises.<br><span class="text-neutral-600">ไม่เก็บวัตถุอันตราย วัตถุไวไฟ วัตถุระเบิด หรือสิ่งผิดกฎหมายในสถานที่เช่า</span></p>
    <p><strong>3.13 Clean Handover / การส่งมอบ:</strong> To return the property in a clean condition and remove all personal belongings at own cost.<br><span class="text-neutral-600">จะส่งคืนสถานที่ในสภาพสะอาดเรียบร้อย และขนย้ายสิ่งของของผู้เช่าออกด้วยค่าใช้จ่ายตนเอง</span></p>
    <p><strong>3.14 Computer Servers / เซิร์ฟเวอร์:</strong> Computer server installation is not allowed. / ไม่อนุญาตให้ติดตั้งคอมพิวเตอร์เซิร์ฟเวอร์</p>
  </div>

  <!-- Section 4 -->
  <div class="space-y-1.5 text-[11px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-4">
    <h3 class="font-bold text-xs mb-1 text-black">4. The Landlord Agrees / ผู้ให้เช่าตกลงทำสัญญาดังต่อไปนี้:</h3>
    <p><strong>4.1 Peaceful Enjoyment:</strong> To ensure the Tenant peacefully enjoys the use of the property for business and working purposes without unlawful interruption.<br><span class="text-neutral-600">รับรองให้ผู้เช่าใช้งานสถานที่เช่าและประกอบธุรกิจได้อย่างสงบสุข ปราศจากการรบกวนโดยมิชอบ</span></p>
    <p><strong>4.2 Maintenance:</strong> To keep the Premises in good repair, including annual maintenance of air-conditioning units.<br><span class="text-neutral-600">จะดูแลซ่อมแซมสถานที่เช่าให้อยู่ในสภาพดี รวมถึงการบำรุงรักษาเครื่องปรับอากาศประจำปี</span></p>
    <p><strong>4.3 Major Repairs:</strong> To pay for major repairs exceeding 1,000 THB per occurrence. If delayed over 7 days after notice, Tenant may proceed and claim reimbursement against receipts.<br><span class="text-neutral-600">จะรับผิดชอบค่าซ่อมแซมใหญ่ที่เกินกว่า 1,000 บาท หากล่าช้าเกิน 7 วันผู้เช่าดำเนินการซ่อมและเบิกคืนตามใบเสร็จจริงได้</span></p>
    <p><strong>4.4 Ready Condition:</strong> To ensure that at commencement, the Premises is clean and in ready working condition.<br><span class="text-neutral-600">จะรับรองว่าเมื่อเริ่มต้นสัญญา สถานที่เช่าต้องสะอาดและอยู่ในสภาพพร้อมใช้งาน</span></p>
    <p><strong>4.5 Building Taxes:</strong> To pay all land and building taxes levied on the Premises.<br><span class="text-neutral-600">จะเป็นผู้ชำระภาษีที่ดินและสิ่งปลูกสร้างของสถานที่เช่า</span></p>
    <p><strong>4.6 Deposit Refund:</strong> To refund security deposit within 30 days after lease ends, minus actual damages caused by Tenant (applicable when security deposit is held).<br><span class="text-neutral-600">จะคืนเงินประกันให้แก่ผู้เช่าภายใน 30 วันหลังจากสิ้นสุดสัญญา โดยหักค่าเสียหายตามจริง (กรณีที่มีการเรียกเก็บเงินประกัน)</span></p>
  </div>

  <!-- Section 5 -->
  <div class="space-y-1.5 text-[11px] leading-relaxed border-t border-neutral-200 pt-3.5 mb-5">
    <h3 class="font-bold text-xs mb-1 text-black">5. TERMINATION &amp; 6. EXTENSION &amp; 7. GOVERNING LAW</h3>
    <p><strong>5.1 Early Termination:</strong> Tenant may terminate early by giving 30 days written notice, forfeiting the 2-month security deposit as penalty.<br><span class="text-neutral-600">ผู้เช่าบอกเลิกสัญญาก่อนกำหนดได้โดยแจ้งล่วงหน้า 30 วัน และยินยอมให้ริบเงินประกัน 2 เดือนเป็นค่าปรับ</span></p>
    <p><strong>5.2 Force Majeure:</strong> Terminates immediately if uninhabitable due to court order or force majeure, deposit refunded.<br><span class="text-neutral-600">สิ้นสุดลงทันทีหากสถานที่เช่าไม่สามารถใช้งานได้จากคำสั่งศาล หรือเหตุสุดวิสัย และต้องคืนเงินประกัน</span></p>
    <p><strong>5.3 Default:</strong> If Tenant defaults on rent or breaches terms and fails to remedy within 10 days of notice, Landlord may repossess.<br><span class="text-neutral-600">หากผิดนัดชำระหรือไม่แก้ไขภายใน 10 วันหลังแจ้งเตือน ผู้ให้เช่ามีสิทธิ์บอกเลิกสัญญาและกลับเข้าครอบครอง</span></p>
    <p><strong>6. Extension:</strong> Tenant shall notify Landlord in writing at least 30 days before termination to extend.<br><span class="text-neutral-600">หากประสงค์จะต่อสัญญา จะต้องแจ้งล่วงหน้าเป็นลายลักษณ์อักษรอย่างน้อย 30 วัน</span></p>
    <p><strong>7. Governing Law:</strong> Governed by the laws of Thailand. / สัญญานี้อยู่ภายใต้กฎหมายของราชอาณาจักรไทย</p>
    <p class="text-[10.5px] text-neutral-600"><strong>7.1 Language Priority:</strong> In case of discrepancy between the English and Thai versions, the Thai version shall prevail in accordance with Thai legal proceedings. / ในกรณีที่มีข้อความขัดแย้งกัน ให้ยึดถือฉบับภาษาไทยเป็นสำคัญ</p>
  </div>

  <!-- Signatures -->
  <div class="border-t-2 border-black pt-5 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 text-xs">
    <div class="space-y-2">
      <p class="font-bold uppercase">ผู้ให้เช่า / LANDLORD:<br>
        <span class="text-blue-950 font-semibold">Chiang Mai AI Center (Colasola Co., Ltd. / บริษัท โคล่าโซล่า จำกัด)</span>
      </p>
      <div class="h-20 border-b border-black items-center justify-start relative py-1 flex">
        <img alt="Official Corporate Seal - Colasola Co., Ltd." class="h-24 w-24 object-contain -my-2" src="https://lazzor.com/images/colasola_stamp.png">
      </div>
      <div class="space-y-0.5 text-[10.5px]">
        <p><strong>Written Name / ชื่อเต็ม:</strong> Authorized Director</p>
        <p><strong>Title / ตำแหน่ง:</strong> Managing Director (Colasola Co., Ltd.)</p>
        <p><strong>Date / วันที่:</strong> ${data.signedAt ? data.signedAt.slice(0, 10) : "14 September 2026"}</p>
        <p><strong>Phone / เบอร์โทร:</strong> +66 62 345 8238</p>
      </div>
    </div>

    <div class="space-y-2">
      <p class="font-bold uppercase">ผู้เช่า / TENANT:<br>
        <span class="text-blue-900 font-semibold">${data.effectiveTenant}</span>
      </p>
      <div class="h-20 border-b border-black flex items-end pb-1">
        ${data.signatureData ? `<img alt="Tenant Signature" class="max-h-16 max-w-full object-contain" src="${data.signatureData}">` : `<span class="font-mono text-xs text-neutral-400 italic">[ Digitally Signed ]</span>`}
      </div>
      <div class="space-y-0.5 text-[10.5px]">
        <p><strong>Written Name / ชื่อเต็ม:</strong> ${data.effectiveSignatory || data.effectiveTenant}</p>
        <p><strong>Title / ตำแหน่ง:</strong> ${data.effectiveSignatory ? "Authorized Representative" : "Individual Tenant"}</p>
        <p><strong>Date / วันที่:</strong> ${data.signedAt ? data.signedAt.slice(0, 10) : "14 September 2026"}</p>
        <p class="break-all"><strong>Phone / เบอร์โทร:</strong> ${data.tenantPhone}</p>
      </div>
    </div>
  </div>

  ${data.idImage ? `
  <div class="mt-8 pt-6 border-t-2 border-dashed border-neutral-300 page-break-before">
    <h4 class="font-bold text-[11px] uppercase tracking-wider text-neutral-700 mb-2 text-center">LEGAL ATTACHMENT / เอกสารแนบ: TENANT PASSPORT / ID COPY</h4>
    <div class="border border-neutral-300 rounded-lg p-2 bg-neutral-50 flex justify-center">
      <img alt="Tenant Identity Document" class="max-h-72 max-w-full object-contain rounded shadow-sm" src="${data.idImage}">
    </div>
  </div>
  ` : ""}

  <div class="mt-6 pt-3 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 text-[9.5px] sm:text-[10px] text-neutral-500 font-mono">
    <span class="break-all">Doc ID: ${data.contractSerial}</span>
    <span class="break-all">Checksum: SHA256:${data.contractHash ? data.contractHash.slice(0, 12) : "00004E4E4295"}</span>
    <span>Official Electronic Record</span>
  </div>

</body>
</html>`;
}

// Email Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- In-Memory Sliding Window Rate Limiter ---
interface RateLimitRecord {
  timestamps: number[];
}

const ipRateLimits = new Map<string, RateLimitRecord>();
const emailRateLimits = new Map<string, RateLimitRecord>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes sliding window
const MAX_REQUESTS_PER_IP = 5;               // Max 5 submissions per 10 minutes per IP
const MAX_REQUESTS_PER_EMAIL = 3;            // Max 3 submissions per 10 minutes per Email

function isRateLimited(key: string, map: Map<string, RateLimitRecord>, maxLimit: number): boolean {
  const now = Date.now();
  const record = map.get(key) || { timestamps: [] };
  const activeTimestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= maxLimit) {
    map.set(key, { timestamps: activeTimestamps });
    return true;
  }

  activeTimestamps.push(now);
  map.set(key, { timestamps: activeTimestamps });
  return false;
}

function getClientIp(req: Request): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown-client-ip";
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // --- 1. IP Rate Limiting Check ---
    if (clientIp !== "unknown-client-ip" && isRateLimited(clientIp, ipRateLimits, MAX_REQUESTS_PER_IP)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Too many contract submissions from your IP. Please wait 10 minutes.",
        },
        { status: 429 }
      );
    }

    const payload: ContractEmailPayload = await req.json();

    const {
      contractSerial,
      contractHash,
      roomId,
      roomFloor,
      roomFeatures,
      finalMonthlyRent,
      standardRoomPrice,
      discountAppliedText,
      securityDeposit,
      advanceRent,
      totalInitialPayment,
      isThreeMonthsNoDeposit,
      rentDueDay,
      startDate,
      endDate,
      durationText,
      tenantType,
      tenantName,
      companyName,
      signatoryName,
      signatoryTitle,
      tenantIdNumber,
      tenantPhone,
      tenantEmail,
      tenantAddress,
      signedAt,
      bot_honeypot,
      pdfBase64,
      pdfEngine,
      pdfError,
      signatureData,
      idImage,
      contractHtml,
    } = payload;

    // --- 2. Honeypot Anti-Bot Trap Check ---
    // If a bot fills out the hidden trap field, silently pretend success without sending any emails
    if (bot_honeypot && bot_honeypot.trim().length > 0) {
      console.warn(`[Anti-Spam] Bot detected via honeypot trap from IP: ${clientIp}`);
      return NextResponse.json({
        success: true,
        method: "honeypot",
        message: "Agreement processed.",
      });
    }

    // --- 3. Strict Input & Whitelist Validation ---
    if (!contractSerial || !roomId || !tenantEmail || !tenantIdNumber || !tenantName) {
      return NextResponse.json(
        { success: false, error: "Missing required contract fields." },
        { status: 400 }
      );
    }

    const cleanEmail = tenantEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid tenant email address format." },
        { status: 400 }
      );
    }

    if (!VALID_ROOM_IDS.has(roomId)) {
      return NextResponse.json(
        { success: false, error: `Invalid room unit identifier: ${roomId}` },
        { status: 400 }
      );
    }

    // --- 4. Email Address Rate Limiting Check ---
    if (isRateLimited(cleanEmail, emailRateLimits, MAX_REQUESTS_PER_EMAIL)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submissions for this email address. Please wait a few minutes before submitting again.",
        },
        { status: 429 }
      );
    }

    const effectiveTenant = tenantType === "company" ? (companyName || tenantName) : tenantName;
    const effectiveSignatory = tenantType === "company" ? `${signatoryName || tenantName} (${signatoryTitle || "Representative"})` : tenantName;
    const effectiveRentDueDay = Number(rentDueDay) || (signedAt ? new Date(signedAt).getDate() : 15);
    const effectiveRentDueDayStr = getOrdinalSuffix(effectiveRentDueDay);

    const smtpUser = process.env.SMTP_USER || "mdmoto@gmail.com";
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const adminEmail = process.env.ADMIN_EMAIL || "cmai@lazzor.com";
    const fromAddress = process.env.SMTP_FROM || `"Chiang Mai AI Center" <cmai@lazzor.com>`;

    // --- Scenario 1: Google Workspace / Gmail SMTP Configured ---
    if (smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for port 465, false for port 587 (STARTTLS)
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });

      // 1. Email to Tenant (Customer Copy - English)
      const tenantHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111; line-height: 1.6; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; color: #fff;">
            <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">CHIANG MAI AI CENTER</h2>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">Colasola Co., Ltd. · Office Lease Application Confirmation</p>
          </div>
          <div style="padding: 24px;">
            <div style="background-color: #ecfdf5; border: 1.5px solid #10b981; border-radius: 8px; padding: 16px 18px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 6px 0; color: #065f46; font-size: 16px; font-weight: 800;">
                ✓ Application Submitted Successfully
              </h3>
              <p style="margin: 0; font-size: 13px; color: #047857; line-height: 1.5;">
                Your office lease application has been successfully submitted. The official executed lease agreement will be dispatched upon receipt and confirmation of your initial payment.
              </p>
            </div>

            <p style="font-size: 14px; margin-top: 0;">Dear <strong>${effectiveTenant}</strong>,</p>
            <p style="font-size: 13px; color: #334155; line-height: 1.6;">
              Thank you for submitting your office lease application with Chiang Mai AI Center. Your application details and verification documents have been securely registered in our system and are currently undergoing human verification.<br/><br/>
              <strong>Important Notice:</strong> Once your initial payment is received and confirmed by our accounting team, the Landlord (Colasola Co., Ltd.) will formally countersign and stamp the agreement, and the officially executed Lease Agreement will be dispatched directly to your email.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <div style="font-weight: bold; margin-bottom: 10px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                Application Summary
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 5px 0; color: #64748b; width: 160px;">Application Ref:</td><td style="padding: 5px 0; font-family: monospace; font-weight: bold; color: #0f172a;">${contractSerial}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Digital Hash:</td><td style="padding: 5px 0; font-family: monospace; font-size: 11px; color: #475569;">SHA256:${contractHash}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Selected Unit:</td><td style="padding: 5px 0; font-weight: bold; color: #2563eb;">Room ${roomId} (${roomFloor}F)${roomFeatures ? ` · ${roomFeatures}` : ""}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Lease Term:</td><td style="padding: 5px 0; font-weight: bold;">${startDate} to ${endDate} (${durationText})</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Monthly Rent:</td><td style="padding: 5px 0; font-weight: bold; color: #0f172a;">฿${finalMonthlyRent.toLocaleString()} THB / month ${discountAppliedText ? `<span style="color: #059669; font-size: 11px;">(${discountAppliedText})</span>` : ""}</td></tr>
                ${!isThreeMonthsNoDeposit ? `<tr><td style="padding: 5px 0; color: #64748b;">Monthly Rent Due:</td><td style="padding: 5px 0; font-weight: bold; color: #0f172a;">On or before the ${effectiveRentDueDayStr} of each month (ทุกวันที่ ${effectiveRentDueDay} ของเดือน)</td></tr>` : ""}
                <tr><td style="padding: 5px 0; color: #64748b;">Security Deposit:</td><td style="padding: 5px 0; font-weight: bold;">${isThreeMonthsNoDeposit ? "฿0 (No Deposit Required)" : `฿${securityDeposit.toLocaleString()} THB (2 Months)`}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Total Initial Payment:</td><td style="padding: 5px 0; font-weight: 800; color: #059669; font-size: 16px;">฿${totalInitialPayment.toLocaleString()} THB</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Tenant Name:</td><td style="padding: 5px 0;">${effectiveTenant}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">ID / Tax Number:</td><td style="padding: 5px 0; font-family: monospace;">${tenantIdNumber}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Contact Phone:</td><td style="padding: 5px 0;">${tenantPhone}</td></tr>
                <tr><td style="padding: 5px 0; color: #64748b;">Submission Time:</td><td style="padding: 5px 0; font-size: 12px; color: #64748b;">${signedAt}</td></tr>
              </table>
            </div>

            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 12px; color: #92400e;">
              <strong>⚠️ Next Steps & Payment Verification:</strong><br/>
              Please retain this confirmation and your Application Reference (<strong>${contractSerial}</strong>) for your tenancy records. Once your payment transfer is verified by our administration, the officially countersigned lease agreement will be emailed to you. For any move-in assistance or billing inquiries, feel free to reply directly to this email or reach us at <strong>+66 62 345 8238</strong>.
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
              Chiang Mai AI Center · Colasola Co., Ltd.<br/>
              236/105 Chiang Mai AI Center, Moo 6, Mahidol Road, Nong Hoi, Mueang Chiang Mai 50000<br/>
              Tax ID: 0505566006478
            </div>
          </div>
        </div>
      `;

      // 2. Generate Standalone Printable Contract HTML Document for Attachment
      const standaloneHtml = contractHtml || generateStandaloneContractHtml({
        contractSerial,
        contractHash,
        roomId,
        roomFloor,
        finalMonthlyRent,
        standardRoomPrice,
        discountAppliedText,
        securityDeposit,
        advanceRent,
        totalInitialPayment,
        isThreeMonthsNoDeposit,
        rentDueDay: effectiveRentDueDay,
        startDate,
        endDate,
        durationText,
        effectiveTenant,
        effectiveSignatory,
        tenantIdNumber,
        tenantPhone,
        tenantEmail: cleanEmail,
        tenantAddress,
        signedAt,
        signatureData,
        idImage,
      });

      // Build Admin Email Attachments Array
      const adminAttachments: any[] = [
        {
          filename: `Lease_Agreement_${roomId}_${contractSerial}.html`,
          content: Buffer.from(standaloneHtml, "utf-8"),
          contentType: "text/html; charset=UTF-8",
        },
      ];

      if (pdfBase64) {
        adminAttachments.push({
          filename: `Lease_Agreement_${roomId}_${contractSerial}.pdf`,
          content: Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        });
      }

      // 3. Email to Landlord / Admin
      const adminHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111; line-height: 1.6; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px;">
          <div style="background-color: #fef3c7; border: 1.5px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 4px 0; color: #92400e; font-size: 15px; font-weight: 800;">
              ⚠️ 待收款与人工校验 / ACTION REQUIRED
            </h3>
            <p style="margin: 0; font-size: 13px; color: #b45309;">
              租户已在线提交办公室租赁申请。请核对银行账户确认收到首期款项（<strong>฿${totalInitialPayment.toLocaleString()} THB</strong>）。确认到账后，可直接将正式盖章合同发送给租户。
            </p>
          </div>

          <div style="background-color: #eff6ff; border: 1.5px solid #3b82f6; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 4px 0; color: #1e40af; font-size: 15px; font-weight: 800;">
              📄 官方盖章完整合同附件已就绪（.html${pdfBase64 ? " 与 .pdf" : ""}）
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
              已随本邮件附带完整正式合同文件：<strong>Lease_Agreement_${roomId}_${contractSerial}.html</strong>。<br/>
              您可用任意浏览器（Safari/Chrome/手机）直接打开该附件，点击顶部的 <strong>「🖨️ 打印合同 / 另存为 PDF」</strong> 按钮，即可秒级直接打印或另存为高清矢量 PDF！
            </p>
            <p style="margin: 0; font-size: 12px; color: #2563eb;">
              💡 <strong>核验交付流程</strong>：核实银行款项到账后，直接在邮箱点击“转发 (Forward)”，将本邮件及附件发送给租户即可！
            </p>
          </div>

          <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">📋 新租赁申请详情 / Application Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: #f8fafc; padding: 12px; border-radius: 8px;">
            <tr><td style="padding: 6px; font-weight: bold; width: 140px;">申请编号 / Ref:</td><td style="padding: 6px; font-family: monospace;">${contractSerial}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">SHA256 Hash:</td><td style="padding: 6px; font-family: monospace; font-size: 11px;">${contractHash}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">申请房间 / Room:</td><td style="padding: 6px; font-weight: bold; color: #2563eb;">Room ${roomId} (${roomFloor}F)</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">租赁期限 / Term:</td><td style="padding: 6px;">${startDate} to ${endDate} (${durationText})</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">月租金 / Rent:</td><td style="padding: 6px;">฿${finalMonthlyRent.toLocaleString()} (Standard: ฿${standardRoomPrice.toLocaleString()})</td></tr>
            ${!isThreeMonthsNoDeposit ? `<tr><td style="padding: 6px; font-weight: bold;">月租交租日 / Due Day:</td><td style="padding: 6px; font-weight: bold; color: #2563eb;">On or before the ${effectiveRentDueDayStr} of each month (每月 ${effectiveRentDueDay} 日前 / ทุกวันที่ ${effectiveRentDueDay})</td></tr>` : ""}
            <tr><td style="padding: 6px; font-weight: bold;">折扣优惠 / Promo:</td><td style="padding: 6px; color: #059669;">${discountAppliedText || "Standard Rate"}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">押金 / Deposit:</td><td style="padding: 6px;">${isThreeMonthsNoDeposit ? "฿0 (No Deposit)" : `฿${securityDeposit.toLocaleString()}`}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">首期总应收 / Total:</td><td style="padding: 6px; font-weight: bold; color: #059669; font-size: 15px;">฿${totalInitialPayment.toLocaleString()}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">租户名称 / Tenant:</td><td style="padding: 6px; font-weight: bold;">${effectiveTenant}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">授权签署人 / Signer:</td><td style="padding: 6px;">${effectiveSignatory}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">证件号 / ID or Tax:</td><td style="padding: 6px; font-family: monospace;">${tenantIdNumber}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">电话 / Phone:</td><td style="padding: 6px;">${tenantPhone}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">邮箱 / Email:</td><td style="padding: 6px;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">注册地址 / Address:</td><td style="padding: 6px;">${tenantAddress}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">提交时间 / Signed:</td><td style="padding: 6px;">${signedAt}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">合同 HTML 附件:</td><td style="padding: 6px; font-family: monospace; color: #059669;">✓ Lease_Agreement_${roomId}_${contractSerial}.html (已随信附带 · 支持一键打印/另存为PDF)</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">合同 PDF 附件:</td><td style="padding: 6px; font-family: monospace; color: #059669;">${pdfBase64 ? `✓ Lease_Agreement_${roomId}_${contractSerial}.pdf (${pdfEngine || "Ready"} - 已随信附带)` : `<span style="color:#64748b;">(未由浏览器直接生成，打开 .html 附件可一键打印为 PDF)</span>`}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">客户端 IP:</td><td style="padding: 6px; font-family: monospace; font-size: 11px;">${clientIp}</td></tr>
          </table>
        </div>
      `;

      // Send customer copy and admin notification concurrently
      await Promise.all([
        transporter.sendMail({
          from: fromAddress,
          to: cleanEmail,
          replyTo: adminEmail,
          subject: `[Application Received] Chiang Mai AI Center - Office Lease Application for Room ${roomId} (${contractSerial})`,
          html: tenantHtml,
        }),
        transporter.sendMail({
          from: fromAddress,
          to: adminEmail,
          replyTo: cleanEmail,
          subject: `[ACTION REQUIRED / 待收款复核] New Lease Application - Room ${roomId} - ${effectiveTenant} (${contractSerial})`,
          html: adminHtml,
          attachments: adminAttachments,
        }),
      ]);

      return NextResponse.json({
        success: true,
        method: "smtp",
        message: "Application notification successfully sent to tenant and landlord.",
      });
    }

    // --- Scenario 2: Web3Forms Fallback ---
    const web3FormsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "87a78bc8-e588-4925-bc58-7546e77afa45";

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: web3FormsAccessKey,
        name: effectiveTenant,
        email: cleanEmail,
        replyto: cleanEmail,
        from_name: "Chiang Mai AI Center (Colasola Co., Ltd.)",
        subject: `[LEASE APPLICATION / 待收款复核] Room ${roomId} - ${effectiveTenant} (${contractSerial})`,
        "Contract Reference": contractSerial,
        "Digital Hash Checksum": contractHash,
        "Lease Room Unit": `Room ${roomId} (${roomFloor}F)`,
        "Monthly Rent": `฿${finalMonthlyRent.toLocaleString()} THB / month`,
        "Monthly Rent Due Day": isThreeMonthsNoDeposit ? "N/A (Full 3-Month Prepaid)" : `On or before the ${effectiveRentDueDayStr} of each month (ทุกวันที่ ${effectiveRentDueDay} ของเดือน)`,
        "Security Deposit": isThreeMonthsNoDeposit ? "฿0 THB (No Deposit Required)" : `฿${securityDeposit.toLocaleString()} THB (2 Months)`,
        "Total Initial Payment": `฿${totalInitialPayment.toLocaleString()} THB`,
        "Lease Term": `${startDate} to ${endDate} (${durationText})`,
        "Tenant Legal Name": effectiveTenant,
        "Authorized Signatory": effectiveSignatory,
        "Tenant ID or Tax No": tenantIdNumber,
        "Tenant Phone": tenantPhone,
        "Tenant Email": cleanEmail,
        "Registered Address": tenantAddress,
        "Discount Applied": discountAppliedText || "Standard Rate (No Promo Code)",
        "Submitted Timestamp": signedAt,
        "Verification Status": "提交成功，待资金支付成功后会发送合同邮件",
        message: `Lease Application Submitted (Pending Payment & Verification):\n- Status: 提交成功，待资金支付成功后会发送合同邮件\n- Ref: ${contractSerial}\n- Hash: ${contractHash}\n- Tenant: ${effectiveTenant}\n- Signatory: ${effectiveSignatory}\n- ID/Tax: ${tenantIdNumber}\n- Phone: ${tenantPhone}\n- Email: ${cleanEmail}\n- Address: ${tenantAddress}\n- Room: ${roomId} (${roomFloor}F)\n- Discount: ${discountAppliedText || "Standard"}\n- Monthly Rent: ฿${finalMonthlyRent.toLocaleString()}\n- Rent Due Day: ${isThreeMonthsNoDeposit ? "N/A (Prepaid)" : `On or before the ${effectiveRentDueDayStr} of each month`}\n- Deposit: ${isThreeMonthsNoDeposit ? "฿0" : `฿${securityDeposit.toLocaleString()}`}\n- Total Initial: ฿${totalInitialPayment.toLocaleString()}\n- Period: ${startDate} to ${endDate} (${durationText})\n- Submitted At: ${signedAt}`,
      }),
    });

    const web3Data = await web3Response.json();

    if (web3Response.ok && web3Data.success) {
      return NextResponse.json({
        success: true,
        method: "web3forms",
        message: "Application successfully archived via Web3Forms.",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: web3Data.message || `Web3Forms dispatch failed with HTTP ${web3Response.status}`,
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Contract email dispatch error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error occurred while sending agreement." },
      { status: 500 }
    );
  }
}
