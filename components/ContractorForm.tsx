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
import { useAuth } from "@/hooks/useAuth";

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "";

export function ContractorForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState<boolean>(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const [userInfo, setUserInfo] = useState<ContractorType | null>(null);
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const userInfoObj = JSON.parse(userInfo) as ContractorType;
      setUserInfo(userInfoObj);
    }
  }, []);

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


  const [formData, setFormData] = useState<ContractorType>({
    fullName: "",
    title: "",
    phoneNumber: "",
    emailAddress: "",
    businessAddress: "",
    serviceRadius: "",
    password: "",
    confirmPassword: "",
  });

  // Function to fetch Google Places suggestions
  const fetchAddressSuggestions = async (input: string) => {
    try {
      setIsLoadingAddresses(true);

      const response = await fetch(`/api/places?input=${encodeURIComponent(input)}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      console.log(data);

      if (data.predictions) {
        const suggestions: PlacePrediction[] = data.predictions.map((prediction: PlacePrediction) => ({
          place_id: prediction.place_id,
          description: prediction.description,
          structured_formatting: {
            main_text: prediction.structured_formatting.main_text,
            secondary_text: prediction.structured_formatting.secondary_text,
          },
        }));
        setAddressSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setAddressSuggestions([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddressSelect = (prediction: PlacePrediction) => {
    setFormData({
      ...formData,
      businessAddress: prediction.description,
    });
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
    setIsLoadingAddresses(false);

    // Clear debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Clear error when address is selected
    if (errors.businessAddress) {
      setErrors({
        ...errors,
        businessAddress: "",
      });
    }
  };
  // Close suggestions when clicking outside
  useEffect(() => {
    setIsMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowAddressSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    // Handle address autocomplete
    if (name === "businessAddress") {
      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (value.length >= 2) {
        setShowAddressSuggestions(true);
        setIsLoadingAddresses(true);

        // Debounce API calls to avoid too many requests
        const timer = setTimeout(() => {
          fetchAddressSuggestions(value);
        }, 300); // 300ms delay

        setDebounceTimer(timer);
      } else {
        setShowAddressSuggestions(false);
        setAddressSuggestions([]);
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }
    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = "Business address is required";
    }
    if (!formData.serviceRadius.trim()) {
      newErrors.serviceRadius = "Service radius is required";
    } else if (!/^\d+$/.test(formData.serviceRadius.trim())) {
      newErrors.serviceRadius = "Allow numeric only";
    } else if (Number(formData.serviceRadius) <= 0) {
      newErrors.serviceRadius = "Please enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must be 8 characters, 1 uppercase, 1 number & 1 special character";
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      const firstErrorField = document.querySelector(".border-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
  
    try {

      const email = formData.emailAddress.toLowerCase();
  
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.emailAddress.toLowerCase(),
        password: formData.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        },
      });
  
      if (error) throw error;
      if (!data.user) throw new Error("User not created");
  
      // 2️⃣ Send data to your backend API route
      await fetch("/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: data.user.id,
          fullName: formData.fullName,
          title: formData.title,
          phoneNumber: formData.phoneNumber,
          emailAddress: formData.emailAddress.toLowerCase(),
          businessAddress: formData.businessAddress,
          serviceRadius: formData.serviceRadius,
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                      name="fullName"
                      type="text"
                      placeholder="John Smith"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className={`h-10 text-sm text-black ${
                        errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Owner / Manager"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className={`h-10 text-sm text-black ${
                        errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className={`h-10 text-sm text-black ${
                        errors.phoneNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      placeholder="john@roofingco.com"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      required
                      className={`h-10 text-sm text-black ${
                        errors.emailAddress ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {errors.emailAddress && <p className="text-red-500 text-xs mt-1">{errors.emailAddress}</p>}
                  </div>
                </div>

                <div className="space-y-2" ref={addressInputRef}>
                  <div className="relative">
                    <Label htmlFor="businessAddress" className="text-sm font-semibold text-gray-700">
                      Business Address * (US Only)
                    </Label>
                    <Input
                      id="businessAddress"
                      name="businessAddress"
                      type="text"
                      placeholder="Start typing your business address..."
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      required
                      className={`h-10 text-sm text-black ${
                        errors.businessAddress ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {isMounted && (
                      <p className="text-xs text-gray-500 mt-1">
                        {GOOGLE_PLACES_API_KEY
                          ? "Powered by Google Places - Start typing for suggestions"
                          : "Demo mode - Add GOOGLE_PLACES_API_KEY for live suggestions"}
                      </p>
                    )}
                    {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}

                    {/* Address Suggestions Dropdown */}
                    {showAddressSuggestions && (
                      <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-xl shadow-xl max-h-48 overflow-y-auto mt-1">
                        {isLoadingAddresses ? (
                          <div className="px-4 py-3 text-gray-600 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm">Loading addresses...</span>
                            </div>
                          </div>
                        ) : addressSuggestions.length > 0 ? (
                          addressSuggestions.map((prediction, index) => (
                            <button
                              key={prediction.place_id}
                              type="button"
                              onClick={() => handleAddressSelect(prediction)}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 flex items-start space-x-3 border-b border-gray-200 last:border-b-0"
                            >
                              <div className="w-2 h-2 bg-[#2563eb] rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {prediction.structured_formatting.main_text}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {prediction.structured_formatting.secondary_text}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center text-sm">
                            No addresses found. Try a different search term.
                          </div>
                        )}

                        {/* Footer */}
                        {!isLoadingAddresses && addressSuggestions.length > 0 && (
                          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                            <p className="text-xs text-gray-500 flex items-center">
                              <ChevronDown className="h-3 w-3 mr-1" />
                              {isMounted &&
                                (GOOGLE_PLACES_API_KEY
                                  ? `${addressSuggestions.length} suggestions from Google Places`
                                  : "Demo suggestions - Add API key for live data")}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceRadius" className="text-sm font-semibold text-gray-700">
                    Service Radius (miles) *
                  </Label>
                  <Input
                    id="serviceRadius"
                    name="serviceRadius"
                    type="number"
                    placeholder="25"
                    value={formData.serviceRadius}
                    onChange={handleInputChange}
                    required
                    className={`h-10 text-sm text-black ${
                      errors.serviceRadius ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {errors.serviceRadius && <p className="text-red-500 text-xs mt-1">{errors.serviceRadius}</p>}
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
                      <span className="font-semibold">Name:</span> {formData.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">Username (Email):</span> {formData.emailAddress}
                    </p>
                    <p>
                      <span className="font-semibold">Service Area:</span> {formData.serviceRadius} miles from{" "}
                      {formData.businessAddress}
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
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleInputChange}
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
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <p className="text-sm text-gray-500">Must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
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
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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
                <p className="text-gray-500 mb-2">
                  We&apos;ve sent a verification email to{" "}
                  <span className="font-semibold text-[#286BBD] my-2">{formData.emailAddress}</span>.<br />
                  Please check your email and click the verification link to activate your account.
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

      {/* {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300 my-8">
}
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

              <div className="relative z-20 text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-200 via-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce-slow">
                  <CheckCircle className="h-10 w-10 text-green-600 drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight drop-shadow-sm">
                  Welcome {userInfo?.fullName ? `${userInfo?.fullName}!` : "to the Pros!"}
                </h1>
                <p className="text-lg text-gray-700 mb-2 font-medium">Your account has been created successfully.</p>
                <p className="text-gray-500 mb-2">
                  We&apos;re excited to have you join{" "}
                  <span className="font-semibold text-[#286BBD]">Roof Claim Pros</span>.<br />
                  Get ready to access premium leads and grow your business!
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-gray-700 font-semibold mb-2 text-base">Ready to get started?</span>
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#122E5F] to-[#041738] hover:from-[#183B7A] hover:to-[#122E5F] transition-colors duration-200 text-white px-6 py-3 font-semibold rounded-xl shadow-md text-lg flex items-center gap-2 mb-3"
                  onClick={() => router.push("/login")}
                >
                  <LogIn className="h-5 w-5 text-white" />
                  Access Your Dashboard
                </button>
                <span className="text-xs text-gray-400">You can now log in with your new credentials.</span>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
