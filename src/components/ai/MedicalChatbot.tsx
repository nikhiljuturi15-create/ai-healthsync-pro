import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  X,
  MessageSquare,
  Minimize2,
  RotateCcw,
  AlertCircle,
  Heart,
  Calendar,
  Pill,
  FileText,
  Stethoscope,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { icon: Calendar, label: 'Book Appointment', action: 'book_appointment' },
  { icon: Pill, label: 'My Medications', action: 'my_medications' },
  { icon: FileText, label: 'Health Records', action: 'health_records' },
  { icon: Stethoscope, label: 'Find Doctor', action: 'find_doctor' },
];

const suggestedQuestions = [
  "What are my upcoming appointments?",
  "How do I manage my medications?",
  "What is my blood pressure history?",
  "I have a headache, what should I do?",
];

const aiResponses: Record<string, string> = {
  'appointment': "I can see you have an upcoming appointment with Dr. Sarah Smith tomorrow at 10:00 AM. Would you like me to reschedule or do you need directions to the clinic?",
  'medication': "You currently have 3 active medications:\n\n1. Amlodipine 5mg - Once daily at 8:00 AM\n2. Metformin 500mg - Twice daily\n3. Vitamin D 1000 IU - Once daily at 9:00 AM\n\nYour medication adherence this week is 95%. Great job!",
  'headache': "I understand you're experiencing a headache. Here are some quick tips:\n\n1. Stay hydrated - drink water\n2. Rest in a quiet, dark room\n3. Consider over-the-counter pain relief if appropriate\n4. Apply a cold or warm compress\n\nIf the headache persists or is severe, I recommend using our Symptom Checker for a more detailed analysis.",
  'blood pressure': "Your recent blood pressure readings:\n\n• Today: 120/80 mmHg (Normal)\n• Yesterday: 118/78 mmHg\n• This week average: 119/79 mmHg\n\nYour blood pressure is well controlled! Continue with your current medication and lifestyle.",
  'default': "I'm here to help you navigate your healthcare journey. You can ask me about:\n\n• Your appointments and schedule\n• Medication information and reminders\n• Health records and test results\n• Finding the right doctor\n• General health questions\n\nHow can I assist you today?",
};

export function MedicalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Health Assistant. How can I help you today?",
      timestamp: new Date(),
      suggestions: suggestedQuestions.slice(0, 3),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = aiResponses.default;

    if (inputValue.toLowerCase().includes('appointment') || inputValue.toLowerCase().includes('schedule')) {
      response = aiResponses.appointment;
    } else if (inputValue.toLowerCase().includes('medication') || inputValue.toLowerCase().includes('medicine')) {
      response = aiResponses.medication;
    } else if (inputValue.toLowerCase().includes('headache') || inputValue.toLowerCase().includes('pain')) {
      response = aiResponses.headache;
    } else if (inputValue.toLowerCase().includes('blood pressure') || inputValue.toLowerCase().includes('bp')) {
      response = aiResponses.blood_pressure;
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions: ['Thanks for the help!', 'Tell me more', 'I have another question'],
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      'book_appointment': 'I want to book a new appointment',
      'my_medications': 'Show me my current medications',
      'health_records': 'Access my health records',
      'find_doctor': 'Help me find a doctor',
    };
    setInputValue(actionMessages[action] || '');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hello! I'm your AI Health Assistant. How can I help you today?",
        timestamp: new Date(),
        suggestions: suggestedQuestions.slice(0, 3),
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white z-50 hover:shadow-xl hover:shadow-primary-500/40 transition-shadow"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-50 ${
              isMinimized
                ? 'bottom-6 right-6 w-80'
                : 'bottom-6 right-6 w-96 h-[600px] max-h-[80vh]'
            }`}
          >
            <Card className="h-full flex flex-col overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Health Assistant</h3>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <span className="w-2 h-2 bg-success-400 rounded-full" />
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Reset conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-primary-600" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                          <div
                            className={`p-3 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-primary-500 text-white rounded-br-sm'
                                : 'bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          </div>
                          {message.suggestions && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.suggestions.map((s, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSuggestionClick(s)}
                                  className="text-xs px-3 py-1 rounded-full bg-dark-50 dark:bg-dark-800 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.role === 'user' && (
                          <Avatar name="You" size="sm" />
                        )}
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="bg-dark-100 dark:bg-dark-700 p-3 rounded-2xl rounded-bl-sm">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                className="w-2 h-2 bg-dark-400 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  {messages.length === 1 && (
                    <div className="px-4 pb-2">
                      <div className="grid grid-cols-4 gap-2">
                        {quickActions.map((action) => (
                          <button
                            key={action.action}
                            onClick={() => handleQuickAction(action.action)}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-dark-50 dark:bg-dark-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-dark-600 dark:text-dark-400 hover:text-primary-600 transition-colors"
                          >
                            <action.icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-dark-100 dark:border-dark-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-lg bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                      />
                      <Button size="md" onClick={handleSendMessage} disabled={!inputValue.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
