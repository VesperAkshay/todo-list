import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Eye, 
  EyeOff,
  Upload,
  Download,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { authService } from '../services/authService';
import { todoService } from '../services/todoService';
import './ProfileSettings.css';

const ProfileSettings = ({ user, onUserUpdate, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      const updatedUser = authService.updateUser(user.id, {
        username: formData.username,
        email: formData.email
      });
      
      onUserUpdate(updatedUser);
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      authService.changePassword(
        user.id, 
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (error) {
      setErrors({ password: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      authService.deleteAccount(user.id);
      onLogout();
    } catch (error) {
      setErrors({ delete: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = todoService.exportTodos(user.id, 'json');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todos-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrors({ export: 'Failed to export data' });
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCount = todoService.importTodos(user.id, e.target.result, 'json');
        alert(`Successfully imported ${importedCount} todos!`);
      } catch (error) {
        setErrors({ import: 'Failed to import data. Please check the file format.' });
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'data', label: 'Data', icon: FileText }
  ];

  return (
    <motion.div
      className="profile-settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="profile-settings"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2>Profile Settings</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <motion.div
              className="tab-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="profile-section">
                <div className="profile-avatar">
                  <div
                    className="avatar-circle"
                    style={{ backgroundColor: user.avatar?.color || '#3b82f6' }}
                  >
                    {user.avatar?.initials || user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <button className="edit-avatar">
                    <Edit size={14} />
                  </button>
                </div>

                <div className="profile-form">
                  <div className="form-group">
                    <label>Username</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={errors.username ? 'error' : ''}
                      />
                      {!isEditing && (
                        <button
                          className="edit-button"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit size={14} />
                        </button>
                      )}
                    </div>
                    {errors.username && <span className="error-message">{errors.username}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Member Since</label>
                    <input
                      type="text"
                      value={new Date(user.createdAt).toLocaleDateString()}
                      disabled
                    />
                  </div>

                  {isEditing && (
                    <div className="form-actions">
                      <button
                        className="cancel-button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            username: user.username,
                            email: user.email
                          });
                          setErrors({});
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="save-button"
                        onClick={handleProfileSave}
                        disabled={isLoading}
                      >
                        <Save size={14} />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}

                  {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              className="tab-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="security-section">
                <div className="security-item">
                  <div className="security-info">
                    <h3>Change Password</h3>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button
                    className="action-button"
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                  >
                    <Lock size={14} />
                    Change Password
                  </button>
                </div>

                <AnimatePresence>
                  {showPasswordChange && (
                    <motion.div
                      className="password-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="form-group">
                        <label>Current Password</label>
                        <div className="password-input">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={errors.currentPassword ? 'error' : ''}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              current: !prev.current
                            }))}
                          >
                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={errors.newPassword ? 'error' : ''}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              new: !prev.new
                            }))}
                          >
                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="password-input">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={errors.confirmPassword ? 'error' : ''}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              confirm: !prev.confirm
                            }))}
                          >
                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                      </div>

                      <div className="form-actions">
                        <button
                          className="cancel-button"
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                            setErrors({});
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="save-button"
                          onClick={handlePasswordSave}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>

                      {errors.password && (
                        <div className="error-message">{errors.password}</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="security-item danger">
                  <div className="security-info">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button
                    className="action-button danger"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 size={14} />
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              className="tab-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="data-section">
                <div className="data-item">
                  <div className="data-info">
                    <h3>Export Data</h3>
                    <p>Download all your todos as a JSON file</p>
                  </div>
                  <button
                    className="action-button"
                    onClick={handleExportData}
                  >
                    <Download size={14} />
                    Export
                  </button>
                </div>

                <div className="data-item">
                  <div className="data-info">
                    <h3>Import Data</h3>
                    <p>Import todos from a JSON file</p>
                  </div>
                  <label className="action-button">
                    <Upload size={14} />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      style={{ display: 'none' }}
                      onChange={handleImportData}
                    />
                  </label>
                </div>

                {errors.export && (
                  <div className="error-message">{errors.export}</div>
                )}
                {errors.import && (
                  <div className="error-message">{errors.import}</div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              className="confirm-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="confirm-dialog"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="confirm-icon">
                  <AlertTriangle size={24} />
                </div>
                <h3>Delete Account?</h3>
                <p>This action cannot be undone. All your todos and data will be permanently deleted.</p>
                <div className="confirm-actions">
                  <button
                    className="cancel-button"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete-button"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
                {errors.delete && (
                  <div className="error-message">{errors.delete}</div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSettings;
