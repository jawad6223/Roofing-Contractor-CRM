"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/roofing-logo.png"
            alt="RoofClaim Pro Logo"
            width={200}
            height={80}
            className="mx-auto object-contain"
          />
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl md:text-9xl font-bold text-[#122E5F] opacity-10 mb-4">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#122E5F]/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-[#122E5F]" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have blown away in the wind.
          </p>
          <p className="text-gray-500">
            Don't worry, our roofing experts are here to help you find your way back!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/">
            <Button className="bg-[#122E5F] hover:bg-[#0f2347] text-white px-8 py-3 text-lg">
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white px-8 py-3 text-lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/contractor" 
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-[#122E5F] hover:bg-[#122E5F]/5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-[#122E5F]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#122E5F]/20">
                <Home className="h-5 w-5 text-[#122E5F]" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Dashboard</div>
                <div className="text-sm text-gray-500">Access your CRM</div>
              </div>
            </Link>

            <Link 
              href="/login" 
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-[#122E5F] hover:bg-[#122E5F]/5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-[#122E5F]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#122E5F]/20">
                <Search className="h-5 w-5 text-[#122E5F]" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Login</div>
                <div className="text-sm text-gray-500">Sign in to your account</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-2">
            Still can't find what you're looking for?
          </p>
          <p className="text-[#122E5F] font-medium">
            Contact our support team for assistance
          </p>
        </div>
      </div>
    </div>
  );
}
