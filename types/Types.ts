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