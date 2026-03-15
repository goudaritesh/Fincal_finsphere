"use client";

import React, { useState } from 'react';
import { API_BASE_URL } from '@/config';

export default function SalaryPlanner() {
  const [salary, setSalary] = useState(50000);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const expenses = salary * 0.50;
  const savings = salary * 0.30;
  const investments = salary * 0.20;

  const askAI = async () => {
    setIsAskingAi(true);
    try {
      const prompt = `My monthly salary is ₹${salary}. According to the 50-30-20 rule, my investment portion is ₹${investments}. Can you suggest a good, safe mutual fund strategy or how I should allocate this twenty percent to build wealth safely?`;
      const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setAiAdvice((data && data.answer) ? data.answer : "AI service returned an unexpected response.");
    } catch (error) {
      setAiAdvice("Failed to connect to AI advisor. Please try again later.");
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="card p-8 max-w-4xl mx-auto shadow-xl space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-blue">Salary Investment Planner</h2>
        <span className="text-xs font-bold bg-blue-50 text-primary-blue px-3 py-1 rounded-full uppercase tracking-wider">50-30-20 Rule</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-sm font-bold text-gray-700">Monthly Salary (₹)</label>
              <span className="text-lg font-bold text-primary-blue">₹{salary.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              className="slider-thumb" 
              min="10000" 
              max="1000000" 
              step="5000" 
              value={salary} 
              onChange={(e) => setSalary(Number(e.target.value))}
            />
          </div>

          <div className="space-y-3">
            <BudgetRow color="bg-orange-400" label="Necessities (50%)" amount={expenses} />
            <BudgetRow color="bg-blue-400" label="Wants (30%)" amount={savings} />
            <BudgetRow color="bg-green-500" label="Investments (20%)" amount={investments} />
          </div>

          <button 
            onClick={askAI}
            disabled={isAskingAi}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {isAskingAi ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Profile...
              </>
            ) : (
              <>
                <span>✨</span> Optimize with AI Analyst
              </>
            )}
          </button>
        </div>

        <div className="flex justify-center flex-col items-center">
          <div className="relative w-48 h-48 mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#fb923c" strokeWidth="4" strokeDasharray="50, 100" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#60a5fa" strokeWidth="4" strokeDasharray="30, 100" strokeDashoffset="-50" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="20, 100" strokeDashoffset="-80" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xs text-gray-400 font-bold uppercase">Budget</span>
              <span className="text-lg font-bold text-gray-800">100%</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 max-w-[200px]">
            The 50/30/20 rule is a simple thumb rule to manage your finances efficiently.
          </p>
        </div>
      </div>

      {aiAdvice && (
        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-primary-blue mb-4 flex items-center gap-2">
            <span>🤖</span> AI Investment Strategy
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {aiAdvice}
          </p>
        </div>
      )}
    </div>
  );
}

function BudgetRow({ color, label, amount }: { color: string; label: string; amount: number }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-xs font-bold text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-800">₹{amount.toLocaleString()}</span>
    </div>
  );
}
