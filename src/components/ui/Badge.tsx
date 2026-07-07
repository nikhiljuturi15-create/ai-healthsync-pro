import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-dark-100 text-dark-600 dark:bg-dark-700 dark:text-dark-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  error: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  outline: 'border border-current text-dark-600 dark:text-dark-300',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5 rounded-full font-semibold
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`
              w-1.5 h-1.5 rounded-full
              ${variant === 'success' ? 'bg-success-500' : ''}
              ${variant === 'warning' ? 'bg-warning-500' : ''}
              ${variant === 'error' ? 'bg-error-500' : ''}
              ${variant === 'primary' ? 'bg-primary-500' : ''}
              ${variant === 'default' || variant === 'outline' ? 'bg-dark-400' : ''}
            `}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export function getStatusBadge(status: string) {
  const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    scheduled: { variant: 'primary', label: 'Scheduled' },
    confirmed: { variant: 'secondary', label: 'Confirmed' },
    in_progress: { variant: 'warning', label: 'In Progress' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    no_show: { variant: 'default', label: 'No Show' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    low: { variant: 'secondary', label: 'Low' },
    medium: { variant: 'warning', label: 'Medium' },
    high: { variant: 'primary', label: 'High' },
    emergency: { variant: 'error', label: 'Emergency' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}
