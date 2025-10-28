"use client";

import React from "react";
import {
  X,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Hash,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DetailPopupProps } from "@/types/Types";

const iconMap = {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Hash,
  Calendar,
  DollarSign,
};

export const DetailPopup: React.FC<DetailPopupProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  titleIcon,
  fields,
  viewAllButton,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 -top-8 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 relative h-[80vh] md:h-auto overflow-auto animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                {React.createElement(titleIcon, {
                  className: "h-6 w-6 text-[#122E5F]",
                })}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
            {viewAllButton && (
              <Link href={viewAllButton.href}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#286BBD] border-[#286BBD] hover:bg-[#286BBD] hover:text-white flex items-center space-x-1"
                >
                  <span className="text-sm">{viewAllButton.text}</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {fields.map((field, index) => {
              const IconComponent = field.icon
                ? iconMap[field.icon.name as keyof typeof iconMap]
                : null;

              return (
                <div key={index}>
                  <label
                    className={`block text-sm font-semibold text-gray-700 mb-1 ${
                      field.whitespaceNowrap ? "whitespace-nowrap" : ""
                    }`}
                  >
                    {field.label}
                  </label>
                  <p
                    className={`text-gray-900 bg-gray-50 p-2 rounded-md text-sm flex items-center ${
                      field.breakAll ? "break-all" : ""
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent className="h-3 w-3 mr-1 text-gray-400" />
                    )}
                    {field.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
