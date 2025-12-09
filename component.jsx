import React, { useState } from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';

export default function OnboardingForm({ onComplete }) {
  const [income, setIncome] = useState('');
  const [goal, setGoal] = useState('');

  const handleSubmit = () => {
    if (income && parseFloat(income) > 0) {
      onComplete(income, goal || '0');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <DollarSign size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Finance Assistant!</h2>
          <p className="text-slate-300">Let's set up your financial profile</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Monthly Income ($) *
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g., 3000"
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Savings Goal ($) <span className="text-slate-400 text-xs">(Optional)</span>
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., 5000"
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!income || parseFloat(income) <= 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Get Started
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-400 mt-1 flex-shrink-0" />
            <p className="text-xs text-blue-200">
              Your data is stored locally and privately. We'll use this to provide personalized financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
