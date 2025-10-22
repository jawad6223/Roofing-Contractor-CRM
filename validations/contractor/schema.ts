// Validation schema for CRM member form
import * as yup from "yup";

export const crmMemberSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
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
    .min(2, "Property address must be at least 2 characters"),
  insuranceCompany: yup
    .string()
    .required("Insurance company is required")
    .min(2, "Insurance company must be at least 2 characters"),
  policy: yup
    .string()
    .required("Policy number is required")
    .min(2, "Policy number must be at least 2 characters"),
});

// Validation schema for payment method form
export const paymentMethodSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(
      /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
      "Please enter a valid 16-digit card number"
    ),
  cardholderName: yup
    .string()
    .required("Cardholder name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  expiryDate: yup
    .string()
    .required("Expiry date is required")
    .matches(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Please enter a valid expiry date (MM/YY)"
    )
    .test("future-date", "Expiry date cannot be in the past", function (value) {
      if (!value) return true;

      const [month, year] = value.split("/");
      const expiryYear = parseInt(`20${year}`);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (expiryYear > currentYear) return true;

      if (expiryYear === currentYear) {
        return parseInt(month) >= currentMonth;
      }
      return false;
    }),
  cvv: yup
    .string()
    .required("CVV is required")
    .matches(/^\d{3}$/, "Please enter a valid CVV (3 digits only)"),
  cardType: yup
    .string()
    .required("Card type is required")
    .oneOf(["visa", "mastercard"], "Please select a valid card type"),
});

// Custom validation schema
export const teamMemberSchema = yup.object().shape({
  name: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .matches(/\.(?:com|edu|org|net|gov)$/, "Please enter a valid email address"),
  phoneno: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Please enter a valid phone number in format (555) 123-4567"
    ),
});
