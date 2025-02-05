import React from 'react';
import { DollarSign } from 'react-feather';

type HeaderProps = {
  growthRate: number;
  onGrowthRateChange: (value: number) => void;
  onRecalculate: () => void;
};

export function Header({ growthRate, onGrowthRateChange, onRecalculate }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-12">
      <div className="flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        <h1 className="text-lg font-medium">MRR</h1>
      </div>
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <label htmlFor="growthRate" className="text-sm text-gray-400">
            Monthly Growth Rate (%)
          </label>
          <input
            id="growthRate"
            type="number"
            value={growthRate}
            onChange={(e) => onGrowthRateChange(Number(e.target.value))}
            className="w-[74px] h-[32px] leading-[32px] px-2 bg-gray-1600 border border-gray-1300 rounded-md text-gray-white"
            min="0"
            max="100"
          />
        </div>
        <button
          onClick={onRecalculate}
          className="h-[32px] leading-[32px] px-8 bg-blue-200 hover:bg-blue-300 rounded-md transition-colors"
        >
          <span>Recalculate</span>
        </button>
      </div>
    </div>
  );
}