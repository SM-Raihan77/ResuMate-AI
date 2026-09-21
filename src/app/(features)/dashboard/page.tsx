import React from "react";
import type { Metadata } from "next";
import { DashboardContainer } from "@/components/features/dashboard";

export const metadata: Metadata = {
  title: "Candidate Dashboard",
  description:
    "Real-time candidate intelligence dashboard: ATS resume scoring, AI mock interview analytics, performance trends, and career milestone roadmap.",
};

export default function DashboardPage() {
  return <DashboardContainer />;
}
