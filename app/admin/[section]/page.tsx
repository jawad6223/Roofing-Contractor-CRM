"use client";

import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { Dashboard, Leads, Contractors, Setting, LeadRequest, AppointmentsRequest } from "@/components/admin/menuTabs/Index";
import { notFound } from "next/navigation";
import { AdminSectionPageProps } from "@/types/AdminTypes";
import { useEffect, useState } from "react";

const validSections = ["dashboard", "leads", "contractors", "leads-request", "appointments-request", "settings"];

export default function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
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
        return <Dashboard />;
      case "leads":
        return <Leads />;
      case "contractors":
        return <Contractors />;
      case "leads-request":
        return <LeadRequest />;
      case "appointments-request":
        return <AppointmentsRequest />;
      case "settings":
        return <Setting />;
      default:
        return <Dashboard />;
    }
  };

  return <>{renderSection()}</>;
}
