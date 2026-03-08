import React from 'react';
import CourseCard from '../CourseCard';

const courses = [
  {
    thumbnail: 'https://dummyimage.com/320x180/eee/333&text=Course+1',
    title: 'Webflow Tutorial: Build Your First Portfolio Website In a Minute',
    instructor: 'Adam Smith',
    rating: 4.7,
    reviews: 320,
    price: 12.99,
    duration: '1h 30m',
  },
  {
    thumbnail: 'https://dummyimage.com/320x180/eee/333&text=Course+2',
    title: 'Basic To Advance Design System With UX Strategies',
    instructor: 'Scott Warden',
    rating: 4.7,
    reviews: 540,
    price: 49.99,
    duration: '2h 15m',
  },
];

export default React.memo(function RecommendedCourses() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Recommended Courses For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map(course => (
          <CourseCard key={course.title} course={course} />
        ))}
      </div>
    </section>
  );
});