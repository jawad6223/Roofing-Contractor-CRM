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