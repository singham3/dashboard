import React from 'react';
import { Star } from 'lucide-react';

export default React.memo(function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="relative mb-3">
        <img src={course.thumbnail} alt={course.title} className="rounded-lg w-full h-40 object-cover" />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">{course.duration}</div>
      </div>
      <div className="font-semibold text-lg mb-1">{course.title}</div>
      <div className="text-sm text-gray-500 mb-2">{course.instructor}</div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-current" />
          <span className="text-brand font-semibold">{course.rating}</span>
        </div>
        <span className="text-gray-500">({course.reviews})</span>
        <span className="text-gray-700 font-semibold ml-auto">${course.price}</span>
      </div>
    </div>
  );
});