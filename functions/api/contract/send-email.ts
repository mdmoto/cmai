// Cloudflare Pages Function: /api/contract/send-email
// This runs natively on Cloudflare Workers edge network

interface Env {
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  ADMIN_EMAIL?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
}

// Allowed Room Whitelist
const VALID_ROOM_IDS = new Set([
  "B1-2", "B6", "B7", "C1-2", "C4", "C5", "C6", "C7-8", "C9", "C11", "C12",
  "D1-2", "D3", "D4", "D5", "D7-8", "D9", "D10", "D11",
  "E2", "E3", "E4-5", "E6", "E7", "E8", "E9", "E10"
]);

// Email Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    } = payload;

    // 1. Honeypot Anti-Bot Trap Check
    if (bot_honeypot && bot_honeypot.trim().length > 0) {
      return new Response(
        JSON.stringify({ success: true, method: "honeypot", message: "Agreement processed." }),
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

    // Web3Forms official Access Key (configured in Cloudflare env or fallback)
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
        message: `Lease Application Submitted (Pending Payment & Verification):\n- Status: 提交成功，待资金支付成功后会发送合同邮件\n- Ref: ${contractSerial}\n- Hash: ${contractHash}\n- Tenant: ${effectiveTenant}\n- Signatory: ${effectiveSignatory}\n- ID/Tax: ${tenantIdNumber}\n- Phone: ${tenantPhone}\n- Email: ${cleanEmail}\n- Address: ${tenantAddress}\n- Room: ${roomId} (${roomFloor}F)\n- Discount: ${discountAppliedText || "Standard"}\n- Monthly Rent: ฿${finalMonthlyRent.toLocaleString()}\n- Deposit: ${isThreeMonthsNoDeposit ? "฿0" : `฿${securityDeposit.toLocaleString()}`}\n- Total Initial Payment: ฿${totalInitialPayment.toLocaleString()}\n- Period: ${startDate} to ${endDate} (${durationText})\n- Submitted At: ${signedAt}`,
      }),
    });

    const web3Data = await web3Response.json();

    if (web3Response.ok && web3Data.success) {
      return new Response(
        JSON.stringify({ success: true, method: "cloudflare-pages", message: "Application archived." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: web3Data.message || "Dispatch provider error" }),
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
