import nlp from 'compromise';
import * as chrono from 'chrono-node';
import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.geminiApiKey = null; // Will be set by user
    this.genAI = null;
    this.model = null;
  }

  // Set Gemini API key (user can provide their own key)
  setGeminiKey(apiKey) {
    this.geminiApiKey = apiKey;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  // Extract due date from natural language
  extractDueDate(text) {
    try {
      const results = chrono.parse(text);
      if (results.length > 0) {
        const date = results[0].start.date();
        return {
          date: date.toISOString(),
          extractedText: results[0].text,
          confidence: results[0].start.isCertain() ? 'high' : 'medium'
        };
      }
    } catch (error) {
      console.error('Error extracting date:', error);
    }
    return null;
  }

  // Extract priority from text
  extractPriority(text) {
    const lowercaseText = text.toLowerCase();
    
    // High priority indicators
    const highPriorityWords = ['urgent', 'critical', 'asap', 'important', 'high priority', 'emergency', 'now'];
    const mediumPriorityWords = ['medium', 'moderate', 'soon', 'this week'];
    const lowPriorityWords = ['low', 'someday', 'maybe', 'later', 'when possible'];

    for (const word of highPriorityWords) {
      if (lowercaseText.includes(word)) {
        return { priority: 'high', confidence: 'high', keyword: word };
      }
    }

    for (const word of mediumPriorityWords) {
      if (lowercaseText.includes(word)) {
        return { priority: 'medium', confidence: 'medium', keyword: word };
      }
    }

    for (const word of lowPriorityWords) {
      if (lowercaseText.includes(word)) {
        return { priority: 'low', confidence: 'medium', keyword: word };
      }
    }

    return { priority: 'medium', confidence: 'low' };
  }

  // Extract category from text using NLP
  extractCategory(text) {
    const doc = nlp(text);
    
    // Predefined categories with keywords
    const categories = {
      'Work': ['work', 'job', 'office', 'meeting', 'project', 'deadline', 'client', 'boss', 'colleague', 'presentation', 'report', 'email'],
      'Personal': ['personal', 'self', 'family', 'friend', 'hobby', 'health', 'exercise', 'workout', 'doctor', 'appointment'],
      'Shopping': ['buy', 'purchase', 'shop', 'store', 'grocery', 'groceries', 'mall', 'amazon', 'order'],
      'Health': ['health', 'doctor', 'medicine', 'exercise', 'gym', 'workout', 'diet', 'medical', 'appointment', 'checkup'],
      'Home': ['home', 'house', 'clean', 'laundry', 'dishes', 'garden', 'repair', 'maintenance', 'bills', 'utilities'],
      'Finance': ['money', 'bank', 'pay', 'bill', 'budget', 'savings', 'investment', 'tax', 'insurance', 'loan'],
      'Learning': ['learn', 'study', 'course', 'book', 'research', 'tutorial', 'skill', 'education', 'training'],
      'Travel': ['travel', 'trip', 'vacation', 'flight', 'hotel', 'passport', 'visa', 'booking', 'destination']
    };

    const lowercaseText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (lowercaseText.includes(keyword)) {
          return { category, confidence: 'high', keyword };
        }
      }
    }

    // Use NLP to extract subjects/topics
    const subjects = doc.topics().out('array');
    if (subjects.length > 0) {
      return { category: 'General', confidence: 'low', subjects };
    }

    return { category: 'General', confidence: 'low' };
  }

  // Generate smart suggestions for todo completion
  generateSuggestions(todoText, userHistory = []) {
    const suggestions = [];
    
    // Analyze the todo text
    const doc = nlp(todoText);
    const verbs = doc.verbs().out('array');
    const nouns = doc.nouns().out('array');

    // Common completion patterns
    const patterns = {
      'call': ['Schedule follow-up', 'Send summary email', 'Add to contacts'],
      'buy': ['Check reviews', 'Compare prices', 'Add to shopping list'],
      'write': ['Proofread', 'Get feedback', 'Publish/send'],
      'meeting': ['Send agenda', 'Book room', 'Send calendar invite'],
      'read': ['Take notes', 'Write summary', 'Share insights'],
      'research': ['Document findings', 'Create presentation', 'Share results']
    };

    // Generate suggestions based on verbs
    verbs.forEach(verb => {
      if (patterns[verb.toLowerCase()]) {
        patterns[verb.toLowerCase()].forEach(suggestion => {
          suggestions.push({
            text: suggestion,
            type: 'completion',
            confidence: 'medium'
          });
        });
      }
    });

    // Time-based suggestions
    const timeExtraction = this.extractDueDate(todoText);
    if (timeExtraction) {
      suggestions.push({
        text: 'Set reminder 1 day before',
        type: 'reminder',
        confidence: 'high'
      });
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  // Smart todo parsing - extract all information from natural language
  parseSmartTodo(text) {
    const result = {
      title: text,
      originalText: text,
      extractedInfo: {}
    };

    // Extract due date
    const dateInfo = this.extractDueDate(text);
    if (dateInfo) {
      result.dueDate = dateInfo.date;
      result.extractedInfo.dueDate = dateInfo;
      // Remove date text from title
      result.title = text.replace(dateInfo.extractedText, '').trim();
    }

    // Extract priority
    const priorityInfo = this.extractPriority(text);
    if (priorityInfo.confidence !== 'low') {
      result.priority = priorityInfo.priority;
      result.extractedInfo.priority = priorityInfo;
      // Remove priority keywords from title
      if (priorityInfo.keyword) {
        result.title = result.title.replace(new RegExp(priorityInfo.keyword, 'gi'), '').trim();
      }
    }

    // Extract category
    const categoryInfo = this.extractCategory(text);
    if (categoryInfo.confidence !== 'low') {
      result.category = categoryInfo.category;
      result.extractedInfo.category = categoryInfo;
    }

    // Clean up title
    result.title = result.title.replace(/\s+/g, ' ').trim();
    if (!result.title) {
      result.title = text; // Fallback to original text
    }

    return result;
  }

  // Generate todo suggestions based on patterns
  generateTodoSuggestions(userTodos, currentTime = new Date()) {
    const suggestions = [];
    
    // Analyze user patterns
    const todoPatterns = this.analyzeUserPatterns(userTodos);
    
    // Time-based suggestions
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();
    
    if (hour >= 9 && hour <= 17) { // Work hours
      suggestions.push({
        text: 'Check emails',
        category: 'Work',
        priority: 'medium',
        reason: 'Work hours reminder'
      });
    }
    
    if (hour >= 18 && hour <= 20) { // Evening
      suggestions.push({
        text: 'Plan tomorrow\'s tasks',
        category: 'Personal',
        priority: 'low',
        reason: 'Evening planning'
      });
    }
    
    if (dayOfWeek === 0) { // Sunday
      suggestions.push({
        text: 'Review weekly goals',
        category: 'Personal',
        priority: 'medium',
        reason: 'Weekly review'
      });
    }

    return suggestions;
  }

  // Analyze user patterns for better suggestions
  analyzeUserPatterns(todos) {
    const patterns = {
      mostCommonCategories: {},
      averageCompletionTime: 0,
      productiveHours: {},
      commonKeywords: {}
    };

    todos.forEach(todo => {
      // Category frequency
      if (todo.category) {
        patterns.mostCommonCategories[todo.category] = 
          (patterns.mostCommonCategories[todo.category] || 0) + 1;
      }

      // Extract keywords from titles
      const words = todo.title.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 3) { // Ignore short words
          patterns.commonKeywords[word] = (patterns.commonKeywords[word] || 0) + 1;
        }
      });
    });

    return patterns;
  }

  // Generate productivity insights
  generateInsights(todos, completedTodos) {
    const insights = [];
    
    // Completion rate analysis
    const totalTodos = todos.length + completedTodos.length;
    const completionRate = totalTodos > 0 ? (completedTodos.length / totalTodos) * 100 : 0;
    
    if (completionRate > 80) {
      insights.push({
        type: 'success',
        title: 'Great Productivity!',
        message: `You have a ${completionRate.toFixed(1)}% completion rate. Keep up the excellent work!`,
        icon: '🎉'
      });
    } else if (completionRate < 50) {
      insights.push({
        type: 'suggestion',
        title: 'Room for Improvement',
        message: `Your completion rate is ${completionRate.toFixed(1)}%. Try breaking down larger tasks into smaller, manageable steps.`,
        icon: '💡'
      });
    }

    // Overdue tasks analysis
    const overdueTasks = todos.filter(todo => 
      todo.dueDate && new Date(todo.dueDate) < new Date()
    );
    
    if (overdueTasks.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Overdue Tasks',
        message: `You have ${overdueTasks.length} overdue task(s). Consider reviewing your priorities.`,
        icon: '⚠️'
      });
    }

    // Category distribution
    const categoryCount = {};
    todos.forEach(todo => {
      if (todo.category) {
        categoryCount[todo.category] = (categoryCount[todo.category] || 0) + 1;
      }
    });

    const dominantCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, null
    );

    if (dominantCategory && categoryCount[dominantCategory] > todos.length * 0.6) {
      insights.push({
        type: 'info',
        title: 'Focus Area Identified',
        message: `Most of your tasks are in ${dominantCategory}. Consider time-blocking for better focus.`,
        icon: '🎯'
      });
    }

    return insights;
  }

  // Gemini integration for advanced features (if API key is provided)
  async generateAIDescription(todoTitle) {
    if (!this.model) {
      // Fallback to simple description generation
      return this.generateSimpleDescription(todoTitle);
    }

    try {
      const prompt = `You are a helpful assistant that creates brief, actionable descriptions for todo items. Keep responses under 50 words and focus on practical steps.

Create a helpful description for this todo: "${todoTitle}"`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text || this.generateSimpleDescription(todoTitle);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.generateSimpleDescription(todoTitle);
    }
  }

  // Fallback description generation without AI
  generateSimpleDescription(todoTitle) {
    const templates = {
      'call': 'Make a phone call to discuss important matters.',
      'email': 'Send an email with necessary information.',
      'buy': 'Purchase the required items from the store.',
      'meeting': 'Attend or organize a meeting to discuss topics.',
      'write': 'Create written content or documentation.',
      'read': 'Review and understand the material.',
      'plan': 'Organize and structure the upcoming activities.',
      'review': 'Examine and evaluate the content or progress.',
      'complete': 'Finish the outstanding task or project.',
      'submit': 'Send or deliver the required documents.'
    };

    const lowercaseTitle = todoTitle.toLowerCase();
    for (const [keyword, template] of Object.entries(templates)) {
      if (lowercaseTitle.includes(keyword)) {
        return template;
      }
    }

    return 'Complete this task efficiently and effectively.';
  }
}

export const aiService = new AIService();
