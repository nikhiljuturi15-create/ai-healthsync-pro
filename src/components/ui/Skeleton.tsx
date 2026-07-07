import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <Loader2 className={`animate-spin text-primary-500 ${sizes[size]} ${className}`} />
  );
}

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-dark-200 border-t-primary-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-500">+</span>
          </div>
        </div>
        <p className="text-dark-600 dark:text-dark-400 font-medium">{message}</p>
      </motion.div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`
        bg-dark-200 dark:bg-dark-700
        ${variants[variant]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-dark-800 shadow-lg animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton variant="circular" className="w-12 h-12" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-dark-100 dark:border-dark-700">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-dark-400" />
      </div>
      <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-dark-500 dark:text-dark-400 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  );
}
