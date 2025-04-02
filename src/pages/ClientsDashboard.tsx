import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { MRRChart } from '../components/MRRChart';
import { MonthlyGrowthChart } from '../components/MonthlyGrowthChart';
import { GoalProgress } from '../components/GoalProgress';
import { LicenseDistributionChart } from '../components/LicenseDistributionChart';
import { useClientsData } from '../hooks/useClientsData';

export function ClientsDashboard() {
  const { clientsData, isLoading, error } = useClientsData();

  const {
    yesterday,
    dayBeforeYesterday,
    dailyGrowthPercentage,
    thirtyDayGrowthPercentage,
    last6MonthsData
  } = useMemo(() => {
    const yesterday = clientsData[clientsData.length - 1] || { clients: 0 };
    const dayBeforeYesterday = clientsData[clientsData.length - 2] || { clients: 0 };
    const thirtyDaysAgo = clientsData[clientsData.length - 31] || { clients: 0 };

    return {
      yesterday,
      dayBeforeYesterday,
      dailyGrowthPercentage: dayBeforeYesterday.clients
        ? ((yesterday.clients - dayBeforeYesterday.clients) / dayBeforeYesterday.clients) * 100
        : 0,
      thirtyDayGrowthPercentage: thirtyDaysAgo.clients
        ? ((yesterday.clients - thirtyDaysAgo.clients) / thirtyDaysAgo.clients) * 100
        : 0,
      last6MonthsData: clientsData.slice(-180)
    };
  }, [clientsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <KPICard
          title="Total Clients"
          value={yesterday.clients.toLocaleString()}
          growth={dailyGrowthPercentage}
          subtitle=" daily"
        />
        <KPICard
          title="30-Day Growth"
          value={`${Math.abs(thirtyDayGrowthPercentage).toFixed(2)}%`}
          subtitle=" over 30 days"
        />
        <GoalProgress 
          title="Road to 1000 Clients"
          currentValue={yesterday.clients} 
          monthlyGoal={1000}
          valuePrefix=""
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <MRRChart
          data={last6MonthsData}
          title="Client Growth - Last 3 Months"
          barColor="#809CFF"
          dataKey="clients"
          valuePrefix=""
          tooltipLabel="Clients"
        />
        <MonthlyGrowthChart 
          data={clientsData} 
          valueKey="clients"
          title="Monthly Client Growth Rate"
        />
      </div>

      <div>
        <LicenseDistributionChart data={clientsData} />
      </div>
    </div>
  );
}