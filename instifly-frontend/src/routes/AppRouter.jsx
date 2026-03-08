import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Lessons = lazy(() => import('../pages/Lessons'));
const Leaderboard = lazy(() => import('../pages/Leaderboard'));
const Courses = lazy(() => import('../pages/Courses'));
const Certificates = lazy(() => import('../pages/Certificates'));
const Messages = lazy(() => import('../pages/Messages'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
        <Route path="/dashboard/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/dashboard/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/dashboard/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
        <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}