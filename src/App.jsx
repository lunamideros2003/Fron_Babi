import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import WeekPage from './pages/WeekPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import RemindersPage from './pages/RemindersPage.jsx';
import TrackingPage from './pages/TrackingPage.jsx';
import { BrandMark } from './components/Icons.jsx';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <BrandMark size={48} />
      <div className="loader" />
      <p>Cargando tu embarazo...</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/entrar" state={{ from: location }} replace />;

  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/entrar"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/semana"
            element={
              <ProtectedRoute>
                <WeekPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/asistente"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citas"
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recordatorios"
            element={
              <ProtectedRoute>
                <RemindersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seguimiento"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
