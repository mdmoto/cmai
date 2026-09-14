// Cloudflare Pages Function: /api/contract/send-email
// Runs on Cloudflare Workers edge network with Gmail SMTP & Web3Forms fallback

// @ts-ignore
import { connect } from "cloudflare:sockets";

interface Env {
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  ADMIN_EMAIL?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
}

// Allowed Room Whitelist
const VALID_ROOM_IDS = new Set([
  "B1-2", "B6", "B7", "C1-2", "C4", "C5", "C6", "C7-8", "C9", "C11", "C12",
  "D1-2", "D3", "D4", "D5", "D7-8", "D9", "D10", "D11",
  "E2", "E3", "E4-5", "E6", "E7", "E8", "E9", "E10"
]);

// Email Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SmtpAttachment {
  filename: string;
  content: string; // base64
  contentType: string;
}

interface SmtpOptions {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  attachment?: SmtpAttachment;
  attachments?: SmtpAttachment[];
}

async function sendSmtpOverSocket(opts: SmtpOptions) {
  const socket = connect({ hostname: opts.host, port: opts.port }, { secureTransport: "on" });
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let buffer = "";
  async function readReply(): Promise<{ code: number; text: string }> {
    while (true) {
      const idx = buffer.indexOf("\r\n");
      if (idx !== -1) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        if (/^\d{3} /.test(line) || /^\d{3}$/.test(line)) {
          return { code: parseInt(line.slice(0, 3), 10), text: line };
        }
        continue;
      }
      const { value, done } = await reader.read();
      if (done) throw new Error("Socket disconnected unexpectedly");
      buffer += decoder.decode(value, { stream: true });
    }
  }

  async function cmd(command: string, expect?: number) {
    await writer.write(encoder.encode(command + "\r\n"));
    if (expect !== undefined) {
      const reply = await readReply();
      if (reply.code !== expect) {
        throw new Error(`SMTP Error for '${command.slice(0, 15)}...': got ${reply.code}, expected ${expect}`);
      }
      return reply;
    }
  }

  try {
    const greeting = await readReply();
    if (greeting.code !== 220) throw new Error(`Invalid greeting: ${greeting.text}`);

    await cmd("EHLO lazzor.com", 250);
    await cmd("AUTH LOGIN", 334);
    await cmd(btoa(opts.user), 334);
    await cmd(btoa(opts.pass), 235);

    const fromAddr = opts.from.includes("<") ? opts.from.replace(/.*<([^>]+)>.*/, "$1") : opts.from;
    const toAddr = opts.to.includes("<") ? opts.to.replace(/.*<([^>]+)>.*/, "$1") : opts.to;

    await cmd(`MAIL FROM:<${fromAddr}>`, 250);
    await cmd(`RCPT TO:<${toAddr}>`, 250);
    await cmd("DATA", 354);

    const boundary = "----=_Part_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    const utf8Subject = encoder.encode(opts.subject);
    let binSubj = "";
    for (let i = 0; i < utf8Subject.length; i++) binSubj += String.fromCharCode(utf8Subject[i]);
    const encodedSubject = `=?UTF-8?B?${btoa(binSubj)}?=`;

    let mime = "";
    mime += `From: ${opts.from}\r\n`;
    mime += `To: ${opts.to}\r\n`;
    if (opts.replyTo) mime += `Reply-To: ${opts.replyTo}\r\n`;
    mime += `Subject: ${encodedSubject}\r\n`;
    mime += `MIME-Version: 1.0\r\n`;
    mime += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

    // HTML Body
    mime += `--${boundary}\r\n`;
    mime += `Content-Type: text/html; charset=UTF-8\r\n`;
    mime += `Content-Transfer-Encoding: base64\r\n\r\n`;

    const utf8Html = encoder.encode(opts.html);
    let binHtml = "";
    for (let i = 0; i < utf8Html.length; i++) binHtml += String.fromCharCode(utf8Html[i]);
    const base64Html = btoa(binHtml).replace(/(.{76})/g, "$1\r\n");
    mime += `${base64Html}\r\n\r\n`;

    // Attachments
    const allAttachments: SmtpAttachment[] = [];
    if (opts.attachments && opts.attachments.length > 0) {
      allAttachments.push(...opts.attachments);
    } else if (opts.attachment && opts.attachment.content) {
      allAttachments.push(opts.attachment);
    }

    for (const att of allAttachments) {
      if (!att || !att.content) continue;
      mime += `--${boundary}\r\n`;
      mime += `Content-Type: ${att.contentType}; name="${att.filename}"\r\n`;
      mime += `Content-Disposition: attachment; filename="${att.filename}"\r\n`;
      mime += `Content-Transfer-Encoding: base64\r\n\r\n`;
      const cleanAtt = att.content.replace(/[\r\n\s]+/g, "");
      const attLines: string[] = [];
      for (let i = 0; i < cleanAtt.length; i += 76) {
        attLines.push(cleanAtt.substring(i, i + 76));
      }
      mime += attLines.join("\r\n") + "\r\n\r\n";
    }

    mime += `--${boundary}--\r\n.\r\n`;

    const encodedMime = encoder.encode(mime);
    const CHUNK_SIZE = 64 * 1024;
    for (let offset = 0; offset < encodedMime.length; offset += CHUNK_SIZE) {
      await writer.write(encodedMime.subarray(offset, offset + CHUNK_SIZE));
    }
    const dataRes = await readReply();
    if (dataRes.code !== 250) throw new Error(`Failed to send data: ${dataRes.text}`);

    try { await cmd("QUIT", 221); } catch {}
  } finally {
    try {
      writer.releaseLock();
      reader.releaseLock();
      await socket.close();
    } catch {}
  }
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
}): string {
  const isThreeMonths = data.isThreeMonthsNoDeposit || data.durationText.includes("3 months");
  const depositText = isThreeMonths ? "฿0 (Prepaid in Full · No Deposit)" : `฿${Number(data.securityDeposit || 0).toLocaleString()} THB (2 Months)`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lease_Agreement_${data.roomId}_${data.contractSerial}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px 16px;
      background-color: #f1f5f9;
      color: #0f172a;
      line-height: 1.5;
      font-size: 12px;
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
    .contract-page {
      max-width: 820px;
      margin: 0 auto;
      background: #fff;
      padding: 40px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 18px;
      gap: 16px;
    }
    .brand-col { display: flex; align-items: center; gap: 14px; }
    .brand-logo { height: 44px; width: auto; }
    .brand-text { border-left: 2px solid #cbd5e1; padding-left: 12px; }
    .brand-title { font-size: 14px; font-weight: 900; letter-spacing: 0.5px; }
    .brand-sub { font-size: 10px; color: #475569; }
    .ref-col { text-align: right; font-family: monospace; font-size: 10px; color: #64748b; }
    .title-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .title-main { font-size: 18px; font-weight: 900; margin: 0; color: #0f172a; }
    .title-sub { font-size: 10px; color: #64748b; margin: 2px 0 0 0; }
    .unit-badge {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 12px;
    }
    .parties-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 16px;
      font-size: 11.5px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      margin: 14px 0 6px 0;
      color: #0f172a;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
    .table-rent {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 11px;
    }
    .table-rent th {
      background: #f1f5f9;
      padding: 6px 10px;
      text-align: left;
      border-bottom: 1px solid #cbd5e1;
    }
    .table-rent td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    .table-rent tr.total-row {
      background: #ecfdf5;
      font-weight: bold;
      color: #065f46;
    }
    .signatures-row {
      display: flex;
      gap: 20px;
      margin-top: 20px;
      border-top: 2px solid #0f172a;
      padding-top: 16px;
    }
    .sig-box {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px;
      position: relative;
    }
    .stamp-container {
      height: 70px;
      display: flex;
      align-items: center;
      margin: 4px 0;
    }
    .stamp-img { height: 74px; width: 74px; object-fit: contain; }
    .sig-img { max-height: 56px; max-width: 180px; object-fit: contain; }
    .annex-box {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 2px dashed #cbd5e1;
      text-align: center;
    }
    .footer-note {
      margin-top: 20px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-family: monospace;
      font-size: 9.5px;
      color: #94a3b8;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .action-bar { display: none !important; }
      .contract-page {
        max-width: 100%;
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .page-break { page-break-before: always; }
      @page {
        size: A4;
        margin: 10mm 12mm;
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

  <div class="contract-page">
    <!-- Header -->
    <div class="header-row">
      <div class="brand-col">
        <img src="https://lazzor.com/images/cmai_header_logo.png" alt="CMAI" class="brand-logo" />
        <div class="brand-text">
          <div class="brand-title">CHIANG MAI AI CENTER</div>
          <div class="brand-sub">Colasola Co., Ltd. (บริษัท โคล่าโซล่า จำกัด) · Tax ID: 0505566006478</div>
          <div class="brand-sub">236/105 Chiang Mai AI Center, Moo 6, Mahidol Rd, Mueang Chiang Mai 50000</div>
        </div>
      </div>
      <div class="ref-col">
        <div>Ref: <strong>${data.contractSerial}</strong></div>
        <div>Date: <strong>${data.signedAt ? data.signedAt.slice(0, 10) : "2026-09-14"}</strong></div>
        <div>Hash: <strong>${data.contractHash ? data.contractHash.slice(0, 12) : "0000625CAED0"}</strong></div>
      </div>
    </div>

    <!-- Title -->
    <div class="title-banner">
      <div>
        <h1 class="title-main">OFFICE LEASE AGREEMENT / สัญญาเช่า</h1>
        <p class="title-sub">Office Space & Facilities Tenancy Agreement · สัญญาเช่าพื้นที่สำนักงานและสิ่งอำนวยความสะดวก</p>
      </div>
      <div class="unit-badge">Unit: Room ${data.roomId} (${data.roomFloor}F)</div>
    </div>

    <!-- Parties -->
    <div class="parties-box">
      <div style="margin-bottom: 8px;">
        <strong>LANDLORD / ผู้ให้เช่า:</strong> Chiang Mai AI Center (Colasola Co., Ltd. / บริษัท โคล่าโซล่า จำกัด)<br/>
        <strong>Address / ที่อยู่:</strong> 236/105 Chiang Mai AI Center, Moo 6, Mahidol Rd, Nong Hoi, Mueang Chiang Mai 50000 · Tax ID: 0505566006478
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 8px;">
        <strong>TENANT / ผู้เช่า:</strong> <span style="font-size: 13px; font-weight: bold; color: #1d4ed8;">${data.effectiveTenant}</span><br/>
        ${data.effectiveSignatory && data.effectiveSignatory !== data.effectiveTenant ? `<strong>Authorized Representative / ผู้มีอำนาจลงนาม:</strong> ${data.effectiveSignatory}<br/>` : ""}
        <strong>ID / Passport / Tax ID / เลขที่บัตรประชาชน / เลขผู้เสียภาษี:</strong> ${data.tenantIdNumber}<br/>
        <strong>Phone / เบอร์โทร:</strong> ${data.tenantPhone} &nbsp;|&nbsp; <strong>Email:</strong> ${data.tenantEmail}<br/>
        <strong>Registered Address / ที่อยู่ตามทะเบียน:</strong> ${data.tenantAddress}
      </div>
    </div>

    <!-- Section 1 -->
    <div class="section-title">1. THE PREMISES & LEASE TERM / สถานที่เช่าและระยะเวลาการเช่า</div>
    <div>
      1.1 The Landlord leases to the Tenant Room <strong>${data.roomId} (${data.roomFloor}F)</strong> at Chiang Mai AI Center, 236/105 Mahidol Rd, Nong Hoi, Mueang Chiang Mai 50000 with all standard fixtures.<br/>
      1.2 Lease Term: <strong>${data.startDate} to ${data.endDate} (${data.durationText})</strong>. Monthly rent payable in advance by the 5th of each month.
    </div>

    <!-- Section 2 -->
    <div class="section-title">2. RENT, SECURITY DEPOSIT & PAYMENT / ค่าเช่า เงินประกัน และการชำระเงิน</div>
    <table class="table-rent">
      <thead>
        <tr>
          <th>Description / รายการ</th>
          <th style="text-align: right;">Amount / จำนวนเงิน (THB)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monthly Rent (Room ${data.roomId})</td>
          <td style="text-align: right; font-weight: bold;">฿${Number(data.finalMonthlyRent || 0).toLocaleString()} THB / month</td>
        </tr>
        <tr>
          <td>Advance Rent (First Period Prepaid)</td>
          <td style="text-align: right;">฿${Number(data.advanceRent || 0).toLocaleString()} THB</td>
        </tr>
        <tr>
          <td>Security Deposit (Refundable upon lease completion)</td>
          <td style="text-align: right;">${depositText}</td>
        </tr>
        <tr class="total-row">
          <td>TOTAL INITIAL PAYMENT DUE UPON SIGNING (ยอดชำระงวดแรก)</td>
          <td style="text-align: right; font-size: 13px;">฿${Number(data.totalInitialPayment || 0).toLocaleString()} THB</td>
        </tr>
      </tbody>
    </table>

    <!-- Section 3, 4, 5 -->
    <div class="section-title">3. KEY TERMS & OBLIGATIONS / ข้อกำหนดและเงื่อนไขสำคัญ</div>
    <div style="font-size: 11px; color: #475569; line-height: 1.6;">
      3.1 Utilities: High-speed fiber Wi-Fi, air-conditioning maintenance, and common janitorial services are included.<br/>
      3.2 Security Deposit: Refundable within 30 days after lease expiration, subject to inspection and key return.<br/>
      3.3 Governing Law: Governed by the laws of Thailand. In case of discrepancy, the Thai text shall prevail.
    </div>

    <!-- Signatures -->
    <div class="signatures-row">
      <!-- Landlord -->
      <div class="sig-box">
        <div style="font-weight: bold; color: #0f172a;">ผู้ให้เช่า / LANDLORD:</div>
        <div style="font-size: 10px; color: #64748b;">Chiang Mai AI Center (Colasola Co., Ltd.)</div>
        <div class="stamp-container">
          <img src="https://lazzor.com/images/colasola_stamp.png" class="stamp-img" alt="Official Seal" />
        </div>
        <div style="font-size: 10px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
          <div><strong>Authorized Director</strong> (ผู้มีอำนาจลงนามและประทับตรา)</div>
          <div>Date: ${data.signedAt ? data.signedAt.slice(0, 10) : "2026-09-14"}</div>
          <div>Tel: +66 62 345 8238</div>
        </div>
      </div>

      <!-- Tenant -->
      <div class="sig-box">
        <div style="font-weight: bold; color: #0f172a;">ผู้เช่า / TENANT:</div>
        <div style="font-size: 10px; color: #64748b;">${data.effectiveTenant}</div>
        <div class="stamp-container">
          ${data.signatureData ? `<img src="${data.signatureData}" class="sig-img" alt="Tenant Signature" />` : `<div style="color: #64748b; font-size: 10px; font-style: italic;">[ Digitally Signed & Approved ]</div>`}
        </div>
        <div style="font-size: 10px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
          <div><strong>${data.effectiveSignatory || data.effectiveTenant}</strong></div>
          <div>Date: ${data.signedAt ? data.signedAt.slice(0, 10) : "2026-09-14"}</div>
          <div>Tel: ${data.tenantPhone}</div>
        </div>
      </div>
    </div>

    <!-- Annex: Tenant ID Photo -->
    ${data.idImage ? `
    <div class="annex-box page-break">
      <div style="font-weight: bold; font-size: 12px; margin-bottom: 10px; color: #0f172a;">
        LEGAL ATTACHMENT / เอกสารแนบ: TENANT PASSPORT / ID COPY
      </div>
      <img src="${data.idImage}" style="max-height: 440px; max-width: 100%; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px;" alt="Tenant ID" />
    </div>
    ` : ""}

    <!-- Footer -->
    <div class="footer-note">
      <span>Doc ID: ${data.contractSerial}</span>
      <span>SHA256: ${data.contractHash}</span>
      <span>Official Tenancy Record · Chiang Mai AI Center</span>
    </div>
  </div>

</body>
</html>`;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const req = context.request;
    const env = context.env;

    const payload = await req.json();

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
    } = payload;

    // 1. Honeypot Anti-Bot Trap Check
    if (bot_honeypot && bot_honeypot.trim().length > 0) {
      return new Response(
        JSON.stringify({ success: true, method: "honeypot", message: "Application received." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Strict Input & Whitelist Validation
    if (!contractSerial || !roomId || !tenantEmail || !tenantIdNumber || !tenantName) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required contract fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = tenantEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid tenant email address format." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!VALID_ROOM_IDS.has(roomId)) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid room unit identifier: ${roomId}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const effectiveTenant = tenantType === "company" ? (companyName || tenantName) : tenantName;
    const effectiveSignatory = tenantType === "company" ? `${signatoryName || tenantName} (${signatoryTitle || "Representative"})` : tenantName;

    // Email Credentials
    const smtpHost = env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(env.SMTP_PORT) || 465;
    const smtpUser = env.SMTP_USER || "mdmoto@gmail.com";
    const smtpPass = env.SMTP_PASS || "xqkzoxwepjmrrckx";
    const adminEmail = env.ADMIN_EMAIL || "cmai@lazzor.com";
    const fromAddress = env.SMTP_FROM || `"Chiang Mai AI Center" <cmai@lazzor.com>`;

    // 1. Email to Tenant (Customer Copy - English Only)
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
              Your application has been received. Once your initial payment is verified, the official countersigned Lease Agreement will be sent to your email.
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
    const standaloneHtml = generateStandaloneContractHtml({
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

    const encoder = new TextEncoder();
    const utf8HtmlDoc = encoder.encode(standaloneHtml);
    let binHtmlDoc = "";
    for (let i = 0; i < utf8HtmlDoc.length; i++) binHtmlDoc += String.fromCharCode(utf8HtmlDoc[i]);
    const base64HtmlContract = btoa(binHtmlDoc);

    // Build Admin Email Attachments Array
    const adminAttachments: SmtpAttachment[] = [
      {
        filename: `Lease_Agreement_${roomId}_${contractSerial}.html`,
        content: base64HtmlContract,
        contentType: "text/html; charset=UTF-8",
      },
    ];

    if (pdfBase64) {
      adminAttachments.push({
        filename: `Lease_Agreement_${roomId}_${contractSerial}.pdf`,
        content: pdfBase64,
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
        </table>
      </div>
    `;

    // Attempt Direct SMTP Delivery (Port 465 SSL)
    let smtpSuccess = false;
    let smtpErrorDetails = "";

    try {
      await Promise.all([
        // 1. Send customer confirmation copy to Tenant (English)
        sendSmtpOverSocket({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          from: fromAddress,
          to: cleanEmail,
          replyTo: adminEmail,
          subject: `[Application Received] Chiang Mai AI Center - Office Lease Application for Room ${roomId} (${contractSerial})`,
          html: tenantHtml,
        }),
        // 2. Send admin notification with attached HTML & PDF contract
        sendSmtpOverSocket({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          from: fromAddress,
          to: adminEmail,
          replyTo: cleanEmail,
          subject: `[ACTION REQUIRED / 待收款复核] New Lease Application - Room ${roomId} - ${effectiveTenant} (${contractSerial})`,
          html: adminHtml,
          attachments: adminAttachments,
        }),
      ]);

      smtpSuccess = true;
    } catch (err: any) {
      smtpErrorDetails = err?.message || String(err);
      console.error("[Cloudflare SMTP Dispatch Error]:", err);
    }

    if (smtpSuccess) {
      return new Response(
        JSON.stringify({
          success: true,
          method: "smtp",
          message: "Application emails successfully delivered to tenant and landlord with full PDF attachment.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fallback to Web3Forms (if socket SMTP fails or is blocked)
    const accessKey = env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "87a78bc8-e588-4925-bc58-7546e77afa45";

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name: effectiveTenant,
        email: cleanEmail,
        replyto: cleanEmail,
        from_name: "Chiang Mai AI Center (Colasola Co., Ltd.)",
        subject: `[LEASE APPLICATION / 待收款复核] Room ${roomId} - ${effectiveTenant} (${contractSerial})`,
        "Contract Reference": contractSerial,
        "Digital Hash Checksum": contractHash,
        "Lease Room Unit": `Room ${roomId} (${roomFloor}F)${roomFeatures ? ` · ${roomFeatures}` : ""}`,
        "Monthly Rent": `฿${finalMonthlyRent.toLocaleString()} THB / month`,
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
        message: `Lease Application Submitted (Pending Payment & Verification):\n- Status: 提交成功，待资金支付成功后会发送合同邮件\n- Ref: ${contractSerial}\n- Hash: ${contractHash}\n- Tenant: ${effectiveTenant}\n- Signatory: ${effectiveSignatory}\n- ID/Tax: ${tenantIdNumber}\n- Phone: ${tenantPhone}\n- Email: ${cleanEmail}\n- Address: ${tenantAddress}\n- Room: ${roomId} (${roomFloor}F)\n- Discount: ${discountAppliedText || "Standard"}\n- Monthly Rent: ฿${finalMonthlyRent.toLocaleString()}\n- Deposit: ${isThreeMonthsNoDeposit ? "฿0" : `฿${securityDeposit.toLocaleString()}`}\n- Total Initial Payment: ฿${totalInitialPayment.toLocaleString()}\n- Period: ${startDate} to ${endDate} (${durationText})\n- Submitted At: ${signedAt}\n- Note: Direct SMTP error: ${smtpErrorDetails}`,
      }),
    });

    const web3Data = await web3Response.json();

    if (web3Response.ok && web3Data.success) {
      return new Response(
        JSON.stringify({
          success: true,
          method: "web3forms",
          warning: `SMTP failed (${smtpErrorDetails}), archived via Web3Forms.`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: smtpErrorDetails || web3Data.message || "Dispatch provider error" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
