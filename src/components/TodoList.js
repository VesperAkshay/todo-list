import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({
  todos,
  selectedTodos,
  onSelectTodo,
  onToggleComplete,
  onEditTodo,
  onDeleteTodo,
  view
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className={`todo-list ${view}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            variants={itemVariants}
            layout
            exit="exit"
          >
            <TodoItem
              todo={todo}
              isSelected={selectedTodos.includes(todo.id)}
              onSelect={() => onSelectTodo(todo.id)}
              onToggleComplete={() => onToggleComplete(todo.id)}
              onEdit={() => onEditTodo(todo)}
              onDelete={() => onDeleteTodo(todo.id)}
              view={view}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TodoList;
