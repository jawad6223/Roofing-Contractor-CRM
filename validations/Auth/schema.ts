import * as yup from "yup";

// Validation schema for login form
export const loginValidationSchema = yup.object().shape({
    emailAddress: yup
      .string()
      .email("Invalid email address")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/,
        "Password must be 8 characters, 1 uppercase, 1 number & 1 special character"
      )
      .required("Password is required"),
  });

// Validation schema for admin login form
export const adminLoginValidationSchema = yup.object().shape({
    emailAddress: yup
      .string()
      .email('Invalid email address')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .required(),
    password: yup
      .string()
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required(),
  });

  // Validation schema for contractor form
  export const step1Schema = yup.object().shape({
    fullName: yup.string().required("Full name is required").min(2, "Name must be at least 2 characters"),
    title: yup.string().required("Title is required").min(2, "Title must be at least 2 characters").matches(/^[A-Za-z\s]+$/, "Title can only contain letters"),
    phoneNumber: yup.string().required("Phone number is required").matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Please enter a valid phone number"),
    emailAddress: yup.string()
      .required("Email address is required")
      .email("Please enter a valid email address")
      .matches(/\.(?:com|edu|org|net|gov)$/, "Please enter a valid email address"),
    businessAddress: yup.string().required("Business address is required").min(5, "Please enter a complete address"),
    serviceRadius: yup.string().required("Service radius is required").matches(/^\d+$/, "Please enter a valid number").test("min-value", "Service radius must be at least 1 mile", (value) => Number(value) >= 1).test("max-value", "Service radius cannot exceed 500 miles", (value) => Number(value) <= 500)
  });
  
  export const step2Schema = yup.object().shape({
    password: yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/, "Password must contain 1 uppercase letter, 1 number, and 1 special character"),
    confirmPassword: yup.string()
      .required("Please confirm your password")
      .oneOf([yup.ref('password')], "Passwords do not match")
  });