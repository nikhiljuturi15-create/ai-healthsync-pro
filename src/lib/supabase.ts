import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: ProfileInsert; Update: ProfileUpdate };
      doctors: { Row: Doctor; Insert: DoctorInsert; Update: DoctorUpdate };
      patients: { Row: Patient; Insert: PatientInsert; Update: PatientUpdate };
      appointments: { Row: Appointment; Insert: AppointmentInsert; Update: AppointmentUpdate };
      prescriptions: { Row: Prescription; Insert: PrescriptionInsert; Update: PrescriptionUpdate };
      medications: { Row: Medication; Insert: MedicationInsert; Update: MedicationUpdate };
      vital_signs: { Row: VitalSign; Insert: VitalSignInsert; Update: VitalSignUpdate };
      reports: { Row: Report; Insert: ReportInsert; Update: ReportUpdate };
      vaccinations: { Row: Vaccination; Insert: VaccinationInsert; Update: VaccinationUpdate };
      chat_sessions: { Row: ChatSession; Insert: ChatSessionInsert; Update: ChatSessionUpdate };
      chat_messages: { Row: ChatMessage; Insert: ChatMessageInsert; Update: ChatMessageUpdate };
      symptom_checks: { Row: SymptomCheck; Insert: SymptomCheckInsert; Update: SymptomCheckUpdate };
      notifications: { Row: Notification; Insert: NotificationInsert; Update: NotificationUpdate };
      emergency_alerts: { Row: EmergencyAlert; Insert: EmergencyAlertInsert; Update: EmergencyAlertUpdate };
    };
  };
};

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  pincode: string | null;
  language: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at' | 'country' | 'language' | 'is_active'> & {
  country?: string;
  language?: string;
  is_active?: boolean;
};

export type ProfileUpdate = Partial<ProfileInsert>;

export interface Doctor {
  id: string;
  profile_id: string;
  specialization: string;
  qualifications: string[];
  experience_years: number;
  consultation_fee: number;
  registration_number: string | null;
  hospital_affiliation: string | null;
  available_days: string[];
  available_time_start: string;
  available_time_end: string;
  bio: string | null;
  rating: number;
  total_reviews: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export type DoctorInsert = Omit<Doctor, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_reviews'>;
export type DoctorUpdate = Partial<DoctorInsert>;

export interface Patient {
  id: string;
  profile_id: string;
  blood_group: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  allergies: string[];
  chronic_conditions: string[];
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  insurance_provider: string | null;
  insurance_number: string | null;
  qr_code: string | null;
  medical_history: string | null;
  created_at: string;
  updated_at: string;
}

export type PatientInsert = Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'qr_code'>;
export type PatientUpdate = Partial<PatientInsert>;

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'video_consultation' | 'routine_checkup';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  type: AppointmentType;
  symptoms: string | null;
  notes: string | null;
  prescription_id: string | null;
  follow_up_date: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type AppointmentInsert = Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'prescription_id'>;
export type AppointmentUpdate = Partial<AppointmentInsert>;

export interface Prescription {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string | null;
  notes: string | null;
  lifestyle_advice: string | null;
  follow_up_instructions: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PrescriptionInsert = Omit<Prescription, 'id' | 'created_at' | 'updated_at' | 'is_active'>;
export type PrescriptionUpdate = Partial<PrescriptionInsert>;

export interface Medication {
  id: string;
  prescription_id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  start_date: string;
  end_date: string | null;
  reminders_enabled: boolean;
  reminder_times: string[];
  is_taken: boolean;
  side_effects: string | null;
  created_at: string;
}

export type MedicationInsert = Omit<Medication, 'id' | 'created_at'>;
export type MedicationUpdate = Partial<MedicationInsert>;

export interface VitalSign {
  id: string;
  patient_id: string;
  recorded_by: string | null;
  recorded_at: string;
  weight_kg: number | null;
  height_cm: number | null;
  bmi: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  heart_rate_bpm: number | null;
  temperature_c: number | null;
  blood_glucose_mg_dl: number | null;
  oxygen_saturation: number | null;
  respiratory_rate: number | null;
  notes: string | null;
  created_at: string;
}

export type VitalSignInsert = Omit<VitalSign, 'id' | 'created_at'>;
export type VitalSignUpdate = Partial<VitalSignInsert>;

export type ReportType = 'blood_test' | 'x_ray' | 'mri' | 'ct_scan' | 'ecg' | 'ultrasound' | 'prescription' | 'discharge_summary' | 'other';

export interface Report {
  id: string;
  patient_id: string;
  uploaded_by: string;
  title: string;
  type: ReportType;
  description: string | null;
  file_url: string;
  ai_summary: string | null;
  ai_insights: string | null;
  report_date: string | null;
  lab_name: string | null;
  is_verified: boolean;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ReportInsert = Omit<Report, 'id' | 'created_at' | 'updated_at' | 'ai_summary' | 'ai_insights' | 'is_verified' | 'verified_by'>;
export type ReportUpdate = Partial<ReportInsert>;

export interface Vaccination {
  id: string;
  patient_id: string;
  vaccine_name: string;
  manufacturer: string | null;
  dose_number: number | null;
  total_doses: number | null;
  administered_date: string;
  administered_by: string | null;
  location: string | null;
  next_dose_date: string | null;
  batch_number: string | null;
  notes: string | null;
  created_at: string;
}

export type VaccinationInsert = Omit<Vaccination, 'id' | 'created_at'>;
export type VaccinationUpdate = Partial<VaccinationInsert>;

export interface ChatSession {
  id: string;
  appointment_id: string | null;
  patient_id: string;
  doctor_id: string;
  status: 'active' | 'ended' | 'waiting';
  started_at: string;
  ended_at: string | null;
  recording_url: string | null;
  notes: string | null;
  created_at: string;
}

export type ChatSessionInsert = Omit<ChatSession, 'id' | 'created_at' | 'started_at'>;
export type ChatSessionUpdate = Partial<ChatSessionInsert>;

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: string;
  message: string;
  attachments: string[];
  is_read: boolean;
  created_at: string;
}

export type ChatMessageInsert = Omit<ChatMessage, 'id' | 'created_at'>;
export type ChatMessageUpdate = Partial<ChatMessageInsert>;

export interface SymptomCheck {
  id: string;
  patient_id: string;
  symptoms: string[];
  additional_details: string | null;
  ai_analysis: Record<string, unknown> | null;
  possible_conditions: Record<string, unknown>[] | null;
  urgency_level: 'low' | 'medium' | 'high' | 'emergency' | null;
  suggested_specialization: string | null;
  home_care_advice: string[] | null;
  disclaimer: string | null;
  created_at: string;
}

export type SymptomCheckInsert = Omit<SymptomCheck, 'id' | 'created_at' | 'ai_analysis' | 'possible_conditions' | 'urgency_level' | 'suggested_specialization' | 'home_care_advice' | 'disclaimer'>;
export type SymptomCheckUpdate = Partial<SymptomCheckInsert>;

export type NotificationType = 'appointment' | 'prescription' | 'reminder' | 'alert' | 'system' | 'emergency';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type NotificationInsert = Omit<Notification, 'id' | 'created_at'>;
export type NotificationUpdate = Partial<NotificationInsert>;

export interface EmergencyAlert {
  id: string;
  patient_id: string;
  type: string;
  location: string | null;
  description: string | null;
  status: 'active' | 'resolved' | 'false_alarm';
  responded_by: string | null;
  response_notes: string | null;
  responded_at: string | null;
  created_at: string;
}

export type EmergencyAlertInsert = Omit<EmergencyAlert, 'id' | 'created_at' | 'responded_by' | 'response_notes' | 'responded_at' | 'status'>;
export type EmergencyAlertUpdate = Partial<EmergencyAlertInsert>;
