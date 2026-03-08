import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const DashboardLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <Footer />
    </div>
  </div>
);

export default DashboardLayout;