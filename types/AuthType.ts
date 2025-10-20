export interface FormDataType {
    emailAddress: string;
    password: string;
  };

  export interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
    redirectTo?: string
  }

  export interface PlacePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }

  export interface AdminProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
  }

  export interface AdminFormDataType {
    emailAddress: string;
    password: string;
  };