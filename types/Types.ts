import * as yup from "yup";

export interface ContractorType {
    fullName: string;
    title: string;
    phoneNumber: string;
    emailAddress: string;
    businessAddress: string;
    serviceRadius: string;
    password: string;
    confirmPassword: string;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    startIndex: number;
    endIndex: number;
    className?: string;
  }

  export interface DetailField {
    label: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
    breakAll?: boolean;
    whitespaceNowrap?: boolean;
  }
  
  export interface DetailPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    titleIcon: React.ComponentType<{ className?: string }>;
    fields: DetailField[];
    viewAllButton?: {
      text: string;
      href: string;
    };
  }

  export interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "number" | "tel" | "select" | "textarea";
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    maxLength?: number;
    className?: string;
    validation?: yup.StringSchema | yup.NumberSchema;
  }
  
  export interface FormPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    titleIcon: React.ComponentType<{ className?: string }>;
    fields: FormField[];
    onSubmit: (formData: Record<string, any>) => void;
    submitButtonText?: string;
    submitButtonIcon?: React.ComponentType<{ className?: string }>;
    initialValues?: Record<string, any>;
    validationSchema?: yup.ObjectSchema<any>;
  }

  export interface TableColumn {
    key: string;
    label: string;
    className?: string;
  }
  
  export interface TableRow {
    [key: string]: any;
  }
  
  export interface TablePopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    titleIcon: React.ComponentType<{ className?: string }>;
    columns: TableColumn[];
    data: TableRow[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    itemsPerPage?: number;
    showPagination?: boolean;
    closeButtonText?: string;
    closeButtonClassName?: string;
    renderCell?: (column: TableColumn, row: TableRow, index: number) => React.ReactNode;
  }