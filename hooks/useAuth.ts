"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const loggedInUser = localStorage.getItem("loggedInUser");
        const loggedInAdmin = localStorage.getItem("adminLoggedInUser");
        
        if (loggedInUser) {
          setUser(loggedInUser);
        }
        if (loggedInAdmin) {
          setAdmin(loggedInAdmin);
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (emailAddress: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("loggedInUser", emailAddress);
    }
    setUser(emailAddress);
    router.push("/dashboard");
  };

  const loginAdmin = (emailAddress: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("adminLoggedInUser", emailAddress);
    }
    setAdmin(emailAddress);
    router.push("/admin");
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("loggedInUser");
    }
    setUser(null);
    router.push("/");
  };

  const logoutAdmin = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("adminLoggedInUser");
    }
    setAdmin(null);
    router.push("/adminLogin");
  };

  const checkAuth = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const loggedInUser = localStorage.getItem("loggedInUser");
      return loggedInUser;
    } catch (error) {
      return null;
    }
  };

  const checkAdminAuth = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const loggedInAdmin = localStorage.getItem("adminLoggedInUser");
      return loggedInAdmin;
    } catch (error) {
      return null;
    }
  };

  // Get the full name of the current user
  const getCurrentUserFullName = () => {
    if (typeof window === 'undefined' || loading) {
      return 'Loading...';
    }
    
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        return userInfo["Full Name"] || user || 'User';
      } catch (error) {
        return user || 'User';
      }
  };

  // Get the admin name
  const getCurrentAdminName = () => {
    if (typeof window === 'undefined' || loading) {
      return 'Loading...';
    }
    
    return admin || 'Admin';
  };

  return {
    user,
    admin,
    loading,
    login,
    logout,
    logoutAdmin,
    checkAuth,
    checkAdminAuth,
    getCurrentUserFullName,
    getCurrentAdminName,
    loginAdmin,
  };
};
