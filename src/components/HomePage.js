import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Calendar,
  Users,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Target,
  Clock,
  Brain,
  Palette,
  Search,
  Keyboard
} from 'lucide-react';
import './HomePage.css';

const HomePage = ({ onGetStarted, onSignIn }) => {
  const features = [
    {
      icon: CheckCircle,
      title: "Smart Task Management",
      description: "Create, organize, and track your todos with intelligent categorization and priority management.",
      color: "var(--success)"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get smart suggestions and productivity insights powered by advanced AI technology.",
      color: "var(--primary)"
    },
    {
      icon: Palette,
      title: "Beautiful Themes",
      description: "Choose from 6 stunning themes including Light, Dark, Ocean, Forest, Sunset, and Minimal.",
      color: "var(--warning)"
    },
    {
      icon: Keyboard,
      title: "Keyboard Shortcuts",
      description: "Boost your productivity with powerful keyboard shortcuts for every action.",
      color: "var(--accent)"
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Find your todos instantly with powerful search and filtering capabilities.",
      color: "var(--text-secondary)"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is stored locally and securely with no external dependencies.",
      color: "var(--error)"
    }
  ];

  const stats = [
    { number: "6", label: "Beautiful Themes", icon: Palette },
    { number: "20+", label: "Keyboard Shortcuts", icon: Keyboard },
    { number: "∞", label: "Unlimited Todos", icon: Target },
    { number: "100%", label: "Privacy Focused", icon: Shield }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="hero-content">
          <motion.div className="hero-badge" variants={itemVariants}>
            <Sparkles size={16} />
            <span>AI-Powered Todo Management</span>
          </motion.div>
          
          <motion.h1 className="hero-title" variants={itemVariants}>
            Organize Your Life with
            <span className="hero-title-accent"> Smart Todos</span>
          </motion.h1>
          
          <motion.p className="hero-description" variants={itemVariants}>
            The most intelligent and beautiful todo app that adapts to your workflow.
            Featuring AI insights, multiple themes, keyboard shortcuts, and advanced productivity tools.
          </motion.p>
          
          <motion.div className="hero-actions" variants={itemVariants}>
            <button className="cta-button primary" onClick={onGetStarted}>
              <Play size={18} />
              Get Started Free
              <ArrowRight size={18} />
            </button>
            <button className="cta-button secondary" onClick={onSignIn}>
              Sign In
            </button>
          </motion.div>
          
          <motion.div className="hero-stats" variants={itemVariants}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <stat.icon size={20} className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
          
          <motion.div className="theme-preview-notice" variants={itemVariants}>
            <div className="theme-notice-content">
              <Palette size={16} className="theme-notice-icon" />
              <span>Try switching themes using the button in the bottom-right corner!</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div className="hero-visual" variants={itemVariants}>
          <div className="app-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="preview-title">TodoApp</div>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="preview-nav-item active">
                  <Target size={14} />
                  <span>All Tasks</span>
                </div>
                <div className="preview-nav-item">
                  <Calendar size={14} />
                  <span>Today</span>
                </div>
                <div className="preview-nav-item">
                  <Star size={14} />
                  <span>Important</span>
                </div>
              </div>
              <div className="preview-main">
                <div className="preview-todo completed">
                  <CheckCircle size={16} className="todo-check" />
                  <span>Learn React Hooks</span>
                </div>
                <div className="preview-todo">
                  <div className="todo-check-empty"></div>
                  <span>Build amazing todo app</span>
                  <div className="todo-priority high"></div>
                </div>
                <div className="preview-todo">
                  <div className="todo-check-empty"></div>
                  <span>Deploy to production</span>
                  <div className="todo-priority medium"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-content">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need to stay organized and productive
            </p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Themes Showcase */}
      <motion.section 
        className="themes-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-content">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">Beautiful Themes</h2>
            <p className="section-description">
              Choose from 6 carefully crafted themes to match your style
            </p>
          </motion.div>
          
          <motion.div className="themes-showcase" variants={itemVariants}>
            <div className="theme-preview light">
              <div className="theme-header">
                <div className="theme-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="theme-name">Light</span>
              </div>
              <div className="theme-content">
                <div className="theme-sidebar"></div>
                <div className="theme-main">
                  <div className="theme-todo"></div>
                  <div className="theme-todo"></div>
                </div>
              </div>
            </div>
            
            <div className="theme-preview dark">
              <div className="theme-header">
                <div className="theme-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="theme-name">Dark</span>
              </div>
              <div className="theme-content">
                <div className="theme-sidebar"></div>
                <div className="theme-main">
                  <div className="theme-todo"></div>
                  <div className="theme-todo"></div>
                </div>
              </div>
            </div>
            
            <div className="theme-preview ocean">
              <div className="theme-header">
                <div className="theme-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="theme-name">Ocean</span>
              </div>
              <div className="theme-content">
                <div className="theme-sidebar"></div>
                <div className="theme-main">
                  <div className="theme-todo"></div>
                  <div className="theme-todo"></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="themes-cta" variants={itemVariants}>
            <div className="themes-cta-content">
              <p className="themes-cta-text">
                <Palette size={18} />
                Try all 6 themes live! Use the theme selector in the bottom-right corner to switch between Light, Dark, Ocean, Forest, Sunset, and Minimal themes.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-content">
          <motion.div className="cta-content" variants={itemVariants}>
            <h2 className="cta-title">Ready to Get Organized?</h2>
            <p className="cta-description">
              Join thousands of users who have transformed their productivity with our smart todo app.
              Start your journey to better organization today.
            </p>
            <div className="cta-actions">
              <button className="cta-button primary large" onClick={onGetStarted}>
                <Play size={20} />
                Start Your Journey
                <ArrowRight size={20} />
              </button>
              <div className="cta-features">
                <div className="cta-feature">
                  <CheckCircle size={16} />
                  <span>Free to use</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle size={16} />
                  <span>No signup required</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle size={16} />
                  <span>Privacy focused</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TodoApp</h3>
            <p>The smart way to organize your life</p>
          </div>
          <div className="footer-features">
            <div className="footer-feature">
              <Sparkles size={16} />
              <span>AI-Powered</span>
            </div>
            <div className="footer-feature">
              <Palette size={16} />
              <span>6 Themes</span>
            </div>
            <div className="footer-feature">
              <Keyboard size={16} />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="footer-feature">
              <Shield size={16} />
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
