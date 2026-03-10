import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const { logout } = useAuth();
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const displayName = user?.full_name || user?.username || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <div className="text-xl font-semibold">Dashboard</div>
      <div className="flex items-center gap-4">
        <input type="text" placeholder="Search here..." className="border rounded px-3 py-1" />
        <button className="bg-orange-500 text-white px-3 py-1 rounded">🔔</button>

        {/* Profile icon with popup */}
        <div className="relative" ref={popupRef}>
          <button
            onClick={() => setShowPopup((prev) => !prev)}
            className="bg-brand text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </button>

          {showPopup && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-fade-in">
              {/* User info section */}
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-brand/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="bg-brand text-white rounded-full w-11 h-11 flex items-center justify-center font-bold text-lg shrink-0">
                    {user?.profile_picture ? (
                      <img src={user.profile_picture} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{displayName}</div>
                    <div className="text-sm text-gray-500 truncate">{user?.email || ''}</div>
                    {user?.role && (
                      <span className="inline-block mt-1 text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details section */}
              {user?.phone && (
                <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-600">
                  📞 {user.phone}
                </div>
              )}

              {/* Actions */}
              <div className="px-3 py-2">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;