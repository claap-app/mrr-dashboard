import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import type { MRRData } from '../lib/supabase';
import type { ClientsData } from '../hooks/useClientsData';

type MonthlyGrowthChartProps = {
  data: (MRRData | ClientsData)[];
  valueKey?: 'mrr' | 'clients';
  title?: string;
};

export function MonthlyGrowthChart({ data, valueKey = 'mrr', title = "Monthly Growth Rate" }: MonthlyGrowthChartProps) {
  const calculateMonthlyGrowth = () => {
    const sixMonthsAgo = subMonths(new Date(), 6);
    const monthlyData: { month: string; growth: number }[] = [];

    for (let i = 0; i < 6; i++) {
      const currentMonth = subMonths(new Date(), i);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const monthData = data.filter(item => {
        const date = parseISO(item.creation_date);
        return date >= monthStart && date <= monthEnd;
      });

      if (monthData.length > 0) {
        const startValue = monthData[0][valueKey];
        const endValue = monthData[monthData.length - 1][valueKey];
        const growth = ((endValue - startValue) / startValue) * 100;

        monthlyData.unshift({
          month: format(currentMonth, 'MMM'),
          growth: Number(growth.toFixed(0))
        });
      }
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