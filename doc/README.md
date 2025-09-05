# Roofing Contractor CRM

A comprehensive Customer Relationship Management system designed specifically for roofing contractors to manage leads, track projects, and streamline their business operations.

## 🏗️ Project Overview

RoofClaim Pro is a professional roofing claims service platform that helps contractors manage their business operations efficiently. The system provides tools for lead management, project tracking, customer communication, and business analytics.

## ✨ Key Features

- **Lead Management**: Capture and track potential customers
- **Contractor Registration**: Multi-step registration process with address validation
- **Dashboard Analytics**: Business insights and performance metrics
- **Authentication System**: Secure login and protected routes
- **Responsive Design**: Mobile-first approach with modern UI
- **Google Places Integration**: Address autocomplete and validation
- **Form Validation**: Comprehensive client-side validation with Yup

## 🛠️ Technology Stack

- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Form Handling**: React Hook Form + Yup validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Authentication**: Custom auth system

## 📁 Project Structure

```
Roofing-Contractor-CRM/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── crmContractor/     # Contractor dashboard
│   ├── dashboard/         # Main dashboard
│   ├── login/            # Authentication pages
│   └── thank-you/        # Success pages
├── components/            # React components
│   ├── Auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── doc/                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Places API key (for address autocomplete)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Roofing-Contractor-CRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Places API
3. Create an API key
4. Add the key to your `.env.local` file

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration. Key settings:
- Custom color palette for roofing industry branding
- Responsive breakpoints
- Custom animations and transitions

## 🏛️ Architecture

### Authentication Flow
- Protected routes with `ProtectedRoute` component
- Login modal for user authentication
- Session management with custom hooks

### Component Architecture
- **Atomic Design**: Components organized by complexity
- **Reusable UI**: shadcn/ui components for consistency
- **Custom Hooks**: Business logic separated from UI

### API Structure
- RESTful API routes in `app/api/`
- Google Places integration for address validation
- Form submission handling

## 📱 Pages & Routes

- `/` - Landing page with hero section and features
- `/login` - User authentication
- `/crmContractor` - Contractor registration form
- `/dashboard` - Main business dashboard
- `/thank-you` - Success confirmation page

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Skeleton loaders and spinners
- **Form Validation**: Real-time validation feedback
- **Toast Notifications**: User feedback system

## 🔒 Security Features

- Protected routes and authentication
- Form validation and sanitization
- Secure API key handling
- Input validation with Yup schemas

## 📊 Performance Optimizations

- Next.js App Router for better performance
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Optimized bundle size

## 🧪 Testing

The project is set up for testing with:
- ESLint for code quality
- TypeScript for type safety
- Component testing capabilities

## 📈 Future Enhancements

- [ ] Database integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Payment integration
- [ ] Email automation
- [ ] Document management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for roofing contractors**
