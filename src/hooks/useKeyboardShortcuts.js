import { useEffect } from 'react';

const useKeyboardShortcuts = ({
  onCreateTodo,
  onOpenProfile,
  onToggleMenu,
  onSearch,
  onSelectAll,
  onEscape
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        // Allow Escape to blur the input
        if (event.key === 'Escape') {
          event.target.blur();
          onEscape?.();
        }
        return;
      }

      // Prevent default for our custom shortcuts
      const shortcutKeys = ['n', 'p', 'm', '/', 'a', 'Escape'];
      if (shortcutKeys.includes(event.key) && (event.ctrlKey || event.metaKey || event.key === 'Escape' || event.key === '/')) {
        event.preventDefault();
      }

      // Handle keyboard shortcuts
      switch (true) {
        case (event.ctrlKey || event.metaKey) && event.key === 'n':
          // Ctrl/Cmd + N: New Todo
          onCreateTodo?.();
          break;
        
        case (event.ctrlKey || event.metaKey) && event.key === 'p':
          // Ctrl/Cmd + P: Open Profile
          onOpenProfile?.();
          break;
        
        case (event.ctrlKey || event.metaKey) && event.key === 'm':
          // Ctrl/Cmd + M: Toggle Menu
          onToggleMenu?.();
          break;
        
        case event.key === '/' && !event.ctrlKey && !event.metaKey:
          // / : Focus Search
          onSearch?.();
          break;
        
        case (event.ctrlKey || event.metaKey) && event.key === 'a':
          // Ctrl/Cmd + A: Select All
          onSelectAll?.();
          break;
        
        case event.key === 'Escape':
          // Escape: Cancel/Close
          onEscape?.();
          break;
        
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCreateTodo, onOpenProfile, onToggleMenu, onSearch, onSelectAll, onEscape]);
};

export default useKeyboardShortcuts;
