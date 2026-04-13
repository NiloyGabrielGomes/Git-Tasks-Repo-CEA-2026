import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center animate-pulse">
      <div className="h-40 mb-4 bg-gray-200 rounded-lg w-full max-w-40"></div>
      
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
      
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
    </div>
  );
};