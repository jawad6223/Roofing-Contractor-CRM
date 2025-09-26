"use client";

import React from "react";
import AdminLoginModal from "@/components/Auth/AdminLoginModal";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

export default function AdminLoginPage() {

  return (
    // <ProtectedRoute requireAuth={false}>
      <AdminLoginModal/>
    // </ProtectedRoute>
  );
}
