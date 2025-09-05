# Development Guide

This document provides comprehensive guidelines for developers working on the Roofing Contractor CRM project.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Git
- Code editor (VS Code recommended)
- Google Places API key

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Roofing-Contractor-CRM
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Git Workflow

1. **Branch Naming Convention**:
   - `feature/feature-name` - New features
   - `bugfix/bug-description` - Bug fixes
   - `hotfix/critical-fix` - Critical fixes
   - `refactor/component-name` - Code refactoring

2. **Commit Message Format**:
   ```
   type(scope): description
   
   [optional body]
   
   [optional footer]
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

   Example:
   ```
   feat(auth): add login modal component
   
   - Implement login form with validation
   - Add error handling
   - Include responsive design
   ```

3. **Pull Request Process**:
   - Create feature branch from `main`
   - Make changes with descriptive commits
   - Create pull request with template
   - Request code review
   - Merge after approval

### Code Standards

#### TypeScript Guidelines

1. **Type Definitions**:
   ```typescript
   // Use interfaces for object shapes
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   // Use types for unions and computed types
   type Status = 'pending' | 'approved' | 'rejected';
   ```

2. **Component Props**:
   ```typescript
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
     disabled?: boolean;
     onClick?: () => void;
     children: React.ReactNode;
   }
   ```

3. **API Response Types**:
   ```typescript
   interface ApiResponse<T> {
     data: T;
     message: string;
     status: 'success' | 'error';
   }
   ```

#### React Best Practices

1. **Component Structure**:
   ```typescript
   // Use functional components with hooks
   const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
     // Hooks at the top
     const [state, setState] = useState(initialValue);
     
     // Event handlers
     const handleClick = useCallback(() => {
       // Handler logic
     }, [dependencies]);
     
     // Effects
     useEffect(() => {
       // Effect logic
     }, [dependencies]);
     
     // Render
     return (
       <div>
         {/* JSX */}
       </div>
     );
   };
   ```

2. **Custom Hooks**:
   ```typescript
   // Extract reusable logic into custom hooks
   const useApi = <T>(url: string) => {
     const [data, setData] = useState<T | null>(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     
     const fetchData = useCallback(async () => {
       setLoading(true);
       try {
         const response = await fetch(url);
         const result = await response.json();
         setData(result);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     }, [url]);
     
     return { data, loading, error, fetchData };
   };
   ```

#### Styling Guidelines

1. **Tailwind CSS Classes**:
   ```tsx
   // Use semantic class names
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
     <h2 className="text-xl font-semibold text-gray-900">Title</h2>
     <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
       Action
     </button>
   </div>
   ```

2. **Responsive Design**:
   ```tsx
   // Mobile-first approach
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Content */}
   </div>
   ```

3. **Component Variants**:
   ```typescript
   import { cva } from 'class-variance-authority';
   
   const buttonVariants = cva(
     'inline-flex items-center justify-center rounded-md font-medium transition-colors',
     {
       variants: {
         variant: {
           primary: 'bg-blue-600 text-white hover:bg-blue-700',
           secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
         },
         size: {
           sm: 'h-8 px-3 text-sm',
           md: 'h-10 px-4',
           lg: 'h-12 px-6 text-lg',
         },
       },
       defaultVariants: {
         variant: 'primary',
         size: 'md',
       },
     }
   );
   ```

## Project Structure Guidelines

### File Organization

1. **Component Files**:
   ```
   components/
   ├── FeatureName/
   │   ├── index.ts              # Export barrel
   │   ├── ComponentName.tsx     # Main component
   │   ├── ComponentName.test.tsx # Tests
   │   └── types.ts              # Type definitions
   ```

2. **Page Components**:
   ```
   app/
   ├── page-name/
   │   ├── page.tsx              # Page component
   │   ├── loading.tsx           # Loading UI
   │   ├── error.tsx             # Error UI
   │   └── not-found.tsx         # 404 UI
   ```

3. **API Routes**:
   ```
   app/api/
   ├── resource/
   │   ├── route.ts              # GET, POST handlers
   │   ├── [id]/
   │   │   └── route.ts          # GET, PUT, DELETE handlers
   ```

### Import/Export Conventions

1. **Import Order**:
   ```typescript
   // 1. React and Next.js imports
   import React from 'react';
   import { useRouter } from 'next/navigation';
   
   // 2. Third-party libraries
   import { Button } from '@/components/ui/button';
   import { toast } from 'sonner';
   
   // 3. Internal components
   import { Header } from '@/components/layout/Header';
   
   // 4. Types and utilities
   import type { User } from '@/types/user';
   import { cn } from '@/lib/utils';
   ```

2. **Export Patterns**:
   ```typescript
   // Default export for main component
   export default function MyComponent() {
     return <div>Content</div>;
   }
   
   // Named exports for utilities
   export const helperFunction = () => {};
   export type { ComponentProps };
   ```

## Testing Guidelines

### Unit Testing

1. **Test Structure**:
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Button } from './Button';
   
   describe('Button Component', () => {
     it('renders with correct text', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
     
     it('calls onClick when clicked', () => {
       const handleClick = jest.fn();
       render(<Button onClick={handleClick}>Click me</Button>);
       
       fireEvent.click(screen.getByText('Click me'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
   });
   ```

2. **Testing Hooks**:
   ```typescript
   import { renderHook, act } from '@testing-library/react';
   import { useCounter } from './useCounter';
   
   describe('useCounter', () => {
     it('should increment counter', () => {
       const { result } = renderHook(() => useCounter());
       
       act(() => {
         result.current.increment();
       });
       
       expect(result.current.count).toBe(1);
     });
   });
   ```

### Integration Testing

1. **API Testing**:
   ```typescript
   import { GET } from '@/app/api/places/route';
   
   describe('/api/places', () => {
     it('should return place predictions', async () => {
       const request = new Request('http://localhost:3000/api/places?input=test');
       const response = await GET(request);
       const data = await response.json();
       
       expect(response.status).toBe(200);
       expect(data.predictions).toBeDefined();
     });
   });
   ```

## Performance Guidelines

### Optimization Techniques

1. **Code Splitting**:
   ```typescript
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <div>Loading...</div>,
     ssr: false
   });
   ```

2. **Memoization**:
   ```typescript
   const ExpensiveComponent = React.memo(({ data }) => {
     const processedData = useMemo(() => {
       return data.map(item => processItem(item));
     }, [data]);
     
     return <div>{processedData}</div>;
   });
   ```

3. **Image Optimization**:
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/hero-image.jpg"
     alt="Hero image"
     width={800}
     height={600}
     priority
     placeholder="blur"
     blurDataURL="data:image/jpeg;base64,..."
   />
   ```

### Bundle Analysis

1. **Analyze Bundle Size**:
   ```bash
   npm run analyze
   ```

2. **Check for Unused Code**:
   ```bash
   npx depcheck
   ```

## Debugging

### Development Tools

1. **React Developer Tools**:
   - Install browser extension
   - Use for component inspection
   - Monitor state changes

2. **Next.js Debugging**:
   ```bash
   # Enable debug mode
   DEBUG=* npm run dev
   
   # Specific debug namespace
   DEBUG=next:* npm run dev
   ```

3. **TypeScript Debugging**:
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true
     }
   }
   ```

### Common Issues

1. **Hydration Mismatch**:
   ```typescript
   // Use useEffect for client-only code
   useEffect(() => {
     // Client-side only code
   }, []);
   ```

2. **Memory Leaks**:
   ```typescript
   useEffect(() => {
     const timer = setInterval(() => {
       // Some logic
     }, 1000);
     
     return () => clearInterval(timer); // Cleanup
   }, []);
   ```

## Code Review Checklist

### Before Submitting PR

- [ ] Code follows TypeScript guidelines
- [ ] Components are properly typed
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Responsive design implemented
- [ ] Accessibility features included
- [ ] Performance optimizations applied
- [ ] Tests written and passing
- [ ] Documentation updated

### Review Criteria

1. **Functionality**:
   - Does the code work as expected?
   - Are edge cases handled?
   - Is error handling appropriate?

2. **Code Quality**:
   - Is the code readable and maintainable?
   - Are naming conventions followed?
   - Is the code DRY (Don't Repeat Yourself)?

3. **Performance**:
   - Are there any performance issues?
   - Is the code optimized?
   - Are unnecessary re-renders avoided?

4. **Security**:
   - Are inputs properly validated?
   - Are sensitive data handled securely?
   - Are there any security vulnerabilities?

## Documentation Standards

### Code Documentation

1. **Component Documentation**:
   ```typescript
   /**
    * Button component with multiple variants and sizes
    * 
    * @param variant - Visual style variant
    * @param size - Button size
    * @param disabled - Whether button is disabled
    * @param onClick - Click handler function
    * @param children - Button content
    */
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     size?: 'sm' | 'md' | 'lg';
     disabled?: boolean;
     onClick?: () => void;
     children: React.ReactNode;
   }
   ```

2. **Function Documentation**:
   ```typescript
   /**
    * Validates email address format
    * 
    * @param email - Email address to validate
    * @returns true if email is valid, false otherwise
    * 
    * @example
    * ```typescript
    * const isValid = validateEmail('user@example.com');
    * console.log(isValid); // true
    * ```
    */
   function validateEmail(email: string): boolean {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   }
   ```

### README Updates

- Update README when adding new features
- Include setup instructions for new dependencies
- Document environment variables
- Add troubleshooting section

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test
    
    - name: Build application
      run: npm run build
```

## Best Practices Summary

1. **Code Organization**: Keep related code together
2. **Type Safety**: Use TypeScript strictly
3. **Performance**: Optimize for speed and bundle size
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Testing**: Write tests for critical functionality
6. **Documentation**: Document complex logic and APIs
7. **Security**: Validate inputs and handle errors
8. **Maintainability**: Write clean, readable code
