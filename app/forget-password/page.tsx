"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

// Define validation schema
const schema = yup.object().shape({
  emailAddress: yup
    .string()
    .email('Invalid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    )
    .required('Email is required'),
});

// Form data type
interface ForgetPasswordFormData {
  emailAddress: string;
}

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  // On form submit
  const onSubmit = async (data: ForgetPasswordFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.emailAddress.toLowerCase(), {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset email sent! Check your inbox.");
      router.push("/login");
    } catch (err: any) {
      console.error("Password reset error:", err);
      
      if (err.message?.includes('Invalid email')) {
        toast.error("Please enter a valid email address.");
      } else if (err.message?.includes('User not found')) {
        toast.error("No account found with this email address.");
      } else {
        toast.error(`Failed to send reset email: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="relative my-auto w-full flex justify-center">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-200">

          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 bg-[#122E5F] rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">Enter your email to receive a password reset link</p>
          </div>

          {/* Form starts here */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                {...register("emailAddress")}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] text-gray-900 placeholder-gray-500 transition-all duration-300"
              />
              {errors.emailAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailAddress.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:space-x-3">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#122E5F] hover:bg-[#0f2347] disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="text-center pt-4 border-t border-gray-200 mt-6">
            <p className="text-sm text-gray-500">
              We'll send you a secure link to reset your password. 
              <br />
              Check your spam folder if you don't see it in your inbox.
            </p>
          </div>

          {/* Switch to Register */}
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
