import React from 'react';

export default React.memo(function ProgressBar({ value, max }) {
  const percent = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div className="bg-brand h-2 rounded-full" style={{ width: `${percent}%` }}></div>
    </div>
  );
});