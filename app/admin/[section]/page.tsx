"use client";

import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { Dashboard, Leads, Contractors, LeadPrice, Setting } from '@/components/admin/menuTabs/Index';
import { notFound } from 'next/navigation';

interface AdminSectionPageProps {
  params: {
    section: string;
  };
}

const validSections = ['dashboard', 'leads', 'contractors', 'settings'];

export default function AdminSectionPage({ params }: AdminSectionPageProps) {
  const { section } = params;
  
  if (!validSections.includes(section.toLowerCase())) {
    notFound();
  }

  const renderSection = () => {
    switch (section.toLowerCase()) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <Leads />;
      case 'contractors':
        return <Contractors />;
      case 'settings':
        return <Setting />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      {renderSection()}
    </ProtectedRoute>
  );
}
