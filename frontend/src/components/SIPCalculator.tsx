"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import InputGroup from './InputGroup';

export default function SIPCalculator() {
  const [investment, setInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);

  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const getAIAdvice = async () => {
    setIsAskingAi(true);
    try {
      const prompt = `I am planning an SIP of ₹${investment} monthly for ${years} years with an expected return of ${returns}%. 
      The total future value is estimated at ${formatCurrency(totalValue)}. 
      Can you provide a brief, professional analysis of this investment plan? 
      Mention if it's realistic, the impact of compounding, and one tip to improve wealth creation.`;
      
      const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setAiAdvice(data?.answer || "AI service is currently unavailable.");
    } catch (error) {
      setAiAdvice("Failed to connect to AI analyst.");
    } finally {
      setIsAskingAi(false);
    }
  };

  useEffect(() => {
    const p = investment;
    const r = returns / 100 / 12;
    const n = years * 12;
    
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    let fv = 0;
    if (r > 0) {
      fv = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    } else {
      fv = p * n;
    }
    
    const invested = p * n;
    setTotalInvestment(invested);
    setTotalValue(fv);
    setEstimatedReturns(fv - invested);
  }, [investment, years, returns]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const investedPercent = (totalInvestment / totalValue) * 100;

  return (
    <div className="card max-w-4xl mx-auto flex flex-col md:flex-row">
      <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100">
        <h2 className="text-xl font-bold text-primary-blue mb-6">SIP Calculator</h2>
        
        <InputGroup
          id="sip-amount"
          label="Monthly Investment"
          value={investment}
          min={500}
          max={100000}
          step={500}
          onChange={setInvestment}
          prefix="₹"
          tooltip="The amount you plan to invest every month."
        />

        <InputGroup
          id="sip-years"
          label="Investment Period"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
          suffix=" yrs"
          tooltip="Duration for which you want to continue your SIP."
        />

        <InputGroup
          id="sip-returns"
          label="Expected Annual Return"
          value={returns}
          min={1}
          max={30}
          step={0.5}
          onChange={setReturns}
          suffix="%"
          tooltip="Expected annual rate of return on your investment."
        />

        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Total Invested Amount</span>
            <span className="font-bold text-gray-700">{formatCurrency(totalInvestment)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Estimated Returns</span>
            <span className="font-bold text-primary-blue">{formatCurrency(estimatedReturns)}</span>
          </div>
        </div>
      </div>

      <div className="p-8 md:w-1/2 bg-accent-light flex flex-col justify-center">
        <div className="text-center mb-8">
          <p className="text-sm text-primary-grey font-medium mb-1">Total Future Value</p>
          <p className="text-4xl font-extrabold text-primary-blue">{formatCurrency(totalValue)}</p>
        </div>

        <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-8">
          <div 
            className="absolute top-0 left-0 h-full bg-primary-grey transition-all duration-500"
            style={{ width: `${investedPercent}%` }}
          ></div>
          <div 
            className="absolute top-0 right-0 h-full bg-primary-blue transition-all duration-500"
            style={{ width: `${100 - investedPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-8">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-grey rounded-full mr-2"></div>
            <span className="text-primary-grey">Invested ({investedPercent.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-blue rounded-full mr-2"></div>
            <span className="text-primary-blue">Returns ({(100 - investedPercent).toFixed(1)}%)</span>
          </div>
        </div>

        <button 
          onClick={getAIAdvice}
          disabled={isAskingAi}
          className="btn-primary w-full shadow-md flex items-center justify-center gap-2 mb-4"
        >
          {isAskingAi ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : "✨ Analyze with AI"}
        </button>

        {aiAdvice && (
          <div className="mt-4 p-4 bg-white/50 border border-blue-100 rounded-2xl text-[11px] text-gray-700 leading-relaxed max-h-40 overflow-y-auto hide-scrollbar">
            <span className="font-bold text-primary-blue block mb-1">🤖 AI Insight:</span>
            {aiAdvice}
          </div>
        )}
      </div>
    </div>
  );
}
