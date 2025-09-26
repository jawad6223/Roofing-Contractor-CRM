"use client";

import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { Dashboard } from '@/components/admin/menuTabs/Index';

export default function Admin() {
  return (
    // <ProtectedRoute requireAuth={true}>
      <Dashboard />
    // </ProtectedRoute>
  );
}