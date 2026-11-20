import type { Metadata } from "next";
import CloudContractLastClient from "./CloudContractLastClient";

export const metadata: Metadata = {
  title: "企业级 AI 云工位与海外算力服务协议在线签约 (回滚前版本) | Chiang Mai AI Center",
  description:
    "官方在线签署企业级 AI 云工位、海外AI无忧懒人包 (4核8G/8核16G)、云工位全服务包 (¥888)、独立原生静态商业IP、Apple Silicon算力及合规代充服务协议，含时间戳防篡改电子存证。",
  alternates: {
    canonical: "/contract-last",
  },
  openGraph: {
    title: "企业级 AI 云工位与算力服务协议在线签约 | Chiang Mai AI Center",
    description: "在线签署海外AI无忧懒人包与云工位全服务包官方采购协议，即刻生效。",
    url: "/contract-last",
    siteName: "Chiang Mai AI Center",
    locale: "zh_CN",
    type: "website",
  },
};

export default function ContractLastPage() {
  return <CloudContractLastClient />;
}
