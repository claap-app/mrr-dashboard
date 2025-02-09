import React from 'react';

type GoalProgressProps = {
  currentValue: number;
  monthlyGoal: number;
};

export function GoalProgress({ title, currentValue, monthlyGoal }: GoalProgressProps) {
  const progress = (currentValue / monthlyGoal) * 100;

  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <div className="space-y-2">
        <p className="text-gray-400">{ title }</p>
        <div className="flex items-end space-x-4">
          <h2 className="text-4xl font-bold text-gray-white">{`${progress.toFixed(1)}%`}</h2>
          <div className="text-sm text-gray-400">
          ${currentValue.toLocaleString()} of ${monthlyGoal.toLocaleString()}
          </div>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-1400">
            <div 
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-200 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}