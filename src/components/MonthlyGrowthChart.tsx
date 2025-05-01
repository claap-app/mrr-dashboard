import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isValid } from 'date-fns';
import type { MRRData } from '../lib/supabase';
import type { ClientsData } from '../hooks/useClientsData';

type MonthlyGrowthChartProps = {
  data: (MRRData | ClientsData)[];
  valueKey?: 'mrr' | 'clients';
  title?: string;
};

export function MonthlyGrowthChart({ data, valueKey = 'mrr', title = "Monthly Growth Rate" }: MonthlyGrowthChartProps) {
  const calculateMonthlyGrowth = () => {
    // Helper function to get MRR of the last recorded day in a given month
    const getEndOfMonthMRR = (targetMonthDate: Date, allData: (MRRData | ClientsData)[]): number | null => {
      const monthStart = startOfMonth(targetMonthDate);
      const monthEnd = endOfMonth(targetMonthDate);

      const monthData = allData.filter(item => {
        const date = parseISO(item.creation_date);
        // Ensure the date is valid before comparison
        return isValid(date) && date >= monthStart && date <= monthEnd;
      });

      if (monthData.length === 0) {
        return null; // No data for this month
      }

      // Data is sorted ascendingly by creation_date from the hook
      // Use the valueKey to access the correct property ('mrr' or 'clients')
      const lastDayData = monthData[monthData.length - 1];
      if (valueKey === 'mrr' && 'mrr' in lastDayData) {
        return lastDayData.mrr;
      } else if (valueKey === 'clients' && 'clients' in lastDayData) {
        return lastDayData.clients;
      }
      return null; // Should not happen if valueKey matches the data structure
    };

    const monthlyData: { month: string; growth: number }[] = [];

    for (let i = 0; i < 6; i++) { // Calculate growth for the last 6 months
      const currentMonthDate = subMonths(new Date(), i);
      const previousMonthDate = subMonths(currentMonthDate, 1);

      const currentMonthEndValue = getEndOfMonthMRR(currentMonthDate, data); // Renamed for clarity
      const previousMonthEndValue = getEndOfMonthMRR(previousMonthDate, data); // Renamed for clarity

      let growth = 0;
      // Calculate growth only if we have value for both current and previous month, and previous month value is not zero
      if (currentMonthEndValue !== null && previousMonthEndValue !== null && previousMonthEndValue !== 0) {
        growth = ((currentMonthEndValue - previousMonthEndValue) / previousMonthEndValue) * 100;
      }
      // If current month has data but previous doesn't (or is 0), growth calculation is ambiguous.
      // We could set it to Infinity or 100%, but setting to 0 might be less confusing.
      // If currentMonthEndValue is null, growth remains 0.

      monthlyData.unshift({ // Add to the beginning to maintain chronological order in the chart
        month: format(currentMonthDate, 'MMM'),
        growth: Number(growth.toFixed(0)) // Round to nearest integer
      });
    }

    return monthlyData;
  };

  const getBarColor = (value: number) => {
    if (valueKey === 'clients') {
      if (value <= 10) return '#D047A2';
      if (value <= 12.5) return '#E368B9';
      if (value <= 15) return '#E77EC3';
      return '#E77EC3';
    }
    if (value <= 10) return '#809CFF';
    if (value <= 12.5) return '#4C74FF';
    if (value <= 15) return '#3864FF';
    return '#1243F2';
  };

  const monthlyGrowthData = calculateMonthlyGrowth();

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    return (
      <text
        x={x + width + 8}
        y={y + height / 2}
        fill="#4E588B"
        className="text-sm"
        dominantBaseline="middle"
      >
        {value}%
      </text>
    );
  };

  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <h3 className="text-md font-medium mb-6 text-gray-white">{title}</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyGrowthData}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#32395A" horizontal={false} />
            <XAxis
              type="number"
              stroke="#4E588B"
              tickFormatter={(value) => `${value}%`}
              domain={[0, 'dataMax']}
            />
            <YAxis
              type="category"
              dataKey="month"
              stroke="#4E588B"
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#32395A', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#202439', border: 'none' }}
              formatter={(value: number) => {
                const color = getBarColor(value);
                return [<span style={{ color }}>{value}%</span>, <span style={{ color }}>Growth</span>];
              }}
            />
            <Bar
              dataKey="growth"
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              <LabelList
                dataKey="growth"
                position="right"
                content={renderCustomLabel}
              />
              {monthlyGrowthData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.growth)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}