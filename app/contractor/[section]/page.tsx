"use client";

import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { DashBoard, CRM, Leads, Setting, Team, LeadPurchaseInfo, Appointments } from "@/components/contractor/menuTabs";
import PurchaseLeads from "@/components/contractor/menuTabs/purchase-leads";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const validSections = ["dashboard", "crm", "leads", "appointments", "purchase-leads", "lead-purchase-info", "settings", "teams"];

export default function DashboardSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const [section, setSection] = useState<string>("");

  useEffect(() => {
    params.then(({ section }) => setSection(section));
  }, [params]);

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (!validSections.includes(section.toLowerCase())) {
    notFound();
  }

  const renderSection = () => {
    switch (section.toLowerCase()) {
      case "dashboard":
        return <DashBoard />;
      case "crm":
        return <CRM />;
      case "leads":
        return <Leads />;
      case "appointments":
        return <Appointments />;
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
