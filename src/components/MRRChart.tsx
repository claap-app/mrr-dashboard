import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, isValid, subMonths, isBefore } from 'date-fns';
import type { MRRData } from '../lib/supabase';

type MRRChartProps = {
  data: (MRRData | { month: string; target: number })[];
  title: string;
  barSize?: number;
  barColor?: string;
  dataKey?: string;
  interval?: number;
  valuePrefix?: string;
  tooltipLabel?: string;
};

export function MRRChart({ 
  data, 
  title, 
  barSize = 2, 
  barColor = '#00CF56',
  dataKey = 'mrr',
  interval = 30,
  valuePrefix = '$',
  tooltipLabel = 'MRR'
}: MRRChartProps) {
  const filteredData = dataKey === 'mrr' ? data.filter((item) => {
    if ('creation_date' in item) {
      const threeMonthsAgo = subMonths(new Date(), 3);
      const itemDate = parseISO(item.creation_date);
      return !isBefore(itemDate, threeMonthsAgo);
    }
    return true;
  }) : data;

  const formatXAxisTick = (value: string) => {
    if (value.length <= 3) {
      return value;
    }
    try {
      const date = parseISO(value);
      if (isValid(date)) {
        return format(date, 'MMM d');
      }
    } catch {
      return value;
    }
    return value;
  };

  const formatTooltipLabel = (value: string) => {
    if (value.length <= 3) {
      return value + ' 2025';
    }
    try {
      const date = parseISO(value);
      if (isValid(date)) {
        return format(date, 'MMM d, yyyy');
      }
    } catch {
      return value;
    }
    return value;
  };

  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <h3 className="text-md font-medium mb-6 text-gray-white">{title}</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} barSize={barSize} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#32395A" />
            <XAxis 
              dataKey={dataKey === 'target' ? 'month' : 'creation_date'}
              tickFormatter={formatXAxisTick}
              stroke="#4E588B"
              interval={interval}
            />
            <YAxis 
              stroke="#4E588B"
              tickFormatter={(value) => `${valuePrefix}${(value / 1000).toFixed(0)}k`}
              domain={[35000, 'auto']}
            />
            <Tooltip
              cursor={{ fill: '#32395A', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#202439', border: 'none' }}
              labelFormatter={formatTooltipLabel}
              formatter={(value: number) => [`${valuePrefix}${value.toLocaleString()}`, tooltipLabel]}
            />
            <Bar 
              dataKey={dataKey}
              fill={barColor}
              radius={[1, 1, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}