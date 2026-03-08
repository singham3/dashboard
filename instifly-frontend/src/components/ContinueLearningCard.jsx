import React from 'react';
import ProgressBar from './ui/ProgressBar';

export default React.memo(function ContinueLearningCard({ course }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-sm">
      <div className="text-3xl mb-4">{course.icon}</div>
      <div className="font-semibold text-lg mb-1">{course.title}</div>
      <div className="text-sm text-gray-500 mb-3">{course.category}</div>
      <ProgressBar value={course.lessons} max={course.totalLessons} />
      <div className="text-sm text-gray-600 mb-4">{course.lessons}/{course.totalLessons} Lessons • {course.timeLeft}</div>
      <button className="bg-brand text-white px-4 py-2 rounded-lg font-semibold w-full">Resume Course</button>
    </div>
  );
});