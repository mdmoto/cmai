"use client";

import React, { useState, useEffect } from "react";
import { useTranslation, Language } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Globe,
  Mail,
  Video,
  Wifi,
  ShieldAlert,
  FileText,
  Users,
  Compass,
  X,
  ArrowRight,
} from "lucide-react";

interface DetailedDoc {
  title: string;
  subtitle: string;
  content: string[];
}

export default function Services() {
  const { t, language } = useTranslation();
  const [activeService, setActiveService] = useState<string | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveService(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const coreServices = [
    {
      id: "private_offices",
      title: t("servicesPrivateOffices"),
      desc: t("servicesPrivateOfficesDesc"),
      icon: <Briefcase className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      id: "enterprise_internet",
      title: t("servicesEnterpriseInternet"),
      desc: t("servicesEnterpriseInternetDesc"),
      icon: <Wifi className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      id: "dedicated_ip",
      title: t("servicesDedicatedIp"),
      desc: t("servicesDedicatedIpDesc"),
      icon: <Globe className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      id: "meeting_facilities",
      title: t("servicesMeetingFacilities"),
      desc: t("servicesMeetingFacilitiesDesc"),
      icon: <Video className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
  ];

  const landingServices = [
    {
      id: "business_address",
      title: t("servicesBusinessAddress"),
      desc: t("servicesBusinessAddressDesc"),
      icon: <Compass className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      id: "mail_handling",
      title: t("servicesMailHandling"),
      desc: t("servicesMailHandlingDesc"),
      icon: <Mail className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      id: "registration_support",
      title: t("servicesRegistration"),
      desc: t("servicesRegistrationDesc"),
      icon: <FileText className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      id: "local_support",
      title: t("servicesLocalSupport"),
      desc: t("servicesLocalSupportDesc"),
      icon: <ShieldAlert className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      id: "community",
      title: t("servicesCommunity"),
      desc: t("servicesCommunityDesc"),
      icon: <Users className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
  ];

  const detailedDocs: Record<string, Record<Language, DetailedDoc>> = {
    private_offices: {
      en: {
        title: "Private Offices",
        subtitle: "High-Performance Workspace",
        content: [
          "Our private offices are engineered for high-performance teams, combining ergonomic design with maximum privacy. Located across 5 security-controlled floors, these spaces are fully fitted with designer desks, ergonomic chairs, and high-speed network points.",
          "Each office features independent VRF air-conditioning controls, allowing your team to customize their environment. Acoustic engineering ensures speech privacy, creating a quiet sanctuary optimized for focus.",
          "Tenancy includes full access to front-desk services, secure printing hubs, fully stocked pantry areas, meeting facilities, and daily professional cleaning. We offer flexible sizing options that can scale with your organization, accommodating teams of 2 to 20+ people."
        ]
      },
      zh: {
        title: "独立办公室",
        subtitle: "高标准专属办公空间",
        content: [
          "我们的独立办公室专为高效能团队打造，融合了人体工学设计与极致的隐私性。这些办公室分布在安全门禁控制的 5 个楼层中，配备了设计师办公桌、人体工学椅和高速局域网接入点。",
          "每个办公室都设有独立的 VRF 温控空调，允许您的团队自由定义工作环境。专业的隔音工程确保了声学隐私，为您创造了一个专为深度工作而优化的静谧空间。",
          "入驻包含前台行政助理服务、安全网络打印中心、茶水间及每日专业保洁。我们提供灵活的办公单元空间方案，支持随着团队的发展进行无缝扩容，满足 2 至 20+ 人的企业需要。"
        ]
      },
      th: {
        title: "สำนักงานส่วนตัว",
        subtitle: "พื้นที่ทำงานประสิทธิภาพสูง",
        content: [
          "ออฟฟิศส่วนตัวของเราได้รับการออกแบบสำหรับทีมที่มีประสิทธิภาพสูง โดยผสมผสานการออกแบบตามหลักสรีรศาสตร์เข้ากับความเป็นส่วนตัวสูงสุด ตั้งอยู่ในทั้ง 5 ชั้นที่มีระบบควบคุมความปลอดภัย พื้นที่เหล่านี้ติดตั้งโต๊ะทำงานของดีไซเนอร์ เก้าอี้ตามหลักสรีรศาสตร์ และจุดเชื่อมต่อเครือข่ายความเร็วสูง",
          "แต่ละออฟฟิศมีระบบควบคุมเครื่องปรับอากาศ VRF แยกส่วน ช่วยให้ทีมของคุณสามารถปรับแต่งสภาพแวดล้อมได้เอง วิศวกรรมเสียงช่วยรับประกันความเป็นส่วนตัวของการพูดคุย สร้างพื้นที่เงียบสงบที่เหมาะสมที่สุดสำหรับความมีสมาธิ",
          "สัญญาเช่ารวมการเข้าถึงบริการต้อนรับส่วนหน้าอย่างเต็มรูปแบบ ศูนย์การพิมพ์ที่ปลอดภัย พื้นที่เตรียมอาหารที่มีอุปกรณ์ครบครัน ห้องประชุม และการทำความสะอาดอย่างมืออาชีพทุกวัน เรามีตัวเลือกขนาดที่ยืดหยุ่นซึ่งสามารถปรับขนาดตามองค์กรของคุณ รองรับทีมตั้งแต่ 2 ถึง 20+ คน"
        ]
      },
      ja: {
        title: "プライベートオフィス",
        subtitle: "高性能な専用ワークスペース",
        content: [
          "当センターのプライベートオフィスは、人間工学に基づいたデザインと最大限のプライバシーを融合させ、生産性の高いチーム向けに設計されています。セキュリティ管理された5つのフロアに位置し、デザイナーズデスク、オフィスチェア、高速ネットワーク接続口を完備しています。",
          "各室に個別のVRF空調コントロールを備えており、チームに合わせた快適な室温調節が可能です。遮音設計により音声のプライバシーを保護し、集中力を高めるための静かな仕事環境を提供します。",
          "フロント対応、安全な共有印刷ハブ、パントリーエリア、会議室の利用、および毎日のプロによる清掃サービスが含まれています。2名から20名以上の規模に合わせて拡張可能な、柔軟なオフィスプランをご用意しています。"
        ]
      }
    },
    enterprise_internet: {
      en: {
        title: "Enterprise Internet",
        subtitle: "Gigabit-Speed Symmetric Fiber",
        content: [
          "Stay connected with ultra-fast, symmetric gigabit fiber-optic lines. We utilize dual-entry paths into the building and redundant backup connections from major national ISPs, guaranteeing 99.9% network uptime.",
          "Our system architecture supports custom private VLAN setups for every tenant, isolating network traffic to prevent any cross-interference or data leakage. High-density enterprise Wi-Fi 6 access points are distributed throughout the facility.",
          "We host an on-site IT operations team to provide instant setup assistance, address server configurations, and resolve any local networking issues immediately. Port forwarding and physical ethernet wiring options are available."
        ]
      },
      zh: {
        title: "企业级光纤网",
        subtitle: "千兆对称光纤冗余接入",
        content: [
          "为您提供超高速、上下行对称的千兆光纤网络。我们采用双物理路由引入楼宇，并接入泰国主流运营商的冗余备份线路，从而保障 99.9% 的网络在线率（SLA）。",
          "网络系统架构支持为每家入驻企业划分独立的专属局域网（VLAN），实现完全的数据隔离，杜绝交叉干扰或任何潜在的数据泄漏隐患。全楼均匀覆盖高密企业级 Wi-Fi 6 接入点。",
          "我们配有驻楼 IT 运营专家团队，为您提供即时网络部署、企业级路由器调试及即时排障支持。可提供端口转发、专属公网IP分配及物理网线布线服务。"
        ]
      },
      th: {
        title: "อินเทอร์เน็ตระดับองค์กร",
        subtitle: "ไฟเบอร์แบบสมมาตรความเร็วระดับกิกะบิต",
        content: [
          "เชื่อมต่ออยู่เสมอด้วยสายใยนำแสงความเร็วระดับกิกะบิตแบบสมมาตรที่รวดเร็วเป็นพิเศษ เราใช้เส้นทางเชื่อมต่อแบบคู่เข้าสู่อาคารและการเชื่อมต่อสำรองจากผู้ให้บริการอินเทอร์เน็ตรายใหญ่ในประเทศ เพื่อรับประกันอัปไทม์เครือข่าย 99.9%",
          "สถาปัตยกรรมระบบของเราสนับสนุนการตั้งค่า VLAN ส่วนตัวสำหรับผู้เช่าแต่ละราย แยกทราฟฟิกเครือข่ายเพื่อป้องกันการรบกวนข้ามระบบหรือข้อมูลรั่วไหล จุดเข้าใช้งาน Wi-Fi 6 ระดับองค์กรที่มีความหนาแน่นสูงกระจายอยู่ทั่วอาคาร",
          "เรามีทีมปฏิบัติการไอทีในสถานที่เพื่อคอยช่วยเหลือในการตั้งค่าทันที จัดการการกำหนดค่าเซิร์ฟเวอร์ และแก้ไขปัญหาเครือข่ายท้องถิ่นทันที มีตัวเลือกการส่งต่อพอร์ตและการเดินสายอีเธอร์เน็ตแบบกายภาพ"
        ]
      },
      ja: {
        title: "企業向け専用ネット",
        subtitle: "ギガビット対称型光回線と冗長化",
        content: [
          "超高速で上下対称のギガビット光回線を提供します。ビルへの2系統の物理引き込みと、タイ主要プロバイダによる冗長バックアップ構成により、ネットワーク稼働率99.9%を保証しています。",
          "入居企業ごとに個別のVLAN（バーチャルLAN）設定を行い、社内データを完全に隔離。データ漏洩や混信を防ぎます。全館にエンタープライズ向けの高性能Wi-Fi 6アクセスポイントを設置しています。",
          "常駐のIT運用エンジニアが初期設定からサーバー接続、不具合対応まで迅速に対応します。ポートフォワーディングやLANケーブルの配線工事など、ご要望に沿ったネットワーク構築が可能です。"
        ]
      }
    },
    dedicated_ip: {
      en: {
        title: "Dedicated IP & VPN",
        subtitle: "Cross-Border E-Commerce Network Solutions",
        content: [
          "We provide dedicated static IPv4 addresses and encrypted VPN gateways specifically optimized for cross-border enterprises operating TikTok, Lazada, and Facebook businesses overseas, supporting highly stable 'Residential IP' solutions.",
          "Unlike standard commercial ISPs that frequently rotate or jump IP addresses—triggering security flags and account bans on major social media and e-commerce platforms—our network locks a clean, static, non-rotating routing path to safeguard your account assets.",
          "Equipped with enterprise-grade network gateways, we prevent jitter and disconnection during live streams and daily operations, ensuring your team has a reliable security shield for global digital business."
        ]
      },
      zh: {
        title: "专用 IP 与 VPN",
        subtitle: "跨境电商与社群运营专用网络",
        content: [
          "我们专为跨境出海企业（如运营 TikTok、Facebook、Lazada 等业务的团队）提供独享的静态公网 IP 与 VPN 加密通道，支持提供高度稳定的‘住宅级家庭 IP’（Residential IP）服务。",
          "常规商业宽带通常会频繁跳转、轮换物理 IP 地址，这对于海外电商平台与社交媒体的安全风控极其敏感，极易导致店铺或广告账号被误封甚至永久封停。我们的网络方案能够锁定纯净静态路由，确保您的账号资产安全稳定。",
          "硬件层面采用企业级专业网关，不仅支持本地专线高速中转，还能防止视频直播、店铺运营中的断线与延迟抖动，是企业高效布局海外电商业务 the 底层网络盾牌。"
        ]
      },
      th: {
        title: "IP เฉพาะ & VPN",
        subtitle: "โซลูชันเครือข่ายอีคอมเมิร์ซข้ามพรมแดน",
        content: [
          "เราให้บริการที่อยู่ IPv4 แบบคงที่โดยเฉพาะและเกตเวย์ VPN ที่เข้ารหัส ซึ่งได้รับการปรับแต่งเป็นพิเศษสำหรับองค์กรข้ามพรมแดนที่ดำเนินธุรกิจ TikTok, Lazada และ Facebook ในต่างประเทศ โดยรองรับโซลูชัน 'Residential IP' ที่มีความเสถียรสูง",
          "ต่างจาก ISP ทั่วไปที่มักจะหมุนเวียนหรือเปลี่ยนที่อยู่ IP บ่อยครั้ง ซึ่งส่งผลให้เกิดการระงับบัญชีในแพลตฟอร์มโซเชียลมีเดียและอีคอมเมิร์ซหลักๆ เครือข่ายของเราจะล็อกเส้นทางที่สะอาด คงที่ และไม่มีการหมุนเวียนเพื่อปกป้องบัญชีของคุณ",
          "ติดตั้งเกตเวย์เครือข่ายระดับองค์กร เราป้องกันการกระตุกและการหลุดระหว่างไลฟ์สตรีมและการดำเนินงานประจำวัน เพื่อให้มั่นใจว่าทีมของคุณมีเกราะป้องกันที่เชื่อถือได้สำหรับธุรกิจดิจิทัลระดับโลก"
        ]
      },
      ja: {
        title: "専用IP & VPN",
        subtitle: "クロスボーダーEC・SNS運用専用ネットワーク",
        content: [
          "海外でTikTok、Lazada、Facebookビジネスを展開する企業向けに、専用の静的IPv4アドレスと暗号化されたVPNゲートウェイを提供。極めて安定した「レジデンシャル（住宅用）IP」環境をサポートします。",
          "一般的な商業プロバイダは物理IPアドレスを頻繁に変更・ローテーションするため、海外ECやSNSプラットフォームのセキュリティ検知に引っかかり、アカウント凍結（BAN）を招くリスクがあります。当センターは純粋な固定ルートを確保し、大切なアカウント資産を守ります。",
          "エンタープライズ級のハードウェアにより、動画配信やストア運営時における通信の切断や遅延ジッターを徹底排除。グローバルデジタルビジネスを支える最も信頼性の高いネットワーク基盤を構築します。"
        ]
      }
    },
    meeting_facilities: {
      en: {
        title: "Meeting Facilities",
        subtitle: "High-Tech Collaborations",
        content: [
          "Host clients and manage team workshops in our premium meeting rooms, designed to host from 8 to 20 participants. Each boardroom features sleek, modern acoustics and clean natural light.",
          "Our facilities are fully equipped with smart 4K flat screens, wide-angle 4K videoconferencing bar systems, multi-directional boundary microphones, and digital whiteboards for interactive brainstorming.",
          "Bookings can be managed seamlessly online or via our dedicated tenant support. High-speed Wi-Fi, presentation connectors, power hubs, and professional catering options are available for half-day or full-day corporate workshops."
        ]
      },
      zh: {
        title: "会议培训设施",
        subtitle: "多功能高清智能会议中心",
        content: [
          "在专门为 8 至 20 人会议设计的高端会议空间中，接待您的贵宾并开展团队业务。每个会议室均具有顶级的声学隔离墙体与开阔的采光视野。",
          "会议室配备 4K 智能大屏显示终端、4K 超广角视频会议系统、多向声源追踪麦克风以及数字电子白板，为您的头脑风暴或跨国远程协作提供无缝支持。",
          "您可以通过在线平台或前台助理快速完成会议室预约。现场提供高速网络、各种常用演示转接口、桌底电源插座，并可根据您的需要提供半天或全天的企业茶歇与餐饮定制。"
        ]
      },
      th: {
        title: "สิ่งอำนวยความสะดวกในการประชุม",
        subtitle: "การทำงานร่วมกันด้วยเทคโนโลยีขั้นสูง",
        content: [
          "ต้อนรับลูกค้าและจัดเวิร์กชอปของทีมในห้องประชุมระดับพรีเมียมของเรา ซึ่งออกแบบมาเพื่อรองรับผู้เข้าร่วมตั้งแต่ 8 ถึง 20 คน ห้องประชุมแต่ละห้องมีการออกแบบระบบเสียงที่ทันสมัยและแสงธรรมชาติที่โปร่งสบาย",
          "สิ่งอำนวยความสะดวกของเราเพียบพร้อมไปด้วยหน้าจอแบนอัจฉริยะ 4K ระบบกล้องวิดีโอคอนเฟอเรนซ์ 4K มุมกว้าง ไมโครโฟนรอบทิศทาง และไวท์บอร์ดดิจิทัลสำหรับการระดมสมองแบบโต้ตอบ",
          "การจองสามารถจัดการได้อย่างราบรื่นทางออนไลน์หรือผ่านฝ่ายสนับสนุนผู้เช่าของเรา มี Wi-Fi ความเร็วสูง อุปกรณ์เชื่อมต่อการนำเสนอ ปลั๊กไฟ และตัวเลือกการจัดเลี้ยงแบบมืออาชีพสำหรับเวิร์กชอปขององค์กรแบบครึ่งวันหรือเต็มวัน"
        ]
      },
      ja: {
        title: "会議・研修設備",
        subtitle: "ハイテク対応の会議・コラボレーション空間",
        content: [
          "8名から20名まで対応可能な、洗練された役員会議室・ワークショップスペースをご利用いただけます。優れた遮音音響設計と、明るい採光設計を取り入れています。",
          "4K対応の大型スマートスクリーン、4K超広角WEB会議カメラシステム、高性能全指向性集音マイク、ブレインストーミングに使えるデジタルホワイトボードを常備。",
          "オンラインまたは受付から空き状況をスマートに確認し、予約可能です。高速Wi-Fi、プレゼン用端子、電源を集約したテーブル、および半日・終日のケータリング提供にも対応します。"
        ]
      }
    },
    business_address: {
      en: {
        title: "Business Address",
        subtitle: "Prestigious Corporate Registration",
        content: [
          "Establish your company with a professional corporate business address at our center in Huay Kaew, one of Chiang Mai's most active commercial districts.",
          "Our business address service complies fully with Thai government standards for official company incorporation, Social Security Fund filings, and Value Added Tax (VAT) registry.",
          "Suitable for BOI-promoted technology projects and foreign corporate branch offices. Included in our service is a dedicated mail signature protocol and administrative compliance check for legal notices."
        ]
      },
      zh: {
        title: "商业地址注册",
        subtitle: "清迈地标级企业法定地址",
        content: [
          "将您的企业设立在清迈黄金商业走廊——Huay Kaew 商业地带，为您的跨国公司树立专业可靠的商业首印形象。",
          "我们的商业地址服务完全符合泰国商政厅、税务局的最新标准，支持开设本地公司、办理增值税（VAT）登记、以及日常社会保障基金（Social Security）的申报归档。",
          "适合 BOI 科技促进企业、外国跨国公司代表处在泰落地注册。地址服务内包含邮件代收签收协议及合规的官方邮件与法律文书签收登记服务。"
        ]
      },
      th: {
        title: "ที่อยู่จดทะเบียนธุรกิจ",
        subtitle: "การจดทะเบียนองค์กรที่มีชื่อเสียง",
        content: [
          "จัดตั้งบริษัทของคุณด้วยที่อยู่จดทะเบียนธุรกิจระดับมืออาชีพที่ศูนย์ของเราในย่านห้วยแก้ว ซึ่งเป็นหนึ่งในย่านการค้าที่มีความเคลื่อนไหวมากที่สุดของเชียงใหม่",
          "บริการที่อยู่จดทะเบียนธุรกิจของเราสอดคล้องกับมาตรฐานของรัฐบาลไทยอย่างสมบูรณ์สำหรับการจดทะเบียนจัดตั้งบริษัทอย่างเป็นทางการ การยื่นเอกสารกองทุนประกันสังคม และการจดทะเบียนภาษีมูลค่าเพิ่ม (VAT)",
          "เหมาะสำหรับโครงการเทคโนโลยีที่ได้รับการส่งเสริมจาก BOI และสำนักงานสาขาของบริษัทต่างประเทศ บริการของเรารวมถึงโปรโตคอลการลงนามจดหมายเฉพาะและการตรวจสอบการปฏิบัติตามกฎระเบียบสำหรับการแจ้งเตือนทางกฎหมาย"
        ]
      },
      ja: {
        title: "登記用住所",
        subtitle: "チェンマイの中心地での企業登録",
        content: [
          "チェンマイ屈指のビジネス地区であるフアイケーオ通りに面した、ステータスの高い商業登記用住所を提供します。信頼性の高いアドレスを対外的にアピールできます。",
          "タイの商業登記、社会保険登録、VAT（付加価値税）登録の法的基準に完全に適合したアドレスです。公式なオフィシャルレターの受取先として指定可能です。",
          "BOI（タイ投資委員会）の推奨テック企業や、外国企業のタイ駐在員事務所などの登記にも多数の実績があります。契約時には正式な住所使用承諾書を速やかに発行します。"
        ]
      }
    },
    mail_handling: {
      en: {
        title: "Mail Handling",
        subtitle: "Vigilant Correspondence Management",
        content: [
          "Never miss critical corporate communications. Our professional front desk receptionists will sign for all inbound letters, registered couriers, and international freight shipments.",
          "Upon receipt, our team securely logs the item, takes a digital photograph or scan of the envelope, and forwards an instant notification directly to your designated email or messaging channel.",
          "We offer multiple options for physical letter forwarding, package consolidation, or secure storage inside lockable reception lockers. Urgent document scanning requests are processed on the same business day."
        ]
      },
      zh: {
        title: "信件包裹代收",
        subtitle: "前台行政助理数字邮件收发",
        content: [
          "确保您不会遗漏任何关键的商业邮件或官方信函。我们的专业前台团队将在办公时间内代签收所有入境挂号信件、快递包裹以及国际物流件。",
          "收到您的信件包裹后，前台会将快件扫码入库，拍摄封皮照片并上传，系统会自动通过电子邮件或您的指定联络工具发送即时数字化通知。",
          "我们提供多种后续处理选择，包括信件物理全球转寄、包裹打包合并转运以及在保险柜内安全存放。前台可在您授权下，于当天完成信件拆阅并扫描发送至您的邮箱。"
        ]
      },
      th: {
        title: "การจัดการจดหมาย",
        subtitle: "การจัดการจดหมายโต้ตอบอย่างรอบคอบ",
        content: [
          "ไม่พลาดการสื่อสารที่สำคัญขององค์กร พนักงานต้อนรับส่วนหน้ามืออาชีพของเราจะลงนามรับจดหมายขาเข้า จดหมายลงทะเบียน และการจัดส่งสินค้าต่างประเทศทั้งหมด",
          "เมื่อได้รับจดหมาย ทีมงานของเราจะบันทึกรายการอย่างปลอดภัย ถ่ายภาพดิจิทัลหรือสแกนซองจดหมาย และส่งการแจ้งเตือนทันทีไปยังอีเมลหรือช่องทางแชทที่คุณกำหนด",
          "เราเสนอทางเลือกที่หลากหลายสำหรับการส่งต่อจดหมายทางกายภาพ การรวมพัสดุ หรือการจัดเก็บอย่างปลอดภัยภายในล็อกเกอร์รับเอกสาร คำขอสแกนเอกสารเร่งด่วนจะได้รับการดำเนินการภายในวันทำการเดียวกัน"
        ]
      },
      ja: {
        title: "郵便物管理",
        subtitle: "郵便物・荷物の受取とデジタル通知",
        content: [
          "重要な法的レターや取引先からの荷物を見逃しません。専門の受付チームが、書留、宅配便、海外からの貨物の受け取りと受領サインを代行します。",
          "受領した郵便物は安全に記録され、封筒の外観をデジタル撮影またはスキャンして、ご指定のメールやチャットへ即座に画像付き通知をお送りします。",
          "受け取った書類の転送、荷物の同梱発送、または専用ロッカーでの安全保管などに対応します。お急ぎの書類は、ご指示に基づき開封してスキャンし、当日中にデータ送付することも可能です。"
        ]
      }
    },
    registration_support: {
      en: {
        title: "Registration Support",
        subtitle: "Thai Incorporation Assistance",
        content: [
          "Navigating foreign business laws can be complex. We provide direct structural support for incorporating your Thai Company Limited or establishing a BOI promoted tech enterprise.",
          "Our consulting partners guide you through drafting the Memorandum of Association, structuring shares between foreign and local shareholders, corporate seal design, and applying for tax numbers.",
          "We also facilitate fast-tracked business bank account introductions with top local Thai commercial banks, helping your team establish physical capital accounts and online banking applications smoothly."
        ]
      },
      zh: {
        title: "公司注册支持",
        subtitle: "一站式泰国公司设立落地协助",
        content: [
          "跨国法律与商业注册流程可能较为繁琐。我们提供直接的落地支持，协助您在泰国设立有限公司或成立 BOI 科技促进型企业。",
          "我们的资深法务顾问伙伴将引导您起草公司章程（MOA）、优化配置符合法定规范的股东结构、设计制作公司企业印章以及申请企业税务登记号。",
          "我们还将协助您对接泰国主流商业银行，提供快速开户通道，确保您的注册资本金打入、企业日常账户开设及企业网上银行功能顺利开通。"
        ]
      },
      th: {
        title: "การสนับสนุนการจดทะเบียน",
        subtitle: "ความช่วยเหลือในการจัดตั้งบริษัทในไทย",
        content: [
          "การทำความเข้าใจกฎหมายธุรกิจต่างประเทศอาจมีความซับซ้อน เราให้การสนับสนุนด้านโครงสร้างโดยตรงสำหรับการจดทะเบียนบริษัทจำกัดในไทย หรือการจัดตั้งองค์กรเทคโนโลยีที่ได้รับการส่งเสริมจาก BOI",
          "พันธมิตรที่ปรึกษาของเราจะแนะนำคุณในการจัดทำหนังสือบริคณห์สนธิ การจัดโครงสร้างหุ้นระหว่างผู้ถือหุ้นต่างชาติและผู้ถือหุ้นไทย การออกแบบตราประทับบริษัท และการขอเลขประจำตัวผู้เสียภาษี",
          "นอกจากนี้ เรายังอำนวยความสะดวกในการแนะนำการเปิดบัญชีธนาคารธุรกิจอย่างรวดเร็วกับธนาคารพาณิชย์ชั้นนำของไทย ช่วยให้ทีมของคุณจัดทำบัญชีเงินทุนและสมัครใช้งานธนาคารออนไลน์ได้อย่างราบรื่น"
        ]
      },
      ja: {
        title: "法人設立サポート",
        subtitle: "タイ現地法人の設立とBOI申請支援",
        content: [
          "タイの法律や外資規制は複雑です。私たちは、タイ現地法人（Co., Ltd.）の設立や、外資100%での設立が可能になるBOI（タイ投資委員会）認定企業の申請サポートを行っています。",
          "提携の専門チームが、定款（基本合意書）の作成、株主構成の最適化、税務署への登録、および法人銀行口座の開設までガイドします。",
          "タイの大手商業銀行の法人口座開設手続きをエスコートし、資本金の送金手続きやオンラインバンキング設定が確実に完了するよう支援します。"
        ]
      }
    },
    local_support: {
      en: {
        title: "Local Business Support",
        subtitle: "Compliance & Administrative Shield",
        content: [
          "Ensure your operations are fully compliant with Thai law. We connect you with verified local professional agencies specializing in corporate accounting, monthly tax compliance, and auditing.",
          "Receive expert guidance on securing non-immigrant visas and work permits. We support BOI Digital Work Permits, LTR (Long-Term Resident) visas, and standard business visa extensions for your global engineers.",
          "Our support network also offers access to commercial attorneys for review of contract leases, intellectual property registration, and professional translators certified for Thai-English-Chinese documents."
        ]
      },
      zh: {
        title: "本地运营保障",
        subtitle: "泰国商业合规与行政保障支持",
        content: [
          "确保您的跨境业务在泰国完全合规运营。我们协助您对接资深的会计事务所，提供日常记账、每月增值税申报、企业所得税代扣代缴以及年度法定财务审计。",
          "提供针对外籍雇员签证和工作许可证（Work Permit）的申请指导。我们大力支持 BOI 专属电子工签、泰国 LTR 长期居民签证的申报，协助您的外籍工程师团队稳定驻地。",
          "我们的本地保障网络还提供商业合同审查、知识产权保护登记以及经过官方认证的中、英、泰三语商务同声传译和文档翻译服务。"
        ]
      },
      th: {
        title: "การสนับสนุนธุรกิจในท้องถิ่น",
        subtitle: "การปฏิบัติตามข้อกำหนดและการป้องกันการบริหาร",
        content: [
          "มั่นใจได้ว่าการดำเนินงานของคุณสอดคล้องกับกฎหมายไทยอย่างสมบูรณ์ เราเชื่อมต่อคุณกับสำนักงานวิชาชีพในท้องถิ่นที่ได้รับการตรวจสอบแล้ว ซึ่งมีความเชี่ยวชาญด้านบัญชีองค์กร การปฏิบัติตามข้อกำหนดภาษีรายเดือน และการตรวจสอบบัญชี",
          "รับคำแนะนำจากผู้เชี่ยวชาญในการขอวีซ่าชั่วคราวและใบอนุญาตทำงาน เราสนับสนุนใบอนุญาตทำงานดิจิทัล BOI วีซ่า LTR (ผู้พำนักระยะยาว) และการต่ออายุวีซ่าธุรกิจมาตรฐานสำหรับวิศวกรระดับโลกของคุณ",
          "เครือข่ายสนับสนุนของเรายังเสนอการเข้าถึงทนายความเชิงพาณิชย์เพื่อตรวจสอบสัญญาเช่า การจดทะเบียนทรัพย์สินทางปัญญา และนักแปลมืออาชีพที่ได้รับการรับรองสำหรับเอกสารภาษาไทย-อังกฤษ-จีน"
        ]
      },
      ja: {
        title: "現地ビジネスサポート",
        subtitle: "法務・会計・ビザの現地バックアップ",
        content: [
          "タイでの法的なコンプライアンス（法令遵守）を確実にします。毎月の会計記帳、付加価値税（VAT）や源泉徴収税の申告、年次決算監査を代行する信頼できる会計事務所を仲介します。",
          "外籍従業員向けのノンイミグラントビザ（Bビザ）やワークパーミット（就労許可証）の取得を実務レベルで支援。BOI電子ワークパーミットや、長期居住ビザ（LTR）の取得ノウハウを提供します。",
          "その他、賃貸借契約書の法的なレビューを行う弁護士、特許・商標登録手続き、タイ公認の翻訳士による法的なドキュメント翻訳（泰・英・日・中）サービスをご紹介します。"
        ]
      }
    },
    community: {
      en: {
        title: "Tech Community",
        subtitle: "Dynamic Entrepreneur Ecosystem",
        content: [
          "Join Chiang Mai's premier community of builders, founders, and engineers. We host regular networking mixers, tech roundtables, artificial intelligence panels, and startup workshops.",
          "Our platform serves as a bridge between international tech teams and Thailand's digital ecosystem, connecting you with local technology universities, talent pools, and startup incubators.",
          "Whether you are looking for local development partners, local talent, co-founders, or peer founder support, our community activities are designed to build meaningful business relationships."
        ]
      },
      zh: {
        title: "科技社群生态",
        subtitle: "清迈卓越的创业者与工程师 network 网络",
        content: [
          "加入清迈顶级的科技创始人与研发工程师社群。我们定期举办行业交流酒会、技术圆桌论坛、人工智能（AI）专题研讨会和创业孵化沙龙。",
          "清迈 AI 中心作为连接国际技术团队与泰国本土数字化生态圈的桥梁，为您提供对接本地理工高校科研机构、本土优秀软件人才库以及行业孵化器的便捷通道。",
          "无论您是在寻找本地的技术开发服务商、招募本地开发人员、寻找联合创始人，还是寻求同行创业者的资源互助，我们的社群活动都能助您建立起有价值的商业纽带。"
        ]
      },
      th: {
        title: "ชุมชนเทคโนโลยี",
        subtitle: "ระบบนิเวศของผู้ประกอบการที่มีชีวิตชีวา",
        content: [
          "เข้าร่วมชุมชนชั้นนำของเชียงใหม่สำหรับนักสร้าง ผู้ก่อตั้ง และวิศวกร เราจัดงานพบปะเพื่อสร้างเครือข่ายเป็นประจำ การสนทนาโต๊ะกลมด้านเทคโนโลยี การอภิปรายเกี่ยวกับปัญญาประดิษฐ์ และเวิร์กชอปสตาร์ทอัพ",
          "แพลตฟอร์มของเราทำหน้าที่เป็นสะพานเชื่อมระหว่างทีมเทคโนโลยีระดับนานาชาติและระบบนิเวศดิจิทัลของประเทศไทย เชื่อมต่อคุณกับมหาวิทยาลัยเทคโนโลยีในท้องถิ่น แหล่งรวบรวมบุคลากรที่มีความสามารถ และศูนย์บ่มเพาะสตาร์ทอัพ",
          "ไม่ว่าคุณกำลังมองหาพันธมิตรด้านการพัฒนาในท้องถิ่น บุคลากรในท้องถิ่น ผู้ร่วมก่อตั้ง หรือการสนับสนุนผู้ก่อตั้งที่เป็นเพื่อนร่วมงาน กิจกรรมชุมชนของเราได้รับการออกแบบมาเพื่อสร้างความสัมพันธ์ทางธุรกิจที่มีความหมาย"
        ]
      },
      ja: {
        title: "テックコミュニティ",
        subtitle: "起業家とエンジニアのネットワーキング",
        content: [
          "チェンマイ屈指のビルダー、創業者、エンジニアのコミュニティへご案内します。定期的なミキサー交流会、テックラウンドテーブル、AIディスカッション、スタートアップワークショップを開催。",
          "国際的なテックチームとタイ現地のITエコシステムとの架け橋として、現地の理工系大学との提携、若手開発者プール、およびスタートアップインキュベーターとの連携を構築します。",
          "現地の開発パートナー、現地スタッフの採用、共同創業者探し、または経営者仲間との情報交換など、有意義なアライアンスと人脈作りを促進します。"
        ]
      }
    }
  };

  const selectedDoc = activeService ? detailedDocs[activeService]?.[language as Language] || detailedDocs[activeService]?.en : null;

  const handleInquire = () => {
    setActiveService(null);
    const target = document.querySelector("#contact");
    if (target) {
      setTimeout(() => {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 300);
    }
  };

  return (
    <section id="services" className="py-28 bg-[#fafafa] dark:bg-[#070707] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="max-w-2xl mb-24">
          <span className="text-[11px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-3">
            {t("servicesSectionTitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] dark:text-white tracking-tight">
            Infrastructure & <span className="font-semibold">Support Services</span>
          </h2>
        </div>

        {/* Group 1: Core Infrastructure */}
        <div className="mb-24">
          <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#86868b] font-bold mb-10 border-l border-neutral-900 dark:border-white pl-3">
            01. Core Infrastructure
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {coreServices.map((service) => (
              <div
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className="space-y-4 cursor-pointer group"
              >
                <div className="text-neutral-500 dark:text-neutral-400 group-hover:translate-x-1 transition-transform">
                  {service.icon}
                </div>
                <h4 className="text-base font-semibold text-[#1d1d1f] dark:text-white tracking-tight group-hover:underline">
                  {service.title}
                </h4>
                <p className="text-[13px] text-[#515154] dark:text-[#86868b] leading-relaxed font-light">
                  {service.desc}
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors pt-1">
                  <span>{t("servicesLearnMore")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group 2: Landing & Soft Support Services */}
        <div>
          <h3 className="text-[10px] uppercase font-mono tracking-widest text-[#86868b] font-bold mb-10 border-l border-neutral-900 dark:border-white pl-3">
            02. Soft Landing & Local Support
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {landingServices.map((service) => (
              <div
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className="space-y-4 cursor-pointer group"
              >
                <div className="text-neutral-500 dark:text-neutral-400 group-hover:translate-x-1 transition-transform">
                  {service.icon}
                </div>
                <h4 className="text-base font-semibold text-[#1d1d1f] dark:text-white tracking-tight group-hover:underline">
                  {service.title}
                </h4>
                <p className="text-[13px] text-[#515154] dark:text-[#86868b] leading-relaxed font-light">
                  {service.desc}
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors pt-1">
                  <span>{t("servicesLearnMore")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elegant Service Details Modal */}
      <AnimatePresence>
        {activeService && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-w-2xl w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-8">
                <span className="text-[10px] font-sans tracking-[0.2em] text-[#86868b] uppercase font-semibold block mb-1">
                  {selectedDoc.subtitle}
                </span>
                <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                  {selectedDoc.title}
                </h3>
              </div>

              {/* Content Paragraphs */}
              <div className="space-y-4 text-[14px] text-[#515154] dark:text-[#86868b] leading-relaxed font-light mb-10">
                {selectedDoc.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Inquire CTA Button */}
              <button
                onClick={handleInquire}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-[13px] font-semibold rounded-full transition-colors shadow-sm group"
              >
                <span>Inquire About This Service</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
