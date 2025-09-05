# Deployment Guide

This document provides comprehensive instructions for deploying the Roofing Contractor CRM application to various environments.

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Git repository access
- Environment variables configured
- Google Places API key

## Environment Setup

### 1. Environment Variables

Create environment files for different environments:

#### Development (`.env.local`)
```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_development_api_key
NODE_ENV=development
```

#### Production (`.env.production`)
```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_production_api_key
NODE_ENV=production
```

### 2. Google Places API Configuration

1. **Enable Google Places API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Places API
   - Create API credentials

2. **Configure API Restrictions**:
   - Set HTTP referrer restrictions for web
   - Add your domain to allowed origins
   - Set usage quotas and billing

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides seamless deployment for Next.js applications.

#### Setup Steps:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Configure Environment Variables**:
   - Go to Vercel dashboard
   - Navigate to project settings
   - Add environment variables
   - Redeploy

#### Vercel Configuration (`vercel.json`):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY": "@google-places-api-key"
  }
}
```

### Option 2: Netlify

#### Setup Steps:

1. **Build Configuration** (`netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**:
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables

### Option 3: AWS Amplify

#### Setup Steps:

1. **Build Settings** (`amplify.yml`):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

2. **Deploy**:
   - Connect repository to Amplify
   - Configure build settings
   - Add environment variables
   - Deploy

### Option 4: Docker Deployment

#### Dockerfile:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose:
```yaml
version: '3.8'
services:
  roofing-crm:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=${GOOGLE_PLACES_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

### Option 5: Traditional Server Deployment

#### Prerequisites:
- Ubuntu/CentOS server
- Nginx web server
- PM2 process manager
- SSL certificate

#### Setup Steps:

1. **Install Dependencies**:
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt-get install nginx
   ```

2. **Build Application**:
   ```bash
   git clone <repository-url>
   cd Roofing-Contractor-CRM
   npm install
   npm run build
   ```

3. **Configure PM2**:
   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'roofing-crm',
       script: 'npm',
       args: 'start',
       cwd: '/path/to/app',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF
   
   # Start application
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Build Configuration

### Next.js Configuration (`next.config.js`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployment
  images: {
    domains: ['your-domain.com'],
    unoptimized: true // For static export
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

### Package.json Scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export",
    "analyze": "cross-env ANALYZE=true next build"
  }
}
```

## Environment-Specific Configurations

### Development
- Hot reloading enabled
- Detailed error messages
- Development API endpoints
- Debug logging

### Staging
- Production-like environment
- Staging API endpoints
- Limited error details
- Performance monitoring

### Production
- Optimized builds
- Production API endpoints
- Error tracking
- Performance monitoring
- Security headers

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use secure key management
- Rotate API keys regularly
- Use different keys per environment

### 2. HTTPS Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
}
```

### 3. CORS Configuration
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}
```

## Monitoring and Logging

### 1. Application Monitoring
```javascript
// Add to next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health',
      },
    ]
  },
}
```

### 2. Error Tracking
```javascript
// Add error boundary
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to monitoring service
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      {/* Your app components */}
    </ErrorBoundary>
  )
}
```

## Performance Optimization

### 1. Build Optimization
```bash
# Analyze bundle size
npm run analyze

# Optimize images
npm install --save-dev @next/bundle-analyzer
```

### 2. Caching Strategy
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Clear `.next` folder and rebuild
   - Verify all dependencies are installed

2. **Environment Variables**:
   - Ensure variables are properly set
   - Check variable naming (NEXT_PUBLIC_ prefix)
   - Verify deployment platform configuration

3. **API Issues**:
   - Check Google Places API key validity
   - Verify API quotas and billing
   - Test API endpoints independently

4. **Performance Issues**:
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets

## Rollback Strategy

### 1. Version Control
- Tag releases with semantic versioning
- Maintain separate branches for environments
- Document deployment history

### 2. Quick Rollback
```bash
# Vercel
vercel --prod --confirm

# Docker
docker-compose down
docker-compose up -d --scale app=0
docker-compose up -d --scale app=1

# PM2
pm2 stop roofing-crm
pm2 start ecosystem.config.js --env production
```

## Maintenance

### Regular Tasks:
- Update dependencies monthly
- Monitor performance metrics
- Review security updates
- Backup database (when implemented)
- Update SSL certificates
- Monitor API usage and costs

### Health Checks:
- Set up uptime monitoring
- Configure alert notifications
- Regular security audits
- Performance benchmarking
