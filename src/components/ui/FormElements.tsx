import { SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl appearance-none
              bg-white dark:bg-dark-800
              border border-dark-200 dark:border-dark-700
              text-dark-900 dark:text-dark-100
              focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
              outline-none transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-error-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white dark:bg-dark-800
            border border-dark-200 dark:border-dark-700
            text-dark-900 dark:text-dark-100
            placeholder:text-dark-400 dark:placeholder:text-dark-500
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            outline-none transition-all duration-200
            resize-none disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-error-500"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-dark-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ label, checked, onChange, disabled = false, className = '' }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-md border-2 transition-all duration-200
            ${checked
              ? 'bg-primary-500 border-primary-500'
              : 'bg-white dark:bg-dark-800 border-dark-300 dark:border-dark-600'
            }
          `}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-full h-full text-white p-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          )}
        </div>
      </div>
      {label && <span className="text-dark-700 dark:text-dark-300">{label}</span>}
    </label>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  return (
    <label className={`flex items-center gap-4 cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-12 h-7 rounded-full transition-all duration-300
            ${checked ? 'bg-primary-500' : 'bg-dark-300 dark:bg-dark-600'}
          `}
        >
          <motion.div
            animate={{ x: checked ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
          />
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && <p className="text-dark-700 dark:text-dark-200 font-medium">{label}</p>}
          {description && <p className="text-sm text-dark-500">{description}</p>}
        </div>
      )}
    </label>
  );
}

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode; count?: number }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 p-1 bg-dark-100 dark:bg-dark-800 rounded-xl ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${activeTab === tab.id
              ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-sm'
              : 'text-dark-600 hover:text-dark-900 dark:text-dark-400 dark:hover:text-dark-200'
            }
          `}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={`
              px-2 py-0.5 rounded-full text-xs
              ${activeTab === tab.id
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400'
                : 'bg-dark-200 dark:bg-dark-600 text-dark-600 dark:text-dark-300'
              }
            `}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
