import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subMonths } from 'date-fns';
import type { ClientsData } from '../hooks/useClientsData';

type LicenseDistributionChartProps = {
  data: ClientsData[];
};

export function LicenseDistributionChart({ data }: LicenseDistributionChartProps) {
  const processData = (rawData: ClientsData[]) => {
    return rawData.map(item => {
      const total = (item.starter || 0) + (item.pro || 0) + (item.business || 0);
      return {
        date: item.creation_date,
        starter: total > 0 ? ((item.starter || 0) / total) * 100 : 0,
        pro: total > 0 ? ((item.pro || 0) / total) * 100 : 0,
        business: total > 0 ? ((item.business || 0) / total) * 100 : 0,
      };
    });
  };

  const sixMonthsData = data.filter(item => {
    const date = parseISO(item.creation_date);
    const sixMonthsAgo = subMonths(new Date(), 6);
    return date >= sixMonthsAgo;
  });

  const processedData = processData(sixMonthsData);

  return (
    <div className="bg-gray-1600 rounded-xl p-6">
      <h3 className="text-md font-medium mb-6 text-gray-white">License Distribution - Last 6 Months</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#32395A" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(parseISO(value), 'MMM d')}
              stroke="#4E588B"
              interval={30}
            />
            <YAxis
              stroke="#4E588B"
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <Tooltip
              cursor={{ fill: '#32395A', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#202439', border: 'none' }}
              labelFormatter={(value) => format(parseISO(value), 'MMM d, yyyy')}
              formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
            />
            <Area
              type="monotone"
              dataKey="business"
              stackId="1"
              stroke="#D047A2"
              fill="#D047A2"
              name="Business"
            />
            <Area
              type="monotone"
              dataKey="pro"
              stackId="1"
              stroke="#4C74FF"
              fill="#4C74FF"
              name="Pro"
            />
            <Area
              type="monotone"
              dataKey="starter"
              stackId="1"
              stroke="#00CF56"
              fill="#00CF56"
              name="Starter"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}