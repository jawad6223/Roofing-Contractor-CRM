"use client";

import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { DashBoard, CRM, Leads, Setting, Team } from '@/components/dashboard/menuTabs';
import { notFound } from 'next/navigation';

interface DashboardSectionPageProps {
  params: {
    section: string;
  };
}

const validSections = ['crm', 'leads', 'settings', 'teams'];

export default function DashboardSectionPage({ params }: DashboardSectionPageProps) {
  const { section } = params;
  
  if (!validSections.includes(section.toLowerCase())) {
    notFound();
  }

  const renderSection = () => {
    switch (section.toLowerCase()) {
      case 'crm':
        return <CRM />;
      case 'leads':
        return <Leads />;
      case 'settings':
        return <Setting />;
      case 'teams':
        return <Team />;
      default:
        return <DashBoard />;
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      {renderSection()}
    </ProtectedRoute>
  );
}
