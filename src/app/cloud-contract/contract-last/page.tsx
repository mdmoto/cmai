import type { Metadata } from "next";
import CloudContractLastClient from "../../contract-last/CloudContractLastClient";

export const metadata: Metadata = {
  title: "企业级 AI 云工位与海外算力服务协议在线签约 (回滚前版本) | Chiang Mai AI Center",
  description: "企业级 AI 云工位服务协议签署",
};

export default function CloudContractContractLastPage() {
  return <CloudContractLastClient />;
}
