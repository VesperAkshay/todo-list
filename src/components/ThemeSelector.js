import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sun, Moon, Droplets, Minimize } from 'lucide-react';
import './ThemeSelector.css';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      name: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Clean and bright'
    },
    {
      name: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes'
    },
    {
      name: 'minimal',
      label: 'Minimal',
      icon: Minimize,
      description: 'Simple and clean'
    },
    {
      name: 'ocean',
      label: 'Ocean',
      icon: Droplets,
      description: 'Cool and calming'
    }
  ];

  const currentThemeData = themes.find(theme => theme.name === currentTheme);

  const handleThemeSelect = (themeName) => {
    console.log('Theme selected:', themeName); // Debug log
    console.log('onThemeChange function:', onThemeChange); // Debug log
    if (onThemeChange) {
      onThemeChange(themeName);
    }
    setIsOpen(false);
  };

  return (
    <div className="theme-selector">
      <motion.button
        className="theme-toggle"
        onClick={() => {
          console.log('Theme toggle clicked, current state:', isOpen); // Debug log
          setIsOpen(!isOpen);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Change theme"
      >
        <Palette size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="theme-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="theme-menu"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="theme-menu-header">
                <h3>Choose Theme</h3>
                <p>Select your preferred color scheme</p>
              </div>

              <div className="theme-options">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    className={`theme-option ${currentTheme === theme.name ? 'active' : ''}`}
                    onClick={() => handleThemeSelect(theme.name)}
                    type="button"
                  >
                    <div className="theme-icon">
                      <theme.icon size={18} />
                    </div>
                    <div className="theme-info">
                      <div className="theme-name">{theme.label}</div>
                      <div className="theme-description">{theme.description}</div>
                    </div>
                    {currentTheme === theme.name && (
                      <div className="theme-check">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="theme-preview">
                <div className="preview-label">Current: {currentThemeData?.label}</div>
                <div className="preview-colors">
                  <div className="color-sample primary" />
                  <div className="color-sample secondary" />
                  <div className="color-sample accent" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
