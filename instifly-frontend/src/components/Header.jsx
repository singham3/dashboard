import React from 'react';

const Header = () => (
  <header className="flex items-center justify-between bg-white shadow px-6 py-4">
    <div className="text-xl font-semibold">Dashboard</div>
    <div className="flex items-center gap-4">
      <input type="text" placeholder="Search here..." className="border rounded px-3 py-1" />
      <button className="bg-orange-500 text-white px-3 py-1 rounded">🔔</button>
      <button className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">👤</button>
    </div>
  </header>
);

export default Header;