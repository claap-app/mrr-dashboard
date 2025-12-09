import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import type { MRRData } from '../lib/supabase';

type NetNewMRRChartProps = {
  data: MRRData[];
};

export function NetNewMRRChart({ data }: NetNewMRRChartProps) {
  const calculateMonthlyNetNewMRR = () => {
    const monthlyData: { month: string; netNewMRR: number }[] = [];
    
    // Sort data by date to ensure proper order
    const sortedData = [...data].sort((a, b) => 
      new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime()
    );

    // Get the last 6 months
    for (let i = 0; i < 6; i++) {
      const currentMonth = subMonths(new Date(), i);
      const currentYear = currentMonth.getFullYear();
      const currentMonthIndex = currentMonth.getMonth();
      
      // Find the last MRR value for the current month
      const currentMonthRecords = sortedData.filter(dataPoint => {
        const date = new Date(dataPoint.creation_date);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonthIndex;
      });
      
      // Find the last MRR value for the previous month
      const previousMonth = subMonths(currentMonth, 1);
      const previousYear = previousMonth.getFullYear();
      const previousMonthIndex = previousMonth.getMonth();
      
      const previousMonthRecords = sortedData.filter(dataPoint => {
        const date = new Date(dataPoint.creation_date);
        return date.getFullYear() === previousYear && date.getMonth() === previousMonthIndex;
      });
      
      const currentMonthMRR = currentMonthRecords.length > 0 
        ? currentMonthRecords[currentMonthRecords.length - 1].mrr 
        : null;
      
      const previousMonthMRR = previousMonthRecords.length > 0 
        ? previousMonthRecords[previousMonthRecords.length - 1].mrr 
        : 0;
      
      // Only calculate net new MRR if we have data for the current month
      const netNewMRR = currentMonthMRR !== null ? currentMonthMRR - previousMonthMRR : 0;

      monthlyData.unshift({
        month: format(currentMonth, 'MMM'),
        netNewMRR
      });
    }

    return monthlyData;
  };

  const monthlyNetNewMRR = calculateMonthlyNetNewMRR();

  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <h3 className="text-md font-medium mb-6 text-gray-white">Net New MRR by Month</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyNetNewMRR}
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net New MRR']}
            />
            <Bar
              dataKey="netNewMRR"
              fill="#00CF56"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}