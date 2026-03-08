import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ContinueLearning from '../components/dashboard/ContinueLearning';
import RecommendedCourses from '../components/dashboard/RecommendedCourses';
import RightSidebar from '../components/dashboard/RightSidebar';

export default React.memo(function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex gap-6">
        <div className="flex-1">
          <ContinueLearning />
          <RecommendedCourses />
        </div>
        <RightSidebar />
      </div>
    </DashboardLayout>
  );
});