import type { Metadata } from "next";
import CloudContractLastClient from "../../contract-last/CloudContractLastClient";

export const metadata: Metadata = {
  title: "海外AI无忧懒人包 8v16g 增强型在线签约 | Chiang Mai AI Center",
  description:
    "海外AI无忧懒人包 (8 vCPU / 16GB RAM / 240GB NVMe 增强型) 官方采购服务协议在线签署，含独立原生静态商业IP、企业级VPN直连与官方AI会员全包交付。",
};

export default function Contract8v16gPage() {
  return (
    <CloudContractLastClient
      initialPlan="ai_lazy_488"
      initialTier="pro"
      initialLocked={true}
      initialSign={true}
    />
  );
}
