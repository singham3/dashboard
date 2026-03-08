import React from 'react';

export default React.memo(function Avatar() {
  return (
    <div
      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white cursor-pointer select-none text-lg font-semibold text-gray-700"
    >
      A
    </div>
  );
});