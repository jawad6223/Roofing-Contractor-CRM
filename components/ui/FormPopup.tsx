"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormPopupProps } from "@/types/Types";
import { FormField } from "@/types/Types";
import { AddressSuggestion } from "@/components/ui/AddressSuggestion";
import { PlacePrediction } from "@/types/AuthType";



// Phone number formatter function
const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Don't format if empty
  if (!phoneNumber) return '';
  
  // Limit to 10 digits maximum
  const limitedPhoneNumber = phoneNumber.slice(0, 10);
  
  // Format based on length
  if (limitedPhoneNumber.length < 4) {
    return `(${limitedPhoneNumber}`;
  } else if (limitedPhoneNumber.length < 7) {
    return `(${limitedPhoneNumber.slice(0, 3)}) ${limitedPhoneNumber.slice(3)}`;
  } else {
    return `(${limitedPhoneNumber.slice(0, 3)}) ${limitedPhoneNumber.slice(3, 6)}-${limitedPhoneNumber.slice(6, 10)}`;
  }
};

// Card number formatter function
const formatCardNumber = (value: string): string => {
  const cardNumber = value.replace(/\D/g, '');
  const limitedCardNumber = cardNumber.slice(0, 16);
  
  if (!limitedCardNumber) return '';
  
  // Format as XXXX XXXX XXXX XXXX
  return limitedCardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Expiry date formatter function
const formatExpiryDate = (value: string): string => {
  const expiryDate = value.replace(/\D/g, '');
  const limitedExpiryDate = expiryDate.slice(0, 4);
  
  if (!limitedExpiryDate) return '';
  
  if (limitedExpiryDate.length === 1) {
    // Single digit: if 2 or greater, add leading 0
    const firstDigit = limitedExpiryDate[0];
    if (firstDigit >= '2') {
      return `0${firstDigit}`;
    }
    return limitedExpiryDate;
  } else if (limitedExpiryDate.length === 2) {
    // Two digits: validate month
    const month = limitedExpiryDate.slice(0, 2);
    const monthNum = parseInt(month);
    
    if (monthNum > 12) {
      // If month > 12, keep only the first digit and add 0
      return `0${limitedExpiryDate[0]}`;
    } else if (monthNum === 0) {
      // If month is 00, keep only the first digit
      return limitedExpiryDate[0];
    }
    return month;
  } else if (limitedExpiryDate.length === 3) {
    // Three digits: format as MM/Y
    const month = limitedExpiryDate.slice(0, 2);
    const yearDigit = limitedExpiryDate.slice(2, 3);
    const monthNum = parseInt(month);
    
    if (monthNum > 12) {
      // If month > 12, fix it
      const fixedMonth = `0${limitedExpiryDate[0]}`;
      return `${fixedMonth}/${yearDigit}`;
    }
    
    return `${month}/${yearDigit}`;
  } else {
    // Four digits: format as MM/YY and validate year
    const month = limitedExpiryDate.slice(0, 2);
    const year = limitedExpiryDate.slice(2, 4);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Get current year (last 2 digits)
    const currentYear = new Date().getFullYear() % 100;
    
    if (monthNum > 12) {
      // If month > 12, fix it
      const fixedMonth = `0${limitedExpiryDate[0]}`;
      return `${fixedMonth}/${year}`;
    }
    
    // Check if year is in the past (less than current year)
    if (yearNum < currentYear) {
      // Don't format if year is in the past - let validation handle the error
      return `${month}/${year}`;
    }
    
    return `${month}/${year}`;
  }
};

export const FormPopup: React.FC<FormPopupProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  titleIcon: TitleIcon,
  fields,
  onSubmit,
  submitButtonText = "Submit",
  submitButtonIcon: SubmitIcon,
  initialValues = {},
  validationSchema,
}) => {
  const [zipSuggestions, setZipSuggestions] = useState<PlacePrediction[]>([]);
  const [showZipSuggestions, setShowZipSuggestions] = useState(false);
  const [isLoadingZips, setIsLoadingZips] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  
  // Create validation schema from fields if not provided
  const createValidationSchema = () => {
    if (validationSchema) return validationSchema;
    
    const schemaFields: Record<string, any> = {};
    fields.forEach(field => {
      let fieldSchema;
      
      if (field.type === "email") {
        fieldSchema = yup.string().email("Please enter a valid email address");
      } else if (field.type === "number") {
        fieldSchema = yup.number().typeError("Please enter a valid number");
      } else {
        fieldSchema = yup.string();
      }
      
      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} is required`);
      }
      
      if (field.maxLength) {
        fieldSchema = fieldSchema.max(field.maxLength, `Maximum ${field.maxLength} characters allowed`);
      }
      
      if (field.validation) {
        fieldSchema = field.validation;
      }
      
      schemaFields[field.name] = fieldSchema;
    });
    
    return yup.object().shape(schemaFields);
  };

  const memoizedInitialValues = useMemo(() => {
    // Ensure all field values are defined (not undefined) to prevent controlled/uncontrolled warnings
    const safeValues: Record<string, any> = {};
    fields.forEach(field => {
      safeValues[field.name] = initialValues[field.name] ?? '';
    });
    return safeValues;
  }, [JSON.stringify(initialValues), fields]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(createValidationSchema()),
    defaultValues: memoizedInitialValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(memoizedInitialValues);
    }
  }, [isOpen, memoizedInitialValues, reset]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleAddressSelect = async (prediction: PlacePrediction, fieldName: string) => {
    try {
      setValue(fieldName, prediction.description);
  
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

  const onFormSubmit = (data: Record<string, any>) => {
    // Include coordinates in the form data if available
    const formDataWithCoords = {
      ...data,
      ...(coords && { latitude: coords.lat, longitude: coords.lng })
    };
    
    onSubmit(formDataWithCoords);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 -top-8 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 relative h-[80vh] md:h-auto overflow-auto animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <TitleIcon className="h-6 w-6 text-[#122E5F]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field: FormField) => (
                <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  {!(field.name.toLowerCase().includes('address') || field.name.toLowerCase().includes('businessaddress')) && (
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  )}
                
                {field.type === "select" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <Select
                        value={controllerField.value || ""}
                        onValueChange={controllerField.onChange}
                      >
                        <SelectTrigger className={`h-10 text-sm text-gray-500 ${field.className || ""}`}>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option: { value: string; label: string }) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : field.type === "textarea" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <Textarea
                        {...controllerField}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        className={`h-20 text-sm ${field.className || ""}`}
                      />
                    )}
                  />
                ) : field.name.toLowerCase().includes('address') || field.name.toLowerCase().includes('businessaddress') ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <AddressSuggestion
                        value={controllerField.value || ""}
                        onChange={controllerField.onChange}
                        onSelect={(prediction) => handleAddressSelect(prediction, field.name)}
                        placeholder={field.placeholder || "Start typing your address..."}
                        label={field.label}
                        required={field.required}
                        error={errors[field.name]?.message as string}
                        className={field.className}
                      />
                    )}
                  />
                ) : (
                  <div className="relative">
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: controllerField }) => (
                        <Input
                          {...controllerField}
                          type={field.type}
                          placeholder={field.placeholder}
                          maxLength={
                            field.type === "tel" 
                              ? 14 
                              : field.name === "cardNumber"
                              ? 19
                              : field.name === "expiryDate"
                              ? 5
                              : field.maxLength
                          }
                          className={`h-10 text-sm ${field.className || ""}`}
                          value={
                            field.type === "tel" 
                              ? formatPhoneNumber(controllerField.value || "") 
                              : field.name === "cardNumber"
                              ? formatCardNumber(controllerField.value || "")
                              : field.name === "expiryDate"
                              ? formatExpiryDate(controllerField.value || "")
                              : controllerField.value || ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            
                            if (field.type === "tel") {
                              const formatted = formatPhoneNumber(value);
                              controllerField.onChange(formatted);
                            } else if (field.name === "cardNumber") {
                              const formatted = formatCardNumber(value);
                              controllerField.onChange(formatted);
                            } else if (field.name === "expiryDate") {
                              const formatted = formatExpiryDate(value);
                              controllerField.onChange(formatted);
                            } else {
                              controllerField.onChange(value);
                            }
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setShowZipSuggestions(false);
                            }, 200);
                          }}
                          onFocus={() => {
                            if (field.name === 'zipCode' && zipSuggestions.length > 0) {
                              setShowZipSuggestions(true);
                            }
                          }}
                        />
                      )}
                    />
                    
                    {/* {field.name === 'zipCode' && showZipSuggestions && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {isLoadingZips ? (
                          <div className="flex items-center justify-center p-3">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">Loading suggestions...</span>
                          </div>
                        ) : zipSuggestions.length > 0 ? (
                          zipSuggestions.map((suggestion, index) => {
                            const extractZipCode = (description: string) => {
                              const zipMatch = description.match(/\b\d{5}(-\d{4})?\b/);
                              return zipMatch ? zipMatch[0] : description.split(',')[0].trim();
                            };
                            
                            const zipCode = extractZipCode(suggestion.description);
                            
                            return (
                              <button
                                key={suggestion.place_id}
                                type="button"
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                                onClick={() => {
                                  setValue(field.name, suggestion.description);
                                  setShowZipSuggestions(false);
                                  setZipSuggestions([]);
                                }}
                              >
                                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">{zipCode}</span>
                                  <span className="text-xs text-gray-500 truncate">{suggestion.description}</span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No suggestions found
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>
                )}
                
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {String((errors[field.name] as any)?.message || 'This field is required')}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-[#122E5F] hover:bg-[#0f2347]/80 text-white disabled:opacity-50"
              >
                {SubmitIcon && <SubmitIcon className="h-4 w-4 mr-1" />}
                {isSubmitting ? "Submitting..." : submitButtonText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
