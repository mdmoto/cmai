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
}

// Allowed Room Whitelist
const VALID_ROOM_IDS = new Set([
  "B1-2", "B6", "B7", "C1-2", "C4", "C5", "C6", "C7-8", "C9", "C11", "C12",
  "D1-2", "D3", "D4", "D5", "D7-8", "D9", "D10", "D11",
  "E2", "E3", "E4-5", "E6", "E7", "E8", "E9", "E10"
]);

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

      // 1. Email to Tenant (Customer Copy)
      const tenantHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111; line-height: 1.6; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; color: #fff;">
            <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">CHIANG MAI AI CENTER</h2>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">Colasola Co., Ltd. · Official Lease Agreement Confirmation</p>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 15px; margin-top: 0;">Dear <strong>${effectiveTenant}</strong>,</p>
            <p style="font-size: 13px; color: #334155;">Thank you for signing the office lease agreement with Chiang Mai AI Center. Your electronic lease agreement has been successfully verified, cryptographically signed, and archived in our registry.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 4px 0; color: #64748b; width: 140px;">Contract Ref:</td><td style="padding: 4px 0; font-family: monospace; font-weight: bold; color: #0f172a;">${contractSerial}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Checksum Hash:</td><td style="padding: 4px 0; font-family: monospace; font-size: 11px; color: #475569;">${contractHash}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Leased Unit:</td><td style="padding: 4px 0; font-weight: bold; color: #2563eb;">Room ${roomId} (${roomFloor}F)${roomFeatures ? ` · ${roomFeatures}` : ""}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Lease Term:</td><td style="padding: 4px 0; font-weight: bold;">${startDate} to ${endDate} (${durationText})</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Monthly Rent:</td><td style="padding: 4px 0; font-weight: bold; color: #0f172a;">฿${finalMonthlyRent.toLocaleString()} THB / mo ${discountAppliedText ? `<span style="color: #059669; font-size: 11px;">(${discountAppliedText})</span>` : ""}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Security Deposit:</td><td style="padding: 4px 0; font-weight: bold;">${isThreeMonthsNoDeposit ? "฿0 (No Deposit Required)" : `฿${securityDeposit.toLocaleString()} THB (2 Months)`}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Total Initial Sum:</td><td style="padding: 4px 0; font-weight: 800; color: #059669; font-size: 15px;">฿${totalInitialPayment.toLocaleString()} THB</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Tenant Name:</td><td style="padding: 4px 0;">${effectiveTenant}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">ID / Tax No:</td><td style="padding: 4px 0; font-family: monospace;">${tenantIdNumber}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Signed Timestamp:</td><td style="padding: 4px 0; font-size: 11px; color: #64748b;">${signedAt}</td></tr>
              </table>
            </div>

            <p style="font-size: 13px; color: #334155; line-height: 1.5;">Please retain this confirmation email and your Contract Reference (<strong>${contractSerial}</strong>) for your tenancy records. For any move-in assistance or billing inquiries, feel free to reply directly to this email or reach us at <strong>+66 62 345 8238</strong>.</p>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
              Chiang Mai AI Center · Colasola Co., Ltd.<br/>
              236/105 Chiang Mai AI Center, Moo 6, Mahidol Road, Nong Hoi, Mueang Chiang Mai 50000<br/>
              Tax ID: 0505566006478
            </div>
          </div>
        </div>
      `;

      // 2. Email to Landlord / Admin
      const adminHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111; line-height: 1.6; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px;">
          <h2 style="color: #059669; margin-top: 0;">📋 New Office Lease Agreement Signed</h2>
          <p style="font-size: 14px;">A new lease contract has been signed on <a href="https://lazzor.com/contract">lazzor.com/contract</a>.</p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: #f8fafc; padding: 12px; border-radius: 8px;">
            <tr><td style="padding: 6px; font-weight: bold; width: 140px;">Contract Ref:</td><td style="padding: 6px; font-family: monospace;">${contractSerial}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">SHA256 Hash:</td><td style="padding: 6px; font-family: monospace; font-size: 11px;">${contractHash}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Room Leased:</td><td style="padding: 6px; font-weight: bold; color: #2563eb;">Room ${roomId} (${roomFloor}F)</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Lease Term:</td><td style="padding: 6px;">${startDate} to ${endDate} (${durationText})</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Monthly Rent:</td><td style="padding: 6px;">฿${finalMonthlyRent.toLocaleString()} (Standard: ฿${standardRoomPrice.toLocaleString()})</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Promo / Discount:</td><td style="padding: 6px; color: #059669;">${discountAppliedText || "Standard Rate"}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Security Deposit:</td><td style="padding: 6px;">${isThreeMonthsNoDeposit ? "฿0 (No Deposit)" : `฿${securityDeposit.toLocaleString()}`}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Total Initial Sum:</td><td style="padding: 6px; font-weight: bold; color: #059669;">฿${totalInitialPayment.toLocaleString()}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Tenant Legal Name:</td><td style="padding: 6px; font-weight: bold;">${effectiveTenant}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Authorized Signer:</td><td style="padding: 6px;">${effectiveSignatory}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">ID / Tax No:</td><td style="padding: 6px; font-family: monospace;">${tenantIdNumber}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Tenant Phone:</td><td style="padding: 6px;">${tenantPhone}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Tenant Email:</td><td style="padding: 6px;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Registered Address:</td><td style="padding: 6px;">${tenantAddress}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Signed Timestamp:</td><td style="padding: 6px;">${signedAt}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Client IP:</td><td style="padding: 6px; font-family: monospace; font-size: 11px;">${clientIp}</td></tr>
          </table>
        </div>
      `;

      // Send customer copy
      await transporter.sendMail({
        from: fromAddress,
        to: cleanEmail,
        replyTo: adminEmail,
        subject: `[Signed Lease Agreement Copy] Chiang Mai AI Center - Room ${roomId} (${contractSerial})`,
        html: tenantHtml,
      });

      // Send admin notification
      await transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        replyTo: cleanEmail,
        subject: `[NEW SIGNED LEASE] Room ${roomId} - ${effectiveTenant} (${contractSerial})`,
        html: adminHtml,
      });

      return NextResponse.json({
        success: true,
        method: "smtp",
        message: "Signed agreement successfully emailed to tenant and archived with landlord.",
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
        subject: `[SIGNED LEASE AGREEMENT] Room ${roomId} - ${effectiveTenant} (${contractSerial})`,
        "Contract Reference": contractSerial,
        "Digital Hash Checksum": contractHash,
        "Lease Room Unit": `Room ${roomId} (${roomFloor}F)`,
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
        "Signed Timestamp": signedAt,
        message: `Official Lease Agreement Signed:\n- Ref: ${contractSerial}\n- Hash: ${contractHash}\n- Tenant: ${effectiveTenant}\n- Signatory: ${effectiveSignatory}\n- ID/Tax: ${tenantIdNumber}\n- Phone: ${tenantPhone}\n- Email: ${cleanEmail}\n- Address: ${tenantAddress}\n- Room: ${roomId} (${roomFloor}F)\n- Discount: ${discountAppliedText || "Standard"}\n- Monthly Rent: ฿${finalMonthlyRent.toLocaleString()}\n- Deposit: ${isThreeMonthsNoDeposit ? "฿0" : `฿${securityDeposit.toLocaleString()}`}\n- Total Initial: ฿${totalInitialPayment.toLocaleString()}\n- Period: ${startDate} to ${endDate} (${durationText})\n- Signed At: ${signedAt}`,
      }),
    });

    const web3Data = await web3Response.json();

    if (web3Response.ok && web3Data.success) {
      return NextResponse.json({
        success: true,
        method: "web3forms",
        message: "Agreement successfully archived via Web3Forms.",
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
