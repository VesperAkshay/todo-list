import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Flag, 
  Tag as TagIcon, 
  AlignLeft,
  Plus,
  Trash2,
  Brain,
  Sparkles,
  Zap
} from 'lucide-react';
import './TodoForm.css';
import { aiService } from '../services/aiService';

const TodoForm = ({ todo, categories, tags, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    dueDate: '',
    tags: [],
    subtasks: []
  });
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiFeatures, setAiFeatures] = useState({
    smartParsing: true,
    autoCategories: true,
    dateParsing: true,
    priorityDetection: true
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        category: todo.category || 'general',
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        tags: todo.tags || [],
        subtasks: todo.subtasks || []
      });
    }

    // Load AI features settings
    const savedFeatures = localStorage.getItem('ai_features');
    if (savedFeatures) {
      setAiFeatures(JSON.parse(savedFeatures));
    }
  }, [todo]);

  // AI processing functions
  const processWithAI = async (text) => {
    if (!text.trim() || !aiFeatures.smartParsing) return;

    setIsProcessingAI(true);
    try {
      const smartParsed = aiService.parseSmartTodo(text);
      
      if (smartParsed) {
        setAiSuggestions(smartParsed);
        setShowAISuggestions(true);
      }
    } catch (error) {
      console.error('AI processing error:', error);
    }
    setIsProcessingAI(false);
  };

  const applyAISuggestions = () => {
    if (!aiSuggestions) return;

    const updates = {};
    
    if (aiFeatures.dateParsing && aiSuggestions.dueDate) {
      updates.dueDate = aiSuggestions.dueDate.split('T')[0];
    }
    
    if (aiFeatures.priorityDetection && aiSuggestions.priority) {
      updates.priority = aiSuggestions.priority;
    }
    
    if (aiFeatures.autoCategories && aiSuggestions.category) {
      updates.category = aiSuggestions.category.toLowerCase();
    }

    if (aiSuggestions.title && aiSuggestions.title !== formData.title) {
      updates.title = aiSuggestions.title;
    }

    setFormData(prev => ({ ...prev, ...updates }));
    setShowAISuggestions(false);
  };

  const dismissAISuggestions = () => {
    setShowAISuggestions(false);
    setAiSuggestions(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Trigger AI processing for title changes
    if (name === 'title' && value.trim().length > 5) {
      processWithAI(value);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [
          ...prev.subtasks,
          {
            id: Date.now().toString(),
            text: newSubtask.trim(),
            completed: false
          }
        ]
      }));
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };

    onSubmit(submitData);
  };

  const priorityColors = {
    low: 'var(--success)',
    medium: 'var(--warning)',
    high: 'var(--error)'
  };

  return (
    <motion.div
      className="todo-form-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="todo-form"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-header">
          <h2>{todo ? 'Edit Todo' : 'Create New Todo'}</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter todo title..."
              autoFocus
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            
            {/* AI Processing Indicator */}
            {isProcessingAI && (
              <div className="ai-processing">
                <Brain className="spinning" size={16} />
                <span>AI is analyzing your todo...</span>
              </div>
            )}

            {/* AI Suggestions */}
            {showAISuggestions && aiSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ai-suggestions"
              >
                <div className="ai-suggestions-header">
                  <Sparkles size={16} />
                  <span>AI Suggestions</span>
                </div>
                <div className="ai-suggestions-content">
                  {aiSuggestions.extractedInfo.dueDate && (
                    <div className="ai-suggestion-item">
                      <Calendar size={14} />
                      <span>Due: {new Date(aiSuggestions.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {aiSuggestions.extractedInfo.priority && (
                    <div className="ai-suggestion-item">
                      <Flag size={14} />
                      <span>Priority: {aiSuggestions.priority}</span>
                    </div>
                  )}
                  {aiSuggestions.extractedInfo.category && (
                    <div className="ai-suggestion-item">
                      <TagIcon size={14} />
                      <span>Category: {aiSuggestions.category}</span>
                    </div>
                  )}
                  {aiSuggestions.title !== formData.title && (
                    <div className="ai-suggestion-item">
                      <Zap size={14} />
                      <span>Cleaned title: "{aiSuggestions.title}"</span>
                    </div>
                  )}
                </div>
                <div className="ai-suggestions-actions">
                  <button
                    type="button"
                    className="ai-apply-button"
                    onClick={applyAISuggestions}
                  >
                    Apply Suggestions
                  </button>
                  <button
                    type="button"
                    className="ai-dismiss-button"
                    onClick={dismissAISuggestions}
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <AlignLeft size={16} />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">
                <Flag size={16} />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                style={{ borderLeft: `4px solid ${priorityColors[formData.priority]}` }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="general">General</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              <Calendar size={16} />
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className={errors.dueDate ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          <div className="form-group">
            <label>
              <TagIcon size={16} />
              Tags
            </label>
            <div className="tags-container">
              <div className="tags-list">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  className="add-tag-button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  <Plus size={16} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="suggested-tags">
                  <span className="suggested-label">Suggested:</span>
                  {tags
                    .filter(tag => !formData.tags.includes(tag))
                    .slice(0, 5)
                    .map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className="suggested-tag"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            tags: [...prev.tags, tag]
                          }));
                        }}
                      >
                        {tag}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Subtasks</label>
            <div className="subtasks-container">
              {formData.subtasks.map(subtask => (
                <div key={subtask.id} className="subtask-item">
                  <span>{subtask.text}</span>
                  <button
                    type="button"
                    className="subtask-remove"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <div className="subtask-input">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  className="add-subtask-button"
                  onClick={handleAddSubtask}
                  disabled={!newSubtask.trim()}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
            >
              {todo ? 'Update Todo' : 'Create Todo'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TodoForm;
