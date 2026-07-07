import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  FileText,
  Pill,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Printer,
  Share2,
  Plus,
  Trash2,
  Sparkles,
  Copy,
  X,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/FormElements';
import { Textarea } from '../ui/FormElements';
import { Badge } from '../ui/Badge';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const medicationTemplates = [
  { name: 'Paracetamol', dosage: '650mg', frequency: 'Three times daily', duration: '5 days' },
  { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days' },
  { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '14 days' },
  { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '5 days' },
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
];

const frequencyOptions = [
  { value: 'Once daily', label: 'Once daily' },
  { value: 'Twice daily', label: 'Twice daily' },
  { value: 'Three times daily', label: 'Three times daily' },
  { value: 'Four times daily', label: 'Four times daily' },
  { value: 'As needed', label: 'As needed' },
  { value: 'Every 4 hours', label: 'Every 4 hours' },
  { value: 'Every 6 hours', label: 'Every 6 hours' },
  { value: 'Every 8 hours', label: 'Every 8 hours' },
];

export function AIPrescriptionGenerator() {
  const [step, setStep] = useState<'details' | 'medications' | 'preview'>('details');
  const [isGenerating, setIsGenerating] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [lifestyleAdvice, setLifestyleAdvice] = useState<string[]>([]);
  const [followUpDate, setFollowUpDate] = useState('');

  const addMedication = (template?: typeof medicationTemplates[0]) => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: template?.name || '',
      dosage: template?.dosage || '',
      frequency: template?.frequency || '',
      duration: template?.duration || '',
      instructions: '',
    };
    setMedications([...medications, newMed]);
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const generatePrescription = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate lifestyle advice based on diagnosis
    const advice = [
      'Maintain a balanced diet rich in fruits and vegetables',
      'Stay hydrated - drink at least 8 glasses of water daily',
      'Get adequate rest and sleep (7-8 hours)',
      'Avoid strenuous physical activity until symptoms improve',
    ];
    setLifestyleAdvice(advice);
    setFollowUpDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    setIsGenerating(false);
    setStep('preview');
  };

  const handleDownload = () => {
    // In a real app, generate and download PDF
    alert('PDF generation would be implemented here with a library like jsPDF');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30"
        >
          <Bot className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
          AI Prescription Generator
        </h1>
        <p className="text-dark-500 mt-2">
          Create professional prescriptions with AI-powered assistance
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        {['details', 'medications', 'preview'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step === s ? 'bg-primary-500 text-white' : i < ['details', 'medications', 'preview'].indexOf(step) ? 'bg-success-500 text-white' : 'bg-dark-200 dark:bg-dark-700 text-dark-500'}
            `}>
              {i + 1}
            </div>
            <span className={`
              text-sm capitalize hidden sm:block
              ${step === s ? 'text-primary-600 font-medium' : 'text-dark-500'}
            `}>
              {s === 'details' ? 'Patient Details' : s === 'medications' ? 'Medications' : 'Preview'}
            </span>
            {i < 2 && <div className="w-8 h-0.5 bg-dark-200 dark:bg-dark-700 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Patient Details */}
      {step === 'details' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg">
            <h2 className="font-semibold text-dark-900 dark:text-white mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Patient Name"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
              <Input
                label="Age"
                type="number"
                placeholder="Enter age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Textarea
                label="Diagnosis"
                placeholder="Enter diagnosis or condition"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={2}
              />
              <Textarea
                label="Symptoms"
                placeholder="List symptoms separated by commas"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
              />
              <Textarea
                label="Additional Notes"
                placeholder="Any additional notes or observations"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setStep('medications')}
                disabled={!patientName || !diagnosis}
                rightIcon={<Plus className="w-4 h-4" />}
              >
                Add Medications
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Medications */}
      {step === 'medications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Quick Add Templates */}
          <Card padding="lg">
            <h3 className="font-semibold text-dark-900 dark:text-white mb-3">Quick Add</h3>
            <div className="flex flex-wrap gap-2">
              {medicationTemplates.map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  size="sm"
                  onClick={() => addMedication(template)}
                  leftIcon={<Pill className="w-4 h-4" />}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Medication Cards */}
          {medications.map((med, index) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-dark-900 dark:text-white">
                    Medication {index + 1}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(med.id)}
                    className="text-error-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Medication Name"
                    placeholder="e.g., Paracetamol"
                    value={med.name}
                    onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                  />
                  <Input
                    label="Dosage"
                    placeholder="e.g., 500mg"
                    value={med.dosage}
                    onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                  />
                  <Select
                    label="Frequency"
                    value={med.frequency}
                    onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                    options={frequencyOptions}
                    placeholder="Select frequency"
                  />
                  <Input
                    label="Duration"
                    placeholder="e.g., 7 days"
                    value={med.duration}
                    onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Special Instructions"
                      placeholder="e.g., Take with food"
                      value={med.instructions}
                      onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Add Medication Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => addMedication()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Another Medication
          </Button>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={generatePrescription}
              disabled={medications.length === 0 || isGenerating}
              leftIcon={isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            >
              {isGenerating ? 'Generating...' : 'Generate Prescription'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Prescription Preview */}
          <Card padding="none" className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold">Medical Prescription</h2>
                  <p className="text-white/80">AI HealthSync Pro</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-sm">Rx ID: {Date.now().toString(36).toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dark-100 dark:border-dark-700">
                <div>
                  <p className="text-sm text-dark-500">Patient Name</p>
                  <p className="font-medium text-dark-900 dark:text-white">{patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-dark-500">Age</p>
                  <p className="font-medium text-dark-900 dark:text-white">{patientAge} years</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="pb-4 border-b border-dark-100 dark:border-dark-700">
                <p className="text-sm text-dark-500">Diagnosis</p>
                <p className="font-medium text-dark-900 dark:text-white">{diagnosis}</p>
              </div>

              {/* Medications */}
              <div>
                <h3 className="font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary-600" />
                  Prescribed Medications
                </h3>
                <div className="space-y-4">
                  {medications.map((med, i) => (
                    <div key={med.id} className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-dark-900 dark:text-white">
                            {i + 1}. {med.name} {med.dosage}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="primary" size="sm">{med.frequency}</Badge>
                            <Badge variant="default" size="sm">{med.duration}</Badge>
                          </div>
                        </div>
                        {med.instructions && (
                          <span className="text-sm text-dark-500">{med.instructions}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Advice */}
              {lifestyleAdvice.length > 0 && (
                <div className="pt-4 border-t border-dark-100 dark:border-dark-700">
                  <h3 className="font-semibold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary-600" />
                    Lifestyle Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {lifestyleAdvice.map((advice, i) => (
                      <li key={i} className="flex items-start gap-2 text-dark-700 dark:text-dark-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up */}
              {followUpDate && (
                <div className="pt-4 border-t border-dark-100 dark:border-dark-700">
                  <p className="text-dark-600 dark:text-dark-400">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Follow-up: <span className="font-medium">{new Date(followUpDate).toLocaleDateString()}</span>
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="pt-4 border-t border-dark-100 dark:border-dark-700">
                <div className="flex items-start gap-2 text-xs text-dark-500">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    This prescription was generated with AI assistance. The prescribing physician has reviewed and approved all medications.
                    Please follow dosage instructions carefully and contact your healthcare provider if you experience any adverse reactions.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => setStep('medications')}>
              Edit
            </Button>
            <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />}>
              Print
            </Button>
            <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>
              Share
            </Button>
            <Button leftIcon={<Download className="w-4 h-4" />} onClick={handleDownload}>
              Download PDF
            </Button>
          </div>

          {/* Medicine Reminders */}
          <Card padding="lg">
            <h3 className="font-semibold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-600" />
              Set Medicine Reminders
            </h3>
            <p className="text-sm text-dark-500 mb-4">
              Automatically set reminders for medication schedules
            </p>
            <Button leftIcon={<Bell className="w-4 h-4" />}>
              Enable Reminders
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
