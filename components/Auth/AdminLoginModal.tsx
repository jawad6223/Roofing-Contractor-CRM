"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { User, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

type FormDataType = {
  emailAddress: string;
  password: string;
};

const schema = yup.object().shape({
  emailAddress: yup
    .string()
    .email('Invalid email address')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required(),
  password: yup
    .string()
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required(),
});

export default function AdminLoginModal() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataType>({
    resolver: yupResolver(schema),
  });

  // const onSubmit = (data: FormDataType) => {
  //   setIsLoading(true);
  //   try{
  //   if (data.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL && data.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
  //     toast.success("Login successful");
  //     loginAdmin(data.emailAddress);
  //     reset();
  //     return;
  //   }
  //   toast.error("Invalid credentials");
  //   } catch (error) {
  //     toast.error("Invalid credentials");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data: FormDataType) => {
    setIsLoading(true);
    try {
      // 1️⃣ Check against environment variables (you'll need to use NEXT_PUBLIC_ prefix for client-side access)
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      console.log(adminEmail);
      console.log(data.emailAddress);
      if (data.emailAddress === adminEmail) {
        // 2️⃣ If credentials match, try to sign in with Supabase Auth
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.emailAddress.toLowerCase(),
          password: data.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid admin credentials.");
          } else if (error.message.includes("Email not confirmed")) {
            toast.error("Please confirm your admin email before logging in.");
          } else {
            toast.error(error.message);
          }
          return;
        }

        // 3️⃣ Successfully logged in
        toast.success("Admin login successful!");
        loginAdmin(data.emailAddress);
        reset();
        
        // 4️⃣ Redirect to admin dashboard
        router.push("/admin");
        return;
      }

      // 5️⃣ If credentials don't match env vars, show error
      toast.error("Invalid admin credentials");
    } catch (err: any) {
      console.error("Admin login error:", err);
      toast.error("Admin login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="relative my-auto w-full flex justify-center">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-200 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-[#122E5F] rounded-2xl flex items-center justify-center shadow-xl mx-auto transform hover:scale-105 transition-transform duration-300">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Email address"
                  {...register("emailAddress")}
                  className={`w-full pl-11 h-12 ${errors.emailAddress ? "border-red-500 focus:ring-red-500" : "focus:ring-[#122E5F]"}`}
                />
              </div>
              {errors.emailAddress && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  Please enter a valid email
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className={`w-full pl-11 h-12 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-[#122E5F]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  Password must be 8 characters, include 1 uppercase, 1 number & 1 special character
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => router.push("/forget-password")}
                className="text-sm text-[#286BBD] hover:text-[#1d4ed8] font-medium transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#122E5F] hover:bg-[#0f2347] text-lg font-semibold shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              {isLoading ? 'Loading...' : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

