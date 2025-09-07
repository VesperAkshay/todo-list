import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Filter, 
  BarChart3, 
  Calendar, 
  Flag, 
  Tag as TagIcon,
  CheckCircle,
  Circle,
  Clock
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  user, 
  categories, 
  tags, 
  stats, 
  onClose, 
  filters, 
  onFiltersChange 
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 200 
      }
    },
    exit: { 
      x: -300, 
      opacity: 0,
      transition: { 
        duration: 0.2 
      }
    }
  };

  return (
    <>
      <motion.div
        className="sidebar-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="sidebar-header">
          <h2>Filters & Stats</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Stats Section */}
          <section className="stats-section">
            <h3>
              <BarChart3 size={16} />
              Statistics
            </h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.total || 0}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.completed || 0}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.pending || 0}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.overdue || 0}</span>
                <span className="stat-label">Overdue</span>
              </div>
            </div>
            
            {stats.total > 0 && (
              <div className="completion-rate">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${stats.completionRate || 0}%` }}
                  />
                </div>
                <span className="progress-text">
                  {stats.completionRate || 0}% Complete
                </span>
              </div>
            )}
          </section>

          {/* Filters Section */}
          <section className="filters-section">
            <h3>
              <Filter size={16} />
              Filters
            </h3>

            {/* Status Filter */}
            <div className="filter-group">
              <label>Status</label>
              <div className="filter-options">
                {[
                  { value: 'all', label: 'All', icon: Circle },
                  { value: 'pending', label: 'Pending', icon: Clock },
                  { value: 'completed', label: 'Completed', icon: CheckCircle },
                  { value: 'overdue', label: 'Overdue', icon: Calendar }
                ].map(option => (
                  <button
                    key={option.value}
                    className={`filter-option ${filters.status === option.value ? 'active' : ''}`}
                    onClick={() => handleFilterChange('status', option.value)}
                  >
                    <option.icon size={14} />
                    {option.label}
                    {option.value === 'pending' && stats.pending > 0 && (
                      <span className="count">{stats.pending}</span>
                    )}
                    {option.value === 'completed' && stats.completed > 0 && (
                      <span className="count">{stats.completed}</span>
                    )}
                    {option.value === 'overdue' && stats.overdue > 0 && (
                      <span className="count">{stats.overdue}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="filter-group">
              <label>
                <Flag size={14} />
                Priority
              </label>
              <div className="filter-options">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' }
                ].map(option => (
                  <button
                    key={option.value}
                    className={`filter-option ${filters.priority === option.value ? 'active' : ''}`}
                    onClick={() => handleFilterChange('priority', option.value)}
                  >
                    {option.value !== 'all' && (
                      <div 
                        className="priority-dot"
                        style={{ 
                          backgroundColor: 
                            option.value === 'high' ? 'var(--error)' :
                            option.value === 'medium' ? 'var(--warning)' : 'var(--success)'
                        }}
                      />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="filter-group">
                <label>Categories</label>
                <div className="filter-options">
                  <button
                    className={`filter-option ${filters.category === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', 'all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-option ${filters.category === 'general' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', 'general')}
                  >
                    General
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`filter-option ${filters.category === category ? 'active' : ''}`}
                      onClick={() => handleFilterChange('category', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="filter-group">
                <label>
                  <TagIcon size={14} />
                  Tags
                </label>
                <div className="filter-options">
                  <button
                    className={`filter-option ${!filters.tag ? 'active' : ''}`}
                    onClick={() => handleFilterChange('tag', '')}
                  >
                    All Tags
                  </button>
                  {tags.slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      className={`filter-option tag-option ${filters.tag === tag ? 'active' : ''}`}
                      onClick={() => handleFilterChange('tag', filters.tag === tag ? '' : tag)}
                    >
                      {tag}
                    </button>
                  ))}
                  {tags.length > 8 && (
                    <span className="more-tags">
                      +{tags.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(filters.status !== 'all' || 
              filters.priority !== 'all' || 
              filters.category !== 'all' || 
              filters.tag || 
              filters.search) && (
              <button
                className="clear-filters"
                onClick={() => onFiltersChange({
                  status: 'all',
                  priority: 'all',
                  category: 'all',
                  search: '',
                  tag: ''
                })}
              >
                Clear All Filters
              </button>
            )}
          </section>

          {/* User Info */}
          <section className="user-section">
            <div className="user-info">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="user-avatar user-avatar-image"
                />
              ) : (
                <div 
                  className="user-avatar"
                  style={{ backgroundColor: user.avatar?.color || '#3b82f6' }}
                >
                  {user.avatar?.initials || user.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="user-details">
                <div className="username">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
