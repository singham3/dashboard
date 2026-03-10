import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default React.memo(function Dropdown({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const displayName = user?.full_name || user?.username || 'User';
  const role = user?.role || 'User';
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-10 border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="font-semibold text-gray-900">{displayName}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
      <button className="w-full text-left px-4 py-3 bg-white text-gray-900 hover:bg-gray-50" onClick={() => { navigate('/dashboard/profile'); onClose(); }}>Profile</button>
      <button className="w-full text-left px-4 py-3 bg-white text-gray-900 hover:bg-gray-50" onClick={onClose}>Settings</button>
      <button className="w-full text-left px-4 py-3 bg-orange-100 text-brand font-semibold hover:bg-orange-200" onClick={() => { logout(); onClose(); }}>Logout</button>
    </div>
  );
});