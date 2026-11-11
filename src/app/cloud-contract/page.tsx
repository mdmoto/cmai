import type { Metadata } from "next";
import CloudContractClient from "./CloudContractClient";

export const metadata: Metadata = {
  title: "企业级 AI 云工位与海外算力服务协议在线签约 | Chiang Mai AI Center & cloud.lazzor.com",
  description:
    "官方在线签署企业级 AI 云工位、海外AI无忧懒人包 (¥488/月)、云工位全服务包 (¥888/月)、独立原生静态商业IP、Apple Silicon物理机算力及合规代充服务协议，含时间戳防篡改电子存证。",
  alternates: {
    canonical: "/cloud-contract",
  },
  openGraph: {
    title: "企业级 AI 云工位与海外算力服务协议在线签约 | cloud.lazzor.com",
    description:
      "在线签署海外AI无忧懒人包 (¥488/月) 与云工位全服务包 (¥888/月) 官方采购协议，即刻生效。",
    url: "/cloud-contract",
    siteName: "Chiang Mai AI Center",
    locale: "zh_CN",
    type: "website",
  },
};

export default function CloudContractPage() {
  return <CloudContractClient />;
}
