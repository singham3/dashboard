import React from 'react';
import UserProfileCard from '../UserProfileCard';

export default React.memo(function RightSidebar() {
  return (
    <aside className="w-80 p-6 space-y-6">
      <UserProfileCard />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="font-semibold text-lg mb-3">Weekly Streak</div>
        <div className="text-sm text-gray-500 mb-3">4/4 Weeks</div>
        <div className="flex gap-2 mb-3">
          <span className="bg-brand bg-opacity-10 text-brand rounded-lg px-3 py-1">Mon 29</span>
          <span className="bg-brand bg-opacity-10 text-brand rounded-lg px-3 py-1">Tue 30</span>
          <span className="bg-brand bg-opacity-10 text-brand rounded-lg px-3 py-1">Wed 31</span>
        </div>
        <div className="text-sm text-gray-500">May 2024</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="font-semibold text-lg mb-3">Courses</div>
        <div className="text-sm text-gray-500 mb-2">3 Courses In Progress</div>
        <div className="text-sm text-gray-500">17 Courses Completed</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="font-semibold text-lg mb-3">Weekly Watch Time</div>
        <div className="text-sm text-gray-500 mb-3">4/4 Weeks</div>
        <div className="flex items-center gap-2">
          <span className="bg-brand bg-opacity-10 text-brand rounded-lg px-3 py-1">4:24m</span>
        </div>
      </div>
    </aside>
  );
});