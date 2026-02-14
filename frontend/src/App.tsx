import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/app/queryClient';
import ErrorBoundary from '@/components/ErrorBoundary';
import Toast from '@/components/Toast';
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute';

// Pages - to be created
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import Dashboard from '@/features/shared/pages/Dashboard';
import UnauthorizedPage from '@/features/shared/pages/UnauthorizedPage';
import NotFoundPage from '@/features/shared/pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toast />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
