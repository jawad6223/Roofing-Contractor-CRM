"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressSuggestionProps, PlacePrediction } from "@/types/AuthType";

export const AddressSuggestion: React.FC<AddressSuggestionProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing your business address...",
  label = "Business Address",
  required = false,
  error,
  className = "",
}) => {
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState<boolean>(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const fetchAddressSuggestions = async (input: string) => {
    try {
      setIsLoadingAddresses(true);

      const response = await fetch(`/api/places?input=${encodeURIComponent(input)}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();

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
    onSelect(prediction);
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
    setIsLoadingAddresses(false);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (inputValue.length >= 2) {
      setShowAddressSuggestions(true);
      setIsLoadingAddresses(true);

      const timer = setTimeout(() => {
        fetchAddressSuggestions(inputValue);
      }, 300); // 300ms delay

      setDebounceTimer(timer);
    } else {
      setShowAddressSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  useEffect(() => {
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

  return (
    <div className="space-y-2" ref={addressInputRef}>
      <div className="relative">
        {label && (
          <Label htmlFor="businessAddress" className="text-sm font-semibold text-gray-700">
            {label} {required && "*"}
          </Label>
        )}
        <Input
          id="businessAddress"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={`h-10 text-sm text-black ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          } ${className}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

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
          </div>
        )}
      </div>
    </div>
  );
};
