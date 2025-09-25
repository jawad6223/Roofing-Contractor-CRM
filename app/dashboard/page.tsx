"use client";

import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { DashBoard } from '@/components/dashboard/menuTabs';

export default function Dashboard() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashBoard />
    </ProtectedRoute>
  );
}