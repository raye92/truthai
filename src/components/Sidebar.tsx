import { useState, useEffect } from 'react';
import './Sidebar.css';

interface SidebarProps {
  onSignOut: () => void;
  onToggle?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSignOut, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={handleToggle}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? '×' : '☰'}
      </button>
      
      <div className="sidebar-content">
        <h3>Menu</h3>
        <button 
          onClick={onSignOut}
          className="sign-out-button"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}; 