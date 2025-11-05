import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MRRData } from '../lib/supabase';
import { MONTHS, MONTHLY_GOALS } from '../lib/constants';

type MonthlyTargetsChartProps = {
  realizedData: MRRData[];
  valuePrefix?: string;
};

export function MonthlyTargetsChart({ realizedData, valuePrefix = '€' }: MonthlyTargetsChartProps) {
  const getLastDayMRR = (data: MRRData[]) => {
    const lastDayMRR: { month: string; mrr: number }[] = [];
    const groupedByMonth: { [key: string]: MRRData[] } = {};

    data.forEach((entry) => {
      const month = entry.creation_date.slice(0, 7);
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = [];
      }
      groupedByMonth[month].push(entry);
    });

    Object.keys(groupedByMonth).forEach((month) => {
      const monthData = groupedByMonth[month];
      const lastDayEntry = monthData.reduce((latest, entry) => {
        return new Date(entry.creation_date) > new Date(latest.creation_date) ? entry : latest;
      });
      lastDayMRR.push({ month, mrr: lastDayEntry.mrr * 12 }); // Convert MRR to ARR
    });

    return lastDayMRR.sort((a, b) => a.month.localeCompare(b.month));
  };

  const lastDayMRR = getLastDayMRR(realizedData);

  const targetData = Object.keys(MONTHLY_GOALS).map((monthKey) => {
    const monthNum = Number(monthKey);
    // monthNum: 11=Nov 2025, 12=Dec 2025, 13-24=Jan-Dec 2026
    const year = monthNum <= 12 ? 2025 : 2026;
    const monthIndex = monthNum <= 12 ? monthNum - 1 : monthNum - 13;
    const monthLabel = `${MONTHS[monthIndex]} ${year}`;

    return {
      month: monthLabel,
      target: MONTHLY_GOALS[monthNum],
      year,
      monthIndex: monthIndex + 1,
    };
  });

  // Calculate new ARR added each month
  const combinedData = targetData.map((target, index) => {
    const monthStr = String(target.monthIndex).padStart(2, '0');
    const currentMonthARR = lastDayMRR.find((mrr) => mrr.month === `${target.year}-${monthStr}`)?.mrr || 0;

    // Get previous month ARR
    let prevMonthARR = 0;
    if (index > 0) {
      const prevTarget = targetData[index - 1];
      const prevMonthStr = String(prevTarget.monthIndex).padStart(2, '0');
      prevMonthARR = lastDayMRR.find((mrr) => mrr.month === `${prevTarget.year}-${prevMonthStr}`)?.mrr || 0;
    } else {
      // For November 2025 (first month), use October 2025 as baseline
      prevMonthARR = lastDayMRR.find((mrr) => mrr.month === '2025-10')?.mrr || 0;
    }

    const realized = currentMonthARR - prevMonthARR;
    return { ...target, realized: Math.max(0, realized) };
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
      <h3 className="text-md font-medium mb-6 text-gray-white">New ARR Targets (Nov 2025 - Dec 2026)</h3>
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
              tickFormatter={(value) => `${valuePrefix}${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: '#32395A', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#202439', border: 'none' }}
              formatter={(value: number, name: string) => [`${valuePrefix}${value.toLocaleString()}`, name]}
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