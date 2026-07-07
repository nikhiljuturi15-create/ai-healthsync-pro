import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Home,
  ClipboardList,
  Stethoscope,
  VideoIcon,
  BarChart3,
  Bell,
  Shield,
  LayoutDashboard,
  Bot,
  AlertCircle,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  title?: string;
}

export function Sidebar({ items, title }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="h-screen fixed left-0 top-0 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 flex flex-col z-40"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-200 dark:border-dark-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display font-bold text-lg text-dark-900 dark:text-white">HealthSync</h1>
              <p className="text-xs text-dark-500">Pro Edition</p>
            </motion.div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-dark-400 hover:text-dark-600 hover:bg-dark-100 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <Link key={item.id} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-primary-500/10 text-primary-600 font-medium'
                      : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${isActive
                      ? 'bg-primary-500/20'
                      : 'group-hover:bg-dark-200 dark:group-hover:bg-dark-700'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge variant="error" size="sm">{item.badge}</Badge>
                      )}
                    </>
                  )}
                  {collapsed && item.badge !== undefined && item.badge > 0 && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-error-500 rounded-full" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-dark-200 dark:border-dark-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-dark-50 dark:bg-dark-800">
          <Avatar
            src={profile?.avatar_url}
            name={profile?.full_name}
            size="sm"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
                {profile?.full_name}
              </p>
              <p className="text-xs text-dark-500 capitalize">{profile?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="p-2 rounded-lg text-dark-400 hover:text-error-500 hover:bg-error-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

export function getNavItems(role: string): NavItem[] {
  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
    { id: 'patients', label: 'Patients', icon: Users, path: '/admin/patients' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const doctorNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/doctor' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { id: 'patients', label: 'My Patients', icon: Users, path: '/doctor/patients' },
    { id: 'consultations', label: 'Video Consults', icon: VideoIcon, path: '/doctor/consultations' },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, path: '/doctor/prescriptions' },
    { id: 'ai-assist', label: 'AI Assist', icon: Bot, path: '/doctor/ai-assist' },
    { id: 'schedule', label: 'My Schedule', icon: ClipboardList, path: '/doctor/schedule' },
  ];

  const patientNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/patient' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/patient/appointments' },
    { id: 'symptom-checker', label: 'Symptom Checker', icon: Bot, path: '/patient/symptom-checker' },
    { id: 'health-records', label: 'Health Records', icon: Activity, path: '/patient/health-records' },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, path: '/patient/prescriptions' },
    { id: 'reports', label: 'Medical Reports', icon: FileText, path: '/patient/reports' },
    { id: 'consultations', label: 'Video Consults', icon: VideoIcon, path: '/patient/consultations' },
    { id: 'chat', label: 'Health Assistant', icon: MessageSquare, path: '/patient/chat' },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle, path: '/patient/emergency' },
  ];

  const receptionistNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/receptionist' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/receptionist/appointments' },
    { id: 'patients', label: 'Patient Registration', icon: Users, path: '/receptionist/patients' },
    { id: 'doctors', label: 'Doctor Schedule', icon: Stethoscope, path: '/receptionist/doctors' },
    { id: 'queue', label: 'Queue Management', icon: ClipboardList, path: '/receptionist/queue' },
  ];

  switch (role) {
    case 'admin':
      return adminNav;
    case 'doctor':
      return doctorNav;
    case 'patient':
      return patientNav;
    case 'receptionist':
      return receptionistNav;
    default:
      return patientNav;
  }
}
