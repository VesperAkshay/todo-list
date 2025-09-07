import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import './ShortcutTip.css';

const ShortcutTip = () => {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    { key: 'Ctrl + N', action: 'Create new todo', icon: '📝' },
    { key: '/', action: 'Focus search', icon: '🔍' },
    { key: 'Ctrl + M', action: 'Toggle sidebar', icon: '📋' },
    { key: '?', action: 'Show all shortcuts', icon: '❓' },
    { key: 'Ctrl + I', action: 'AI insights', icon: '🤖' }
  ];

  useEffect(() => {
    // Show tip after 3 seconds on first visit
    const hasSeenTips = localStorage.getItem('hasSeenShortcutTips');
    if (!hasSeenTips) {
      const timer = setTimeout(() => {
        setShowTip(true);
        localStorage.setItem('hasSeenShortcutTips', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (showTip) {
      // Cycle through tips every 4 seconds
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showTip, tips.length]);

  const dismissTip = () => {
    setShowTip(false);
  };

  const showNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  return (
    <AnimatePresence>
      {showTip && (
        <motion.div
          className="shortcut-tip"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <div className="tip-header">
            <div className="tip-icon">
              <Keyboard size={16} />
            </div>
            <button className="tip-close" onClick={dismissTip}>
              <X size={14} />
            </button>
          </div>
          
          <motion.div
            key={currentTip}
            className="tip-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tip-emoji">{tips[currentTip].icon}</div>
            <div className="tip-text">
              <kbd className="tip-key">{tips[currentTip].key}</kbd>
              <span className="tip-action">{tips[currentTip].action}</span>
            </div>
          </motion.div>

          <div className="tip-footer">
            <button className="tip-next" onClick={showNextTip}>
              Next tip
            </button>
            <div className="tip-dots">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={`tip-dot ${index === currentTip ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShortcutTip;
