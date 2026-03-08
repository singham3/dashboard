import React from 'react';
import ContinueLearningCard from '../ContinueLearningCard';

const courses = [
  {
    icon: '🖌️',
    title: 'Advance UI/UX Design',
    category: 'DESIGN',
    lessons: 18,
    totalLessons: 40,
    timeLeft: '2 hours left',
  },
  {
    icon: '💻',
    title: 'Basic Web Development',
    category: 'DEVELOPMENT',
    lessons: 18,
    totalLessons: 40,
    timeLeft: '2 hours left',
  },
];

export default React.memo(function ContinueLearning() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Continue Learning</h2>
      <div className="flex gap-5">
        {courses.map(course => (
          <ContinueLearningCard key={course.title} course={course} />
        ))}
      </div>
    </section>
  );
});