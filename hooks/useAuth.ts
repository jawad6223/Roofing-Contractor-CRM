"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     try {
  //       const loggedInUser = localStorage.getItem("loggedInUser");
  //       const loggedInAdmin = localStorage.getItem("adminLoggedInUser");
        
  //       if (loggedInUser) {
  //         setUser(loggedInUser);
  //       }
  //       if (loggedInAdmin) {
  //         setAdmin(loggedInAdmin);
  //       }
  //     } catch (error) {
  //       console.error('Error accessing localStorage:', error);
  //     }
  //   }
  //   setLoading(false);
  // }, []);

  // Fetch user full name from Supabase
  

  useEffect(() => {
    const fetchAdminFullName = async () => {
      try {
        const { data, error } = await supabase
          .from("Admin_Data")
          .select('"Full Name", "Email Address"')
          .maybeSingle();

        if (error) {
          console.error("Error fetching admin full name:", error);
          setLoading(false);
          return;
        }

        if (data) {
          setAdmin(data["Full Name"] || null);
          setAdminEmail(data["Email Address"] || null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchAdminFullName:", error);
        setAdmin(null);
        setLoading(false);
      }
    };

    fetchAdminFullName();
  }, []);

  // Fetch user full name from Supabase
  useEffect(() => {
    const fetchUserFullName = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          setUserFullName(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("Roofing_Auth")
          .select('"Full Name"')
          .eq("user_id", authData.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user full name:", error);
          setUserFullName(null);
          setLoading(false);
          return;
        }

        if (data) {
          setUserFullName(data["Full Name"] || null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchUserFullName:", error);
        setUserFullName(null);
        setLoading(false);
      }
    };

    fetchUserFullName();
  }, []);

  const login = (emailAddress: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("loggedInUser", emailAddress);
    }
    setUser(emailAddress);
    router.push("/contractor");
  };

  const loginAdmin = (emailAddress: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("adminLoggedInUser", emailAddress);
    }
    router.push("/admin");
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("user_id");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("sb-luonhxqzqsgspxjgzozh-auth-token");
    }
    setUser(null);
    router.push("/login");
  };

  const logoutAdmin = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("adminLoggedInUser");
      localStorage.removeItem("admin_id");
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

  // Get the full name of the current user from Supabase
  const getCurrentUserFullName = () => {
    if (typeof window === 'undefined' || loading) {
      return 'Loading...';
    }
    
    return userFullName;
  };

  // Get the admin name
  const getCurrentAdminName = () => {
    if (typeof window === 'undefined' || loading) {
      return { admin: 'Loading...', adminEmail: 'Loading...', loading: true };
    }
    
    return { admin: admin || 'Admin', adminEmail: adminEmail || '', loading: false };
  };

  return {
    user,
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
