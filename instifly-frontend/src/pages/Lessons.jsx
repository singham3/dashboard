import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

export default React.memo(function Lessons() {
  return (
    <DashboardLayout>
      <div className="p-8">Lessons Page</div>
    </DashboardLayout>
  );
});