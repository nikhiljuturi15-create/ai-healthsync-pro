import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40',
  secondary: 'bg-white dark:bg-dark-800 text-dark-700 dark:text-dark-200 border border-dark-200 dark:border-dark-700 shadow-md hover:shadow-lg hover:border-primary-300',
  outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  ghost: 'text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800',
  danger: 'bg-gradient-to-r from-error-500 to-error-600 text-white shadow-lg shadow-error-500/30 hover:shadow-xl',
  success: 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/30 hover:shadow-xl',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
