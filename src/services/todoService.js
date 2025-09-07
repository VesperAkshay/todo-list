import { format } from 'date-fns';

class TodoService {
  constructor() {
    this.todos = this.loadTodos();
  }

  loadTodos() {
    const todos = localStorage.getItem('todoApp_todos');
    return todos ? JSON.parse(todos) : [];
  }

  saveTodos() {
    localStorage.setItem('todoApp_todos', JSON.stringify(this.todos));
  }

  getUserTodos(userId) {
    return this.todos.filter(todo => todo.userId === userId);
  }

  createTodo(userId, todoData) {
    const newTodo = {
      id: Date.now().toString(),
      userId,
      title: todoData.title,
      description: todoData.description || '',
      completed: false,
      priority: todoData.priority || 'medium',
      category: todoData.category || 'general',
      dueDate: todoData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: todoData.tags || [],
      subtasks: todoData.subtasks || []
    };

    this.todos.push(newTodo);
    this.saveTodos();
    return newTodo;
  }

  updateTodo(todoId, updates) {
    const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    this.todos[todoIndex] = {
      ...this.todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveTodos();
    return this.todos[todoIndex];
  }

  deleteTodo(todoId) {
    const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    this.todos.splice(todoIndex, 1);
    this.saveTodos();
  }

  toggleTodoComplete(todoId) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.completed = !todo.completed;
    todo.updatedAt = new Date().toISOString();
    if (todo.completed) {
      todo.completedAt = new Date().toISOString();
    } else {
      delete todo.completedAt;
    }

    this.saveTodos();
    return todo;
  }

  addSubtask(todoId, subtaskText) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const subtask = {
      id: Date.now().toString(),
      text: subtaskText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    todo.subtasks.push(subtask);
    todo.updatedAt = new Date().toISOString();
    this.saveTodos();
    return todo;
  }

  toggleSubtask(todoId, subtaskId) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const subtask = todo.subtasks.find(st => st.id === subtaskId);
    if (!subtask) {
      throw new Error('Subtask not found');
    }

    subtask.completed = !subtask.completed;
    todo.updatedAt = new Date().toISOString();
    this.saveTodos();
    return todo;
  }

  deleteSubtask(todoId, subtaskId) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.subtasks = todo.subtasks.filter(st => st.id !== subtaskId);
    todo.updatedAt = new Date().toISOString();
    this.saveTodos();
    return todo;
  }

  addTag(todoId, tag) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (!todo.tags.includes(tag)) {
      todo.tags.push(tag);
      todo.updatedAt = new Date().toISOString();
      this.saveTodos();
    }
    return todo;
  }

  removeTag(todoId, tag) {
    const todo = this.todos.find(todo => todo.id === todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.tags = todo.tags.filter(t => t !== tag);
    todo.updatedAt = new Date().toISOString();
    this.saveTodos();
    return todo;
  }

  getCategories(userId) {
    const userTodos = this.getUserTodos(userId);
    const categories = [...new Set(userTodos.map(todo => todo.category))];
    return categories.filter(cat => cat && cat !== 'general');
  }

  getTags(userId) {
    const userTodos = this.getUserTodos(userId);
    const tags = new Set();
    userTodos.forEach(todo => {
      todo.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }

  getStats(userId) {
    const userTodos = this.getUserTodos(userId);
    const completed = userTodos.filter(todo => todo.completed).length;
    const total = userTodos.length;
    const overdue = userTodos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false;
      return new Date(todo.dueDate) < new Date();
    }).length;

    const highPriority = userTodos.filter(todo => 
      todo.priority === 'high' && !todo.completed
    ).length;

    return {
      total,
      completed,
      pending: total - completed,
      overdue,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  searchTodos(userId, query) {
    const userTodos = this.getUserTodos(userId);
    const lowercaseQuery = query.toLowerCase();

    return userTodos.filter(todo =>
      todo.title.toLowerCase().includes(lowercaseQuery) ||
      todo.description.toLowerCase().includes(lowercaseQuery) ||
      todo.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      todo.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  filterTodos(userId, filters) {
    let userTodos = this.getUserTodos(userId);

    if (filters.status) {
      if (filters.status === 'completed') {
        userTodos = userTodos.filter(todo => todo.completed);
      } else if (filters.status === 'pending') {
        userTodos = userTodos.filter(todo => !todo.completed);
      } else if (filters.status === 'overdue') {
        userTodos = userTodos.filter(todo => {
          if (!todo.dueDate || todo.completed) return false;
          return new Date(todo.dueDate) < new Date();
        });
      }
    }

    if (filters.priority) {
      userTodos = userTodos.filter(todo => todo.priority === filters.priority);
    }

    if (filters.category) {
      userTodos = userTodos.filter(todo => todo.category === filters.category);
    }

    if (filters.tag) {
      userTodos = userTodos.filter(todo => todo.tags.includes(filters.tag));
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      userTodos = userTodos.filter(todo => {
        if (!todo.dueDate) return false;
        const dueDate = new Date(todo.dueDate);
        return dueDate >= new Date(start) && dueDate <= new Date(end);
      });
    }

    return userTodos;
  }

  sortTodos(todos, sortBy = 'createdAt', order = 'desc') {
    return [...todos].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'completed':
          aValue = a.completed ? 1 : 0;
          bValue = b.completed ? 1 : 0;
          break;
        default: // createdAt, updatedAt
          aValue = new Date(a[sortBy]);
          bValue = new Date(b[sortBy]);
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  exportTodos(userId, format = 'json') {
    const userTodos = this.getUserTodos(userId);
    
    if (format === 'json') {
      return JSON.stringify(userTodos, null, 2);
    } else if (format === 'csv') {
      const headers = ['Title', 'Description', 'Completed', 'Priority', 'Category', 'Due Date', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...userTodos.map(todo => [
          `"${todo.title}"`,
          `"${todo.description}"`,
          todo.completed ? 'Yes' : 'No',
          todo.priority,
          todo.category,
          todo.dueDate || '',
          format(new Date(todo.createdAt), 'yyyy-MM-dd HH:mm')
        ].join(','))
      ].join('\n');
      
      return csvContent;
    }
  }

  importTodos(userId, data, format = 'json') {
    try {
      let todosToImport = [];
      
      if (format === 'json') {
        todosToImport = JSON.parse(data);
      }
      
      todosToImport.forEach(todoData => {
        this.createTodo(userId, {
          title: todoData.title,
          description: todoData.description || '',
          priority: todoData.priority || 'medium',
          category: todoData.category || 'general',
          dueDate: todoData.dueDate || null,
          tags: todoData.tags || []
        });
      });
      
      return todosToImport.length;
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }

  bulkDelete(userId, todoIds) {
    this.todos = this.todos.filter(todo => 
      !(todo.userId === userId && todoIds.includes(todo.id))
    );
    this.saveTodos();
  }

  bulkUpdate(userId, todoIds, updates) {
    this.todos.forEach(todo => {
      if (todo.userId === userId && todoIds.includes(todo.id)) {
        Object.assign(todo, updates, { updatedAt: new Date().toISOString() });
      }
    });
    this.saveTodos();
  }
}

export const todoService = new TodoService();
