import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Circle, 
  Calendar, 
  Flag, 
  Edit, 
  Trash2, 
  Tag as TagIcon,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import './TodoItem.css';

const TodoItem = ({
  todo,
  isSelected,
  onSelect,
  onToggleComplete,
  onEdit,
  onDelete,
  view
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    
    return format(date, 'MMM d, yyyy');
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'var(--text-secondary)';
    
    const date = new Date(dueDate);
    
    if (isPast(date) && !isToday(date)) return 'var(--error)';
    if (isToday(date)) return 'var(--warning)';
    
    return 'var(--text-secondary)';
  };

  const priorityColors = {
    low: 'var(--success)',
    medium: 'var(--warning)',
    high: 'var(--error)'
  };

  const hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
  const completedSubtasks = hasSubtasks ? todo.subtasks.filter(st => st.completed).length : 0;

  return (
    <motion.div
      className={`todo-item ${view} ${todo.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="todo-item-header">
        <button
          className={`complete-button ${todo.completed ? 'completed' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
        >
          {todo.completed ? <Check size={16} /> : <Circle size={16} />}
        </button>

        <div className="todo-content">
          <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className="todo-description">
              {todo.description}
            </p>
          )}

          <div className="todo-metadata">
            <div className="metadata-row">
              {todo.dueDate && (
                <span 
                  className="due-date"
                  style={{ color: getDueDateColor(todo.dueDate) }}
                >
                  <Calendar size={12} />
                  {formatDueDate(todo.dueDate)}
                </span>
              )}

              <span 
                className="priority"
                style={{ color: priorityColors[todo.priority] }}
              >
                <Flag size={12} />
                {todo.priority}
              </span>

              {todo.category !== 'general' && (
                <span className="category">
                  {todo.category}
                </span>
              )}
            </div>

            {todo.tags && todo.tags.length > 0 && (
              <div className="tags">
                <TagIcon size={12} />
                {todo.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
                {todo.tags.length > 3 && (
                  <span className="tag-count">
                    +{todo.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {hasSubtasks && (
              <div className="subtasks-summary">
                <button
                  className="expand-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>
                    {completedSubtasks}/{todo.subtasks.length} subtasks
                  </span>
                </button>
              </div>
            )}
          </div>

          {isExpanded && hasSubtasks && (
            <motion.div
              className="subtasks-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {todo.subtasks.map(subtask => (
                <div key={subtask.id} className={`subtask ${subtask.completed ? 'completed' : ''}`}>
                  <span className="subtask-bullet">
                    {subtask.completed ? <Check size={12} /> : <Circle size={12} />}
                  </span>
                  <span className="subtask-text">{subtask.text}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="todo-actions">
          <button
            className="action-button edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit todo"
          >
            <Edit size={14} />
          </button>
          <button
            className="action-button delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete todo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="todo-footer">
        <span className="created-date">
          <Clock size={12} />
          Created {format(new Date(todo.createdAt), 'MMM d')}
        </span>
        
        {todo.completedAt && (
          <span className="completed-date">
            <Check size={12} />
            Completed {format(new Date(todo.completedAt), 'MMM d')}
          </span>
        )}
      </div>

      {isSelected && (
        <div className="selection-indicator" />
      )}
    </motion.div>
  );
};

export default TodoItem;
