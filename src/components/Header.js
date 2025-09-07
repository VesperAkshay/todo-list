import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  ArrowUpDown,
  CheckSquare,
  Trash,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import './Header.css';

const Header = ({
  user,
  onLogout,
  onMenuClick,
  onCreateTodo,
  onOpenProfile,
  filters,
  onFiltersChange,
  view,
  onViewChange,
  sortBy,
  sortOrder,
  onSortChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onBulkAction
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleSearchChange = (e) => {
    onFiltersChange({
      ...filters,
      search: e.target.value
    });
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'updatedAt', label: 'Last Modified' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' }
  ];

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="brand">
          <h1>TodoApp</h1>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search todos..."
            value={filters.search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {selectedCount > 0 && (
          <motion.div
            className="bulk-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <span className="selection-count">
              {selectedCount} selected
            </span>
            <button
              className="bulk-action-btn"
              onClick={() => onBulkAction('complete')}
              title="Mark as complete"
            >
              <CheckSquare size={16} />
            </button>
            <button
              className="bulk-action-btn danger"
              onClick={() => onBulkAction('delete')}
              title="Delete selected"
            >
              <Trash size={16} />
            </button>
          </motion.div>
        )}

        <div className="header-controls">
          <button
            className={`view-toggle ${view === 'grid' ? 'active' : ''}`}
            onClick={() => onViewChange('grid')}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            className={`view-toggle ${view === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
            title="List view"
          >
            <List size={18} />
          </button>

          <div className="sort-dropdown">
            <button
              className="sort-button"
              onClick={() => setShowSortMenu(!showSortMenu)}
              title="Sort options"
            >
              <ArrowUpDown size={18} />
            </button>
            {showSortMenu && (
              <motion.div
                className="sort-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                    onClick={() => {
                      if (sortBy === option.value) {
                        onSortChange(option.value, sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        onSortChange(option.value, 'desc');
                      }
                      setShowSortMenu(false);
                    }}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <span className={`sort-indicator ${sortOrder}`}>
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <button
            className="create-button"
            onClick={onCreateTodo}
            title="Create new todo"
          >
            <Plus size={18} />
            <span>Add Todo</span>
          </button>
        </div>

        <div className="user-menu">
          <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div
              className="user-avatar"
              style={{ backgroundColor: user.avatar?.color || '#3b82f6' }}
            >
              {user.avatar?.initials || user.username.slice(0, 2).toUpperCase()}
            </div>
          </button>
          
          {showUserMenu && (
            <motion.div
              className="user-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <hr />
              <button 
                className="dropdown-item"
                onClick={onOpenProfile}
              >
                <Settings size={16} />
                Profile Settings
              </button>
              <button 
                className="dropdown-item danger"
                onClick={onLogout}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Click outside handlers */}
      {showUserMenu && (
        <div 
          className="overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
      {showSortMenu && (
        <div 
          className="overlay"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
