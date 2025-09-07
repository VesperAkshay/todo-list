import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import './StatsPanel.css';

const StatsPanel = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total || 0,
      icon: TrendingUp,
      color: 'var(--accent)'
    },
    {
      label: 'Completed',
      value: stats.completed || 0,
      icon: CheckCircle,
      color: 'var(--success)'
    },
    {
      label: 'Pending',
      value: stats.pending || 0,
      icon: Clock,
      color: 'var(--warning)'
    },
    {
      label: 'Overdue',
      value: stats.overdue || 0,
      icon: AlertTriangle,
      color: 'var(--error)'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="stats-panel"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          className="stat-card"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 24px var(--shadow-lg)'
          }}
        >
          <div className="stat-icon" style={{ color: item.color }}>
            <item.icon size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="stat-label">{item.label}</div>
          </div>
        </motion.div>
      ))}

      {stats.total > 0 && (
        <motion.div
          className="progress-card"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="progress-header">
            <span className="progress-title">Progress</span>
            <span className="progress-percentage">
              {stats.completionRate || 0}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="progress-text">
            {stats.completed || 0} of {stats.total || 0} tasks completed
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatsPanel;
