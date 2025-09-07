import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';
import './ConfirmDialog.css';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      onConfirm();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={24} className="danger-icon" />;
      case 'warning':
        return <AlertTriangle size={24} className="warning-icon" />;
      case 'info':
        return <Check size={24} className="info-icon" />;
      default:
        return <AlertTriangle size={24} className="danger-icon" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <motion.div
            className={`confirm-dialog ${type}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="confirm-header">
              <div className="confirm-icon">
                {getIcon()}
              </div>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="confirm-content">
              <h3 className="confirm-title">{title}</h3>
              <p className="confirm-message">{message}</p>
            </div>

            <div className="confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                autoFocus
              >
                {cancelText}
              </button>
              <button
                className={`btn btn-${type}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
