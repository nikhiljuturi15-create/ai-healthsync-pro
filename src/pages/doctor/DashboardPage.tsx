import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Clock,
  FileText,
  VideoIcon,
  ChevronRight,
  Plus,
  TrendingUp,
  Activity,
  Bot,
  Pill,
  Stethoscope,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { useAuth } from '../../contexts/AuthContext';

// Sample data
const todaySchedule = [
  { id: 1, patient: 'Alice Johnson', time: '09:00 AM', type: 'Video Consultation', duration: 30, status: 'completed' },
  { id: 2, patient: 'Bob Williams', time: '10:00 AM', type: 'In-Person', duration: 45, status: 'in_progress' },
  { id: 3, patient: 'Carol Davis', time: '11:00 AM', type: 'Follow-up', duration: 30, status: 'scheduled' },
  { id: 4, patient: 'David Brown', time: '12:00 PM', type: 'Video Consultation', duration: 30, status: 'scheduled' },
  { id: 5, patient: 'Emma Wilson', time: '02:00 PM', type: 'New Patient', duration: 60, status: 'scheduled' },
];

const recentPatients = [
  { id: 1, name: 'Alice Johnson', lastVisit: '2 days ago', condition: 'Hypertension', nextAppointment: 'Dec 20' },
  { id: 2, name: 'Bob Williams', lastVisit: '1 week ago', condition: 'Diabetes Type 2', nextAppointment: 'Dec 25' },
  { id: 3, name: 'Carol Davis', lastVisit: '3 days ago', condition: 'Asthma', nextAppointment: 'Jan 5' },
  { id: 4, name: 'David Brown', lastVisit: '1 day ago', condition: 'Cardiac Arrhythmia', nextAppointment: 'Dec 18' },
];

const pendingPrescriptions = [
  { id: 1, patient: 'Alice Johnson', medication: 'Amlodipine 5mg', status: 'pending' },
  { id: 2, patient: 'Bob Williams', medication: 'Metformin 500mg', status: 'pending' },
  { id: 3, patient: 'Emma Wilson', medication: 'Atorvastatin 10mg', status: 'pending' },
];

export function DoctorDashboard() {
  const { profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'schedule' | 'patients'>('schedule');

  const stats = {
    todayAppointments: 8,
    completedToday: 3,
    totalPatients: 245,
    weeklyConsultations: 47,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-dark-900 dark:text-white"
          >
            Good morning, Dr. {profile?.full_name?.split(' ')[1]}!
          </motion.h1>
          <p className="text-dark-500 mt-1">You have {stats.todayAppointments} appointments scheduled today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<VideoIcon className="w-4 h-4" />}>
            Start Video Consult
          </Button>
          <Button leftIcon={<Bot className="w-4 h-4" />} as={Link} to="/doctor/ai-assist">
            AI Prescription
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          change={`${stats.completedToday} completed`}
          changeType="positive"
          icon={<Calendar className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="My Patients"
          value={stats.totalPatients}
          change="+12 this month"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
          color="secondary"
        />
        <StatCard
          title="Weekly Consultations"
          value={stats.weeklyConsultations}
          change="+8% vs last week"
          changeType="positive"
          icon={<VideoIcon className="w-5 h-5" />}
          color="accent"
        />
        <StatCard
          title="Patient Satisfaction"
          value="4.8"
          change="Based on 156 reviews"
          changeType="neutral"
          icon={<TrendingUp className="w-5 h-5" />}
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-5 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white">Today's Schedule</h3>
              <p className="text-sm text-dark-500">Your appointments for today</p>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              View Calendar
            </Button>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-700">
            {todaySchedule.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors ${
                  apt.status === 'in_progress' ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-semibold text-dark-900 dark:text-white">{apt.time}</p>
                    <p className="text-xs text-dark-500">{apt.duration} min</p>
                  </div>
                  <div className="w-px h-12 bg-dark-200 dark:bg-dark-700" />
                  <Avatar name={apt.patient} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 dark:text-white">{apt.patient}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {apt.type === 'Video Consultation' && <VideoIcon className="w-3 h-3 text-primary-600" />}
                      {apt.type === 'In-Person' && <Users className="w-3 h-3 text-secondary-600" />}
                      <span className="text-sm text-dark-500">{apt.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        apt.status === 'completed' ? 'success' :
                        apt.status === 'in_progress' ? 'warning' : 'default'
                      }
                    >
                      {apt.status.replace('_', ' ')}
                    </Badge>
                    {apt.status === 'scheduled' && (
                      <Button size="sm" variant="primary">
                        {apt.type === 'Video Consultation' ? 'Join' : 'Start'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Prescriptions */}
          <Card padding="none">
            <div className="p-5 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-accent-600" />
                <h3 className="font-semibold text-dark-900 dark:text-white">Pending Approvals</h3>
              </div>
              <Badge variant="warning">{pendingPrescriptions.length}</Badge>
            </div>
            <div className="p-4 space-y-3">
              {pendingPrescriptions.map((rx) => (
                <div key={rx.id} className="flex items-center gap-3 p-3 rounded-lg bg-dark-50 dark:bg-dark-800">
                  <Avatar name={rx.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 dark:text-white truncate">{rx.patient}</p>
                    <p className="text-xs text-dark-500">{rx.medication}</p>
                  </div>
                  <Button size="sm" variant="primary">Approve</Button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-dark-100 dark:border-dark-700">
              <Button variant="ghost" size="sm" className="w-full" as={Link} to="/doctor/prescriptions">
                View All Prescriptions
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card padding="lg">
            <h3 className="font-semibold text-dark-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Bot, label: 'Generate Prescription', color: 'primary' },
                { icon: FileText, label: 'View Lab Reports', color: 'accent' },
                { icon: Users, label: 'Add New Patient', color: 'secondary' },
                { icon: Calendar, label: 'Block Schedule', color: 'warning' },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start"
                  leftIcon={<action.icon className="w-4 h-4" />}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Patients */}
      <Card padding="none">
        <div className="p-5 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-dark-900 dark:text-white">Recent Patients</h3>
            <p className="text-sm text-dark-500">Patients you've consulted recently</p>
          </div>
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />} as={Link} to="/doctor/patients">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">Condition</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">Last Visit</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">Next Appointment</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {recentPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={patient.name} size="sm" />
                      <span className="font-medium text-dark-900 dark:text-white">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-600 dark:text-dark-400">{patient.condition}</td>
                  <td className="px-6 py-4 text-dark-600 dark:text-dark-400">{patient.lastVisit}</td>
                  <td className="px-6 py-4">
                    <Badge variant="primary" size="sm">{patient.nextAppointment}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">View Record</Button>
                      <Button size="sm" variant="outline">Video Call</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
