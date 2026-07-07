import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'bordered';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variants = {
  default: 'bg-white dark:bg-dark-800 shadow-lg border border-dark-100 dark:border-dark-700',
  glass: 'backdrop-blur-xl bg-white/70 dark:bg-dark-800/70 border border-white/30 dark:border-dark-700/30 shadow-glass',
  gradient: 'bg-gradient-to-br from-white to-dark-50 dark:from-dark-800 dark:to-dark-900 shadow-xl',
  bordered: 'bg-white dark:bg-dark-800 border-2 border-primary-100 dark:border-primary-900',
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = false, padding = 'md', className = '', children, ...props }, ref) => {
    const Component = hover ? motion.div : 'div';

    return (
      <Component
        ref={ref}
        whileHover={hover ? { y: -4, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' } : undefined}
        className={`
          rounded-2xl overflow-hidden
          transition-all duration-300
          ${variants[variant]}
          ${paddings[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const colorStyles = {
  primary: 'from-primary-500 to-primary-600',
  secondary: 'from-secondary-500 to-secondary-600',
  accent: 'from-accent-500 to-accent-600',
  success: 'from-success-500 to-success-600',
  warning: 'from-warning-500 to-warning-600',
  error: 'from-error-500 to-error-600',
};

export function StatCard({ title, value, change, changeType = 'neutral', icon, color = 'primary' }: StatCardProps) {
  const changeColors = {
    positive: 'text-success-500',
    negative: 'text-error-500',
    neutral: 'text-dark-500',
  };

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-dark-500 dark:text-dark-400">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-dark-900 dark:text-white mt-1"
          >
            {value}
          </motion.p>
          {change && (
            <p className={`text-sm mt-2 ${changeColors[changeType]}`}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorStyles[color]} text-white shadow-lg`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
