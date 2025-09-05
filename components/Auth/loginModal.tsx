"use client";

import {useState} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, EyeOff, Eye, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// 1. Define validation schema
const schema = yup.object().shape({
  emailAddress: yup
  .string()
  .email('Invalid email address')
  .matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'Please enter a valid email address'
  )
  .required('Email is required'),
  password: yup
    .string()
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be 8 characters, 1 uppercase, 1 number & 1 special character')
    .required("Password is required"),
});

// 2. Form data type
type FormData = {
  emailAddress: string;
  password: string;
};

export default function LoginModal() {

  const router = useRouter();
  const { login } = useAuth();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // 4. On form submit
  const onSubmit = (data: FormData) => {
    const validCredentials = [
      { emailAddress: "contractor1", password: "pass123" },
      { emailAddress: "contractor2", password: "pass456" },
    ];

    const existingUsers = JSON.parse(localStorage.getItem("userInfo") || "[]");
    const isValid = existingUsers.some(
      (user: { emailAddress: string; password: string }) =>
        user.emailAddress === data.emailAddress && user.password === data.password
    );

    // const isValidCredentials = validCredentials.some(
    //   cred => cred.emailAddress === data.emailAddress && cred.password === data.password
    // );

    if (!isValid) {
      alert("Invalid credentials. Please use the Correct credentials.");
      return;
    }
    login(data.emailAddress);
    reset();
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
          {/* <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button> */}

          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 bg-[#122E5F] rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Contractor Login
            </h2>
            <p className="text-gray-600">Access your professional dashboard</p>
          </div>

          {/* 5. Form starts here */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* emailAddress Field */}
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

            {/* Password Field */}
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
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#122E5F] hover:bg-[#0f2347] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg"
              >
                Login
              </button>
              {/* <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
              >
                Cancel
              </button> */}
            </div>
          </form>

          {/* Switch to Register */}
          <div className="text-center pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/")}
                className="text-[#286BBD] hover:text-[#1d4ed8] font-semibold transition-colors duration-200"
              >
                Create Account
              </button>
            </span>
          </div>

          {/* Trust Badge */}
          <div className="mt-4 mx-auto max-w-[240px]">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#122E5F]/10 to-[#286BBD]/10 animate-pulse rounded-xl"></div>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#286BBD]/20 text-center">
                <div className="flex items-center justify-center space-x-1.5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#286BBD]/20 blur-sm rounded-full"></div>
                    <CheckCircle className="h-3.5 w-3.5 text-[#286BBD] relative" />
                  </div>
                  <span className="text-[11px] font-medium text-[#122E5F]">
                    Trusted by 2K+ Pros
                  </span>
                  <span className="text-[11px] text-[#286BBD]">💫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
