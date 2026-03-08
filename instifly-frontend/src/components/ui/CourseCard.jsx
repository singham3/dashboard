import React from 'react';
import Card from './Card';

export default function CourseCard({ course }) {
  return (
    <Card className="mb-4">
      <div className="mb-2">
        <img src={course.thumbnail} alt={course.title} className="rounded w-full h-32 object-cover" />
      </div>
      <div className="font-semibold">{course.title}</div>
      <div className="text-xs text-gray-500">{course.instructor}</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-orange-500 font-bold">{course.rating}</span>
        <span className="text-gray-500">({course.reviews})</span>
        <span className="text-gray-700">${course.price}</span>
      </div>
    </Card>
  );
}