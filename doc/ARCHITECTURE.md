# Architecture Documentation

This document outlines the technical architecture, design patterns, and folder structure of the Roofing Contractor CRM system.

## System Overview

The Roofing Contractor CRM is built as a modern web application using Next.js 13 with the App Router, providing a scalable and maintainable architecture for managing roofing contractor operations.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │  External APIs  │
│                 │    │                 │    │                 │
│ • React UI      │◄──►│ • Next.js API   │◄──►│ • Google Places │
│ • State Mgmt    │    │ • Route Handlers │    │ • Future APIs   │
│ • Form Handling │    │ • Authentication │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3
- **UI Library**: Radix UI + shadcn/ui
- **Form Management**: React Hook Form + Yup
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: Custom implementation
- **Validation**: Yup schemas

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js built-in
- **Package Manager**: npm

## Folder Structure

```
Roofing-Contractor-CRM/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   └── places/              # Google Places API proxy
│   │       └── route.ts         # Places endpoint handler
│   ├── crmContractor/           # Contractor registration page
│   │   └── page.tsx            # Registration form page
│   ├── dashboard/               # Main dashboard
│   │   └── page.tsx            # Dashboard page
│   ├── login/                   # Authentication pages
│   │   └── page.tsx            # Login page
│   ├── thank-you/               # Success pages
│   │   └── page.tsx            # Thank you page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page
├── components/                   # React Components
│   ├── Auth/                    # Authentication components
│   │   ├── loginModal.tsx       # Login modal component
│   │   └── ProtectedRoute.tsx   # Route protection wrapper
│   ├── dashboard/               # Dashboard-specific components
│   │   └── crmDashboard.tsx     # Main dashboard component
│   ├── layout/                  # Layout components
│   │   ├── Footer.tsx           # Footer component
│   │   └── Header.tsx           # Header component
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── input.tsx            # Input component
│   │   ├── form.tsx             # Form components
│   │   └── ...                  # Other UI components
│   ├── ContractorForm.tsx       # Main contractor registration form
│   ├── FAQ.tsx                  # FAQ component
│   ├── Hero.tsx                 # Hero section
│   ├── HowItWorks.tsx           # How it works section
│   ├── LeadQualityGuarantee.tsx # Quality guarantee section
│   ├── PricingPackages.tsx      # Pricing section
│   ├── SuccessStories.tsx       # Testimonials section
│   └── WhyChooseUs.tsx          # Why choose us section
├── hooks/                       # Custom React Hooks
│   ├── useAuth.ts               # Authentication hook
│   └── use-toast.ts             # Toast notification hook
├── lib/                         # Utility Libraries
│   └── utils.ts                 # Utility functions
├── public/                      # Static Assets
│   ├── BG-Image.png             # Background image
│   ├── roofing-logo.png         # Main logo
│   └── roofingF-logo.png        # Footer logo
├── doc/                         # Documentation
│   ├── README.md                # Main documentation
│   ├── API.md                   # API documentation
│   ├── COMPONENTS.md            # Component documentation
│   └── ARCHITECTURE.md          # This file
├── components.json              # shadcn/ui configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── postcss.config.js            # PostCSS configuration
```

## Design Patterns

### 1. Component Architecture

#### Atomic Design Principles
- **Atoms**: Basic UI elements (Button, Input, Label)
- **Molecules**: Simple combinations (FormField, SearchBox)
- **Organisms**: Complex components (Header, ContractorForm)
- **Templates**: Page layouts (Dashboard, Landing)
- **Pages**: Complete pages with real data

#### Component Composition
```tsx
// Example: Composing complex forms from simple components
<Form>
  <FormField>
    <Label>Name</Label>
    <Input />
  </FormField>
  <Button>Submit</Button>
</Form>
```

### 2. State Management

#### Local State
- React useState for component-level state
- React useReducer for complex state logic
- Custom hooks for reusable state logic

#### Global State (Future)
- Context API for theme and authentication
- Zustand or Redux for complex global state

### 3. Data Flow

#### Unidirectional Data Flow
```
User Action → Event Handler → State Update → Component Re-render
```

#### API Integration
```
Component → API Route → External Service → Response → Component Update
```

## Authentication Architecture

### Current Implementation
```typescript
// Simple authentication with local state
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

### Future Implementation
```typescript
// JWT-based authentication
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

## API Architecture

### Route Structure
```
/api/
├── places/          # Google Places integration
├── auth/            # Authentication endpoints (future)
├── contractors/     # Contractor management (future)
├── leads/           # Lead management (future)
└── projects/        # Project management (future)
```

### Request/Response Pattern
```typescript
// Standardized API response format
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: 'success' | 'error';
}
```

## Styling Architecture

### Tailwind CSS Configuration
```typescript
// Custom design system
const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  // Roofing industry specific colors
  roofing: {
    blue: '#1e40af',
    gray: '#6b7280',
    orange: '#ea580c',
  }
};
```

### Component Styling Strategy
1. **Utility-First**: Tailwind classes for styling
2. **Component Variants**: CVA for component variants
3. **Responsive Design**: Mobile-first approach
4. **Dark Mode**: Theme switching capability

## Performance Architecture

### Optimization Strategies

#### 1. Code Splitting
```typescript
// Dynamic imports for large components
const Dashboard = dynamic(() => import('./contractor'), {
  loading: () => <DashboardSkeleton />
});
```

#### 2. Image Optimization
```typescript
// Next.js Image component for optimized images
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={200} height={100} />
```

#### 3. Bundle Optimization
- Tree shaking for unused code
- Dynamic imports for route-based splitting
- Optimized dependencies

### Caching Strategy
- Static generation for landing pages
- Server-side rendering for dynamic content
- Client-side caching for API responses

## Security Architecture

### Current Security Measures
1. **Input Validation**: Yup schemas for form validation
2. **XSS Protection**: React's built-in XSS protection
3. **CSRF Protection**: Next.js built-in CSRF protection
4. **Environment Variables**: Secure API key storage

### Future Security Enhancements
1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control
3. **Rate Limiting**: API rate limiting
4. **Data Encryption**: Sensitive data encryption

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Load balancer compatibility

### Vertical Scaling
- Efficient memory usage
- Optimized database queries
- Caching strategies

### Microservices Architecture (Future)
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Auth      │  │   CRM       │  │   Analytics │
│   Service   │  │   Service   │  │   Service   │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Development Workflow

### Code Organization
1. **Feature-Based Structure**: Components grouped by feature
2. **Shared Components**: Reusable components in `/ui`
3. **Custom Hooks**: Business logic in custom hooks
4. **Type Safety**: Comprehensive TypeScript usage

### Quality Assurance
1. **TypeScript**: Compile-time type checking
2. **ESLint**: Code quality and consistency
3. **Testing**: Unit and integration tests (future)
4. **Code Review**: Pull request reviews

## Deployment Architecture

### Current Deployment
- Static site generation
- Vercel deployment
- Environment variable configuration

### Future Deployment Options
- Docker containerization
- Kubernetes orchestration
- CI/CD pipeline integration
- Multi-environment support

## Monitoring and Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- API response time tracking

### Error Tracking
- Client-side error boundaries
- Server-side error logging
- User feedback collection

## Future Architecture Plans

### Phase 1: Database Integration
- PostgreSQL database
- Prisma ORM
- User management system

### Phase 2: Real-time Features
- WebSocket integration
- Real-time notifications
- Live dashboard updates

### Phase 3: Mobile Application
- React Native app
- Shared business logic
- Offline functionality

### Phase 4: Advanced Features
- AI-powered lead scoring
- Automated workflows
- Advanced analytics
- Third-party integrations

## Best Practices

### Code Quality
- Consistent naming conventions
- Comprehensive error handling
- Proper TypeScript usage
- Clean code principles

### Performance
- Lazy loading implementation
- Optimized re-renders
- Efficient state management
- Bundle size optimization

### Security
- Input validation
- Secure authentication
- Data protection
- Regular security audits

### Maintainability
- Modular architecture
- Clear documentation
- Test coverage
- Refactoring guidelines
