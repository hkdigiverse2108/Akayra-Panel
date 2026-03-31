import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "You want to delete this record? This action cannot be undone.",
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  variant = 'danger',
  loading = false,
}) => {
  const variantStyles = {
    danger: "text-red-500 bg-red-50 dark:bg-red-500/10",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
    primary: "text-primary-500 bg-primary-50 dark:bg-primary-500/10",
  };

  const buttonVariant = variant === 'danger' ? 'danger' : variant === 'warning' ? 'secondary' : 'primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        <div className={`h-16 w-16 rounded-3xl flex items-center justify-center shadow-sm ${variantStyles[variant]}`}>
          <AlertCircle size={32} />
        </div>
        
        <div className="space-y-2 px-4">
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
            "{message}"
          </p>
        </div>

        <div className="flex items-center gap-4 w-full pt-4">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={buttonVariant}
            onClick={onConfirm} 
            className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95"
            isLoading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
