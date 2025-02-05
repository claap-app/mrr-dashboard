import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MRRData } from '../lib/supabase';
import { MONTHS } from '../lib/constants';

type MonthlyTargetsChartProps = {
  targetData: { month: string; target: number }[];
  realizedData: MRRData[];
};

export function MonthlyTargetsChart({ targetData, realizedData }: MonthlyTargetsChartProps) {
  const combinedData = targetData.map(target => {
    const monthRealized = realizedData.find(item => {
      const itemDate = new Date(item.creation_date);
      return itemDate.getMonth() === MONTHS.indexOf(target.month) && 
             itemDate.getFullYear() === 2025;
    });

    return {
      month: target.month,
      target: target.target,
      realized: monthRealized?.mrr || 0
    };
  });

  const renderLegendIcon = (props: any) => {
    const { x, y, width, height, fill } = props;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={4}
      />
    );
  };

  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <h3 className="text-md font-medium mb-6 text-gray-white">2025 Monthly Targets</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={combinedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#32395A" />
            <XAxis
              dataKey="month"
              stroke="#4E588B"
            />
            <YAxis
              stroke="#4E588B"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: '#32395A', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#202439', border: 'none' }}
              formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
            />
            <Legend iconType="square" iconSize={10} formatter={(value) => <span style={{ color: '#4E588B' }}>{value}</span>} />
            <Bar
              name="Target"
              dataKey="target"
              fill="#D047A2"
              radius={[4, 4, 0, 0]}
              barSize={20}
              legendIcon={renderLegendIcon}
            />
            <Bar
              name="Realized"
              dataKey="realized"
              fill="#00CF56"
              radius={[4, 4, 0, 0]}
              barSize={20}
              legendIcon={renderLegendIcon}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}