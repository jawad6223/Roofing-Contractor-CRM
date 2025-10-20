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