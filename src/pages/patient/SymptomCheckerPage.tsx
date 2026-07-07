import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Mic,
  AlertCircle,
  Heart,
  Thermometer,
  Activity,
  Brain,
  Stethoscope,
  ArrowRight,
  Clock,
  Shield,
  Info,
  ChevronDown,
  Sparkles,
  MicOff,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  symptoms?: string[];
}

interface SymptomAnalysis {
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
  }>;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  specialty: string;
  homeCare: string[];
  disclaimer: string;
}

const commonSymptoms = [
  { id: 1, name: 'Headache', icon: Brain },
  { id: 2, name: 'Fever', icon: Thermometer },
  { id: 3, name: 'Cough', icon: Activity },
  { id: 4, name: 'Chest Pain', icon: Heart },
  { id: 5, name: 'Fatigue', icon: Activity },
  { id: 6, name: 'Nausea', icon: AlertCircle },
  { id: 7, name: 'Dizziness', icon: AlertCircle },
  { id: 8, name: 'Shortness of Breath', icon: Activity },
];

const urgencyConfig = {
  low: { color: 'success', message: 'Self-care may be appropriate' },
  medium: { color: 'warning', message: 'Consider consulting a doctor soon' },
  high: { color: 'primary', message: 'Schedule an appointment promptly' },
  emergency: { color: 'error', message: 'Seek immediate medical attention' },
};

export function SymptomCheckerPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [step, setStep] = useState<'symptoms' | 'details' | 'results'>('symptoms');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSymptomClick = (symptomName: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomName)
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
    );
  };

  const handleAnalyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    setStep('details');

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis result
    const mockAnalysis: SymptomAnalysis = {
      conditions: [
        {
          name: 'Viral Upper Respiratory Infection',
          probability: 75,
          description: 'Common cold or flu-like illness affecting the upper respiratory tract.',
        },
        {
          name: 'Tension Headache',
          probability: 45,
          description: 'Headache caused by muscle tension, often related to stress or posture.',
        },
        {
          name: 'Mild Dehydration',
          probability: 30,
          description: 'Insufficient fluid intake leading to headache and fatigue.',
        },
      ],
      urgency: selectedSymptoms.includes('Chest Pain') || selectedSymptoms.includes('Shortness of Breath')
        ? 'high'
        : selectedSymptoms.includes('Fever')
        ? 'medium'
        : 'low',
      specialty: selectedSymptoms.includes('Chest Pain') ? 'Cardiologist' : 'General Physician',
      homeCare: [
        'Stay hydrated - drink 8-10 glasses of water daily',
        'Get adequate rest and sleep',
        'Take over-the-counter pain relievers if needed',
        'Use a humidifier if experiencing congestion',
        'Monitor temperature if fever is present',
      ],
      disclaimer: 'This analysis is for informational purposes only and does not constitute a medical diagnosis. Always consult a qualified healthcare professional for proper medical advice, diagnosis, or treatment. If you are experiencing a medical emergency, please call emergency services immediately.',
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    setStep('results');

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Based on your symptoms (${selectedSymptoms.join(', ')}), I've analyzed potential conditions. Please review the results carefully.`,
        timestamp: new Date(),
      },
    ]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, implement voice recording here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
          AI Symptom Checker
        </h1>
        <p className="text-dark-500 mt-2 max-w-lg mx-auto">
          Describe your symptoms or select from common symptoms below. Our AI will help identify potential conditions and recommend next steps.
        </p>
      </div>

      {/* Disclaimer Banner */}
      <Card className="bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-warning-800 dark:text-warning-200 font-medium">
              Important: This tool is not a substitute for professional medical advice
            </p>
            <p className="text-xs text-warning-700 dark:text-warning-300 mt-1">
              The AI provides general information only. Always consult a healthcare provider for diagnosis and treatment.
            </p>
          </div>
        </div>
      </Card>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        {['symptoms', 'details', 'results'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step === s ? 'bg-primary-500 text-white' : i < ['symptoms', 'details', 'results'].indexOf(step) ? 'bg-success-500 text-white' : 'bg-dark-200 dark:bg-dark-700 text-dark-500'}
            `}>
              {i + 1}
            </div>
            <span className={`
              text-sm capitalize
              ${step === s ? 'text-primary-600 font-medium' : 'text-dark-500'}
            `}>
              {s}
            </span>
            {i < 2 && <ChevronDown className="w-4 h-4 text-dark-400 rotate-[-90deg] mx-2" />}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {step === 'symptoms' && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Common Symptoms Grid */}
            <Card padding="lg">
              <h2 className="font-semibold text-dark-900 dark:text-white mb-1">Select Your Symptoms</h2>
              <p className="text-sm text-dark-500 mb-4">Tap on symptoms that apply to you</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {commonSymptoms.map((symptom) => {
                  const Icon = symptom.icon;
                  const isSelected = selectedSymptoms.includes(symptom.name);
                  return (
                    <motion.button
                      key={symptom.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSymptomClick(symptom.name)}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-left
                        ${isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                        }
                      `}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary-600' : 'text-dark-400'}`} />
                      <p className={`font-medium ${isSelected ? 'text-primary-600' : 'text-dark-700 dark:text-dark-300'}`}>
                        {symptom.name}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-2">
                  Or describe other symptoms
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type additional symptoms..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (inputValue.trim()) {
                        setSelectedSymptoms(prev => [...prev, inputValue.trim()]);
                        setInputValue('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-dark-500 mb-2">Selected symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="primary"
                        size="md"
                        className="cursor-pointer hover:bg-primary-200"
                        onClick={() => handleSymptomClick(symptom)}
                      >
                        {symptom}
                        <span className="ml-1">×</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Input */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant={isRecording ? 'danger' : 'outline'}
                  leftIcon={isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  onClick={toggleRecording}
                >
                  {isRecording ? 'Stop Recording' : 'Voice Input'}
                </Button>
                <span className="text-sm text-dark-500">
                  {isRecording ? 'Listening... Speak your symptoms' : 'Or use voice to describe symptoms'}
                </span>
              </div>

              <Button
                size="lg"
                disabled={selectedSymptoms.length === 0}
                onClick={handleAnalyzeSymptoms}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Analyze Symptoms
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card padding="lg">
              <div className="flex items-center justify-center flex-col py-12">
                <div className="relative mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 rounded-full border-4 border-dark-200 border-t-primary-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                  Analyzing Your Symptoms
                </h3>
                <p className="text-dark-500 text-center">
                  Our AI is reviewing {selectedSymptoms.length} symptoms to identify potential conditions...
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 'results' && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Urgency Banner */}
            <Card className={`
              ${analysis.urgency === 'emergency' ? 'bg-error-50 dark:bg-error-900/20 border-error-500' : ''}
              ${analysis.urgency === 'high' ? 'bg-warning-50 dark:bg-warning-900/20 border-warning-500' : ''}
              ${analysis.urgency === 'medium' ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500' : ''}
              ${analysis.urgency === 'low' ? 'bg-success-50 dark:bg-success-900/20 border-success-500' : ''}
            `}>
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${analysis.urgency === 'emergency' ? 'bg-error-100 text-error-600' : ''}
                  ${analysis.urgency === 'high' ? 'bg-warning-100 text-warning-600' : ''}
                  ${analysis.urgency === 'medium' ? 'bg-primary-100 text-primary-600' : ''}
                  ${analysis.urgency === 'low' ? 'bg-success-100 text-success-600' : ''}
                `}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    analysis.urgency === 'emergency' ? 'text-error-800' : ''
                  }`}>
                    Urgency Level: {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}
                  </h3>
                  <p className="text-sm">{urgencyConfig[analysis.urgency].message}</p>
                </div>
              </div>
            </Card>

            {/* Possible Conditions */}
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-dark-900 dark:text-white">Possible Conditions</h3>
              </div>
              <div className="space-y-4">
                {analysis.conditions.map((condition, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-dark-50 dark:bg-dark-800">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-dark-900 dark:text-white">{condition.name}</h4>
                        <Badge variant={condition.probability > 60 ? 'primary' : 'default'}>
                          {condition.probability}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-dark-500">{condition.description}</p>
                      <div className="mt-2 w-full h-2 bg-dark-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${condition.probability}%` }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Specialist */}
            <Card padding="lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-dark-900 dark:text-white">Recommended Specialist</h3>
                  <p className="text-dark-500">Based on your symptoms, consider consulting:</p>
                </div>
                <Badge variant="primary" size="lg">{analysis.specialty}</Badge>
              </div>
            </Card>

            {/* Home Care Advice */}
            <Card padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-secondary-600" />
                <h3 className="font-semibold text-dark-900 dark:text-white">Home Care Recommendations</h3>
              </div>
              <ul className="space-y-3">
                {analysis.homeCare.map((advice, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-secondary-600">{i + 1}</span>
                    </div>
                    <span className="text-dark-700 dark:text-dark-300">{advice}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-dark-50 dark:bg-dark-800">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-dark-400 shrink-0 mt-0.5" />
                <p className="text-sm text-dark-600 dark:text-dark-400">{analysis.disclaimer}</p>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" onClick={() => setStep('symptoms')} className="flex-1">
                Check New Symptoms
              </Button>
              <Button className="flex-1" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Book Appointment with {analysis.specialty}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
