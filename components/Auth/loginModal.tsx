"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "@/validations/Auth/schema";
import { User, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormDataType } from "@/types/AuthType";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function LoginModal() {
  const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = async (data: FormDataType) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.emailAddress.toLowerCase(),
        password: data.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email before logging in.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser?.user_metadata.role !== "user") {
          await supabase.auth.signOut();
          toast.error("Access denied. Only contractors can access this panel.");
          return;
        }
        
      const user = authData.user;
      if (!user) {
        toast.error("User not found after login.");
        return;
      }
      localStorage.setItem("user_id", user.id);
      toast.success("Login successful!");

      const { data: userRecord, error: recordError } = await supabase
        .from("Roofing_Auth")
        .select("*")
        .eq("user_id", authData.user?.id)
        .single();

      if (recordError) {
        console.warn("No Roofing_Auth data found for this user:", recordError);
      } else {
        localStorage.setItem("userInfo", JSON.stringify(userRecord));
        localStorage.setItem("loggedInUser", authData.user?.email || "");
      }

      router.push("/contractor/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-100 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="relative my-auto w-full flex justify-center">
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="relative mb-8 flex justify-center">
              <Image 
                src="/roofingF-logo.png" 
                alt="Roofing CRM Logo" 
                width={200} 
                height={50}
                className="object-contain drop-shadow-lg"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Contractor Login
            </h2>
            <p className="text-gray-600">Access your professional dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="text"
                placeholder="Enter emailAddress"
                {...register("emailAddress")}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] text-gray-900 placeholder-gray-500 transition-all duration-300"
              />
              {errors.emailAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailAddress.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password")}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] text-gray-900 placeholder-gray-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => router.push("/forget-password")}
                className="text-sm text-[#286BBD] hover:text-[#1d4ed8] font-medium transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-[#122E5F] hover:bg-[#0f2347] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg"
              >
                Login
              </button>
            </div>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push("/")}
                className="text-[#286BBD] hover:text-[#1d4ed8] font-semibold transition-colors duration-200"
              >
                Create Account
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
