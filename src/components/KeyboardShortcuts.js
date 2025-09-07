import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import './KeyboardShortcuts.css';

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  const shortcuts = [
    {
      category: "General",
      items: [
        { keys: ["Ctrl", "N"], description: "Create new todo", mac: ["⌘", "N"] },
        { keys: ["Ctrl", "P"], description: "Open profile", mac: ["⌘", "P"] },
        { keys: ["Ctrl", "M"], description: "Toggle sidebar", mac: ["⌘", "M"] },
        { keys: ["/"], description: "Focus search", mac: ["/"] },
        { keys: ["Escape"], description: "Cancel/Close", mac: ["Escape"] },
        { keys: ["?"], description: "Show keyboard shortcuts", mac: ["?"] }
      ]
    },
    {
      category: "Todo Management",
      items: [
        { keys: ["Ctrl", "A"], description: "Select all todos", mac: ["⌘", "A"] },
        { keys: ["Ctrl", "D"], description: "Duplicate selected todo", mac: ["⌘", "D"] },
        { keys: ["Delete"], description: "Delete selected todos", mac: ["Delete"] },
        { keys: ["Enter"], description: "Save todo (when editing)", mac: ["Enter"] },
        { keys: ["Escape"], description: "Cancel editing", mac: ["Escape"] }
      ]
    },
    {
      category: "AI Features",
      items: [
        { keys: ["Ctrl", "I"], description: "Toggle AI insights", mac: ["⌘", "I"] },
        { keys: ["Ctrl", "B"], description: "Open AI settings", mac: ["⌘", "B"] }
      ]
    },
    {
      category: "Navigation",
      items: [
        { keys: ["Tab"], description: "Navigate between elements", mac: ["Tab"] },
        { keys: ["Shift", "Tab"], description: "Navigate backwards", mac: ["Shift", "Tab"] },
        { keys: ["↑", "↓"], description: "Navigate todo list", mac: ["↑", "↓"] }
      ]
    }
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const renderKeys = (keys, macKeys) => {
    const keysToShow = isMac && macKeys ? macKeys : keys;
    return (
      <div className="shortcut-keys">
        {keysToShow.map((key, index) => (
          <span key={index}>
            <kbd className="key">{key}</kbd>
            {index < keysToShow.length - 1 && <span className="plus">+</span>}
          </span>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="shortcuts-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="shortcuts-dialog"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shortcuts-header">
              <h2>
                <Keyboard size={24} />
                Keyboard Shortcuts
              </h2>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="shortcuts-content">
              {shortcuts.map((category, categoryIndex) => (
                <div key={categoryIndex} className="shortcut-category">
                  <h3 className="category-title">{category.category}</h3>
                  <div className="shortcut-list">
                    {category.items.map((shortcut, shortcutIndex) => (
                      <div key={shortcutIndex} className="shortcut-item">
                        <div className="shortcut-description">
                          {shortcut.description}
                        </div>
                        {renderKeys(shortcut.keys, shortcut.mac)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="shortcuts-footer">
              <div className="shortcuts-tip">
                <p>💡 <strong>Pro tip:</strong> Most shortcuts work globally throughout the app</p>
                <p>Press <kbd className="key">?</kbd> anywhere to toggle this help</p>
              </div>
              <div className="shortcuts-note">
                <p className="platform-note">
                  {isMac ? 'macOS shortcuts shown' : 'Windows/Linux shortcuts shown'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;
