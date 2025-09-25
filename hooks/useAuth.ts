"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
          setUser(loggedInUser);
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

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("loggedInUser");
    }
    setUser(null);
    router.push("/");
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

  const getCurrentUserFullName = () => {
    if (typeof window === 'undefined') {
      return user || 'User';
    }
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "[]");
      const currentUserInfo = userInfo.find(
        (info: { emailAddress: string; fullName: string }) =>
          info.emailAddress === user
      );
      const currentUserFullName = currentUserInfo?.fullName || user;
      return currentUserFullName;
    } catch (error) {
      return user || 'User';
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    getCurrentUserFullName,
  };
};
