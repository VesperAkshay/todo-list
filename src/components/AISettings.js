import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, Brain, Key, Info, CheckCircle, XCircle } from 'lucide-react';
import { aiService } from '../services/aiService';

const AISettings = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(null);
  const [aiFeatures, setAiFeatures] = useState({
    smartParsing: true,
    autoCategories: true,
    dateParsing: true,
    priorityDetection: true,
    suggestions: true,
    insights: true
  });
  const [testResult, setTestResult] = useState(null);
  const [isTestingAI, setIsTestingAI] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedApiKey = localStorage.getItem('gemini_api_key');
    const savedFeatures = localStorage.getItem('ai_features');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
      aiService.setGeminiKey(savedApiKey);
      setIsApiKeyValid(true);
    }
    
    if (savedFeatures) {
      setAiFeatures(JSON.parse(savedFeatures));
    }
  }, []);

  const handleApiKeyChange = (e) => {
    const key = e.target.value;
    setApiKey(key);
    setIsApiKeyValid(null);
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey);
      aiService.setGeminiKey(apiKey);
      setIsApiKeyValid(true);
      testAIConnection();
    } else {
      localStorage.removeItem('gemini_api_key');
      setIsApiKeyValid(false);
    }
  };

  const testAIConnection = async () => {
    if (!apiKey.trim()) return;
    
    setIsTestingAI(true);
    try {
      const description = await aiService.generateAIDescription("Test todo item");
      setTestResult({ success: true, message: "AI connection successful!" });
      setIsApiKeyValid(true);
    } catch (error) {
      setTestResult({ success: false, message: "AI connection failed. Please check your API key." });
      setIsApiKeyValid(false);
    }
    setIsTestingAI(false);
  };

  const toggleFeature = (feature) => {
    const newFeatures = { ...aiFeatures, [feature]: !aiFeatures[feature] };
    setAiFeatures(newFeatures);
    localStorage.setItem('ai_features', JSON.stringify(newFeatures));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ai-settings-overlay"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="ai-settings-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ai-settings-header">
            <h2>
              <Brain className="icon" />
              AI Settings
            </h2>
            <button onClick={handleClose} className="close-button">×</button>
          </div>

          <div className="ai-settings-content">
            {/* API Key Section */}
            <div className="settings-section">
              <h3>
                <Key className="icon" />
                Google Gemini API Configuration
              </h3>
              <p className="settings-description">
                Enter your Google Gemini API key to enable advanced AI features like smart descriptions and enhanced suggestions.
              </p>
              
              <div className="api-key-input-group">
                <input
                  type="password"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your Gemini API key..."
                  className="api-key-input"
                />
                <div className="api-key-actions">
                  <button 
                    onClick={saveApiKey}
                    className="btn-primary"
                    disabled={!apiKey.trim()}
                  >
                    Save Key
                  </button>
                  <button 
                    onClick={testAIConnection}
                    className="btn-secondary"
                    disabled={!apiKey.trim() || isTestingAI}
                  >
                    {isTestingAI ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>

              {/* API Key Status */}
              {isApiKeyValid !== null && (
                <div className={`api-status ${isApiKeyValid ? 'success' : 'error'}`}>
                  {isApiKeyValid ? (
                    <>
                      <CheckCircle className="icon" />
                      API key is valid and working
                    </>
                  ) : (
                    <>
                      <XCircle className="icon" />
                      Invalid API key or connection failed
                    </>
                  )}
                </div>
              )}

              {/* Test Result */}
              {testResult && (
                <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                  <Info className="icon" />
                  {testResult.message}
                </div>
              )}

              <div className="api-info">
                <Info className="icon" />
                <span>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></span>
              </div>
            </div>

            {/* AI Features Section */}
            <div className="settings-section">
              <h3>
                <Zap className="icon" />
                AI Features
              </h3>
              <p className="settings-description">
                Enable or disable specific AI-powered features for your todo management.
              </p>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-info">
                    <h4>Smart Parsing</h4>
                    <p>Automatically extract due dates, priorities, and categories from natural language</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={aiFeatures.smartParsing}
                      onChange={() => toggleFeature('smartParsing')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="feature-card">
                  <div className="feature-info">
                    <h4>Auto Categories</h4>
                    <p>Automatically categorize todos based on content analysis</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={aiFeatures.autoCategories}
                      onChange={() => toggleFeature('autoCategories')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="feature-card">
                  <div className="feature-info">
                    <h4>Date Parsing</h4>
                    <p>Understand natural language dates like "tomorrow" or "next week"</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={aiFeatures.dateParsing}
                      onChange={() => toggleFeature('dateParsing')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="feature-card">
                  <div className="feature-info">
                    <h4>Priority Detection</h4>
                    <p>Automatically detect task priority from keywords and context</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={aiFeatures.priorityDetection}
                      onChange={() => toggleFeature('priorityDetection')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="feature-card">
                  <div className="feature-info">
                    <h4>Smart Suggestions</h4>
                    <p>Get intelligent suggestions for task completion and follow-ups</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={aiFeatures.suggestions}
                      onChange={() => toggleFeature('suggestions')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="feature-card">
                  <div className="feature-info">
                    <h4>Productivity Insights</h4>
                    <p>Analyze your patterns and provide productivity recommendations</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={aiFeatures.insights}
                      onChange={() => toggleFeature('insights')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AISettings;
