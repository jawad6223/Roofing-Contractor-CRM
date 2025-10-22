"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, Eye, EyeOff, ChevronDown, X, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlacePrediction } from "@/types/AuthType";
import { ContractorType } from "@/types/Types";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { step1Schema, step2Schema } from "@/validations/Auth/schema";
import { AddressSuggestion } from "@/components/ui/AddressSuggestion";

export function ContractorForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // React Hook Form setup
  const form = useForm<ContractorType>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      title: "",
      phoneNumber: "",
      emailAddress: "",
      businessAddress: "",
      serviceRadius: "",
      password: "",
      confirmPassword: "",
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = form;

  useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSuccessModal]);

  useEffect(()=>{
    if(window.innerWidth < 768){
      setIsMobile(true);
    }else{
      setIsMobile(false);
    }
  }, [])

  const handleAddressSelect = async (prediction: PlacePrediction) => {
    try {
      // Set the address text in the form
      setValue("businessAddress", prediction.description);
  
      // Fetch latitude and longitude using the Place Details API
      const response = await fetch(`/api/place-details?place_id=${prediction.place_id}`);
      const data = await response.json();
      if (data.lat && data.lng) {
        console.log("Selected Address Coordinates:", data.lat, data.lng);
        setCoords({ lat: data.lat, lng: data.lng });
        
      } else {
        console.warn("No coordinates found for selected address");
      }
    } catch (error) {
      console.error("Error fetching address coordinates:", error);
    }
  };
  
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Format phone number as user types
    if (name === "phoneNumber") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "");

      // Format based on length
      if (digits.length <= 3) {
        processedValue = digits;
      } else if (digits.length <= 6) {
        processedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length <= 10) {
        processedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else {
        // Limit to 10 digits
        processedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }

    setValue(name as keyof ContractorType, processedValue);
  };

  const handleContinue = async () => {
    const formData = form.getValues();
    const step1Data = {
      fullName: formData.fullName,
      title: formData.title,
      phoneNumber: formData.phoneNumber,
      emailAddress: formData.emailAddress,
      businessAddress: formData.businessAddress,
      serviceRadius: formData.serviceRadius
    };
    
    try {
      await step1Schema.validate(step1Data, { abortEarly: false });
      setCurrentStep(2);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          form.setError(err.path as keyof ContractorType, {
            type: "validation",
            message: err.message
          });
        });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };
  
  const onSubmit = async (data: ContractorType) => {
    setIsSubmitting(true);
    
    // Validate step 2 before submission
    try {
      await step2Schema.validate({
        password: data.password,
        confirmPassword: data.confirmPassword
      }, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          form.setError(err.path as keyof ContractorType, {
            type: "validation",
            message: err.message
          });
        });
      }
      setIsSubmitting(false);
      return;
    }
  
    try {
      const email = data.emailAddress.toLowerCase();
  
      // 1️⃣ Check if email already exists
      const checkRes = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const checkData = await checkRes.json();
      if (checkData.exists) {
        toast.error("This email is already in use");
        return;
      }

      // 1️⃣ Create Supabase Auth user (email confirmation enabled)
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.emailAddress.toLowerCase(),
        password: data.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
          data: { role: "user" },
        },
      });

      const user = authData.user;
      console.log(user);
      if (!user) {
        toast.error("Email address is invalid.");
        return;
      }
  
      if (error) throw error;
      if (!authData.user) throw new Error("Email address is invalid.");
      
  
      // 2️⃣ Send data to your backend API route
      await fetch("/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: authData.user.id,
          fullName: data.fullName,
          title: data.title,
          phoneNumber: data.phoneNumber,
          emailAddress: data.emailAddress.toLowerCase(),
          businessAddress: data.businessAddress,
          serviceRadius: data.serviceRadius,
          latitude: coords?.lat,
          longitude: coords?.lng,
        }),
      });
  
      toast.success("Check your email to confirm your account!");
      if(isMobile){
        router.push(`/thank-you`);
      }else{
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <Card className="border-0 shadow-2xl bg-white rounded-2xl">
        <CardHeader className="text-center pb-3 px-6 pt-5">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep >= 1 ? "bg-[#122E5F] text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div className={`w-16 h-1 rounded-full ${currentStep >= 2 ? "bg-[#122E5F]" : "bg-gray-200"}`}></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep >= 2 ? "bg-[#122E5F] text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>

          {currentStep === 1 ? (
            <>
              <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                Join Our Elite Contractor Network
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-relaxed">
                Get started with 5 free premium leads - no credit card required
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Create Your CRM Account</CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-relaxed">
                Set up your login credentials to access your leads dashboard
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === 1 ? (
              <>
                {/* Step 1 Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Smith"
                      {...register("fullName")}
                      className={`h-10 text-sm text-black ${
                        errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Owner / Manager"
                      {...register("title")}
                      className={`h-10 text-sm text-black ${
                        errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...register("phoneNumber")}
                      onChange={handleInputChange}
                      className={`h-10 text-sm text-black ${
                        errors.phoneNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      placeholder="john@roofingco.com"
                      {...register("emailAddress")}
                      className={`h-10 text-sm text-black ${
                        errors.emailAddress ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.emailAddress && <p className="text-red-500 text-xs mt-1">{errors.emailAddress.message}</p>}
                  </div>
                </div>

                <AddressSuggestion
                  value={watch("businessAddress")}
                  onChange={(value) => setValue("businessAddress", value)}
                  onSelect={handleAddressSelect}
                  placeholder="Start typing your business address..."
                  label="Business Address (US Only)"
                  required={true}
                  error={errors.businessAddress?.message}
                />

                <div className="space-y-2">
                  <Label htmlFor="serviceRadius" className="text-sm font-semibold text-gray-700">
                    Service Radius (miles) *
                  </Label>
                  <Input
                    id="serviceRadius"
                    type="number"
                    placeholder="25"
                    {...register("serviceRadius")}
                    className={`h-10 text-sm text-black ${
                      errors.serviceRadius ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {errors.serviceRadius && <p className="text-red-500 text-xs mt-1">{errors.serviceRadius.message}</p>}
                </div>

                <Button
                  type="button"
                  onClick={handleContinue}
                  className="w-full h-11 bg-[#122E5F] hover:bg-[#183B7A] disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  Continue to Account Setup
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to receive calls and texts about premium leads.
                  <br />
                  No spam, unsubscribe anytime.
                </p>
              </>
            ) : (
              <>
                {/* Step 2 Fields */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Account Information</h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold">Name:</span> {watch("fullName")}
                    </p>
                    <p>
                      <span className="font-semibold">Username (Email):</span> {watch("emailAddress")}
                    </p>
                    <p>
                      <span className="font-semibold">Service Area:</span> {watch("serviceRadius")} miles from{" "}
                      {watch("businessAddress")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      {...register("password")}
                      className={`h-10 pr-12 text-sm text-black ${
                        errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  <p className="text-sm text-gray-500">Must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...register("confirmPassword")}
                      className={`h-10 pr-12 text-sm text-black ${
                        errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 text-[#122E5F] hover:text-[#183B7A] h-11 font-bold text-sm rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-11 bg-[#122E5F] hover:bg-[#183B7A] disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition-colors"
                  >
                    {isSubmitting ? "Creating Account..." : "Create CRM Account"}
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* Guarantee */}
          <div className="mt-4 p-4 rounded-xl">
            <div className="flex items-center text-[#286BBD] space-x-3 mb-1">
              <CheckCircle className="h-4 w-4 " />
              <span className="text-sm font-bold ">100% Risk-Free Guarantee</span>
            </div>
            <p className="text-xs text-black leading-relaxed">
              If you&apos;re not satisfied with your first 5 leads, we&apos;ll refund every penny. No questions asked.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Success Modal */}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300 my-8">
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="absolute top-0 left-0 w-32 h-32 opacity-30" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="6" fill="#60a5fa" />
              <circle cx="80" cy="30" r="4" fill="#fbbf24" />
              <circle cx="60" cy="80" r="5" fill="#34d399" />
              <circle cx="90" cy="60" r="3" fill="#f472b6" />
              <circle cx="10" cy="70" r="4" fill="#818cf8" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-30" viewBox="0 0 100 100">
              <circle cx="80" cy="80" r="6" fill="#60a5fa" />
              <circle cx="20" cy="70" r="4" fill="#fbbf24" />
              <circle cx="40" cy="20" r="5" fill="#34d399" />
              <circle cx="10" cy="40" r="3" fill="#f472b6" />
              <circle cx="90" cy="30" r="4" fill="#818cf8" />
            </svg>
          </div>

          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="relative z-20 text-center mb-5">
              <div className="w-20 h-20 bg-[#122E5F] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce-slow">
                <Mail className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <p className="text-gray-500">
                We&apos;ve sent a verification email to
                <span className="font-semibold text-[#286BBD] block my-2">{watch("emailAddress")}</span>
              </p>
              <p className="text-gray-500 mt-5">
                Please check your email and click the verification link
                <br/>
                to activate your account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                className="bg-gradient-to-r from-[#122E5F] to-[#041738] hover:from-[#183B7A] hover:to-[#122E5F] transition-colors duration-200 text-white px-6 py-3 font-semibold rounded-xl shadow-md text-lg flex items-center gap-2"
              >
                <Mail className="h-5 w-5 text-white" />
                <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">Verify Email</a>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
