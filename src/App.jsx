import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InvoicingPage from './pages/InvoicingPage';
import CatalogPage from './pages/CatalogPage';
import PaymentsPage from './pages/PaymentsPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

function AppShell({ children, currentPage }) {
  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} />
      <div className="main-area">
        <Topbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ loggedIn, children }) => {
  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    // Check local storage robustly for any auth indicator
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    // If either token or user string exists and is not an empty string, we consider them logged in
    return Boolean(token || (userStr && userStr !== '{}'));
  });
console.log(loggedIn)
  return (
    <BrowserRouter>
          <AuthProvider>
      <Routes>
        <Route path="/" element={
          loggedIn ? <Navigate to="/invoicing" replace /> : <LoginPage onLogin={() => setLoggedIn(true)} />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute loggedIn={loggedIn}>
            <AppShell currentPage="dashboard"><DashboardPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/invoicing" element={
          <ProtectedRoute loggedIn={loggedIn}>
            <AppShell currentPage="invoicing"><InvoicingPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/catalog" element={
          <ProtectedRoute loggedIn={loggedIn}>
            <AppShell currentPage="catalog"><CatalogPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute loggedIn={loggedIn}>
            <AppShell currentPage="payments"><PaymentsPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute loggedIn={loggedIn}>
            <AppShell currentPage="orders"><OrdersPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute loggedIn={loggedIn}>
            <AppShell currentPage="customers"><CustomersPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
