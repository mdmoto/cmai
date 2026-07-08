"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "zh" | "th" | "ja";

type TranslationDict = Record<string, string>;

const translations: Record<Language, TranslationDict> = {
  en: {
    // Navbar
    navHome: "Home",
    navWorkspace: "Offices",
    navServices: "Services",
    navGallery: "Gallery",
    navFaq: "FAQ",
    navContact: "Contact",
    navBookVisit: "Book a Visit",
    
    // Hero
    heroTitle: "Chiang Mai AI Center",
    heroSubtitle: "Business Infrastructure for AI, Startups and Global Companies in Thailand.",
    heroCTAExplore: "Explore Offices",
    heroCTABook: "Book a Visit",
    
    // About
    aboutSectionTitle: "About",
    aboutTitle: "More Than a Coworking Space",
    aboutSub: "Business Infrastructure Platform",
    aboutDesc: "Chiang Mai AI Center is a premium business infrastructure platform designed for international tech teams, AI companies, and startups entering Thailand. We provide high-quality private offices, reliable networking, and local support to scale your operations.",
    aboutStatArea: "Total Area",
    aboutStatFloors: "Professional Facility",
    aboutStatOffices: "Private Workspaces",
    aboutStatInternet: "High-Speed Internet",
    aboutStatLocation: "Prime Location",
    aboutStatAirport: "To Chiang Mai Airport",
    aboutStatAirportSub: "5 km Distance",
    aboutStatInternetSub: "Enterprise Fiber",
    aboutStatFloorsSub: "5-Floor Building",
    aboutStatOfficesSub: "40+ Secure Units",
    
    // Workspace
    workspaceSectionTitle: "Workspace",
    workspaceSubtitle: "Discover Premium Offices",
    workspaceDesc: "Explore our range of secure, fully furnished private offices across 5 floors, custom-tailored for teams of all sizes.",
    workspaceFloorSelector: "Select Floor Layout",
    workspaceFloor1: "1F: Reception & Meeting Area",
    workspaceFloor2: "2F: Common Area & Offices B1-B7",
    workspaceFloor3: "3F: Enterprise Suites C1-C11",
    workspaceFloor4: "4F: Executive Suites D1-D11",
    workspaceFloor5: "5F: Penthouse Suites E1-E8",
    workspaceFloor1Desc: "Ground floor featuring the main reception entrance, professional meeting room, full kitchen, and visitor lounge.",
    workspaceFloor2Desc: "Features a spacious common workspace area along with private offices B1 to B7.",
    workspaceFloor3Desc: "Large enterprise offices C1 to C11 optimized for teams of 2 to 6 people.",
    workspaceFloor4Desc: "Dedicated executive offices D1 to D11 with private server racking setup.",
    workspaceFloor5Desc: "High-end executive workspaces E1 to E8 featuring scenic balcony views and outdoor spirit house area.",
    workspaceDetails: "Office Specifications",
    workspaceCapacity: "Capacity",
    workspaceArea: "Area",
    workspacePricing: "Pricing",
    workspaceStatus: "Status",
    workspaceAvailable: "Available",
    workspaceLimited: "Limited",
    workspaceFull: "Fully Leased",
    workspacePriceContact: "Contact for Details",
    
    // Services
    servicesSectionTitle: "Services",
    servicesLearnMore: "Learn More →",
    servicesSubtitle: "Full-Spectrum Business Support",
    servicesPrivateOffices: "Private Offices",
    servicesPrivateOfficesDesc: "Fully furnished offices for startups and international businesses.",
    servicesBusinessAddress: "Business Address",
    servicesBusinessAddressDesc: "Professional registered business address for your company setup.",
    servicesMailHandling: "Mail Handling",
    servicesMailHandlingDesc: "Receive business mail and parcels with digital notifications.",
    servicesMeetingFacilities: "Meeting Facilities",
    servicesMeetingFacilitiesDesc: "Premium high-tech meeting rooms and training space.",
    servicesEnterpriseInternet: "Enterprise Internet",
    servicesEnterpriseInternetDesc: "Fast and reliable business-grade symmetric fiber internet.",
    servicesDedicatedIp: "Dedicated IP & VPN",
    servicesDedicatedIpDesc: "Enterprise networking solutions for secure global connections.",
    servicesRegistration: "Registration Support",
    servicesRegistrationDesc: "Partner-based company registration assistance.",
    servicesLocalSupport: "Local Business Support",
    servicesLocalSupportDesc: "Accounting, legal, tax, visa and translation partners.",
    servicesCommunity: "Tech Community",
    servicesCommunityDesc: "Networking events and startup activities.",

    // Pricing
    pricingSectionTitle: "Pricing",
    pricingSubtitle: "Interactive Cost Estimator",
    pricingDesc: "Customize your setup and instantly calculate your monthly and one-time setup costs.",
    pricingTableHeadItem: "Service Item",
    pricingTableHeadOptions: "Options",
    pricingTableHeadPrice: "Price",
    pricingTableHeadUnit: "Unit",
    pricingTableHeadNotes: "Notes",
    pricingMonth: "Month",
    pricingOnce: "Once",
    pricingMonthlySubtotal: "Monthly Cost Subtotal",
    pricingOneTimeSubtotal: "One-time Setup Subtotal",
    pricingTotalCost: "Total Estimated Quote",
    pricingDiscounts: "Applied Savings & Discounts",
    pricingInquireQuote: "Send Quote & Inquire",
    pricingOfficeSizeS: "Small Team (1-3 Pax)",
    pricingOfficeSizeM: "Medium Team (4-8 Pax)",
    pricingOfficeSizeL: "Large Team (9-15 Pax)",
    pricingDuration: "Rental lease duration",
    pricingMonthsUnit: "Months",
    pricingOfficeSelectionRequired: "Office or Virtual Address Selection Required",
    pricingOfficeRequiredForBank: "Office Selection (Private/Shared) Required for Bank Account",

    // Gallery
    gallerySectionTitle: "Gallery",
    gallerySubtitle: "A Glimpse of Chiang Mai AI Center",
    galleryAll: "All Areas",
    galleryExterior: "Exterior",
    galleryReception: "Reception & Lobby",
    galleryOffices: "Private Offices",
    galleryCommon: "Common Area",

    // FAQ
    faqSectionTitle: "FAQ",
    faqSubtitle: "Frequently Asked Questions",
    faqQ1: "Can foreigners rent an office?",
    faqA1: "Yes, absolutely. We specialize in helping international founders and companies set up operations in Chiang Mai, providing full contract support in English.",
    faqQ2: "Can I register my company here?",
    faqA2: "Yes. We offer premium registered business address services along with partner-based company registration, accounting, and tax filing setup.",
    faqQ3: "Is mail handling available?",
    faqA3: "Yes, our reception team handles all business letters and parcels, and provides instant digital notifications (via email or chat) upon receipt.",
    faqQ4: "Is short-term rental available?",
    faqA4: "We focus on stable business operations. The standard leasing term starts from 6 to 12 months to foster a solid corporate environment.",
    faqQ5: "Is parking available?",
    faqA5: "Yes, secure dedicated car and motorcycle parking spaces are available for office tenants and their guests.",
    faqQ6: "How do I schedule a visit?",
    faqA6: "You can easily book a physical or virtual tour using our online visit booking form below, or contact us directly via LINE, WeChat, or WhatsApp.",

    // Contact
    contactSectionTitle: "Contact",
    contactSubtitle: "Start Your Business in Thailand",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSubmit: "Submit Booking",
    contactSuccess: "Thank you! We will get in touch with you shortly.",
    contactChat: "Direct Chat",
    contactLocation: "Location",
    contactMapButton: "Open in Google Maps",
  },
  zh: {
    // Navbar
    navHome: "首页",
    navWorkspace: "办公空间",
    navServices: "商业服务",
    navGallery: "空间实景",
    navFaq: "常见问题",
    navContact: "联系我们",
    navBookVisit: "预约参观",
    
    // Hero
    heroTitle: "清迈 AI 中心",
    heroSubtitle: "专为 AI、初创企业及全球公司打造的泰国商业基础设施。",
    heroCTAExplore: "探索办公空间",
    heroCTABook: "预约参观",
    
    // About
    aboutSectionTitle: "关于我们",
    aboutTitle: "不仅是共享办公空间",
    aboutSub: "商业基础设施平台",
    aboutDesc: "清迈 AI 中心是一个专为进入泰国的国际技术团队、AI 公司和初创企业打造的卓越商业基础设施平台。我们提供高品质的独立办公室、可靠的企业网络及本地运营支持，助力您的业务蓬勃发展。",
    aboutStatArea: "总面积",
    aboutStatFloors: "独栋楼宇",
    aboutStatOffices: "独立办公单元",
    aboutStatInternet: "高速网络",
    aboutStatLocation: "黄金地段",
    aboutStatAirport: "直达清迈机场",
    aboutStatAirportSub: "仅 5 公里距离",
    aboutStatInternetSub: "企业对称光纤",
    aboutStatFloorsSub: "独立 5 层楼宇",
    aboutStatOfficesSub: "40+ 间安全办公室",
    
    // Workspace
    workspaceSectionTitle: "办公空间",
    workspaceSubtitle: "发现高端办公室",
    workspaceDesc: "探索我们分布于 5 个楼层的安全、设施齐全的独立办公室，专为各种规模的团队定制。",
    workspaceFloorSelector: "选择楼层平面图",
    workspaceFloor1: "1F: 前台接待与会议中心",
    workspaceFloor2: "2F: 独立办公与公共空间 (B1-B7)",
    workspaceFloor3: "3F: 企业专属套房 (C1-C11)",
    workspaceFloor4: "4F: 行政专属套房 (D1-D11)",
    workspaceFloor5: "5F: 顶层全景套房 (E1-E8)",
    workspaceFloor1Desc: "一楼设有主前台入口、专业会议室、配套厨房和访客休息室。",
    workspaceFloor2Desc: "设有宽敞的公共工作区以及 B1 至 B7 独立办公室。",
    workspaceFloor3Desc: "大型企业专属办公室 C1 至 C11，专为 2-6 人团队优化。",
    workspaceFloor4Desc: "专属行政办公室 D1 至 D11，配备专用服务器机柜设置。",
    workspaceFloor5Desc: "高端行政空间 E1 至 E8，配有景观阳台和户外休闲平台。",
    workspaceDetails: "办公室规格",
    workspaceCapacity: "容纳人数",
    workspaceArea: "面积",
    workspacePricing: "租金",
    workspaceStatus: "状态",
    workspaceAvailable: "招租中",
    workspaceLimited: "席位紧缺",
    workspaceFull: "已全部租罄",
    workspacePriceContact: "欢迎详询",
    
    // Services
    servicesSectionTitle: "商业服务",
    servicesLearnMore: "点击了解更多 →",
    servicesSubtitle: "全方位商业支持",
    servicesPrivateOffices: "独立办公室",
    servicesPrivateOfficesDesc: "专为初创公司和跨国企业设计的精装修独立办公室。",
    servicesBusinessAddress: "商业地址注册",
    servicesBusinessAddressDesc: "为您的公司注册提供符合标准的专业商业地址。",
    servicesMailHandling: "信件包裹代收",
    servicesMailHandlingDesc: "安全代收商业信件与包裹，并提供即时数字化通知。",
    servicesMeetingFacilities: "会议培训设施",
    servicesMeetingFacilitiesDesc: "配备智能设备的现代化会议室及多功能培训空间。",
    servicesEnterpriseInternet: "企业级光纤网",
    servicesEnterpriseInternetDesc: "极速、稳定的对称企业级光纤网络保障。",
    servicesDedicatedIp: "专用 IP 与 VPN",
    servicesDedicatedIpDesc: "提供专用 IP 地址与企业级 VPN 网络安全解决方案。",
    servicesRegistration: "公司注册支持",
    servicesRegistrationDesc: "联合资深伙伴协助您完成泰国公司设立登记。",
    servicesLocalSupport: "本地运营保障",
    servicesLocalSupportDesc: "协助对接会计、法律、税务、签证和专业翻译伙伴。",
    servicesCommunity: "科技社群生态",
    servicesCommunityDesc: "丰富的行业社交活动、沙龙工作坊及创始人聚会。",

    // Pricing
    pricingSectionTitle: "报价方案",
    pricingSubtitle: "互动费用估算计算器",
    pricingDesc: "根据您的出海团队规模与业务需求定制配置，即时估算您的月租费用和一次性行政设立费用。",
    pricingTableHeadItem: "服务项目",
    pricingTableHeadOptions: "选择",
    pricingTableHeadPrice: "价格",
    pricingTableHeadUnit: "单位",
    pricingTableHeadNotes: "备注",
    pricingMonth: "月",
    pricingOnce: "次",
    pricingMonthlySubtotal: "月度租金小计",
    pricingOneTimeSubtotal: "一次性行政小计",
    pricingTotalCost: "预估报价合计",
    pricingDiscounts: "已享受的专项优惠",
    pricingInquireQuote: "发送报价并咨询",
    pricingOfficeSizeS: "小型办公室 (1-3 人)",
    pricingOfficeSizeM: "中型办公室 (4-8 人)",
    pricingOfficeSizeL: "大型办公室 (9-15 人)",
    pricingDuration: "租赁租期时长",
    pricingMonthsUnit: "个月",
    pricingOfficeSelectionRequired: "公司注册必须选择独立办公室、共享办公室或虚拟地址中的一项",
    pricingOfficeRequiredForBank: "办理银行开户必须选择独立办公室或共享办公室中的一项",

    // Gallery
    gallerySectionTitle: "空间实景",
    gallerySubtitle: "走进清迈 AI 中心",
    galleryAll: "全部区域",
    galleryExterior: "外观建筑",
    galleryReception: "大堂前台",
    galleryOffices: "独立办公室",
    galleryCommon: "公共区域",

    // FAQ
    faqSectionTitle: "常见问题",
    faqSubtitle: "常见疑问解答",
    faqQ1: "外国人可以在这里租办公室吗？",
    faqA1: "当然可以。我们致力于协助国际创始人及跨国企业在清迈设立分支机构，提供全英文合同支持与对接。",
    faqQ2: "我可以使用这里的地址注册公司吗？",
    faqA2: "可以。我们提供优质的商业地址注册服务，并联合专业伙伴为您提供公司注册、日常会计和税务申报支持。",
    faqQ3: "这里有前台包裹信件代收服务吗？",
    faqA3: "有的。前台行政团队代收所有商业信件和包裹，并在收件时提供即时的数字化通知（通过邮件或社交软件）。",
    faqQ4: "你们支持短期租赁吗？",
    faqA4: "为了维护稳定的商业和社区环境，我们主要提供 6 个月到 12 个月起租的标租合同，以建立良好的企业生态圈。",
    faqQ5: "楼宇内提供停车位吗？",
    faqA5: "有的。我们为入驻企业租户及其到访客户提供安全、专属的汽车与摩托车停车区。",
    faqQ6: "如何预约现场参观？",
    faqA6: "您可以通过下方的在线表格轻松预约现场或远程视频参观，亦可通过 LINE、微信或 WhatsApp 直接与我们沟通。",

    // Contact
    contactSectionTitle: "联系我们",
    contactSubtitle: "开启您的泰国业务",
    contactName: "姓名",
    contactEmail: "电子邮箱",
    contactMessage: "您的留言",
    contactSubmit: "提交预约申请",
    contactSuccess: "提交成功！我们将尽快与您取得联系。",
    contactChat: "在线沟通",
    contactLocation: "地理位置",
    contactMapButton: "在 Google 地图打开",
  },
  th: {
    // Navbar
    navHome: "หน้าแรก",
    navWorkspace: "พื้นที่ทำงาน",
    navServices: "บริการ",
    navGallery: "แกลเลอรี",
    navFaq: "คำถามที่พบบ่อย",
    navContact: "ติดต่อเรา",
    navBookVisit: "นัดหมายเข้าชม",
    
    // Hero
    heroTitle: "Chiang Mai AI Center",
    heroSubtitle: "โครงสร้างพื้นฐานทางธุรกิจสำหรับ AI, สตาร์ทอัพ และบริษัทระดับโลกในประเทศไทย",
    heroCTAExplore: "สำรวจออฟฟิศ",
    heroCTABook: "นัดหมายเข้าชม",
    
    // About
    aboutSectionTitle: "เกี่ยวกับเรา",
    aboutTitle: "เป็นมากกว่าโคเวิร์กกิ้งสเปซ",
    aboutSub: "แพลตฟอร์มโครงสร้างพื้นฐานธุรกิจ",
    aboutDesc: "Chiang Mai AI Center เป็นแพลตฟอร์มโครงสร้างพื้นฐานทางธุรกิจระดับพรีเมียมที่ออกแบบมาสำหรับทีมเทคโนโลยีระดับนานาชาติ บริษัท AI และสตาร์ทอัพที่เข้าสู่ประเทศไทย เราให้บริการออฟฟิศส่วนตัวคุณภาพสูง เครือข่ายที่เชื่อถือได้ และการสนับสนุนในท้องถิ่นเพื่อขยายการดำเนินงานของคุณ",
    aboutStatArea: "พื้นที่ทั้งหมด",
    aboutStatFloors: "สิ่งอำนวยความสะดวกเฉพาะ",
    aboutStatOffices: "พื้นที่ทำงานส่วนตัว",
    aboutStatInternet: "อินเทอร์เน็ตความเร็วสูง",
    aboutStatLocation: "ทำเลทอง",
    aboutStatAirport: "ไปสนามบินเชียงใหม่",
    aboutStatAirportSub: "ระยะทาง 5 กม.",
    aboutStatInternetSub: "ไฟเบอร์ระดับองค์กร",
    aboutStatFloorsSub: "อาคาร 5 ชั้น",
    aboutStatOfficesSub: "40+ ยูนิตที่ปลอดภัย",
    
    // Workspace
    workspaceSectionTitle: "พื้นที่ทำงาน",
    workspaceSubtitle: "ค้นพบออฟฟิศระดับพรีเมียม",
    workspaceDesc: "สำรวจออฟฟิศส่วนตัวที่ปลอดภัยและตกแต่งครบครันในทั้ง 5 ชั้น ซึ่งออกแบบมาโดยเฉพาะสำหรับทีมทุกขนาด",
    workspaceFloorSelector: "เลือกแปลนชั้น",
    workspaceFloor1: "ชั้น 1: แผนกต้อนรับ & ห้องประชุม",
    workspaceFloor2: "ชั้น 2: พื้นที่ส่วนกลาง & ออฟฟิศ B1-B7",
    workspaceFloor3: "ชั้น 3: ห้องชุดองค์กร C1-C11",
    workspaceFloor4: "ชั้น 4: ห้องชุดระดับผู้บริหาร D1-D11",
    workspaceFloor5: "ชั้น 5: เพนท์เฮาส์สูท E1-E8",
    workspaceFloor1Desc: "ชั้นล่างประกอบด้วยทางเข้าหลัก แผนกต้อนรับ ห้องประชุมระดับมืออาชีพ ห้องครัวเต็มรูปแบบ และเลานจ์สำหรับผู้มาเยือน",
    workspaceFloor2Desc: "มีพื้นที่ทำงานร่วมกันที่กว้างขวางพร้อมกับออฟฟิศส่วนตัว B1 ถึง B7",
    workspaceFloor3Desc: "ออฟฟิศขนาดใหญ่ C1 ถึง C11 สำหรับทีม 2-6 คน",
    workspaceFloor4Desc: "ออฟฟิศระดับบริหาร D1 ถึง D11 พร้อมระบบเซิร์ฟเวอร์ส่วนตัว",
    workspaceFloor5Desc: "พื้นที่ทำงานระดับไฮเอนด์ E1 ถึง E8 พร้อมวิวระเบียงชมทิวทัศน์และพื้นที่ศาลพระภูมิกลางแจ้ง",
    workspaceDetails: "ข้อมูลจำเพาะของออฟฟิศ",
    workspaceCapacity: "ความจุ",
    workspaceArea: "พื้นที่",
    workspacePricing: "ราคา",
    workspaceStatus: "สถานะ",
    workspaceAvailable: "ว่าง",
    workspaceLimited: "จำนวนจำกัด",
    workspaceFull: "เต็มแล้ว",
    workspacePriceContact: "ติดต่อสำหรับรายละเอียด",
    
    // Services
    servicesSectionTitle: "บริการ",
    servicesLearnMore: "เรียนรู้เพิ่มเติม →",
    servicesSubtitle: "การสนับสนุนธุรกิจครบวงจร",
    servicesPrivateOffices: "ออฟฟิศส่วนตัว",
    servicesPrivateOfficesDesc: "ออฟฟิศที่ตกแต่งครบครันสำหรับสตาร์ทอัพและธุรกิจต่างชาติ",
    servicesBusinessAddress: "ที่อยู่จดทะเบียนธุรกิจ",
    servicesBusinessAddressDesc: "ที่อยู่จดทะเบียนธุรกิจระดับมืออาชีพสำหรับการตั้งบริษัทของคุณ",
    servicesMailHandling: "การจัดการจดหมาย",
    servicesMailHandlingDesc: "รับจดหมายและพัสดุธุรกิจพร้อมการแจ้งเตือนทางดิจิทัล",
    servicesMeetingFacilities: "สิ่งอำนวยความสะดวกในการประชุม",
    servicesMeetingFacilitiesDesc: "ห้องประชุมและพื้นที่จัดฝึกอบรมระดับพรีเมียมพร้อมเทคโนโลยีสูง",
    servicesEnterpriseInternet: "อินเทอร์เน็ตสำหรับองค์กร",
    servicesEnterpriseInternetDesc: "อินเทอร์เน็ตไฟเบอร์แบบสมมาตรระดับธุรกิจที่รวดเร็วและเชื่อถือได้",
    servicesDedicatedIp: "IP เฉพาะ & VPN",
    servicesDedicatedIpDesc: "โซลูชันเครือข่ายองค์กรเพื่อการเชื่อมต่อทั่วโลกที่ปลอดภัย",
    servicesRegistration: "สนับสนุนการจดทะเบียน",
    servicesRegistrationDesc: "การช่วยเหลือจดทะเบียนบริษัทในไทยผ่านพันธมิตร",
    servicesLocalSupport: "การสนับสนุนธุรกิจในท้องถิ่น",
    servicesLocalSupportDesc: "พันธมิตรด้านบัญชี กฎหมาย ภาษี วีซ่า และการแปลที่มีความเชี่ยวชาญ",
    servicesCommunity: "ชุมชนเทคโนโลยี",
    servicesCommunityDesc: "งานสร้างเครือข่ายและกิจกรรมเริ่มต้นธุรกิจ",

    // Pricing
    pricingSectionTitle: "ราคา",
    pricingSubtitle: "เครื่องคำนวณต้นทุนเชิงโต้ตอบ",
    pricingDesc: "ปรับแต่งการตั้งค่าของคุณและคำนวณรายเดือนและค่าใช้จ่ายครั้งแรกของคุณทันที",
    pricingTableHeadItem: "รายการบริการ",
    pricingTableHeadOptions: "ตัวเลือก",
    pricingTableHeadPrice: "ราคา",
    pricingTableHeadUnit: "หน่วย",
    pricingTableHeadNotes: "หมายเหตุ",
    pricingMonth: "เดือน",
    pricingOnce: "ครั้ง",
    pricingMonthlySubtotal: "ยอดรวมรายเดือน",
    pricingOneTimeSubtotal: "ยอดรวมค่าแรกเข้า",
    pricingTotalCost: "ประมาณการยอดรวม",
    pricingDiscounts: "ส่วนลดที่ใช้",
    pricingInquireQuote: "ส่งใบเสนอราคาและสอบถาม",
    pricingOfficeSizeS: "ทีมขนาดเล็ก (1-3 คน)",
    pricingOfficeSizeM: "ทีมขนาดกลาง (4-8 คน)",
    pricingOfficeSizeL: "ทีมขนาดใหญ่ (9-15 คน)",
    pricingDuration: "ระยะเวลาเช่า",
    pricingMonthsUnit: "เดือน",
    pricingOfficeSelectionRequired: "ต้องเลือกสำนักงานหรือที่อยู่เสมือนสำหรับการจดทะเบียนบริษัท",
    pricingOfficeRequiredForBank: "ต้องเลือกสำนักงานสำหรับการเปิดบัญชีธนาคาร",

    // Gallery
    gallerySectionTitle: "แกลเลอรี",
    gallerySubtitle: "ภาพบรรยากาศ Chiang Mai AI Center",
    galleryAll: "ทุกพื้นที่",
    galleryExterior: "ภายนอกอาคาร",
    galleryReception: "ต้อนรับ & ล็อบบี้",
    galleryOffices: "ออฟฟิศส่วนตัว",
    galleryCommon: "พื้นที่ส่วนกลาง",

    // FAQ
    faqSectionTitle: "คำถามที่พบบ่อย",
    faqSubtitle: "คำถามที่พบบ่อย",
    faqQ1: "ชาวต่างชาติสามารถเช่าออฟฟิศได้หรือไม่?",
    faqA1: "ได้อย่างแน่นอน เราเชี่ยวชาญในการช่วยเหลือผู้ก่อตั้งและบริษัทต่างชาติในการตั้งสำนักงานในเชียงใหม่ โดยมีสัญญาภาษาอังกฤษเต็มรูปแบบ",
    faqQ2: "ฉันสามารถจดทะเบียนบริษัทที่นี่ได้หรือไม่?",
    faqA2: "ได้ เราให้บริการที่อยู่จดทะเบียนธุรกิจระดับพรีเมียมพร้อมกับการช่วยเหลือจดทะเบียนบริษัท บัญชี และการยื่นภาษีผ่านพันธมิตรของเรา",
    faqQ3: "มีบริการจัดการจดหมายหรือไม่?",
    faqA3: "มี ทีมต้อนรับของเราจัดการจดหมายและพัสดุธุรกิจทั้งหมด และให้การแจ้งเตือนทางดิจิทัลทันทีเมื่อได้รับ",
    faqQ4: "มีบริการเช่าระยะสั้นหรือไม่?",
    faqA4: "เรามุ่งเน้นความมั่นคงของธุรกิจ ระยะเวลาเช่ามาตรฐานเริ่มต้นที่ 6 ถึง 12 เดือน เพื่อส่งเสริมสภาพแวดล้อมองค์กรที่ดี",
    faqQ5: "มีที่จอดรถให้บริการหรือไม่?",
    faqA5: "มี มีพื้นที่จอดรถยนต์และรถจักรยานยนต์เฉพาะสำหรับผู้เช่าออฟฟิศและแขกของพวกเขา",
    faqQ6: "ฉันจะนัดหมายเข้าชมได้อย่างไร?",
    faqA6: "คุณสามารถนัดหมายการเข้าชมสถานที่จริงหรือเสมือนจริงได้ง่ายๆ โดยใช้แบบฟอร์มนัดหมายเข้าชมด้านล่าง หรือติดต่อเราโดยตรงผ่าน LINE, WeChat หรือ WhatsApp",

    // Contact
    contactSectionTitle: "ติดต่อเรา",
    contactSubtitle: "เริ่มต้นธุรกิจของคุณในประเทศไทย",
    contactName: "ชื่อ",
    contactEmail: "อีเมล",
    contactMessage: "ข้อความ",
    contactSubmit: "ส่งข้อมูลนัดหมาย",
    contactSuccess: "ขอบคุณ! เราจะติดต่อกลับหาคุณในไม่ช้า",
    contactChat: "แชทโดยตรง",
    contactLocation: "ที่ตั้ง",
    contactMapButton: "เปิดใน Google Maps",
  },
  ja: {
    // Navbar
    navHome: "ホーム",
    navWorkspace: "オフィス",
    navServices: "サービス",
    navGallery: "ギャラリー",
    navFaq: "よくある質問",
    navContact: "お問い合わせ",
    navBookVisit: "内覧予約",
    
    // Hero
    heroTitle: "チェンマイ AI センター",
    heroSubtitle: "AI、スタートアップ、そしてグローバル企業のタイ進出を支えるビジネスインフラプラットフォーム。",
    heroCTAExplore: "オフィスを見る",
    heroCTABook: "内覧予約",
    
    // About
    aboutSectionTitle: "私たちについて",
    aboutTitle: "コワーキングスペースを超えた存在",
    aboutSub: "ビジネスインフラプラットフォーム",
    aboutDesc: "チェンマイAIセンターは、タイに進出する国際的なテックチーム、AI企業、スタートアップのために設計されたプレミアムなビジネスインフラプラットフォームです。高品質なプライベートオフィス、信頼性の高いネットワーク、そして現地サポートを提供します。",
    aboutStatArea: "総面積",
    aboutStatFloors: "プロフェッショナル設備",
    aboutStatOffices: "専用ワークスペース",
    aboutStatInternet: "高速インターネット",
    aboutStatLocation: "プライムロケーション",
    aboutStatAirport: "チェンマイ空港まで",
    aboutStatAirportSub: "わずか 5 km",
    aboutStatInternetSub: "エンタープライズ光回線",
    aboutStatFloorsSub: "5階建て一棟ビル",
    aboutStatOfficesSub: "セキュリティ完備40+室",
    
    // Workspace
    workspaceSectionTitle: "ワークスペース",
    workspaceSubtitle: "プレミアムオフィスを探す",
    workspaceDesc: "あらゆる規模のチームに合わせてカスタマイズされた、5つの階にまたがる安全で家具付きのプライベートオフィスをご紹介します。",
    workspaceFloorSelector: "フロアレイアウトを選択",
    workspaceFloor1: "1階：レセプション＆会議エリア",
    workspaceFloor2: "2階：コモンルーム＆オフィス B1-B7",
    workspaceFloor3: "3階：エンタープライズスイート C1-C11",
    workspaceFloor4: "4階：エグゼクティブスイート D1-D11",
    workspaceFloor5: "5階：ペントハウススイート E1-E8",
    workspaceFloor1Desc: "メインレセプション入口、プロフェッショナルな会議室、フルキッチン、ビジターラウンジを備えたグランドフロア。",
    workspaceFloor2Desc: "広々としたコモンスペースと、B1〜B7のプライベートオフィスを配置。",
    workspaceFloor3Desc: "2〜6名のチームに最適化された大型エンタープライズオフィスC1〜C11。",
    workspaceFloor4Desc: "専用サーバーラック設置を備えたエグゼクティブオフィスD1〜D11。",
    workspaceFloor5Desc: "景色の良いバルコニーと屋外スピリットハウスエリアを備えた、エグゼクティブスペースE1〜E8。",
    workspaceDetails: "オフィス仕様",
    workspaceCapacity: "収容人数",
    workspaceArea: "面積",
    workspacePricing: "料金",
    workspaceStatus: "ステータス",
    workspaceAvailable: "空室",
    workspaceLimited: "残りわずか",
    workspaceFull: "満室",
    workspacePriceContact: "詳細はお問い合わせください",
    
    // Services
    servicesSectionTitle: "サービス",
    servicesLearnMore: "詳細を見る →",
    servicesSubtitle: "総合的なビジネス支援",
    servicesPrivateOffices: "プライベートオフィス",
    servicesPrivateOfficesDesc: "スタートアップや国際企業向けに家具が完備された個室オフィス。",
    servicesBusinessAddress: "登記用住所",
    servicesBusinessAddressDesc: "現地法人設立のためのプロフェッショナルな登記用住所を提供。",
    servicesMailHandling: "郵便物管理",
    servicesMailHandlingDesc: "郵便物や荷物の受け取り、およびデジタルでの即時通知サービス。",
    servicesMeetingFacilities: "会議室設備",
    servicesMeetingFacilitiesDesc: "ハイテク設備を備えた高品質な会議室と研修用スペース。",
    servicesEnterpriseInternet: "専用インターネット",
    servicesEnterpriseInternetDesc: "高速で信頼性の高いビジネスグレードの対称型光ファイバー回線。",
    servicesDedicatedIp: "専用IP & VPN",
    servicesDedicatedIpDesc: "安全なグローバル接続のための企業向けセキュリティネットワーク。",
    servicesRegistration: "法人設立サポート",
    servicesRegistrationDesc: "提携パートナーによるタイ法人設立手続きの支援。",
    servicesLocalSupport: "現地ビジネスサポート",
    servicesLocalSupportDesc: "会計、法務、税務、ビザ、翻訳の専門パートナーをご紹介。",
    servicesCommunity: "テックコミュニティ",
    servicesCommunityDesc: "ネットワーキングイベント、ワークショップ、交流活動の開催。",

    // Pricing
    pricingSectionTitle: "料金プラン",
    pricingSubtitle: "見積シミュレーター",
    pricingDesc: "ご要件に合わせてプランをカスタマイズし、月額費用と初期費用を即座にシミュレーションできます。",
    pricingTableHeadItem: "サービス項目",
    pricingTableHeadOptions: "選択",
    pricingTableHeadPrice: "価格",
    pricingTableHeadUnit: "単位",
    pricingTableHeadNotes: "備考",
    pricingMonth: "月",
    pricingOnce: "回",
    pricingMonthlySubtotal: "月額費用小計",
    pricingOneTimeSubtotal: "初期費用小計",
    pricingTotalCost: "お見積り合計",
    pricingDiscounts: "適用された割引特典",
    pricingInquireQuote: "この見積もりで問い合わせる",
    pricingOfficeSizeS: "小規模オフィス (1-3名)",
    pricingOfficeSizeM: "中規模オフィス (4-8名)",
    pricingOfficeSizeL: "大規模オフィス (9-15名)",
    pricingDuration: "契約レンタル期間",
    pricingMonthsUnit: "ヶ月",
    pricingOfficeSelectionRequired: "会社設立にはオフィスまたはバーチャルアドレスの選択が必要です",
    pricingOfficeRequiredForBank: "銀行口座開設にはオフィス（独立またはシェア）の選択が必要です",

    // Gallery
    gallerySectionTitle: "ギャラリー",
    gallerySubtitle: "チェンマイAIセンターの様子",
    galleryAll: "すべて",
    galleryExterior: "外観",
    galleryReception: "レセプション・ロビー",
    galleryOffices: "プライベートオフィス",
    galleryCommon: "コモンエリア",

    // FAQ
    faqSectionTitle: "よくある質問",
    faqSubtitle: "よくある質問",
    faqQ1: "外国人はオフィスをレンタルできますか？",
    faqA1: "はい、可能です。私たちは海外の創業者や企業がチェンマイで事業を開始するためのサポートを専門としており、英語での契約サポートを提供しています。",
    faqQ2: "ここで会社登記はできますか？",
    faqA2: "はい、可能です。プレミアムな登記用住所サービスと、提携パートナーによる会社設立、会計、税務手続きサポートを提供しています。",
    faqQ3: "郵便物の受け取りサービスはありますか？",
    faqA3: "はい、受付スタッフがすべての郵便物や小包を受け取り、受け取り時にデジタル通知（メールまたはチャット）をお送りします。",
    faqQ4: "短期契約は可能ですか？",
    faqA4: "安定したビジネス環境を維持するため、標準の契約期間は6ヶ月から12ヶ月からとなっております。",
    faqQ5: "駐車場はありますか？",
    faqA5: "はい、オフィス入居者様およびそのご来客者様用の、安全な専用駐車場（自動車・バイク）がございます。",
    faqQ6: "内覧はどのように予約すればよいですか？",
    faqA6: "以下のオンライン内覧予約フォームをご利用いただくか、LINE、WeChat、またはWhatsAppで直接お問い合わせください。",

    // Contact
    contactSectionTitle: "お問い合わせ",
    contactSubtitle: "タイでのビジネス展開を始めましょう",
    contactName: "お名前",
    contactEmail: "メールアドレス",
    contactMessage: "メッセージ",
    contactSubmit: "内覧予約を送信する",
    contactSuccess: "送信が完了しました。担当者より追ってご連絡いたします。",
    contactChat: "直接チャット",
    contactLocation: "アクセス",
    contactMapButton: "Google マップで開く",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("preferred_lang") as Language;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "zh" || browserLang === "th" || browserLang === "ja") {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_lang", lang);
  };

  const t = (key: string): string => {
    const dict = translations[language] || translations["en"];
    return dict[key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
