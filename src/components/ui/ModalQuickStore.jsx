import React, { useEffect } from 'react';
import { X, Shield, Lock, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const QuickStoreLogo = ({ size = "w-8 h-8" }) => (
  <div className={`relative inline-flex items-center justify-center ${size} bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-lg overflow-hidden`}>
    <div className="absolute inset-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-inner">
      <Shield className="h-1/2 w-1/2 text-slate-200" />
    </div>
    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
      <Lock className="h-1.5 w-1.5 text-white" />
    </div>
  </div>
);

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
}) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl mx-4",
  };

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4",
          "w-full mx-4 max-h-[90vh] overflow-hidden",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
        
        {children}
      </div>
    </div>
  );
};

// Modal Header Component
const ModalHeader = ({ 
  children, 
  showLogo = false, 
  className,
  variant = "default" 
}) => {
  const variantClasses = {
    default: "border-b border-gray-200",
    gradient: "bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200",
    danger: "bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200",
    success: "bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200",
  };

  return (
    <div className={cn(
      "px-6 py-4 flex items-center space-x-3",
      variantClasses[variant],
      className
    )}>
      {showLogo && <QuickStoreLogo />}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

// Modal Body Component
const ModalBody = ({ 
  children, 
  className,
  scrollable = false 
}) => (
  <div className={cn(
    "px-6 py-4",
    scrollable && "max-h-96 overflow-y-auto",
    className
  )}>
    {children}
  </div>
);

// Modal Footer Component
const ModalFooter = ({ 
  children, 
  className,
  justify = "end" 
}) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <div className={cn(
      "px-6 py-4 border-t border-gray-200 flex items-center space-x-3",
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}) => {
  const variants = {
    default: {
      icon: Info,
      iconColor: "text-blue-600",
      confirmButton: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      confirmButton: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      confirmButton: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-orange-600",
      confirmButton: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBody>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Icon className={cn("w-6 h-6", config.iconColor)} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "px-4 py-2 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center space-x-2",
                config.confirmButton
              )}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

// Form Modal with QuickStore Styling
const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
  size = "md",
  showLogo = true,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <form onSubmit={handleSubmit}>
        <ModalHeader showLogo={showLogo} variant="gradient">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </ModalHeader>
        
        <ModalBody scrollable>
          {children}
        </ModalBody>
        
        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{submitText}</span>
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

// Alert Modal
const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
  buttonText = "OK",
}) => {
  const variants = {
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      headerVariant: "default",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600", 
      iconBg: "bg-green-100",
      headerVariant: "success",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100", 
      headerVariant: "gradient",
    },
    error: {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      headerVariant: "danger",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader variant={config.headerVariant}>
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-lg", config.iconBg)}>
            <Icon className={cn("w-5 h-5", config.iconColor)} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </ModalHeader>
      
      <ModalBody>
        <p className="text-gray-600">{message}</p>
      </ModalBody>
      
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {buttonText}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  ConfirmationModal, 
  FormModal, 
  AlertModal 
};