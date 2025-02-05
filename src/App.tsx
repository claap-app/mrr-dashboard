import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { KPICard } from './components/KPICard';
import { MRRChart } from './components/MRRChart';
import { MonthlyGrowthChart } from './components/MonthlyGrowthChart';
import { MonthlyTargetsChart } from './components/MonthlyTargetsChart';
import { GoalProgress } from './components/GoalProgress';
import { useMRRData } from './hooks/useMRRData';
import { MONTHS, INITIAL_GROWTH_RATE } from './lib/constants';

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
      currentTarget *= (1 + INITIAL_GROWTH_RATE/100);
    }
    return targets;
  });

  const {
    yesterday,
    dayBeforeYesterday,
    dailyGrowthPercentage,
    thirtyDayGrowthPercentage,
    last6MonthsData
  } = useMemo(() => {
    const yesterday = mrrData[mrrData.length - 1] || { mrr: 0 };
    const dayBeforeYesterday = mrrData[mrrData.length - 2] || { mrr: 0 };
    const thirtyDaysAgo = mrrData[mrrData.length - 31] || { mrr: 0 };
    
    return {
      yesterday,
      dayBeforeYesterday,
      dailyGrowthPercentage: dayBeforeYesterday.mrr ? 
        ((yesterday.mrr - dayBeforeYesterday.mrr) / dayBeforeYesterday.mrr) * 100 : 0,
      thirtyDayGrowthPercentage: thirtyDaysAgo.mrr ?
        ((yesterday.mrr - thirtyDaysAgo.mrr) / thirtyDaysAgo.mrr) * 100 : 0,
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
      currentTarget *= (1 + growthRate/100);
    }
    setTargetMRR(newTargets);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Error: {error}</div>;
  }

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
              growth={thirtyDayGrowthPercentage}
              subtitle=" over 30 days"
            />
            <GoalProgress currentValue={yesterday.mrr} />
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