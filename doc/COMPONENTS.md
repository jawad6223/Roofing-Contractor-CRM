# Component Documentation

This document provides detailed information about the React components used in the Roofing Contractor CRM system.

## Component Architecture

The project follows a modular component architecture with clear separation of concerns:

- **UI Components**: Reusable, styled components from shadcn/ui
- **Business Components**: Feature-specific components with business logic
- **Layout Components**: Structural components for page layout
- **Auth Components**: Authentication-related components

## Component Categories

### 1. Authentication Components (`components/Auth/`)

#### `ProtectedRoute.tsx`
**Purpose**: Wrapper component that protects routes based on authentication status.

**Props**:
- `requireAuth` (boolean): Whether authentication is required
- `children` (ReactNode): Child components to render

**Usage**:
```tsx
<ProtectedRoute requireAuth={true}>
  <Dashboard />
</ProtectedRoute>
```

#### `loginModal.tsx`
**Purpose**: Modal component for user authentication.

**Features**:
- Login form with email/password
- Form validation
- Error handling
- Responsive design

**State Management**:
- Form data state
- Loading states
- Error states

### 2. Layout Components (`components/layout/`)

#### `Header.tsx`
**Purpose**: Main navigation header for the application.

**Features**:
- Logo display
- Navigation menu
- User authentication status
- Responsive mobile menu

#### `Footer.tsx`
**Purpose**: Footer component with links and company information.

**Features**:
- Company information
- Social media links
- Legal links
- Contact information

### 3. Business Components

#### `ContractorForm.tsx`
**Purpose**: Multi-step registration form for contractors.

**Key Features**:
- **Multi-step Process**: 3-step registration flow
- **Address Autocomplete**: Google Places API integration
- **Form Validation**: Comprehensive validation with Yup
- **Password Security**: Show/hide password functionality
- **Progress Tracking**: Visual progress indicator

**Form Steps**:
1. **Personal Information**: Name, title, contact details
2. **Business Information**: Address, service radius
3. **Account Setup**: Password creation and confirmation

**State Management**:
```typescript
const [formData, setFormData] = useState({
  fullName: '',
  title: '',
  phoneNumber: '',
  emailAddress: '',
  businessAddress: '',
  serviceRadius: '',
  password: '',
  confirmPassword: ''
});
```

**Validation Rules**:
- Required fields validation
- Email format validation
- Phone number format validation
- Password strength requirements
- Password confirmation matching

#### `crmDashboard.tsx`
**Purpose**: Main dashboard for contractors to manage their business.

**Features**:
- Business metrics display
- Lead management
- Project tracking
- Quick actions

### 4. Landing Page Components

#### `Hero.tsx`
**Purpose**: Hero section for the landing page.

**Features**:
- Compelling headline
- Call-to-action buttons
- Background imagery
- Responsive design

#### `HowItWorks.tsx`
**Purpose**: Explains the service process to potential customers.

**Features**:
- Step-by-step process
- Visual icons
- Clear explanations

#### `SuccessStories.tsx`
**Purpose**: Customer testimonials and success stories.

**Features**:
- Customer testimonials
- Before/after images
- Star ratings

#### `LeadQualityGuarantee.tsx`
**Purpose**: Highlights the quality guarantee for leads.

**Features**:
- Guarantee messaging
- Trust indicators
- Quality metrics

#### `WhyChooseUs.tsx`
**Purpose**: Competitive advantages and unique selling points.

**Features**:
- Feature highlights
- Comparison points
- Value propositions

#### `FAQ.tsx`
**Purpose**: Frequently asked questions section.

**Features**:
- Expandable questions
- Search functionality
- Categorized questions

#### `PricingPackages.tsx`
**Purpose**: Pricing information and package options.

**Features**:
- Package comparison
- Pricing tiers
- Feature lists

### 5. UI Components (`components/ui/`)

The project uses shadcn/ui components for consistent styling and functionality:

#### Core Components
- `Button`: Various button styles and states
- `Input`: Form input fields with validation
- `Card`: Content containers with headers and content
- `Dialog`: Modal dialogs and overlays
- `Form`: Form components with validation
- `Label`: Form labels with accessibility
- `Select`: Dropdown selection components
- `Textarea`: Multi-line text input
- `Toast`: Notification system

#### Layout Components
- `Accordion`: Collapsible content sections
- `Tabs`: Tabbed interface
- `Separator`: Visual separators
- `ScrollArea`: Custom scrollable areas

#### Data Display
- `Table`: Data tables with sorting and filtering
- `Badge`: Status indicators and labels
- `Avatar`: User profile images
- `Progress`: Progress indicators
- `Chart`: Data visualization components

#### Navigation
- `NavigationMenu`: Main navigation
- `Breadcrumb`: Navigation breadcrumbs
- `Pagination`: Page navigation
- `Command`: Command palette interface

## Component Patterns

### 1. Form Components
All form components follow these patterns:
- Controlled components with React state
- Validation with Yup schemas
- Error handling and display
- Loading states
- Accessibility features

### 2. Modal Components
Modal components include:
- Backdrop overlay
- Escape key handling
- Focus management
- Responsive design
- Animation transitions

### 3. Data Display Components
Data components feature:
- Loading skeletons
- Empty states
- Error states
- Responsive layouts
- Accessibility compliance

## Styling Approach

### Tailwind CSS Classes
Components use Tailwind CSS for styling:
- Utility-first approach
- Responsive design classes
- Dark mode support
- Custom color palette

### Component Variants
Many components support variants:
- Size variants (sm, md, lg)
- Color variants (primary, secondary, destructive)
- Style variants (outline, ghost, solid)

## Accessibility Features

All components include:
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Performance Considerations

### Optimization Techniques
- React.memo for expensive components
- useCallback for event handlers
- useMemo for computed values
- Lazy loading for heavy components
- Code splitting at component level

### Bundle Size
- Tree shaking for unused components
- Dynamic imports for large components
- Optimized icon usage
- Minimal dependencies

## Testing Strategy

### Component Testing
- Unit tests for individual components
- Integration tests for component interactions
- Visual regression tests
- Accessibility testing

### Test Utilities
- Custom render functions
- Mock providers
- Test data factories
- Accessibility testing helpers

## Development Guidelines

### Component Creation
1. Start with TypeScript interfaces
2. Implement accessibility features
3. Add comprehensive prop validation
4. Include error boundaries
5. Write unit tests

### Code Organization
- Single responsibility principle
- Clear prop interfaces
- Consistent naming conventions
- Proper file structure
- Documentation comments

### Performance Best Practices
- Avoid unnecessary re-renders
- Use proper dependency arrays
- Implement proper cleanup
- Optimize bundle size
- Monitor performance metrics

## Future Enhancements

### Planned Features
- [ ] Component library documentation
- [ ] Storybook integration
- [ ] Automated testing pipeline
- [ ] Performance monitoring
- [ ] Component analytics

### Technical Improvements
- [ ] Server-side rendering optimization
- [ ] Progressive web app features
- [ ] Advanced caching strategies
- [ ] Real-time updates
- [ ] Offline functionality
