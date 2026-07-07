import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Activity, ArrowRight, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/FormElements';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { UserRole } from '../../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        // Get the user role from localStorage
        const storedUser = localStorage.getItem('healthsync_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const role = user?.role || 'patient';

        // Redirect to appropriate dashboard
        navigate(`/${role}`, { replace: true });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
        <div className="absolute inset-0 bg-grid opacity-10" />
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">{t('appName')}</h1>
                <p className="text-white/80">{t('tagline')}</p>
              </div>
            </div>

            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Transforming Healthcare<br />
              <span className="text-white/80">with AI Intelligence</span>
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-md">
              Connect with top doctors, get AI-powered health insights, and manage your medical journey all in one place.
            </p>

            <div className="space-y-4">
              {[
                { icon: '🩺', text: 'AI-Powered Symptom Analysis' },
                { icon: '📅', text: 'Smart Appointment Scheduling' },
                { icon: '💊', text: 'Digital Prescriptions & Reminders' },
                { icon: '📹', text: 'HD Video Consultations' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-center gap-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-dark-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">HealthSync</h1>
              <p className="text-sm text-dark-500">Pro Edition</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-dark-500 mt-2">
              Sign in to access your health dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-error-50 dark:bg-error-900/20 text-error-600 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <Input
              type="email"
              label={t('email')}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type="password"
              label={t('password')}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-dark-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-sm text-dark-600 dark:text-dark-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                {t('forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              {t('signIn')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-500">
              {t('noAccount')}{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                {t('signUp')}
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
            <p className="text-xs text-dark-500 text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => setEmail('admin@health.ai')} className="p-2 bg-white dark:bg-dark-700 rounded-lg text-dark-600 dark:text-dark-300 hover:border-primary-300 border border-transparent transition-colors">
                Admin
              </button>
              <button onClick={() => setEmail('doctor@health.ai')} className="p-2 bg-white dark:bg-dark-700 rounded-lg text-dark-600 dark:text-dark-300 hover:border-primary-300 border border-transparent transition-colors">
                Doctor
              </button>
              <button onClick={() => setEmail('patient@health.ai')} className="p-2 bg-white dark:bg-dark-700 rounded-lg text-dark-600 dark:text-dark-300 hover:border-primary-300 border border-transparent transition-colors">
                Patient
              </button>
              <button onClick={() => setEmail('receptionist@health.ai')} className="p-2 bg-white dark:bg-dark-700 rounded-lg text-dark-600 dark:text-dark-300 hover:border-primary-300 border border-transparent transition-colors">
                Receptionist
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      // Navigate to appropriate dashboard
      setTimeout(() => {
        navigate(`/${role}`, { replace: true });
      }, 100);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-950 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-white dark:bg-dark-800 rounded-2xl shadow-xl text-center"
        >
          <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-2">
            Account Created!
          </h2>
          <p className="text-dark-500 mb-6">
            Please check your email to verify your account.
          </p>
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">{t('appName')}</h1>
              <p className="text-sm text-dark-500">{t('tagline')}</p>
            </div>
          </Link>
          <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
            {t('createAccount')}
          </h2>
          <p className="text-dark-500 mt-2">
            Join the future of healthcare management
          </p>
        </div>

        <div className="p-8 bg-white dark:bg-dark-800 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-error-50 dark:bg-error-900/20 text-error-600 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <Input
              label={t('fullName')}
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <Input
              type="email"
              label={t('email')}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Select
              label="I am a..."
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { value: 'patient', label: 'Patient' },
                { value: 'doctor', label: 'Doctor' },
                { value: 'receptionist', label: 'Receptionist' },
              ]}
            />

            <Input
              type="password"
              label={t('password')}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <Input
              type="password"
              label={t('confirmPassword')}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              {t('signUp')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-xs text-dark-500 text-center mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <p className="text-center text-dark-500 mt-6">
          {t('hasAccount')}{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            {t('signIn')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
