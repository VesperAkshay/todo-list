import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './components/AuthForm';
import TodoApp from './components/TodoApp';
import ThemeSelector from './components/ThemeSelector';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleThemeChange = (newTheme) => {
    console.log('Changing theme to:', newTheme); // Debug log
    console.log('Before change - current theme:', theme); // Debug log
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    console.log('After change - document theme attribute:', document.documentElement.getAttribute('data-theme')); // Debug log
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AuthForm onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TodoApp 
              user={user} 
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
              theme={theme}
              onThemeChange={handleThemeChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <ThemeSelector 
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}

export default App;
