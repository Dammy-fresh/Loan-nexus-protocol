# DeLoan Project Appendix

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [File Structure](#file-structure)
4. [Dependencies](#dependencies)
5. [Component Documentation](#component-documentation)
6. [Page Documentation](#page-documentation)
7. [Routing Configuration](#routing-configuration)
8. [UI Components Library](#ui-components-library)
9. [Wallet Integration](#wallet-integration)
10. [State Management](#state-management)
11. [Styling System](#styling-system)
12. [Development Guidelines](#development-guidelines)
13. [API Endpoints](#api-endpoints)
14. [Deployment Configuration](#deployment-configuration)

## Project Overview

**Project Name:** DeLoan - Decentralized Lending Platform  
**Technology Stack:** React + TypeScript + Vite + Tailwind CSS  
**Purpose:** Web3-based peer-to-peer lending platform connecting borrowers and lenders  
**Blockchain Integration:** Ethereum-compatible wallets (Keplr, Rabby, Phantom, Backpack)

## Technical Architecture

### Frontend Architecture
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design system
- **State Management:** React Query for server state, React hooks for local state
- **Routing:** React Router DOM v6
- **UI Library:** Radix UI primitives with shadcn/ui components

### Wallet Integration
- **Supported Wallets:** Keplr, Rabby, Phantom, Backpack
- **Connection Flow:** Modal selection → External login → Wallet connection
- **Authentication:** Web3 wallet-based authentication

## File Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── ActiveLoans.tsx         # Borrower active loans management
│   ├── InvestmentModal.tsx     # Lender investment interface
│   ├── LoanCreationForm.tsx    # Multi-step loan application
│   ├── LoanDetailsModal.tsx    # Detailed loan information display
│   ├── PaymentModal.tsx        # Loan payment processing
│   ├── Portfolio.tsx           # Investment portfolio management
│   └── WalletSelectionModal.tsx # Wallet connection interface
├── pages/
│   ├── BorrowerAuth.tsx        # Borrower authentication
│   ├── BorrowerDashboard.tsx   # Borrower main dashboard
│   ├── Landing.tsx             # Homepage/landing page
│   ├── LenderAuth.tsx          # Lender authentication
│   ├── LenderDashboard.tsx     # Lender main dashboard
│   ├── LoanApplication.tsx     # 3-step loan application process
│   ├── Index.tsx               # Main dashboard (legacy)
│   └── NotFound.tsx            # 404 error page
├── hooks/
│   ├── use-mobile.tsx          # Mobile device detection
│   └── use-toast.ts            # Toast notification hook
├── lib/
│   └── utils.ts                # Utility functions
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles and design tokens
```

## Dependencies

### Core Dependencies
- **React Ecosystem:**
  - `react@^18.3.1` - Core React library
  - `react-dom@^18.3.1` - React DOM renderer
  - `react-router-dom@^6.26.2` - Client-side routing
  - `react-hook-form@^7.53.0` - Form management
  - `react-query@^5.56.2` - Server state management

- **UI & Styling:**
  - `@radix-ui/*` - Accessible UI primitives
  - `tailwindcss` - Utility-first CSS framework
  - `class-variance-authority@^0.7.1` - Component variant management
  - `tailwind-merge@^2.5.2` - Tailwind class merging
  - `lucide-react@^0.462.0` - Icon library

- **Utilities:**
  - `clsx@^2.1.1` - Conditional className utility
  - `date-fns@^3.6.0` - Date manipulation
  - `zod@^3.23.8` - Schema validation
  - `jspdf@^3.0.1` - PDF generation

## Component Documentation

### Core Components

#### `WalletSelectionModal`
**Purpose:** Handles wallet connection flow  
**Props:**
- `isOpen: boolean` - Modal visibility state
- `onClose: () => void` - Close handler
- `onWalletSelect: (wallet: string) => void` - Wallet selection handler

**Supported Wallets:**
- Keplr (Cosmos ecosystem)
- Rabby (Multi-chain)
- Phantom (Solana)
- Backpack (Solana)

#### `LoanCreationForm`
**Purpose:** Multi-step loan application process  
**Features:**
- Loan amount and collateral calculation
- Asset selection (ETH, BTC, USDC, USDT)
- Risk assessment and health factor calculation
- Smart contract deployment preparation

#### `ActiveLoans`
**Purpose:** Displays borrower's active loans  
**Features:**
- Loan status tracking
- Payment progress visualization
- Risk indicators (collateral ratio, liquidation price)
- Payment processing integration

#### `InvestmentModal`
**Purpose:** Handles lender investments  
**Props:**
- `loan: any` - Loan data object
- `walletBalance: number` - Available wallet balance
- `onInvestmentComplete: (amount: number) => void` - Investment callback

### UI Components Library

All UI components are built on Radix UI primitives and follow the shadcn/ui pattern:

- **Form Controls:** Button, Input, Select, Checkbox, Radio Group
- **Layout:** Card, Separator, Tabs, Accordion
- **Feedback:** Alert, Toast, Badge, Progress
- **Overlay:** Dialog, Popover, Tooltip, Sheet
- **Navigation:** Navigation Menu, Breadcrumb, Pagination

## Page Documentation

### Authentication Pages

#### `BorrowerAuth` & `LenderAuth`
**Purpose:** Separate authentication flows for borrowers and lenders  
**Features:**
- Login/registration forms
- Form validation with React Hook Form
- Role-based redirection after authentication

### Dashboard Pages

#### `BorrowerDashboard`
**Features:**
- Wallet connection integration
- Loan application initiation
- Active loans management
- Document upload and management
- Payment processing

#### `LenderDashboard`
**Features:**
- Investment portfolio overview
- Available loans browsing
- Risk assessment tools
- Performance analytics

#### `LoanApplication`
**Structure:** 3-step wizard
1. **Loan Details:** Amount, duration, purpose
2. **Financial Info:** Income verification, document upload
3. **Review & Submit:** Smart contract deployment

## Routing Configuration

```typescript
Routes:
- "/" - Landing page
- "/dashboard" - Legacy main dashboard
- "/borrower-portal" - Borrower authentication
- "/lender-portal" - Lender authentication  
- "/loan-application" - Loan application process
- "/borrower-dashboard" - Borrower main interface
- "/lender-dashboard" - Lender main interface
- "*" - 404 Not Found page
```

## Wallet Integration

### Connection Flow
1. User clicks "Connect Wallet"
2. `WalletSelectionModal` displays 4 wallet options
3. Selected wallet redirects to external login page
4. After successful login, returns to connection page
5. Wallet details validated and connection established

### Wallet Configurations
- **Keplr:** Cosmos ecosystem wallet
- **Rabby:** Multi-chain wallet with enhanced security
- **Phantom:** Solana-focused wallet
- **Backpack:** Modern Solana wallet

## State Management

### Local State (React Hooks)
- Component-level state with `useState`
- Form state managed by React Hook Form
- Modal visibility and UI state

### Server State (React Query)
- API data fetching and caching
- Background updates and synchronization
- Error handling and retry logic

### Global State
- Toast notifications via custom hook
- Theme management with next-themes
- Wallet connection status

## Styling System

### Design Tokens (index.css)
```css
:root {
  --background: hsl(var(--background));
  --foreground: hsl(var(--foreground));
  --primary: hsl(var(--primary));
  --secondary: hsl(var(--secondary));
  /* ... additional tokens */
}
```

### Tailwind Configuration
- Custom color palette based on HSL values
- Responsive breakpoints
- Animation utilities
- Component-specific utilities

### Component Styling Pattern
- Use semantic tokens instead of direct colors
- Implement variants with `class-variance-authority`
- Follow shadcn/ui component patterns
- Maintain dark/light mode compatibility

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent file naming conventions
- Component composition over inheritance

### Best Practices
- Use semantic HTML elements
- Implement proper error boundaries
- Handle loading and error states
- Optimize for mobile responsiveness
- Follow accessibility guidelines (WCAG)

### Performance Optimizations
- Lazy loading for route components
- Image optimization with proper alt attributes
- Bundle splitting with Vite
- React Query for efficient data fetching

## API Endpoints

### Mock Data Endpoints
Currently using mock data for:
- Loan listings
- User authentication
- Payment processing
- Investment tracking

### Future Integration Points
- Blockchain transaction endpoints
- Smart contract interaction APIs
- KYC/AML verification services
- Credit scoring APIs

## Deployment Configuration

### Vercel Configuration
```json
{
  "build": {
    "env": {
      "NODE_VERSION": "20"
    }
  }
}
```

### Build Process
- Vite production build
- TypeScript compilation
- Tailwind CSS optimization
- Asset bundling and optimization

### Environment Variables
```
VITE_APP_NAME=DeLoan
VITE_WALLET_CONNECT_PROJECT_ID=[project_id]
VITE_BLOCKCHAIN_NETWORK=ethereum
```

## Security Considerations

### Frontend Security
- Input validation with Zod schemas
- XSS prevention through React's built-in protection
- Secure wallet connection handling
- Environment variable protection

### Blockchain Security
- Smart contract interaction validation
- Transaction confirmation flows
- Wallet signature verification
- Gas fee estimation and limits

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing for custom functionality
- Utility function testing

### Integration Testing
- Page-level component testing
- Form submission flows
- Modal interactions
- Routing behavior

### End-to-End Testing
- Complete user journey testing
- Wallet connection flows
- Loan application process
- Investment workflow

## Contributing Guidelines

### Development Setup
```bash
npm install
npm run dev
```

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation if needed
4. Submit PR with clear description

### Code Review Checklist
- TypeScript compliance
- Component reusability
- Performance implications
- Accessibility standards
- Mobile responsiveness

---

**Last Updated:** August 28, 2025  
**Version:** 1.0.0  
**Maintainer:** DeLoan Development Team