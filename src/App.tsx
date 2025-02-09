import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { KPICard } from './components/KPICard';
import { MRRChart } from './components/MRRChart';
import { MonthlyGrowthChart } from './components/MonthlyGrowthChart';
import { MonthlyTargetsChart } from './components/MonthlyTargetsChart';
import { GoalProgress } from './components/GoalProgress';
import { useMRRData } from './hooks/useMRRData';
import { MONTHS, INITIAL_GROWTH_RATE, MONTHLY_GOALS } from './lib/constants';

function App() {
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

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed

    // Determine the last day of the previous month
    // By setting day to 0, the Date constructor returns the last day of the previous month.
    const previousMonthDate = new Date(currentYear, currentMonth, 0);
    const previousYear = previousMonthDate.getFullYear();
    const previousMonth = previousMonthDate.getMonth(); // 0-indexed

    // Filter records for the previous month and year
    const previousMonthRecords = mrrData.filter(dataPoint => {
      const date = new Date(dataPoint.creation_date);
      return date.getFullYear() === previousYear && date.getMonth() === previousMonth;
    });

    // Sort records by creation_date (ascending) and select the last one (the last day)
    const lastDayOfPreviousMonth = previousMonthRecords.length > 0
      ? previousMonthRecords.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date))[previousMonthRecords.length - 1]
      : { mrr: 0 };

    // Get the record from 30 days ago (or fallback)
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

  const recalculateTargets = () => {
    const newTargets = [];
    let currentTarget = 52000;
    
    for (let i = 0; i < 12; i++) {
      newTargets.push({
        month: MONTHS[i],
        target: Math.round(currentTarget)
      });
      currentTarget *= (1 + growthRate / 100);
    }
    setTargetMRR(newTargets);
  };

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

  const currentMonthIndex = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1
  const monthlyGoal = MONTHLY_GOALS[currentMonthIndex] || 0; // Default to 0 if no goal is set for the current month

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="px-16">
        <div className="max-w-7xl mx-auto space-y-16">
          <Header 
            growthRate={growthRate}
            onGrowthRateChange={setGrowthRate}
            onRecalculate={recalculateTargets}
          />

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
              title="Road to 1M ARR"
              currentValue={yesterday.mrr*12} 
              monthlyGoal={1000000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <MRRChart
              data={last6MonthsData}
              title="MRR Growth - Last 3 Months"
              barColor="#00CF56"
            />
            <MonthlyGrowthChart data={mrrData} />
          </div>

          <div>
            <MonthlyTargetsChart targetData={targetMRR} realizedData={mrrData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
