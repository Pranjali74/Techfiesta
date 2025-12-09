import React from 'react';
import { TrendingUp } from 'lucide-react';
import { analyzeSpending } from '../utils/financeCalculations';

export default function SpendingOverview({ userData }) {
  if (userData.expenses.length === 0) return null;
  
  const { analysis, total } = analyzeSpending(userData.expenses);
  const remaining = userData.income - total;
  
  return (
    <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <TrendingUp size={18} />
        Your Spending Overview
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/10 rounded p-3">
          <div className="text-blue-200 text-xs mb-1">Total Spent</div>
          <div className="text-white text-xl font-bold">${total.toLocaleString()}</div>
        </div>
        <div className="bg-white/10 rounded p-3">
          <div className="text-green-200 text-xs mb-1">Remaining</div>
          <div className="text-white text-xl font-bold">${remaining.toLocaleString()}</div>
        </div>
      </div>
      <div className="space-y-2">
        {analysis.slice(0, 3).map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-white">{cat.category}</span>
            <span className="text-blue-200">${cat.amount.toLocaleString()} ({cat.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
