import React from 'react';
import { TrendingUp } from 'react-feather';

type KPICardProps = {
  title: string;
  value: string;
  growth: number;
  subtitle?: string;
};

export function KPICard({ title, value, growth, subtitle }: KPICardProps) {
  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <div className="space-y-2">
        <p className="text-gray-400">{title}</p>
        <div className="flex items-end space-x-4">
          <h2 className="text-4xl font-bold text-gray-white">{value}</h2>
          <div className={`flex items-center space-x-1 text-sm ${growth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
            <TrendingUp className={`w-3 h-3 ${growth >= 0 ? '' : 'transform rotate-180'}`} />
            <span>{Math.abs(growth).toFixed(2)}%{subtitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}