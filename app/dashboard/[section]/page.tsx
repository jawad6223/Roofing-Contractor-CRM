"use client";

import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { DashBoard, CRM, Leads, Setting, Team, LeadPurchaseInfo } from "@/components/dashboard/menuTabs";
import PurchaseLeads from "@/components/dashboard/menuTabs/purchase-leads";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const validSections = ["crm", "leads", "purchase-leads", "lead-purchase-info", "settings", "teams"];

export default function DashboardSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const [section, setSection] = useState<string>("");

  useEffect(() => {
    params.then(({ section }) => setSection(section));
  }, [params]);

  if (!section) {
    return <div>Loading...</div>;
  }

  if (!validSections.includes(section.toLowerCase())) {
    notFound();
  }

  const renderSection = () => {
    switch (section.toLowerCase()) {
      case "crm":
        return <CRM />;
      case "leads":
        return <Leads />;
      case "purchase-leads":
        return <PurchaseLeads />;
      case "lead-purchase-info":
        return <LeadPurchaseInfo />;
      case "settings":
        return <Setting />;
      case "teams":
        return <Team />;
      default:
        return <DashBoard />;
    }
  };

  return <ProtectedRoute requireAuth={true}>{renderSection()}</ProtectedRoute>;
}
