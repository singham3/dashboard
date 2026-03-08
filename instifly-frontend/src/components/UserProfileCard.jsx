import React from 'react';

export default React.memo(function UserProfileCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <img src="https://dummyimage.com/48x48/eee/333&text=U" alt="Avatar" className="rounded-full w-12 h-12 mr-4" />
        <div>
          <div className="font-semibold text-lg">Brooklyn Simmons</div>
          <div className="text-sm text-gray-500">UI/UX Designer & Developer</div>
        </div>
      </div>
      <div className="font-bold text-brand text-xl mb-4">876 Points</div>
      <div className="flex gap-6">
        <div className="text-center">
          <div className="font-bold text-lg">54</div>
          <div className="text-xs text-gray-500">Days Streak</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">06</div>
          <div className="text-xs text-gray-500">Goals in Month</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">02</div>
          <div className="text-xs text-gray-500">2nd Place</div>
        </div>
      </div>
    </div>
  );
});