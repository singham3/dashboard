import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default React.memo(function Dropdown({ onClose }) {
  const { logout } = useAuth();
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-10 border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="font-semibold text-gray-900">Brooklyn Simmons</div>
        <div className="text-sm text-gray-500">UI/UX Designer & Developer</div>
      </div>
      <button className="w-full text-left px-4 py-3 bg-white text-gray-900 hover:bg-gray-50" onClick={onClose}>Profile</button>
      <button className="w-full text-left px-4 py-3 bg-white text-gray-900 hover:bg-gray-50" onClick={onClose}>Settings</button>
      <button className="w-full text-left px-4 py-3 bg-orange-100 text-brand font-semibold hover:bg-orange-200" onClick={() => { logout(); onClose(); }}>Logout</button>
    </div>
  );
});