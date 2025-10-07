"use client";

import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { Dashboard, Leads, Contractors, Setting, LeadRequest } from "@/components/admin/menuTabs/Index";
import { notFound } from "next/navigation";
import { AdminSectionPageProps } from "@/types/AdminTypes";
import { useEffect, useState } from "react";

const validSections = ["dashboard", "leads", "contractors", "leads-request", "settings"];


export default function AdminSectionPage({ params }: { params: { section: string } }) {
  const section = params.section.toLowerCase();

  const validSections = ["dashboard", "leads", "contractors", "leads-request", "settings"];

  if (!validSections.includes(section)) {
    notFound();
  }

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <Dashboard />;
      case "leads":
        return <Leads />;
      case "contractors":
        return <Contractors />;
      case "leads-request":
        return <LeadRequest />;
      case "settings":
        return <Setting />;
      default:
        return <Dashboard />;
    }
  };

  return <>{renderSection()}</>;
}


// export default function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
//   const [section, setSection] = useState<string>("");

//   useEffect(() => {
//     params.then(({ section }) => setSection(section));
//   }, [params]);

//   if (!section) {
//     return <div>Loading...</div>;
//   }

//   if (!validSections.includes(section.toLowerCase())) {
//     notFound();
//   }

//   const renderSection = () => {
//     switch (section.toLowerCase()) {
//       case "dashboard":
//         return <Dashboard />;
//       case "leads":
//         return <Leads />;
//       case "contractors":
//         return <Contractors />;
//       case "leads-request":
//         return <LeadRequest />;
//       case "settings":
//         return <Setting />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     // <ProtectedRoute requireAuth={true}>
//     <>{renderSection()}</>
//     // </ProtectedRoute>
//   );
// }
