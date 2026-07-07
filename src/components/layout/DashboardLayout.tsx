import { useState, ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar, getNavItems } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-dark-200 border-t-primary-500"
        />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  const navItems = getNavItems(profile.role);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar items={navItems} />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar items={navItems} />
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="lg:pl-[280px] transition-all duration-300">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children || <Outlet />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
