import React, { useState, useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { MRRChart } from '../components/MRRChart';
import { MonthlyGrowthChart } from '../components/MonthlyGrowthChart';
import { MonthlyTargetsChart } from '../components/MonthlyTargetsChart';
import { GoalProgress } from '../components/GoalProgress';
import { NetNewMRRChart } from '../components/NetNewMRRChart';
import { useMRRData } from '../hooks/useMRRData';
import { MONTHS, INITIAL_GROWTH_RATE, MONTHLY_GOALS } from '../lib/constants';

export function MRRDashboard() {
  const { mrrData, isLoading, error } = useMRRData();
  const [growthRate, setGrowthRate] = useState(INITIAL_GROWTH_RATE);
  const [targetMRR, setTargetMRR] = useState(() => {
    const targets = [];
    let currentTarget = 52000;

    for (let i = 0; i < 12; i++) {
      targets.push({
        month: MONTHS[i],
        target: Math.round(currentTarget)
      });
      currentTarget *= (1 + INITIAL_GROWTH_RATE / 100);
    }
    return targets;
  });

  const {
    yesterday,
    dayBeforeYesterday,
    lastDayOfPreviousMonth,
    dailyGrowthPercentage,
    thirtyDayGrowthPercentage,
    sixMonthsGrowthPercentage,
    last6MonthsData
  } = useMemo(() => {
    const yesterday = mrrData[mrrData.length - 1] || { mrr: 0 };
    const dayBeforeYesterday = mrrData[mrrData.length - 2] || { mrr: 0 };

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const previousMonthDate = new Date(currentYear, currentMonth, 0);
    const previousYear = previousMonthDate.getFullYear();
    const previousMonth = previousMonthDate.getMonth();

    const previousMonthRecords = mrrData.filter(dataPoint => {
      const date = new Date(dataPoint.creation_date);
      return date.getFullYear() === previousYear && date.getMonth() === previousMonth;
    });

    const lastDayOfPreviousMonth = previousMonthRecords.length > 0
      ? previousMonthRecords.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date))[previousMonthRecords.length - 1]
      : { mrr: 0 };

    const thirtyDaysAgo = mrrData[mrrData.length - 31] || { mrr: 0 };
    const sixMonthsAgo = mrrData[mrrData.length - 182] || { mrr: 0 };

    return {
      yesterday,
      dayBeforeYesterday,
      lastDayOfPreviousMonth,
      dailyGrowthPercentage: dayBeforeYesterday.mrr
        ? ((yesterday.mrr - dayBeforeYesterday.mrr) / dayBeforeYesterday.mrr) * 100
        : 0,
      thirtyDayGrowthPercentage: thirtyDaysAgo.mrr
        ? ((yesterday.mrr - thirtyDaysAgo.mrr) / thirtyDaysAgo.mrr) * 100
        : 0,
      sixMonthsGrowthPercentage: sixMonthsAgo.mrr
        ? (yesterday.mrr / sixMonthsAgo.mrr)
        : 0,
      last6MonthsData: mrrData.slice(-180)
    };
  }, [mrrData]);

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

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth() + 1;

  // Calculate the key for MONTHLY_GOALS
  // Keys 11-12 = Nov-Dec 2025, Keys 13-24 = Jan-Dec 2026
  let monthlyGoalKey;
  if (currentYear === 2025 && currentMonthIndex >= 11) {
    monthlyGoalKey = currentMonthIndex; // 11 or 12
  } else if (currentYear === 2026) {
    monthlyGoalKey = currentMonthIndex + 12; // 13-24
  } else {
    monthlyGoalKey = null; // No target for other periods
  }

  const monthlyGoal = monthlyGoalKey ? (MONTHLY_GOALS[monthlyGoalKey] || 0) : 0;

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <KPICard
          title="Yesterday's MRR"
          value={`$${yesterday.mrr.toLocaleString()}`}
          growth={dailyGrowthPercentage}
          subtitle=" daily"
        />
        <KPICard
          title="30-Day Growth"
          value={`${Math.abs(thirtyDayGrowthPercentage).toFixed(2)}%`}
          subtitle=" over 30 days"
        />
        <GoalProgress
          title="Monthly Goal Progress"
          currentValue={yesterday.mrr - lastDayOfPreviousMonth.mrr}
          monthlyGoal={monthlyGoal - lastDayOfPreviousMonth.mrr}
          valuePrefix="$"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <KPICard
          title="ARR"
          value={`$${(yesterday.mrr*12).toLocaleString()}`}
        />
        <KPICard
          title="6 Months Growth"
          value={`${Math.abs(sixMonthsGrowthPercentage).toFixed(2)}x`}
          subtitle=" over 6 months"
        />
        <GoalProgress
          title="Road to 2M ARR"
          currentValue={yesterday.mrr*12}
          monthlyGoal={2000000}
          valuePrefix="$"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <MRRChart
          data={last6MonthsData}
          title="MRR Growth - Last 3 Months"
          barColor="#00CF56"
          valuePrefix="$"
        />
        <MonthlyGrowthChart data={mrrData} />
      </div>

      <div>
        <MonthlyTargetsChart targetData={targetMRR} realizedData={mrrData} valuePrefix="$" />
      </div>

      <div>
        <NetNewMRRChart data={mrrData} />
      </div>
    </div>
  );
}
