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
      const monthKey = format(currentMonth, 'yyyy-MM');
      
      // Find the last MRR value for the current month
      const currentMonthData = sortedData.filter(item => 
        item.creation_date.startsWith(monthKey)
      );
      
      // Find the last MRR value for the previous month
      const previousMonth = subMonths(currentMonth, 1);
      const previousMonthKey = format(previousMonth, 'yyyy-MM');
      const previousMonthData = sortedData.filter(item => 
        item.creation_date.startsWith(previousMonthKey)
      );
      
      const currentMonthMRR = currentMonthData.length > 0 
        ? currentMonthData[currentMonthData.length - 1].mrr 
        : 0;
      
      const previousMonthMRR = previousMonthData.length > 0 
        ? previousMonthData[previousMonthData.length - 1].mrr 
        : 0;
      
      const netNewMRR = currentMonthMRR - previousMonthMRR;

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
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: '#32395A', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#202439', border: 'none' }}
              formatter={(value: number) => [`€${value.toLocaleString()}`, 'Net New MRR']}
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