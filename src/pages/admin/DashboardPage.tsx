import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  Bell,
  Clock,
  ArrowRight,
  Activity,
  UserPlus,
  Building2,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Sample data
const revenueData = [
  { month: 'Jan', revenue: 45000, appointments: 120 },
  { month: 'Feb', revenue: 52000, appointments: 145 },
  { month: 'Mar', revenue: 48000, appointments: 132 },
  { month: 'Apr', revenue: 61000, appointments: 168 },
  { month: 'May', revenue: 55000, appointments: 150 },
  { month: 'Jun', revenue: 67000, appointments: 185 },
];

const specialtyData = [
  { name: 'Cardiology', value: 25, color: '#3b82f6' },
  { name: 'Dermatology', value: 20, color: '#22c55e' },
  { name: 'Orthopedics', value: 18, color: '#f59e0b' },
  { name: 'Neurology', value: 15, color: '#8b5cf6' },
  { name: 'Pediatrics', value: 12, color: '#ec4899' },
  { name: 'Others', value: 10, color: '#64748b' },
];

const recentActivities = [
  { id: 1, type: 'appointment', user: 'John Doe', action: 'booked appointment', time: '5 min ago', avatar: null },
  { id: 2, type: 'doctor', user: 'Dr. Sarah Smith', action: 'joined the platform', time: '1 hour ago', avatar: null },
  { id: 3, type: 'consultation', user: 'Emma Wilson', action: 'completed video consultation', time: '2 hours ago', avatar: null },
  { id: 4, type: 'prescription', user: 'Dr. Michael Brown', action: 'issued new prescription', time: '3 hours ago', avatar: null },
];

const upcomingAppointments = [
  { id: 1, patient: 'Alice Johnson', doctor: 'Dr. Sarah Smith', time: '10:00 AM', type: 'Video Consultation', status: 'confirmed' },
  { id: 2, patient: 'Bob Williams', doctor: 'Dr. Michael Chen', time: '10:30 AM', type: 'In-Person', status: 'scheduled' },
  { id: 3, patient: 'Carol Davis', doctor: 'Dr. Emma Wilson', time: '11:00 AM', type: 'Follow-up', status: 'confirmed' },
];

export function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 1247,
    totalDoctors: 48,
    todayAppointments: 127,
    monthlyRevenue: 67000,
    revenueChange: '+12.5%',
    appointmentsChange: '+8.2%',
    patientsChange: '+15%',
    doctorsChange: '+5%',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-dark-900 dark:text-white"
          >
            Welcome back, {profile?.full_name?.split(' ')[0]}!
          </motion.h1>
          <p className="text-dark-500 mt-1">Here's what's happening with your clinic today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
          <Button leftIcon={<UserPlus className="w-4 h-4" />}>
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          change={stats.patientsChange + ' this month'}
          changeType="positive"
          icon={<Users className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors}
          change={stats.doctorsChange + ' this month'}
          changeType="positive"
          icon={<Stethoscope className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          change={stats.appointmentsChange + ' vs yesterday'}
          changeType="positive"
          icon={<Calendar className="w-6 h-6" />}
          color="accent"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change={stats.revenueChange + ' vs last month'}
          changeType="positive"
          icon={<DollarSign className="w-6 h-6" />}
          color="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Revenue Overview</h3>
              <p className="text-sm text-dark-500">Monthly revenue and appointments</p>
            </div>
            <select className="px-3 py-2 rounded-lg bg-dark-50 dark:bg-dark-700 text-sm border-none outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Specialty Distribution */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
            Doctor Specialties
          </h3>
          <p className="text-sm text-dark-500 mb-4">Distribution by specialization</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {specialtyData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-dark-600 dark:text-dark-400">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-5 border-b border-dark-100 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-dark-900 dark:text-white">Upcoming Appointments</h3>
                <p className="text-sm text-dark-500">Next scheduled consultations</p>
              </div>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </div>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-700">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <Avatar name={apt.patient} size="sm" />
                    <Avatar name={apt.doctor} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 dark:text-white truncate">
                      {apt.patient} with {apt.doctor}
                    </p>
                    <p className="text-sm text-dark-500">{apt.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-dark-900 dark:text-white">{apt.time}</p>
                    <Badge variant={apt.status === 'confirmed' ? 'success' : 'primary'} size="sm">
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="none">
          <div className="p-5 border-b border-dark-100 dark:border-dark-700">
            <h3 className="font-semibold text-dark-900 dark:text-white">Recent Activity</h3>
            <p className="text-sm text-dark-500">Latest platform updates</p>
          </div>
          <div className="p-4 space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  ${activity.type === 'appointment' ? 'bg-primary-100 text-primary-600' : ''}
                  ${activity.type === 'doctor' ? 'bg-secondary-100 text-secondary-600' : ''}
                  ${activity.type === 'consultation' ? 'bg-accent-100 text-accent-600' : ''}
                  ${activity.type === 'prescription' ? 'bg-warning-100 text-warning-600' : ''}
                `}>
                  {activity.type === 'appointment' && <Calendar className="w-4 h-4" />}
                  {activity.type === 'doctor' && <Stethoscope className="w-4 h-4" />}
                  {activity.type === 'consultation' && <VideoIcon className="w-4 h-4" />}
                  {activity.type === 'prescription' && <FileText className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-dark-500"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-dark-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card padding="lg">
        <h3 className="font-semibold text-dark-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: UserPlus, label: 'Add Doctor', color: 'primary' },
            { icon: Users, label: 'Add Patient', color: 'secondary' },
            { icon: Calendar, label: 'New Appointment', color: 'accent' },
            { icon: Building2, label: 'Add Clinic', color: 'success' },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-4 rounded-xl flex flex-col items-center gap-3
                bg-${action.color}-50 dark:bg-${action.color}-900/20
                hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30
                text-${action.color}-600 transition-colors
              `}
            >
              <action.icon className="w-6 h-6" />
              <span className="font-medium text-sm">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Missing import fix
import { Download } from 'lucide-react';
import { VideoIcon, FileText } from 'lucide-react';
