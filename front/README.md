# Frontend - Next.js Application

The frontend service for the Jadwa Trade Management System, built with Next.js 16, React 19, and TypeScript.

## 🏗️ Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Data Table**: TanStack React Table 8.21.3
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks + nuqs (URL state)
- **Icons**: Lucide React, FontAwesome
- **Animation**: Framer Motion

## 📁 Project Structure

```
front/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── Header.tsx               # Application header
│   ├── Search.tsx               # Search component
│   ├── data-table/              # Data table components
│   │   ├── data-table.tsx
│   │   ├── data-table-advanced-toolbar.tsx
│   │   ├── data-table-pagination.tsx
│   │   └── ...                  # Other table components
│   ├── filters/                 # Filter components
│   │   ├── Filters.tsx
│   │   ├── DateFilter.tsx
│   │   └── FluxFilter.tsx
│   ├── trade-data/              # Trade-specific components
│   │   ├── TradeDashboard.tsx
│   │   ├── TradeDataTable.tsx
│   │   ├── columns.tsx
│   │   └── useTradeData.ts      # Custom hook
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── table.tsx
│       └── ...                  # Other UI primitives
├── config/                      # Configuration
│   └── data-table.ts
├── hooks/                       # Custom React hooks
│   ├── use-data-table.ts
│   ├── use-callback-ref.ts
│   └── use-debounced-callback.ts
├── lib/                         # Utilities & services
│   ├── api.ts                   # API client
│   ├── utils.ts                 # Utility functions
│   └── services/
│       └── trade.service.ts     # Trade API service
├── types/                       # TypeScript types
│   └── data-table.ts
├── public/                      # Static assets
├── components.json              # shadcn/ui config
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── Dockerfile                   # Docker image
└── package.json                 # Dependencies
```

## 🚀 Getting Started

### With Docker (Recommended)

From the project root:

```bash
# Start all services
make up

# View frontend logs
make front-logs

# Access frontend shell
make front-shell
```

Access the app at [http://localhost:3000](http://localhost:3000)

### Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## 📚 Key Features

### 1. Advanced Data Table

Located in `components/data-table/`, featuring:

- Server-side pagination
- Multi-column sorting
- Advanced filtering
- Column visibility controls
- Expandable rows
- Responsive design

### 2. Trade Dashboard

Main dashboard (`components/trade-data/TradeDashboard.tsx`):

- Real-time data fetching
- Interactive filters
- Search functionality
- Export capabilities
- 50,000+ records handling

### 3. API Integration

Complete API integration (`lib/api.ts`, `lib/services/trade.service.ts`):

- RESTful API client
- Automatic pagination handling
- Error handling
- Type-safe requests
- Request/response interceptors

### 4. Custom Hooks

Reusable hooks (`hooks/`):

- `useTradeData` - Trade data fetching and state management
- `useDataTable` - Table state and interactions
- `useDebouncedCallback` - Debounced function calls

## 🎨 UI Components

Built with shadcn/ui and Radix UI primitives:

```typescript
// Example usage
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
```

Add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

## 📊 Data Fetching

### Using the Trade Service

```typescript
import { tradeService } from '@/lib/services/trade.service';

// Fetch all trades (auto-pagination)
const trades = await tradeService.getAllTrades();

// Fetch single page
const page = await tradeService.getTrades({ page: 1, page_size: 100 });

// Fetch with filters
const filtered = await tradeService.getTrades({
  continent: 'Europe',
  date_after: '2024-01-01',
  search: 'coffee',
});
```

### Using the Custom Hook

```typescript
import { useTradeData } from '@/components/trade-data/useTradeData'

function MyComponent() {
  const { data, loading, error } = useTradeData({ pageSize: 50 })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{data.length} trades loaded</div>
}
```

## 🧪 Development Scripts

```bash
# Development
npm run dev              # Start dev server with hot-reload
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check

# Testing (when implemented)
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
```

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

Or with Docker:

```bash
# From project root
make rebuild-prod
```

## 📖 API Documentation

See [../docs/API_REFERENCE.md](../docs/API_REFERENCE.md) for complete API documentation.

See [../docs/INTEGRATION.md](../docs/INTEGRATION.md) for integration details.

## 🎯 Component Development

### Adding New Components

1. Create component in appropriate directory
2. Use TypeScript for type safety
3. Follow naming conventions (PascalCase for components)
4. Export from component file

Example:

```typescript
// components/MyComponent.tsx
import React from 'react'

interface MyComponentProps {
  title: string
  onClick?: () => void
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
    </div>
  )
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theming
- Keep styles close to components

## 🔍 Debugging

### Common Issues

**API Connection Issues:**

```bash
# Check API URL
echo $NEXT_PUBLIC_API_BASE_URL

# Verify backend is running
curl http://localhost:8000/api/trades/
```

**Build Errors:**

```bash
# Clear cache
rm -rf .next
npm run build
```

**Type Errors:**

```bash
# Run type checker
npm run type-check
```

## 📝 Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write clear, descriptive variable names
- Add JSDoc comments for complex functions

## 🤝 Contributing

See [../README.md](../README.md) for contribution guidelines.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Table](https://tanstack.com/table)
- [shadcn/ui](https://ui.shadcn.com/)

## 🔗 Related Documentation

- [Backend Documentation](../back/README.md)
- [API Reference](../docs/API_REFERENCE.md)
- [Integration Guide](../docs/INTEGRATION.md)
- [Main README](../README.md)
