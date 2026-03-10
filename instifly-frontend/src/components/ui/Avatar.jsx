import React from 'react';
import { useSelector } from 'react-redux';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

export default React.memo(function Avatar() {
  const user = useSelector((state) => state.user.user);
  const profilePic = user?.profile_picture;
  const initial = user?.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U';
  const imgSrc = profilePic ? (profilePic.startsWith('http') ? profilePic : `${BASE_URL}${profilePic}`) : null;

  return (
    <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white cursor-pointer select-none text-lg font-semibold text-gray-700 overflow-hidden">
      {imgSrc ? (
        <img src={imgSrc} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
});