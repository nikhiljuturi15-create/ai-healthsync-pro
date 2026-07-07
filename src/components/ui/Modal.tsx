import { Fragment, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`
                  relative w-full ${sizes[size]}
                  bg-white dark:bg-dark-800
                  rounded-2xl shadow-2xl
                  overflow-hidden
                `}
              >
                {(title || showClose) && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100 dark:border-dark-700">
                    <div>
                      {title && (
                        <h3 className="text-xl font-semibold text-dark-900 dark:text-white">
                          {title}
                        </h3>
                      )}
                      {description && (
                        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                    {showClose && (
                      <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-dark-400 hover:text-dark-600 hover:bg-dark-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
                <div className="p-6">{children}</div>
              </motion.div>
            </div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
}: ConfirmDialogProps) {
  const buttonVariants = {
    danger: 'bg-error-500 hover:bg-error-600 text-white',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white',
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showClose={false}>
      <p className="text-dark-600 dark:text-dark-300 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-dark-600 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonVariants[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
