"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    setLoading(false);
  }, []);

  const login = (emailAddress: string) => {
    localStorage.setItem("loggedInUser", emailAddress);
    setUser(emailAddress);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    router.push("/");
  };

  const checkAuth = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    return loggedInUser;
  };

  const getCurrentUserFullName = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "[]");
    const currentUserInfo = userInfo.find(
      (info: { emailAddress: string; fullName: string }) =>
        info.emailAddress === user
    );
    const currentUserFullName = currentUserInfo?.fullName || user;
    return currentUserFullName;
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
