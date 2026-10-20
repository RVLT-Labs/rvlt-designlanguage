import type { Metadata } from "next";
import { ContractsPage } from "@/components/contracts-page";

export const metadata: Metadata = {
  title: "Component contracts · RVLT Flow preview v2",
  description: "Every documented @rvlt/flow-theme example, compiled against the registry and exercised by the browser tests.",
};

export default function Page() {
  return <ContractsPage />;
}
