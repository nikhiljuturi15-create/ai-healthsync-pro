import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const variants = {
  primary: 'from-primary-500 to-primary-400',
  secondary: 'from-secondary-500 to-secondary-400',
  success: 'from-success-500 to-success-400',
  warning: 'from-warning-500 to-warning-400',
  error: 'from-error-500 to-error-400',
};

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function Progress({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-dark-600 dark:text-dark-400">{value}</span>
          <span className="text-dark-400">{max}</span>
        </div>
      )}
      <div className={`w-full bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${variants[variant]} rounded-full`}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  className?: string;
}

const circleVariants = {
  primary: '#3b82f6',
  secondary: '#22c55e',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'primary',
  showValue = true,
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-dark-200 dark:text-dark-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={circleVariants[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-dark-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
