import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Calendar,
  Upload,
  Settings,
  Trash2
} from 'lucide-react';
import { authService } from '../services/authService';
import './ProfileSection.css';

const ProfileSection = ({ user, onUserUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // Keep editedUser in sync with user prop changes
  useEffect(() => {
    setEditedUser({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || null
    });
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        ...editedUser,
        updatedAt: new Date().toISOString()
      };
      
      // Update user in auth service
      const savedUser = authService.updateUserProfile(updatedUser);
      
      // Call parent update function
      onUserUpdate(savedUser);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || null
    });
    setIsEditing(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleProfilePictureUpload(file);
    }
  };

  const handleProfilePictureUpload = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Convert to base64 for local storage
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      
      // Update local state
      setEditedUser(prev => ({
        ...prev,
        profilePicture: base64Image
      }));

      try {
        // Immediately save the profile picture to the database
        const updatedUser = {
          ...user,
          profilePicture: base64Image,
          updatedAt: new Date().toISOString()
        };
        
        const savedUser = authService.updateUserProfile(updatedUser);
        onUserUpdate(savedUser);
        
        setNotification({ type: 'success', message: 'Profile picture uploaded successfully!' });
        setTimeout(() => setNotification(null), 3000);
        console.log('Profile picture saved successfully');
      } catch (error) {
        console.error('Error saving profile picture:', error);
        alert('Error saving profile picture. Please try again.');
      }
      
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePicture = async () => {
    try {
      // Update local state
      setEditedUser(prev => ({
        ...prev,
        profilePicture: null
      }));

      // Immediately save the removal to the database
      const updatedUser = {
        ...user,
        profilePicture: null,
        updatedAt: new Date().toISOString()
      };
      
      const savedUser = authService.updateUserProfile(updatedUser);
      onUserUpdate(savedUser);
      
      setNotification({ type: 'success', message: 'Profile picture removed successfully!' });
      setTimeout(() => setNotification(null), 3000);
      console.log('Profile picture removed successfully');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      alert('Error removing profile picture. Please try again.');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  return (
    <motion.div
      className="profile-section-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="profile-section"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="profile-header">
          <h2>
            <Settings size={24} />
            Profile Settings
          </h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              className={`notification ${notification.type}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="profile-picture-container">
            {(editedUser.profilePicture || user.profilePicture) ? (
              <img
                src={editedUser.profilePicture || user.profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                {getInitials(editedUser.firstName, editedUser.lastName) || <User size={40} />}
              </div>
            )}
            
            {isUploading && (
              <div className="upload-overlay">
                <div className="upload-spinner"></div>
              </div>
            )}
            
            <div className="profile-picture-actions">
              <button
                className="picture-action-btn upload-btn"
                onClick={triggerFileUpload}
                disabled={isUploading}
                title="Upload new picture"
              >
                <Camera size={16} />
              </button>
              
              {(editedUser.profilePicture || user.profilePicture) && (
                <button
                  className="picture-action-btn remove-btn"
                  onClick={handleRemoveProfilePicture}
                  title="Remove picture"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Profile Information */}
        <div className="profile-info">
          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="save-button"
                  onClick={handleSave}
                >
                  <Save size={18} />
                  Save
                </button>
                <button
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-fields">
            {/* First Name */}
            <div className="field-group">
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              ) : (
                <div className="field-value">{user.firstName || 'Not specified'}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="field-group">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              ) : (
                <div className="field-value">{user.lastName || 'Not specified'}</div>
              )}
            </div>

            {/* Email */}
            <div className="field-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="field-value">{user.email || 'Not specified'}</div>
              )}
            </div>

            {/* Bio */}
            <div className="field-group">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              ) : (
                <div className="field-value bio">
                  {user.bio || 'No bio added yet'}
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="account-info">
            <h3>Account Information</h3>
            <div className="info-row">
              <Calendar size={16} />
              <span>Member since: {formatDate(user.createdAt)}</span>
            </div>
            <div className="info-row">
              <User size={16} />
              <span>Username: {user.username}</span>
            </div>
            {user.updatedAt && (
              <div className="info-row">
                <Edit3 size={16} />
                <span>Last updated: {formatDate(user.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSection;
