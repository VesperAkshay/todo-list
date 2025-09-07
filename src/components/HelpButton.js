import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Keyboard, X } from 'lucide-react';
import './HelpButton.css';

const HelpButton = ({ onOpenShortcuts }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  const quickTips = [
    { key: 'Ctrl+N', action: 'New Todo' },
    { key: '/', action: 'Search' },
    { key: 'Ctrl+M', action: 'Menu' },
    { key: '?', action: 'Full Help' }
  ];

  return (
    <>
      <motion.div
        className="help-button-container"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          className="help-button"
          onClick={() => setShowQuickHelp(!showQuickHelp)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Keyboard shortcuts help"
        >
          <HelpCircle size={20} />
        </motion.button>

        <AnimatePresence>
          {showTooltip && !showQuickHelp && (
            <motion.div
              className="help-tooltip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              Click for quick shortcuts
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showQuickHelp && (
          <motion.div
            className="quick-help-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickHelp(false)}
          >
            <motion.div
              className="quick-help-panel"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="quick-help-header">
                <h3>
                  <Keyboard size={18} />
                  Quick Shortcuts
                </h3>
                <button 
                  className="close-quick-help"
                  onClick={() => setShowQuickHelp(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="quick-help-content">
                <div className="quick-shortcuts">
                  {quickTips.map((tip, index) => (
                    <motion.div
                      key={tip.key}
                      className="quick-shortcut-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <kbd className="quick-key">{tip.key}</kbd>
                      <span className="quick-action">{tip.action}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="quick-help-actions">
                  <button
                    className="view-all-shortcuts"
                    onClick={() => {
                      setShowQuickHelp(false);
                      onOpenShortcuts();
                    }}
                  >
                    <Keyboard size={16} />
                    View All Shortcuts
                  </button>
                </div>
              </div>

              <div className="quick-help-footer">
                <p>Press <kbd className="quick-key">?</kbd> for full help</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpButton;
