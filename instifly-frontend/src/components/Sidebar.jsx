import React from 'react';
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="bg-white shadow h-full w-64 p-4 flex flex-col">
    <div className="text-2xl font-bold mb-8">Focotech</div>
    <nav className="flex-1">
      <ul className="space-y-4">
        <li><Link to="/dashboard" className="text-orange-500 font-semibold">Overview</Link></li>
        <li><Link to="/dashboard/lessons">Lessons</Link></li>
        <li><Link to="/dashboard/leaderboard">Leaderboard</Link></li>
        <li><Link to="/dashboard/skill-graph">Skill Graph</Link></li>
        <li><Link to="/dashboard/courses">Courses</Link></li>
        <li><Link to="/dashboard/certificates">Certificates</Link></li>
        <li><Link to="/dashboard/messages">Messages <span className="ml-1 text-xs bg-orange-500 text-white rounded px-2">5</span></Link></li>
        <li><Link to="/dashboard/settings">Settings</Link></li>
      </ul>
    </nav>

  </aside>
);

export default Sidebar;