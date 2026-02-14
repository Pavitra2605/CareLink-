# CareLink Frontend - Production-Grade React Application

A modern, scalable React 18 + TypeScript frontend for the CareLink healthcare management system. Built with Vite, TailwindCSS, React Router, React Query, Zustand, and Framer Motion.

**Status**:  **Phase 1 Foundation Complete** | **436 KB JavaScript** | **Zero TypeScript Errors**

---

##  Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Project Structure](#project-structure)
- [Component Library](#component-library)

---

##  Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Test Credentials**:
- **Patient**: john@example.com / password123
- **Doctor**: doctor@example.com / password123

---

##  Features (Phase 1 - Foundation Complete)

### Authentication System 
- JWT token management with refresh
- Persistent auth state (Zustand + localStorage)
- Protected routes with role-based guards
- Automatic redirect for unauthenticated users
- Login & Registration pages with validation

### Global Infrastructure 
- **Centralized API Client**: Axios with JWT auto-attach
- **State Management**: Zustand stores (auth, UI)
- **Server State**: React Query with 5min cache
- **Error Handling**: Global error boundary
- **Notifications**: Toast system with animations
- **Loading States**: Global and component-specific

### Styling System 
- **TailwindCSS v3**: Production-ready utility classes
- **Dark Mode**: Built-in dark/light theme support
- **Design System**: Consistent badges, buttons, cards, inputs
- **Animations**: Framer Motion for transitions
- **Responsive**: Mobile-first design

### Pages Implemented 
- **Login Page**: Email/password authentication
- **Register Page**: User registration with role selection
- **Dashboard**: Role-aware welcome screen
- **Error Handling**: 404, 403, and error boundary pages

---

##  Architecture

### Tech Stack
- **React 18**: Latest with concurrent features
- **TypeScript 5.3**: Strict mode enabled
- **Vite 7.3**: Lightning-fast dev & build
- **TailwindCSS 3**: Utility-first CSS
- **React Router v6**: Client-side routing
- **React Query**: Server state management
- **Zustand**: Lightweight store management
- **Framer Motion**: Smooth animations
- **Axios**: HTTP client with interceptors
- **Lucide React**: Modern icon library

### Feature-Based Architecture
```
src/
 api/               # API clients & services
 app/               # Global stores & config
    stores/        # Zustand stores
    queryClient.ts # React Query setup
 features/          # Feature modules
    auth/          # Authentication feature
    triage/        # Triage feature (Phase 2)
    consultations/ # Consultations (Phase 2)
    timeline/      # Timeline view (Phase 2)
    emergency/     # Emergency handling (Phase 2)
    admin/         # Admin dashboard (Phase 2)
    shared/        # Shared pages & components
 components/        # Reusable UI components
 layouts/           # Layout wrappers
 hooks/             # Custom React hooks
 utils/             # Utility functions
 routes/            # Route definitions
 index.css          # Global Tailwind styles
```

### Data Flow
```
Component
   useAuth() from AuthStore
   useToast() from UIStore  
   useQuery() from React Query
   Custom Hooks
     API Client (Axios with JWT)
       Backend API
```

---

##  Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your backend URL:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

---

##  Development

### Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (HMR enabled) |
| `npm run build` | Compile TypeScript & build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint (configured in eslint.config.js) |
| `npm run type-check` | Check TypeScript types |

### Development Workflow

1. **Create Feature**
   - Add folder in `src/features/{feature-name}/`
   - Create `pages/`, `components/`, `services/` subdirs

2. **Create Page**
   - Component in `src/features/{name}/pages/{Name}Page.tsx`
   - Add route to `App.tsx`

3. **Create Component**
   - Add to `src/components/` for reusables
   - Or to feature''s components folder

4. **Create API Service**
   - Add to `src/api/{feature}.api.ts`
   - Export typed functions
   - Use axios client instance

5. **Use in Component**
   - Import from `@/api`, `@/hooks`, `@/components`
   - Leverage path aliases for clean imports

### Hot Module Replacement
Dev server automatically reloads code changes. CSS and components update without full reload.

---

##  Build & Deployment

### Production Build
```bash
npm run build
```

Outputs to `dist/`:
- `dist/index.html` - Application entry
- `dist/assets/` - Bundled JS and CSS
- Total size: ~437 KB JS + 25 KB CSS (gzipped)

### Preview Built App
```bash
npm run preview
```

### Deploy to Production

**Vercel** (Recommended):
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Docker**:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

---

##  Project Structure

### `/src/api`
Centralized API clients using Axios with JWT interceptor.

- **client.ts** - Axios instance with auto token attach
- **auth.api.ts** - Authentication endpoints
- **(feature).api.ts** - Feature-specific endpoints

### `/src/app`
Global application setup and configuration.

- **stores/** - Zustand stores
  - `auth.store.ts` - User auth state
  - `ui.store.ts` - UI state (loading, toasts)
- **queryClient.ts** - React Query configuration

### `/src/features`
Feature modules with complete isolation.

Each feature has:
- **pages/** - Page components
- **components/** - Feature-specific components
- **services/** - Business logic (if needed)
- **types.ts** - Feature types (if needed)

### `/src/components`
Reusable UI components.

- **Toast.tsx** - Toast notification system
- **Loading.tsx** - Loading spinner
- **ErrorBoundary.tsx** - Error catching component

### `/src/hooks`
Custom React hooks for business logic.

- **useAuth.ts** - Auth helpers and status
- **useToast.ts** - Toast notification helper
- **index.ts** - Barrel export

### `/src/routes`
Route protection and guards.

- **ProtectedRoute.tsx** - Role-based route guard
- **PublicRoute.tsx** - Auth-protected public routes

### `/src/utils`
Utility functions for common operations.

- Format, parse, validate helpers
- Constants and enums

---

##  Component Library

### Pre-built Components

#### Buttons
```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-danger">Danger</button>
<button className="btn btn-success">Success</button>
```

#### Cards
```jsx
<div className="card">Card content</div>
<div className="card-hover">Hoverable card</div>
```

#### Badges
```jsx
<span className="badge-low">Low</span>
<span className="badge-medium">Medium</span>
<span className="badge-high">High</span>
<span className="badge-emergency">Emergency</span>
<span className="badge-requested">Requested</span>
<span className="badge-completed">Completed</span>
```

#### Inputs
```jsx
<input className="input" placeholder="Text input" />
<textarea className="input" placeholder="Text area" />
<select className="input">
  <option>Option</option>
</select>
```

#### Alerts
```jsx
<div className="alert-info">ℹ Info message</div>
<div className="alert-warning"> Warning message</div>
<div className="alert-error"> Error message</div>
<div className="alert-success"> Success message</div>
```

#### Loading
```jsx
<Loading size="md" fullScreen={false} message="Loading..." />
```

#### Toast
```jsx
const toast = useToast();
toast.success(''Success message!'');
toast.error(''Error message!'');
toast.warning(''Warning!'');
toast.info(''Info!'');
```

---

##  Type Safety

All APIs are fully typed:

```typescript
// API call with types
const { data } = await authAPI.login({ email, password });
// data: { token, refreshToken, user }

// Store with types
const { user, login, logout } = useAuthStore();
// user: User | null
// login: (email, password) => Promise<void>

// Hook with types
const { isAuthenticated, isPatient, hasRole } = useAuth();
// All return boolean | function
```

---

##  Performance

- **Code Splitting**: Automatic per-route bundling
- **Lazy Loading**: Routes loaded on demand
- **Caching**: 5-minute query cache
- **Optimization**: Tree-shaking, minification, gzip
- **Bundle Size**: 437 KB JS + 25 KB CSS (gzipped)

---

##  Next Steps (Phase 2 - Core Dashboards)

- [ ] Patient Triage Form
- [ ] Doctor Consultation Queue
- [ ] Admin Analytics Dashboard
- [ ] Timeline Visualization
- [ ] Emergency Alert Banner
- [ ] Medical Records Interface

---

##  Contributing

1. Create feature branch: `git checkout -b feat/feature-name`
2. Follow folder structure conventions
3. Use TypeScript strict mode
4. Write components as functional with hooks
5. Keep business logic in services/hooks
6. Commit: `git commit -am ''feat: description''`

---

##  Links

- **Backend**: [CareLink Backend](../backend)
- **API Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

---

##  License

[Specify your license]

---

**Last Updated**: February 2025  
**Status**: Phase 1 Foundation Complete - Ready for Phase 2 Implementation
