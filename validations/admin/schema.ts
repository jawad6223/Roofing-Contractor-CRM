// Validation schema for new lead form
import * as yup from "yup";

export const newLeadSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: yup
      .string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    phoneno: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        "Please enter a valid phone number in format (555) 123-4567"
      ),
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address"),
    propertyAddress: yup
      .string()
      .required("Property address is required")
      .min(5, "Please enter a valid property address"),
    company: yup
      .string()
      .required("Insurance company is required")
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    policy: yup
      .string()
      .required("Policy number is required")
      .min(2, "Policy number must be at least 2 characters")
      .max(50, "Policy number must be less than 50 characters"),
  });