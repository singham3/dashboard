import {
  Home,
  BookOpen,
  Trophy,
  TrendingUp,
  GraduationCap,
  Award,
  MessageSquare,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const menu = [
  { name: 'Overview', path: '/dashboard', icon: Home },
  { name: 'Lessons', path: '/dashboard/lessons', icon: BookOpen },
  { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: Trophy },
  { name: 'Skill Graph', path: '/dashboard/skill-graph', icon: TrendingUp },
  { name: 'Courses', path: '/dashboard/courses', icon: GraduationCap },
  { name: 'Certificates', path: '/dashboard/certificates', icon: Award },
  { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare, badge: 5 },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default React.memo(function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="bg-white shadow h-full w-64 p-6 flex flex-col">
      <div className="mb-8">
        <img src="/Artboard 12x.png" alt="Focotech Logo" className="w-36 h-auto mx-auto" />
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map(item => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium no-underline ${
                  isActive(item.path)
                    ? 'bg-orange-100 text-brand'
                    : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} className={isActive(item.path) ? 'text-brand' : 'text-gray-500'} />
                {item.name}
                {item.badge && (
                  <span className="ml-auto text-xs bg-orange-500 text-white rounded-full px-2 py-1">{item.badge}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
});