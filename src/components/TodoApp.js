import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Sidebar from './Sidebar';
import StatsPanel from './StatsPanel';
import ProfileSection from './ProfileSection';
import { todoService } from '../services/todoService';
import './TodoApp.css';

const TodoApp = ({ user, onLogout, onUserUpdate, theme, onThemeChange }) => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [view, setView] = useState('grid'); // grid or list
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadTodos();
    loadStats();
  }, [user]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [todos, filters, sortBy, sortOrder]);

  const loadTodos = () => {
    const userTodos = todoService.getUserTodos(user.id);
    setTodos(userTodos);
  };

  const loadStats = () => {
    const userStats = todoService.getStats(user.id);
    setStats(userStats);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...todos];

    // Apply search filter
    if (filters.search) {
      filtered = todoService.searchTodos(user.id, filters.search);
    }

    // Apply other filters
    const filterObj = {};
    if (filters.status !== 'all') filterObj.status = filters.status;
    if (filters.priority !== 'all') filterObj.priority = filters.priority;
    if (filters.category !== 'all') filterObj.category = filters.category;

    if (Object.keys(filterObj).length > 0) {
      filtered = todoService.filterTodos(user.id, filterObj).filter(todo => 
        !filters.search || filtered.some(f => f.id === todo.id)
      );
    }

    // Apply sorting
    filtered = todoService.sortTodos(filtered, sortBy, sortOrder);

    setFilteredTodos(filtered);
  };

  const handleCreateTodo = (todoData) => {
    try {
      const newTodo = todoService.createTodo(user.id, todoData);
      setTodos(prev => [newTodo, ...prev]);
      setIsFormOpen(false);
      loadStats();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdateTodo = (todoId, updates) => {
    try {
      const updatedTodo = todoService.updateTodo(todoId, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === todoId ? updatedTodo : todo
      ));
      setEditingTodo(null);
      loadStats();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = (todoId) => {
    try {
      todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      setSelectedTodos(prev => prev.filter(id => id !== todoId));
      loadStats();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = (todoId) => {
    try {
      const updatedTodo = todoService.toggleTodoComplete(todoId);
      setTodos(prev => prev.map(todo => 
        todo.id === todoId ? updatedTodo : todo
      ));
      loadStats();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleBulkAction = (action, todoIds = selectedTodos) => {
    try {
      switch (action) {
        case 'delete':
          todoService.bulkDelete(user.id, todoIds);
          setTodos(prev => prev.filter(todo => !todoIds.includes(todo.id)));
          break;
        case 'complete':
          todoService.bulkUpdate(user.id, todoIds, { completed: true });
          setTodos(prev => prev.map(todo => 
            todoIds.includes(todo.id) ? { ...todo, completed: true } : todo
          ));
          break;
        case 'incomplete':
          todoService.bulkUpdate(user.id, todoIds, { completed: false });
          setTodos(prev => prev.map(todo => 
            todoIds.includes(todo.id) ? { ...todo, completed: false } : todo
          ));
          break;
        default:
          break;
      }
      setSelectedTodos([]);
      loadStats();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleSelectTodo = (todoId) => {
    setSelectedTodos(prev => 
      prev.includes(todoId)
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTodos.length === filteredTodos.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(filteredTodos.map(todo => todo.id));
    }
  };

  const categories = todoService.getCategories(user.id);
  const tags = todoService.getTags(user.id);

  return (
    <div className="todo-app">
      <Header
        user={user}
        onLogout={onLogout}
        onMenuClick={() => setSidebarOpen(true)}
        onCreateTodo={() => setIsFormOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        filters={filters}
        onFiltersChange={setFilters}
        view={view}
        onViewChange={setView}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(sort, order) => {
          setSortBy(sort);
          setSortOrder(order);
        }}
        selectedCount={selectedTodos.length}
        totalCount={filteredTodos.length}
        onSelectAll={handleSelectAll}
        onBulkAction={handleBulkAction}
      />

      <div className="todo-app-content">
        <AnimatePresence>
          {sidebarOpen && (
            <Sidebar
              user={user}
              categories={categories}
              tags={tags}
              stats={stats}
              onClose={() => setSidebarOpen(false)}
              filters={filters}
              onFiltersChange={setFilters}
            />
          )}
        </AnimatePresence>

        <main className="main-content">
          <StatsPanel stats={stats} />
          
          <TodoList
            todos={filteredTodos}
            selectedTodos={selectedTodos}
            onSelectTodo={handleSelectTodo}
            onToggleComplete={handleToggleComplete}
            onEditTodo={setEditingTodo}
            onDeleteTodo={handleDeleteTodo}
            view={view}
          />

          {filteredTodos.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-state-content">
                <h3>No todos found</h3>
                <p>
                  {todos.length === 0 
                    ? "Start by creating your first todo!"
                    : "Try adjusting your filters or search query."
                  }
                </p>
                {todos.length === 0 && (
                  <button
                    className="create-first-todo"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Create Your First Todo
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {(isFormOpen || editingTodo) && (
          <TodoForm
            todo={editingTodo}
            categories={categories}
            tags={tags}
            onSubmit={editingTodo ? 
              (data) => handleUpdateTodo(editingTodo.id, data) : 
              handleCreateTodo
            }
            onClose={() => {
              setIsFormOpen(false);
              setEditingTodo(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileOpen && (
          <ProfileSection
            user={user}
            onUserUpdate={onUserUpdate}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodoApp;
