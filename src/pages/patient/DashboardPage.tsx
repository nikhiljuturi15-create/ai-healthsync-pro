import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Heart,
  Bell,
  ChevronRight,
  Clock,
  FileText,
  Pill,
  TrendingUp,
  User,
  VideoIcon,
  Bot,
  AlertTriangle,
  Plus,
  Download,
  QrCode,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Progress, CircularProgress } from '../../components/ui/Progress';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// Sample health data
const vitalSignsHistory = [
  { date: 'Mon', weight: 72, bp: 120, heartRate: 72, glucose: 95 },
  { date: 'Tue', weight: 71.5, bp: 118, heartRate: 75, glucose: 98 },
  { date: 'Wed', weight: 71.8, bp: 122, heartRate: 70, glucose: 92 },
  { date: 'Thu', weight: 72.2, bp: 121, heartRate: 73, glucose: 96 },
  { date: 'Fri', weight: 71.9, bp: 119, heartRate: 71, glucose: 94 },
  { date: 'Sat', weight: 71.6, bp: 120, heartRate: 74, glucose: 97 },
  { date: 'Sun', weight: 71.8, bp: 118, heartRate: 72, glucose: 95 },
];

const upcomingAppointments = [
  { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'Cardiologist', date: 'Tomorrow', time: '10:00 AM', type: 'Video', status: 'confirmed' },
  { id: 2, doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Dec 15', time: '2:30 PM', type: 'In-Person', status: 'scheduled' },
];

const activeMedications = [
  { id: 1, name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', nextDose: '8:00 AM', progress: 75 },
  { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: '2:00 PM', progress: 50 },
  { id: 3, name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', nextDose: '9:00 AM', progress: 90 },
];

const recentReports = [
  { id: 1, name: 'Blood Test Report', date: 'Dec 5, 2024', type: 'blood_test', status: 'normal' },
  { id: 2, name: 'Lipid Profile', date: 'Dec 1, 2024', type: 'blood_test', status: 'attention' },
  { id: 3, name: 'ECG Report', date: 'Nov 28, 2024', type: 'ecg', status: 'normal' },
];

export function PatientDashboard() {
  const { profile, patientProfile } = useAuth();
  const { actualTheme } = useTheme();
  const [showQR, setShowQR] = useState(false);

  const healthScore = 85;
  const patientQRId = `HS-${profile?.id?.slice(0, 8).toUpperCase() || 'DEMO'}`;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-dark-900 dark:text-white"
          >
            Hello, {profile?.full_name?.split(' ')[0]}!
          </motion.h1>
          <p className="text-dark-500 mt-1">Here's your health overview for today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<QrCode className="w-4 h-4" />} onClick={() => setShowQR(!showQR)}>
            My QR ID
          </Button>
          <Button leftIcon={<Bot className="w-4 h-4" />} as={Link} to="/patient/symptom-checker">
            Check Symptoms
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/50 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <Card className="p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-dark-900 dark:text-white mb-4">Your Patient ID</h3>
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <QRCodeSVG value={patientQRId} size={200} />
            </div>
            <p className="text-2xl font-mono font-bold text-dark-900 dark:text-white">{patientQRId}</p>
            <p className="text-sm text-dark-500 mt-2">Show this at the clinic</p>
          </Card>
        </motion.div>
      )}

      {/* Health Score & Vitals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Health Score Card */}
        <Card padding="lg" className="lg:row-span-2">
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-dark-600 dark:text-dark-400 mb-4">Overall Health Score</h3>
            <CircularProgress
              value={healthScore}
              max={100}
              size={140}
              strokeWidth={12}
              variant={healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'error'}
            />
            <p className="mt-4 text-sm text-dark-500 text-center">
              Based on your vital signs, activity, and medical history
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 w-full">
              <div className="text-center p-2 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <p className="text-lg font-bold text-success-600">12</p>
                <p className="text-xs text-dark-500">Good Days</p>
              </div>
              <div className="text-center p-2 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                <p className="text-lg font-bold text-warning-600">2</p>
                <p className="text-xs text-dark-500">Alerts</p>
              </div>
              <div className="text-center p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-lg font-bold text-primary-600">95%</p>
                <p className="text-xs text-dark-500">Adherence</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Vital Signs */}
        <StatCard
          title="Blood Pressure"
          value="120/80"
          change="mmHg - Normal"
          changeType="positive"
          icon={<Heart className="w-5 h-5" />}
          color="error"
        />
        <StatCard
          title="Heart Rate"
          value="72"
          change="bpm - Normal"
          changeType="positive"
          icon={<Activity className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Blood Glucose"
          value="95"
          change="mg/dL - Normal"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
          color="accent"
        />
        <StatCard
          title="Weight"
          value="71.8"
          change="kg - -0.5 this week"
          changeType="positive"
          icon={<User className="w-5 h-5" />}
          color="secondary"
        />
        <StatCard
          title="BMI"
          value="22.4"
          change="Healthy Range"
          changeType="positive"
          icon={<Activity className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Next Checkup"
          value="Dec 15"
          change="In 10 days"
          changeType="neutral"
          icon={<Calendar className="w-5 h-5" />}
          color="primary"
        />
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals Trend Chart */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white">Health Trends</h3>
              <p className="text-sm text-dark-500">Your vital signs over the past week</p>
            </div>
            <div className="flex gap-2">
              {['weight', 'bp', 'heartRate'].map((metric) => (
                <button
                  key={metric}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {metric === 'weight' && 'Weight'}
                  {metric === 'bp' && 'BP'}
                  {metric === 'heartRate' && 'Heart Rate'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalSignsHistory}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Medications */}
        <Card padding="none">
          <div className="p-5 border-b border-dark-100 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-dark-900 dark:text-white">Active Medications</h3>
              <Badge variant="primary" size="sm">{activeMedications.length}</Badge>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {activeMedications.map((med) => (
              <div key={med.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-dark-900 dark:text-white text-sm">{med.name}</p>
                      <p className="text-xs text-dark-500">{med.dosage} - {med.frequency}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-500">Next dose: {med.nextDose}</span>
                  <span className="text-primary-600 font-medium">{med.progress}%</span>
                </div>
                <Progress value={med.progress} size="sm" />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-dark-100 dark:border-dark-700">
            <Button variant="ghost" size="sm" className="w-full" as={Link} to="/patient/prescriptions">
              View All Medications
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card padding="none">
          <div className="p-5 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white">Upcoming Appointments</h3>
              <p className="text-sm text-dark-500">Your scheduled consultations</p>
            </div>
            <Button variant="ghost" size="sm" as={Link} to="/patient/appointments">
              Book New
              <Plus className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-700">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar name={apt.doctor} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 dark:text-white">{apt.doctor}</p>
                    <p className="text-sm text-dark-500">{apt.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-dark-900 dark:text-white">{apt.date}</p>
                    <p className="text-sm text-dark-500">{apt.time}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={apt.status === 'confirmed' ? 'success' : 'primary'} size="sm">
                      {apt.status}
                    </Badge>
                    <span className="text-xs text-dark-400">
                      {apt.type === 'Video' ? <VideoIcon className="w-3 h-3 inline" /> : <User className="w-3 h-3 inline" />}
                      {apt.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card padding="none">
          <div className="p-5 border-b border-dark-100 dark:border-dark-700 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white">Recent Reports</h3>
              <p className="text-sm text-dark-500">Your medical records and test results</p>
            </div>
            <Button variant="ghost" size="sm" as={Link} to="/patient/reports">
              Upload Report
              <Plus className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-700">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${report.type === 'blood_test' ? 'bg-error-100 text-error-600' : ''}
                    ${report.type === 'ecg' ? 'bg-primary-100 text-primary-600' : ''}
                  `}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 dark:text-white">{report.name}</p>
                    <p className="text-sm text-dark-500">{report.date}</p>
                  </div>
                  <Badge
                    variant={report.status === 'normal' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {report.status === 'normal' ? 'Normal' : 'Needs Attention'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Emergency Alert Banner */}
      <Card className="bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-error-100 dark:bg-error-900/50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-error-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-error-900 dark:text-error-100">Emergency Assistance</h3>
            <p className="text-sm text-error-700 dark:text-error-300">In case of emergency, tap the alert button to notify your emergency contacts and nearby healthcare providers.</p>
          </div>
          <Button variant="danger" as={Link} to="/patient/emergency">
            Send Alert
          </Button>
        </div>
      </Card>
    </div>
  );
}
