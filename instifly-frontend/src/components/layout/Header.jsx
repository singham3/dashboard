import React, { useState, useRef, useCallback } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Dropdown from '../ui/Dropdown';

export default React.memo(function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowDropdown(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  }, []);

  const handleClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowDropdown(false);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4 relative">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="flex items-center gap-4">
        <button className="relative bg-white p-2 rounded-full border border-gray-200">
          <Bell size={20} className="text-brand" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <button className="relative bg-white p-2 rounded-full border border-gray-200">
          <MessageSquare size={20} className="text-brand" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Avatar />
          {showDropdown && (
            <Dropdown onClose={handleClose} />
          )}
        </div>
      </div>
    </header>
  );
});