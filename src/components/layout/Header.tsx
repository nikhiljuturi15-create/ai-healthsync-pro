import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Globe,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, Language } from '../../contexts/LanguageContext';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMenuClick?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function Header({ sidebarCollapsed, onMenuClick, showSearch = true, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { profile, signOut } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New Appointment', message: 'John Doe booked a consultation', time: '5m ago', read: false },
    { id: 2, title: 'Prescription Reminder', message: 'Patient needs refill approval', time: '1h ago', read: false },
    { id: 3, title: 'Lab Results Ready', message: 'Blood test results for Sarah...', time: '2h ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  const languageOptions: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिंदी' },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
      setShowSearchInput(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header
      className="h-16 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30"
      style={{ marginLeft: '0px' }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-dark-600 hover:bg-dark-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        {showSearch && (
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-64 pl-10 pr-4 py-2 rounded-lg bg-dark-50 dark:bg-dark-800 border border-transparent focus:border-primary-500 text-sm outline-none transition-all"
            />
          </div>
        )}

        <button
          className="md:hidden p-2 rounded-lg text-dark-600 hover:bg-dark-100"
          onClick={(e) => {
            e.stopPropagation();
            setShowSearchInput(!showSearchInput);
          }}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="relative hidden sm:block">
          <button
            className="p-2.5 rounded-lg text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          <div className="absolute right-0 mt-2 w-32 py-2 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-dark-200 dark:border-dark-700 hidden group-hover:block">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full px-4 py-2 text-left text-sm ${
                  language === lang.code
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-dark-600 hover:bg-dark-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-lg text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
        >
          {actualTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 rounded-lg text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full animate-pulse" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-200 dark:border-dark-700 overflow-hidden"
              >
                <div className="p-4 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
                  <h3 className="font-semibold text-dark-900 dark:text-white">{t('notifications')}</h3>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    {t('markAllRead')}
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-dark-50 dark:hover:bg-dark-700/50 cursor-pointer border-l-2 ${
                        !notif.read ? 'border-primary-500 bg-primary-50/50' : 'border-transparent'
                      }`}
                    >
                      <p className="font-medium text-dark-900 dark:text-white text-sm">
                        {notif.title}
                      </p>
                      <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-dark-400 mt-2">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-dark-100 dark:border-dark-700">
                  <Link
                    to={`/${profile?.role}/notifications`}
                    className="block text-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-dark-900 dark:text-white">
                {profile?.full_name?.split(' ')[0]}
              </p>
              <p className="text-xs text-dark-500 capitalize">{profile?.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-200 dark:border-dark-700 overflow-hidden"
              >
                <div className="p-4 border-b border-dark-100 dark:border-dark-700">
                  <p className="font-semibold text-dark-900 dark:text-white">
                    {profile?.full_name}
                  </p>
                  <p className="text-sm text-dark-500">{profile?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate(`/${profile?.role}/profile`);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {t('profile')}
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/${profile?.role}/settings`);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    {t('settings')}
                  </button>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </button>
                </div>
                <div className="p-2 border-t border-dark-100 dark:border-dark-700">
                  <button
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('signOut')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showSearchInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-16 bg-white dark:bg-dark-900 p-4 border-b border-dark-200 dark:border-dark-800 md:hidden"
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-dark-900 dark:text-white"
                autoFocus
              />
              <button onClick={() => setShowSearchInput(false)}>
                <X className="w-5 h-5 text-dark-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
