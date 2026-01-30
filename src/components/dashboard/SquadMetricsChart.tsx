'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { SquadMetric } from '@/types';

interface SquadMetricsChartProps {
  data: SquadMetric[];
  type: 'gold' | 'vision' | 'cs';
}

const SquadMetricsChart: React.FC<SquadMetricsChartProps> = ({ data, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Squad Data...</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.name,
    value: type === 'gold' ? item.gold_diff : type === 'vision' ? item.vision_score : item.cs,
  }));

  const color = type === 'gold' ? '#fbbf24' : type === 'vision' ? '#8b5cf6' : '#00aeef';

  return (
    <div className="w-full h-[250px] min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            fontSize={10} 
            fontWeight={700}
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            fontSize={10} 
            fontWeight={700}
            tick={{ fill: '#64748b' }}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SquadMetricsChart;
