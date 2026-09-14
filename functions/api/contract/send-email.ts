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
  attachment?: {
    filename: string;
    content: string; // base64
    contentType: string;
  };
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

    // Attachment
    if (opts.attachment && opts.attachment.content) {
      mime += `--${boundary}\r\n`;
      mime += `Content-Type: ${opts.attachment.contentType}; name="${opts.attachment.filename}"\r\n`;
      mime += `Content-Disposition: attachment; filename="${opts.attachment.filename}"\r\n`;
      mime += `Content-Transfer-Encoding: base64\r\n\r\n`;
      const cleanAtt = opts.attachment.content.replace(/[\r\n\s]+/g, "");
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

    // 2. Email to Landlord / Admin
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111; line-height: 1.6; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px;">
        <div style="background-color: #fef3c7; border: 1.5px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 4px 0; color: #92400e; font-size: 15px; font-weight: 800;">
            ⚠️ 待收款与人工校验 / ACTION REQUIRED
          </h3>
          <p style="margin: 0; font-size: 13px; color: #b45309;">
            租户已在线提交办公室租赁申请。完整版本合同（含租户签名与证件）已作为 <strong>PDF 附件</strong> 随本邮件发送。<br/>
            请核对银行账户确认收到首期款项（<strong>฿${totalInitialPayment.toLocaleString()} THB</strong>）。确认到账后，可直接将正式盖章合同发送给租户。
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
          <tr><td style="padding: 6px; font-weight: bold;">合同 PDF 附件:</td><td style="padding: 6px; font-family: monospace; color: #059669;">${pdfBase64 ? `✓ Lease_Agreement_${roomId}_${contractSerial}.pdf (${pdfEngine || "Ready"} - 已随邮件附带)` : `<span style="color:#dc2626;">❌ 无 PDF 附带 (${pdfError || "未生成"})</span>`}</td></tr>
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
        // 2. Send admin notification with attached full PDF
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
          attachment: pdfBase64 ? {
            filename: `Lease_Agreement_${roomId}_${contractSerial}.pdf`,
            content: pdfBase64,
            contentType: "application/pdf",
          } : undefined,
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
