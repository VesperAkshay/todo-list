import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  Calendar,
  Award,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { aiService } from '../services/aiService';

const AIInsights = ({ todos, completedTodos, isVisible }) => {
  const [insights, setInsights] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (isVisible && (todos.length > 0 || completedTodos.length > 0)) {
      generateInsights();
    }
  }, [todos, completedTodos, isVisible]);

  const generateInsights = async () => {
    setIsLoading(true);
    
    try {
      // Generate insights
      const aiInsights = aiService.generateInsights(todos, completedTodos);
      setInsights(aiInsights);

      // Generate suggestions
      const todoSuggestions = aiService.generateTodoSuggestions(todos);
      setSuggestions(todoSuggestions);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error generating insights:', error);
    }
    
    setIsLoading(false);
  };

  const getProductivityStats = () => {
    const totalTasks = todos.length + completedTodos.length;
    const completionRate = totalTasks > 0 ? (completedTodos.length / totalTasks) * 100 : 0;
    
    const overdueTasks = todos.filter(todo => 
      todo.dueDate && new Date(todo.dueDate) < new Date()
    ).length;

    const todayTasks = todos.filter(todo => {
      if (!todo.dueDate) return false;
      const taskDate = new Date(todo.dueDate);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    }).length;

    const upcomingTasks = todos.filter(todo => {
      if (!todo.dueDate) return false;
      const taskDate = new Date(todo.dueDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return taskDate >= tomorrow && taskDate <= nextWeek;
    }).length;

    return {
      totalTasks,
      completionRate,
      overdueTasks,
      todayTasks,
      upcomingTasks
    };
  };

  const getCategoryDistribution = () => {
    const categories = {};
    [...todos, ...completedTodos].forEach(todo => {
      if (todo.category) {
        categories[todo.category] = (categories[todo.category] || 0) + 1;
      }
    });
    return categories;
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return <Award className="icon success" />;
      case 'warning': return <AlertTriangle className="icon warning" />;
      case 'suggestion': return <Lightbulb className="icon suggestion" />;
      case 'info': return <Target className="icon info" />;
      default: return <Brain className="icon" />;
    }
  };

  if (!isVisible) return null;

  const stats = getProductivityStats();
  const categoryDistribution = getCategoryDistribution();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="ai-insights-panel"
    >
      <div className="insights-header">
        <h3>
          <Brain className="icon" />
          AI Insights
        </h3>
        <button 
          onClick={generateInsights}
          className="refresh-button"
          disabled={isLoading}
        >
          <RefreshCw className={`icon ${isLoading ? 'spinning' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="icon" />
          </motion.div>
          <p>Analyzing your productivity patterns...</p>
        </div>
      ) : (
        <div className="insights-content">
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <TrendingUp className="icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.completionRate.toFixed(1)}%</span>
                <span className="stat-label">Completion Rate</span>
              </div>
            </div>
            
            <div className="stat-card">
              <Calendar className="icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.todayTasks}</span>
                <span className="stat-label">Due Today</span>
              </div>
            </div>
            
            <div className="stat-card">
              <Clock className="icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.overdueTasks}</span>
                <span className="stat-label">Overdue</span>
              </div>
            </div>
            
            <div className="stat-card">
              <Target className="icon" />
              <div className="stat-info">
                <span className="stat-value">{stats.upcomingTasks}</span>
                <span className="stat-label">This Week</span>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          {Object.keys(categoryDistribution).length > 0 && (
            <div className="insights-section">
              <h4>
                <BarChart3 className="icon" />
                Task Distribution
              </h4>
              <div className="category-chart">
                {Object.entries(categoryDistribution).map(([category, count]) => {
                  const percentage = (count / stats.totalTasks) * 100;
                  return (
                    <div key={category} className="category-bar">
                      <div className="category-info">
                        <span className="category-name">{category}</span>
                        <span className="category-count">{count} tasks</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className="progress-fill"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {insights.length > 0 && (
            <div className="insights-section">
              <h4>
                <Lightbulb className="icon" />
                Productivity Insights
              </h4>
              <div className="insights-list">
                <AnimatePresence>
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`insight-card ${insight.type}`}
                    >
                      <div className="insight-icon">
                        {getInsightIcon(insight.type)}
                        <span className="insight-emoji">{insight.icon}</span>
                      </div>
                      <div className="insight-content">
                        <h5>{insight.title}</h5>
                        <p>{insight.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Smart Suggestions */}
          {suggestions.length > 0 && (
            <div className="insights-section">
              <h4>
                <Target className="icon" />
                Smart Suggestions
              </h4>
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="suggestion-card"
                  >
                    <div className="suggestion-content">
                      <h5>{suggestion.text}</h5>
                      <div className="suggestion-meta">
                        <span className="suggestion-category">{suggestion.category}</span>
                        <span className="suggestion-priority">{suggestion.priority}</span>
                      </div>
                      <p className="suggestion-reason">{suggestion.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="insights-footer">
              <p className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AIInsights;
