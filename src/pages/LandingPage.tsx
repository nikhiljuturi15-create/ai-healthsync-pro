import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Activity,
  Bot,
  Calendar,
  VideoIcon,
  Shield,
  Globe,
  Smartphone,
  Heart,
  ChevronRight,
  Star,
  Users,
  Award,
  Zap,
  ArrowUpRight,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Pill,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const features = [
  {
    icon: Bot,
    title: 'AI Symptom Analysis',
    description: 'Get instant AI-powered insights about your symptoms and recommendations for next steps.',
    color: 'primary',
  },
  {
    icon: VideoIcon,
    title: 'Video Consultations',
    description: 'Connect with certified doctors from anywhere through secure HD video calls.',
    color: 'secondary',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-optimized appointment scheduling that finds the best time for you.',
    color: 'accent',
  },
  {
    icon: Shield,
    title: 'Secure Health Records',
    description: 'Your medical history stored safely with end-to-end encryption.',
    color: 'success',
  },
  {
    icon: Pill,
    title: 'Prescription Management',
    description: 'Digital prescriptions with automated medication reminders.',
    color: 'warning',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Available in English, Telugu, and Hindi for seamless healthcare access.',
    color: 'primary',
  },
];

const stats = [
  { label: 'Patients Served', value: '50,000+' },
  { label: 'Certified Doctors', value: '500+' },
  { label: 'AI Analyses', value: '100,000+' },
  { label: 'User Rating', value: '4.9/5' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Patient',
    content: 'The AI symptom checker helped me understand my condition before my appointment. The doctors are professional and caring.',
    rating: 5,
  },
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Cardiologist',
    content: 'HealthSync has transformed how I manage my practice. The AI prescription generator saves hours of work.',
    rating: 5,
  },
  {
    name: 'Anitha Reddy',
    role: 'Patient',
    content: 'Being able to consult doctors in Telugu made everything so much easier. Excellent platform!',
    rating: 5,
  },
];

export function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-dark-900 dark:text-white">
                HealthSync
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-dark-600 dark:text-dark-300 hover:text-primary-600 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-dark-600 dark:text-dark-300 hover:text-primary-600 transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-dark-600 dark:text-dark-300 hover:text-primary-600 transition-colors">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            style={{ y }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="primary" size="lg" className="mb-6">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Healthcare Platform
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-dark-900 dark:text-white mb-6"
            >
              The Future of{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                Digital Healthcare
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-dark-600 dark:text-dark-400 mb-10 max-w-2xl mx-auto"
            >
              Experience intelligent healthcare with AI-powered symptom analysis, seamless video consultations,
              and comprehensive health management all in one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/signup">
                <Button size="lg" rightIcon={<ArrowUpRight className="w-5 h-5" />}>
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" leftIcon={<Users className="w-5 h-5" />}>
                  Login as Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16"
          >
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden border border-dark-200 dark:border-dark-700">
                <div className="flex items-center gap-2 px-4 py-3 bg-dark-100 dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error-500" />
                    <div className="w-3 h-3 rounded-full bg-warning-500" />
                    <div className="w-3 h-3 rounded-full bg-success-500" />
                  </div>
                  <span className="text-sm text-dark-500">healthsync.pro/dashboard</span>
                </div>
                <img
                  src="https://images.pexels.com/photo-1576091160550-2173dba999ef?auto=compress&cs=tinysrgb&w=1200"
                  alt="Dashboard Preview"
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-display font-bold text-primary-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-dark-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge variant="secondary" size="lg" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-dark-600 dark:text-dark-400">
              Powered by cutting-edge AI technology, our platform brings healthcare into the digital age.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card hover padding="lg" className="h-full">
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-lg text-dark-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-dark-500">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge variant="accent" size="lg" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-dark-600 dark:text-dark-400">
              See what our patients and healthcare providers have to say about HealthSync.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card padding="lg" className="h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-warning-400 text-warning-400" />
                    ))}
                  </div>
                  <p className="text-dark-700 dark:text-dark-300 mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-dark-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-dark-500">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 p-8 sm:p-12 lg:p-16 text-center text-white"
          >
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of patients and healthcare providers who trust HealthSync for their digital healthcare needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-dark-100">
                    Get Started Free
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-display font-bold">HealthSync</span>
              </Link>
              <p className="text-dark-400 text-sm">
                Transforming healthcare with artificial intelligence and seamless digital experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2 text-dark-400 text-sm">
                <li><Link to="#" className="hover:text-white">Find Doctor</Link></li>
                <li><Link to="#" className="hover:text-white">Symptom Checker</Link></li>
                <li><Link to="#" className="hover:text-white">Health Records</Link></li>
                <li><Link to="#" className="hover:text-white">Video Consultation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Doctors</h4>
              <ul className="space-y-2 text-dark-400 text-sm">
                <li><Link to="#" className="hover:text-white">Join as Doctor</Link></li>
                <li><Link to="#" className="hover:text-white">AI Prescription</Link></li>
                <li><Link to="#" className="hover:text-white">Patient Management</Link></li>
                <li><Link to="#" className="hover:text-white">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-dark-400 text-sm">
                <li><Link to="#" className="hover:text-white">About Us</Link></li>
                <li><Link to="#" className="hover:text-white">Careers</Link></li>
                <li><Link to="#" className="hover:text-white">Contact</Link></li>
                <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-dark-400 text-sm">
              © 2024 AI HealthSync Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-dark-400 text-sm">Made with</span>
              <Heart className="w-4 h-4 text-error-500 fill-error-500" />
              <span className="text-dark-400 text-sm">for better healthcare</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
