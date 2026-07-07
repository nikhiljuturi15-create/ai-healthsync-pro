/*
# AI HealthSync Pro - Core Healthcare Schema

1. New Tables
- `profiles` - User profiles extending auth.users with role-based access
- `doctors` - Doctor-specific information including specialization
- `patients` - Patient-specific information including health data
- `appointments` - Appointment management system
- `prescriptions` - Medical prescriptions with dosage schedules
- `health_records` - Patient health metrics and history
- `reports` - Medical reports including blood tests, X-rays
- `medications` - Medication tracking and reminders
- `vital_signs` - Real-time vital signs monitoring
- `chat_sessions` - Video consultation sessions
- `chat_messages` - Messages within consultation sessions
- `symptom_checks` - AI symptom checker history
- `notifications` - System notifications for users
- `emergency_contacts` - Emergency contact management

2. Security
- Enable RLS on all tables
- Role-based policies (admin, doctor, receptionist, patient)
- Owner-scoped access where applicable

3. Features Supported
- Multi-portal access (Admin, Doctor, Receptionist, Patient)
- Appointment scheduling and management
- Prescription generation and tracking
- Health history and vital signs
- AI symptom checking
- Video consultations
- Report uploads
- Notifications system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  role text NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist', 'patient')),
  date_of_birth date,
  gender text,
  address text,
  city text,
  state text,
  country text DEFAULT 'India',
  pincode text,
  language text DEFAULT 'en',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  qualifications text[],
  experience_years integer DEFAULT 0,
  consultation_fee numeric DEFAULT 500,
  registration_number text UNIQUE,
  hospital_affiliation text,
  available_days text[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  available_time_start time DEFAULT '09:00:00',
  available_time_end time DEFAULT '17:00:00',
  bio text,
  rating numeric DEFAULT 4.5,
  total_reviews integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  blood_group text,
  height_cm numeric,
  weight_kg numeric,
  allergies text[],
  chronic_conditions text[],
  emergency_contact_name text,
  emergency_contact_phone text,
  insurance_provider text,
  insurance_number text,
  qr_code text UNIQUE,
  medical_history text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  type text DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow_up', 'emergency', 'video_consultation', 'routine_checkup')),
  symptoms text,
  notes text,
  prescription_id uuid,
  follow_up_date date,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  diagnosis text,
  notes text,
  lifestyle_advice text,
  follow_up_instructions text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  duration text NOT NULL,
  instructions text,
  start_date date NOT NULL,
  end_date date,
  reminders_enabled boolean DEFAULT true,
  reminder_times text[],
  is_taken boolean DEFAULT false,
  side_effects text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Health records / Vital signs
CREATE TABLE IF NOT EXISTS vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  recorded_by uuid REFERENCES profiles(id),
  recorded_at timestamptz DEFAULT now(),
  weight_kg numeric,
  height_cm numeric,
  bmi numeric,
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  heart_rate_bpm integer,
  temperature_c numeric,
  blood_glucose_mg_dl numeric,
  oxygen_saturation numeric,
  respiratory_rate integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;

-- Medical reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('blood_test', 'x_ray', 'mri', 'ct_scan', 'ecg', 'ultrasound', 'prescription', 'discharge_summary', 'other')),
  description text,
  file_url text NOT NULL,
  ai_summary text,
  ai_insights text,
  report_date date,
  lab_name text,
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Vaccinations table
CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  manufacturer text,
  dose_number integer,
  total_doses integer,
  administered_date date NOT NULL,
  administered_by uuid REFERENCES profiles(id),
  location text,
  next_dose_date date,
  batch_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

-- Chat/Consultation sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'ended', 'waiting')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  recording_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id),
  message text NOT NULL,
  attachments text[],
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Symptom checks (AI)
CREATE TABLE IF NOT EXISTS symptom_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  symptoms text[] NOT NULL,
  additional_details text,
  ai_analysis jsonb,
  possible_conditions jsonb,
  urgency_level text CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')),
  suggested_specialization text,
  home_care_advice text[],
  disclaimer text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE symptom_checks ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('appointment', 'prescription', 'reminder', 'alert', 'system', 'emergency')),
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Emergency alerts
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  type text NOT NULL,
  location text,
  description text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_alarm')),
  responded_by uuid REFERENCES profiles(id),
  response_notes text,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admin_all_profiles" ON profiles;
CREATE POLICY "admin_all_profiles" ON profiles FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Doctors policies
DROP POLICY IF EXISTS "doctors_select_all" ON doctors;
CREATE POLICY "doctors_select_all" ON doctors FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "doctors_manage_own" ON doctors;
CREATE POLICY "doctors_manage_own" ON doctors FOR ALL
  TO authenticated USING (profile_id = auth.uid());

-- Patients policies
DROP POLICY IF EXISTS "patients_select_own" ON patients;
CREATE POLICY "patients_select_own" ON patients FOR SELECT
  TO authenticated USING (profile_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'receptionist')));

DROP POLICY IF EXISTS "patients_insert_own" ON patients;
CREATE POLICY "patients_insert_own" ON patients FOR INSERT
  TO authenticated WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "patients_update_own" ON patients;
CREATE POLICY "patients_update_own" ON patients FOR UPDATE
  TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- Appointments policies
DROP POLICY IF EXISTS "appointments_patient_access" ON appointments;
CREATE POLICY "appointments_patient_access" ON appointments FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "appointments_doctor_access" ON appointments;
CREATE POLICY "appointments_doctor_access" ON appointments FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM doctors WHERE id = doctor_id AND profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "appointments_staff_access" ON appointments;
CREATE POLICY "appointments_staff_access" ON appointments FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'receptionist'))
  );

-- Prescriptions policies
DROP POLICY IF EXISTS "prescriptions_patient_view" ON prescriptions;
CREATE POLICY "prescriptions_patient_view" ON prescriptions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM doctors WHERE id = doctor_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'receptionist'))
  );

DROP POLICY IF EXISTS "prescriptions_doctor_manage" ON prescriptions;
CREATE POLICY "prescriptions_doctor_manage" ON prescriptions FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM doctors WHERE id = doctor_id AND profile_id = auth.uid())
  );

-- Medications policies
DROP POLICY IF EXISTS "medications_access" ON medications;
CREATE POLICY "medications_access" ON medications FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM prescriptions p JOIN patients pat ON p.patient_id = pat.id WHERE p.id = prescription_id AND pat.profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM prescriptions p JOIN doctors d ON p.doctor_id = d.id WHERE p.id = prescription_id AND d.profile_id = auth.uid())
  );

-- Vital signs policies
DROP POLICY IF EXISTS "vitals_patient_access" ON vital_signs;
CREATE POLICY "vitals_patient_access" ON vital_signs FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "vitals_staff_access" ON vital_signs;
CREATE POLICY "vitals_staff_access" ON vital_signs FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'receptionist'))
  );

-- Reports policies
DROP POLICY IF EXISTS "reports_access" ON reports;
CREATE POLICY "reports_access" ON reports FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'receptionist'))
  );

DROP POLICY IF EXISTS "reports_insert" ON reports;
CREATE POLICY "reports_insert" ON reports FOR INSERT
  TO authenticated WITH CHECK (true);

-- Vaccinations policies
DROP POLICY IF EXISTS "vaccinations_access" ON vaccinations;
CREATE POLICY "vaccinations_access" ON vaccinations FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'receptionist'))
  );

-- Chat sessions policies
DROP POLICY IF EXISTS "chat_sessions_access" ON chat_sessions;
CREATE POLICY "chat_sessions_access" ON chat_sessions FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM doctors WHERE id = doctor_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Chat messages policies
DROP POLICY IF EXISTS "chat_messages_access" ON chat_messages;
CREATE POLICY "chat_messages_access" ON chat_messages FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM chat_sessions cs WHERE cs.id = session_id AND 
      (EXISTS (SELECT 1 FROM patients WHERE id = cs.patient_id AND profile_id = auth.uid()) OR
       EXISTS (SELECT 1 FROM doctors WHERE id = cs.doctor_id AND profile_id = auth.uid())))
  );

-- Symptom checks policies
DROP POLICY IF EXISTS "symptom_checks_access" ON symptom_checks;
CREATE POLICY "symptom_checks_access" ON symptom_checks FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM patients WHERE id = patient_id AND profile_id = auth.uid())
  );

-- Notifications policies
DROP POLICY IF EXISTS "notifications_user_access" ON notifications;
CREATE POLICY "notifications_user_access" ON notifications FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- Emergency alerts policies
DROP POLICY IF EXISTS "emergency_alerts_access" ON emergency_alerts;
CREATE POLICY "emergency_alerts_access" ON emergency_alerts FOR ALL
  TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_vitals_patient ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_patient ON reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);