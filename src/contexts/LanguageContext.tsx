import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'te' | 'hi';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    appName: 'AI HealthSync Pro',
    tagline: 'The Future Digital Clinic',
    loading: 'Loading...',
    error: 'An error occurred',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    noResults: 'No results found',
    seeAll: 'See All',

    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    createAccount: 'Create Account',

    // Roles
    admin: 'Admin',
    doctor: 'Doctor',
    patient: 'Patient',
    receptionist: 'Receptionist',

    // Dashboard
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    overview: 'Overview',
    statistics: 'Statistics',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',

    // Appointments
    appointments: 'Appointments',
    newAppointment: 'New Appointment',
    upcomingAppointments: 'Upcoming Appointments',
    pastAppointments: 'Past Appointments',
    appointmentDate: 'Date',
    appointmentTime: 'Time',
    appointmentType: 'Type',
    appointmentStatus: 'Status',
    reschedule: 'Reschedule',
    cancelAppointment: 'Cancel Appointment',
    bookAppointment: 'Book Appointment',

    // Patients
    patients: 'Patients',
    patientRecords: 'Patient Records',
    medicalHistory: 'Medical History',
    personalInfo: 'Personal Information',
    emergencyContact: 'Emergency Contact',

    // Doctors
    doctors: 'Doctors',
    findDoctor: 'Find a Doctor',
    specialization: 'Specialization',
    experience: 'Experience',
    consultationFee: 'Consultation Fee',
    availability: 'Availability',

    // Health
    healthRecords: 'Health Records',
    vitalSigns: 'Vital Signs',
    bloodPressure: 'Blood Pressure',
    heartRate: 'Heart Rate',
    temperature: 'Temperature',
    weight: 'Weight',
    height: 'Height',
    bmi: 'BMI',
    bloodGlucose: 'Blood Glucose',
    oxygenSaturation: 'Oxygen Saturation',

    // Prescriptions
    prescriptions: 'Prescriptions',
    medications: 'Medications',
    dosage: 'Dosage',
    frequency: 'Frequency',
    duration: 'Duration',
    startDate: 'Start Date',
    endDate: 'End Date',
    reminders: 'Reminders',
    activeMedications: 'Active Medications',

    // Reports
    reports: 'Reports',
    uploadReport: 'Upload Report',
    bloodTest: 'Blood Test',
    xRay: 'X-Ray',
    mri: 'MRI',
    ctScan: 'CT Scan',
    ecg: 'ECG',
    ultrasound: 'Ultrasound',

    // AI Features
    symptomChecker: 'AI Symptom Checker',
    describeSymptoms: 'Describe your symptoms',
    possibleConditions: 'Possible Conditions',
    urgencyLevel: 'Urgency Level',
    homeCareAdvice: 'Home Care Advice',
    aiDisclaimer: 'This is not a medical diagnosis. Please consult a healthcare professional.',
    prescriptionGenerator: 'AI Prescription Generator',
    medicalChatbot: 'Medical Assistant',

    // Consultation
    videoConsultation: 'Video Consultation',
    startConsultation: 'Start Consultation',
    endConsultation: 'End Consultation',
    chat: 'Chat',
    shareScreen: 'Share Screen',
    sharePrescription: 'Share Prescription',

    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark All as Read',

    // Settings
    settings: 'Settings',
    profile: 'Profile',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',

    // Emergency
    emergency: 'Emergency',
    emergencyAlert: 'Emergency Alert',
    sendAlert: 'Send Alert',

    // Misc
    download: 'Download',
    print: 'Print',
    share: 'Share',
    qrCode: 'QR Code',
  },
  te: {
    appName: 'AI HealthSync Pro',
    tagline: 'భవిష్యత్తు డిజిటల్ క్లినిక్',
    loading: 'లోడ్ అవుతోంది...',
    error: 'ఒక లోపం సంభవించింది',
    save: 'సేవ్',
    cancel: 'రద్దు',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    add: 'జోడించు',
    search: 'వెతకండి',
    filter: 'ఫిల్టర్',
    noResults: 'ఫలితాలు లేవు',
    seeAll: 'అన్నీ చూడండి',

    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    signOut: 'సైన్ అవుట్',
    email: 'ఇమెయిల్',
    password: 'పాస్వర్డ్',
    fullName: 'పూర్తి పేరు',
    forgotPassword: 'పాస్వర్డ్ మర్చిపోయారా?',
    noAccount: 'ఖాతా లేదా?',
    hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',

    admin: 'అడ్మిన్',
    doctor: 'డాక్టర్',
    patient: 'రోగి',
    receptionist: 'రిసెప్షనిస్ట్',

    dashboard: 'డాష్‌బోర్డ్',
    welcome: 'స్వాగతం',
    appointments: 'అపాయింట్‌మెంట్‌లు',
    patients: 'రోగులు',
    doctors: 'డాక్టర్లు',
    healthRecords: 'ఆరోగ్య రికార్డులు',
    prescriptions: 'ప్రిస్క్రిప్షన్‌లు',
    reports: 'రిపోర్టులు',

    vitalSigns: 'శరీర సంకేతాలు',
    bloodPressure: 'రక్తపోటు',
    heartRate: 'గుండె వేగం',
    weight: 'బరువు',
    height: 'ఎత్తు',

    symptomChecker: 'AI లక్షణాల పరిశీలన',
    videoConsultation: 'వీడియో సలహా',
    emergency: 'అత్యవసరం',
    settings: 'సెట్టింగ్‌లు',
    language: 'భాష',
  },
  hi: {
    appName: 'AI HealthSync Pro',
    tagline: 'भविष्य का डिजिटल क्लिनिक',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    noResults: 'कोई परिणाम नहीं मिला',
    seeAll: 'सभी देखें',

    signIn: 'साइन इन',
    signUp: 'साइन अप',
    signOut: 'साइन आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    forgotPassword: 'पासवर्ड भूल गए?',
    noAccount: 'खाता नहीं है?',
    hasAccount: 'पहले से खाता है?',

    admin: 'व्यवस्थापक',
    doctor: 'डॉक्टर',
    patient: 'मरीज़',
    receptionist: 'रिसेप्शनिस्ट',

    dashboard: 'डैशबोर्ड',
    welcome: 'स्वागत है',
    appointments: 'अपॉइंटमेंट',
    patients: 'मरीज़',
    doctors: 'डॉक्टर',
    healthRecords: 'स्वास्थ्य रिकॉर्ड',
    prescriptions: 'प्रिस्क्रिप्शन',
    reports: 'रिपोर्ट',

    vitalSigns: 'शरीर के संकेत',
    bloodPressure: 'रक्तचाप',
    heartRate: 'दिल की धड़कन',
    weight: 'वजन',
    height: 'ऊंचाई',

    symptomChecker: 'AI लक्षण जांच',
    videoConsultation: 'वीडियो परामर्श',
    emergency: 'आपातकालीन',
    settings: 'सेटिंग्स',
    language: 'भाषा',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    return stored && ['en', 'te', 'hi'].includes(stored) ? stored : 'en';
  });

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export type { Language };
