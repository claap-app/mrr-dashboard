import React from 'react';
import { MONTHLY_GOAL } from '../lib/constants';

type GoalProgressProps = {
  currentValue: number;
};

export function GoalProgress({ currentValue }: GoalProgressProps) {
  const progress = (currentValue / MONTHLY_GOAL) * 100;

  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <div className="space-y-2">
        <p className="text-gray-400">Monthly Goal Progress</p>
        <div className="flex items-end space-x-4">
          <h2 className="text-4xl font-bold text-gray-white">{`${progress.toFixed(1)}%`}</h2>
          <div className="text-sm text-gray-400">
            of ${MONTHLY_GOAL.toLocaleString()}
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