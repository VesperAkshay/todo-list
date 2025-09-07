class AuthService {
  constructor() {
    this.users = this.loadUsers();
  }

  loadUsers() {
    const users = localStorage.getItem('todoApp_users');
    return users ? JSON.parse(users) : [];
  }

  saveUsers() {
    localStorage.setItem('todoApp_users', JSON.stringify(this.users));
  }

  register(username, email, password) {
    // Check if user already exists
    const existingUser = this.users.find(
      user => user.username === username || user.email === email
    );

    if (existingUser) {
      throw new Error('User already exists with this username or email');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      avatar: this.generateAvatar(username)
    };

    this.users.push(newUser);
    this.saveUsers();

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  login(usernameOrEmail, password) {
    const user = this.users.find(
      user => 
        (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
        user.password === this.hashPassword(password)
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Store current user session
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('todoApp_currentUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  }

  logout() {
    localStorage.removeItem('todoApp_currentUser');
  }

  getCurrentUser() {
    const user = localStorage.getItem('todoApp_currentUser');
    return user ? JSON.parse(user) : null;
  }

  updateUser(userId, updates) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveUsers();

    // Update current user session if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const { password: _, ...userWithoutPassword } = this.users[userIndex];
      localStorage.setItem('todoApp_currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }

    const { password: _, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  // Update user profile with complete user object
  updateUserProfile(updatedUser) {
    const userIndex = this.users.findIndex(user => user.id === updatedUser.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Preserve password and other sensitive data
    const currentUser = this.users[userIndex];
    this.users[userIndex] = { 
      ...currentUser, 
      ...updatedUser,
      password: currentUser.password // Keep original password
    };
    this.saveUsers();

    // Update current user session
    const { password: _, ...userWithoutPassword } = this.users[userIndex];
    localStorage.setItem('todoApp_currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  hashPassword(password) {
    // Simple hash function for demo purposes
    // In a real app, use proper hashing like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  generateAvatar(username) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    const color = colors[username.length % colors.length];
    return {
      color,
      initials: username.slice(0, 2).toUpperCase()
    };
  }

  deleteAccount(userId) {
    this.users = this.users.filter(user => user.id !== userId);
    this.saveUsers();
    
    // If current user is being deleted, logout
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logout();
    }
  }

  changePassword(userId, currentPassword, newPassword) {
    const user = this.users.find(user => user.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== this.hashPassword(currentPassword)) {
      throw new Error('Current password is incorrect');
    }

    user.password = this.hashPassword(newPassword);
    this.saveUsers();
  }
}

export const authService = new AuthService();
