"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import InputGroup from './InputGroup';

export default function GoalBasedCalculator() {
  const [currentCost, setCurrentCost] = useState(1000000);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [returns, setReturns] = useState(12);

  const [inflatedValue, setInflatedValue] = useState(0);
  const [requiredSIP, setRequiredSIP] = useState(0);

  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const getAIAdvice = async () => {
    setIsAskingAi(true);
    try {
      const prompt = `I have a financial goal that costs ₹${currentCost} today. 
      In ${years} years, with ${inflation}% inflation, it will cost ₹${inflatedValue.toFixed(0)}. 
      To reach this, I need to invest ₹${requiredSIP.toFixed(0)} monthly at ${returns}% returns. 
      Can you provide a brief, professional analysis? 
      Is the inflation assumption realistic? How should I adjust my portfolio as I get closer to the goal?`;
      
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
    // Step 1: Inflate Goal Value
    const fv = currentCost * Math.pow(1 + inflation / 100, years);
    setInflatedValue(fv);

    // Step 2: Calculate Required Monthly SIP
    const r = returns / 100 / 12;
    const n = years * 12;
    
    if (r > 0) {
      const sip = (fv * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
      setRequiredSIP(sip);
    } else {
      setRequiredSIP(fv / n);
    }
  }, [currentCost, years, inflation, returns]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="card max-w-4xl mx-auto flex flex-col md:flex-row">
      <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100">
        <h2 className="text-xl font-bold text-primary-blue mb-6">Goal-Based Planner</h2>
        
        <InputGroup
          id="current-cost"
          label="Current Cost of Goal"
          value={currentCost}
          min={100000}
          max={10000000}
          step={50000}
          onChange={setCurrentCost}
          prefix="₹"
          tooltip="The cost of your goal in today's money (e.g., cost of a car today)."
        />

        <InputGroup
          id="years-to-goal"
          label="Years to Goal"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
          suffix=" yrs"
          tooltip="How many years from now you want to achieve this goal."
        />

        <InputGroup
          id="inflation-rate"
          label="Assumed Inflation Rate"
          value={inflation}
          min={1}
          max={15}
          step={0.5}
          onChange={setInflation}
          suffix="%"
          tooltip="Expected annual rise in the cost of your goal."
        />

        <InputGroup
          id="return-rate"
          label="Assumed Annual Return"
          value={returns}
          min={1}
          max={30}
          step={0.5}
          onChange={setReturns}
          suffix="%"
          tooltip="The expected annual rate of return on your investments."
        />
      </div>

      <div className="p-8 md:w-1/2 bg-accent-light flex flex-col justify-center">
        <div className="text-center mb-10">
          <p className="text-sm text-primary-grey font-medium mb-1">Estimated Future Value of Goal</p>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(inflatedValue)}</p>
          <p className="text-[10px] text-primary-grey mt-2 px-4 italic">
            *Considering {inflation}% inflation, your goal of {formatCurrency(currentCost)} will cost {formatCurrency(inflatedValue)} in {years} years.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-blue/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-blue"></div>
          <p className="text-sm text-primary-grey font-medium mb-2">Required Monthly Investment</p>
          <p className="text-4xl font-extrabold text-primary-blue">{formatCurrency(requiredSIP)}</p>
          <p className="text-[10px] text-primary-grey mt-4">
            Invest this amount every month for {years} years to reach your goal.
          </p>
        </div>

        <button 
          onClick={getAIAdvice}
          disabled={isAskingAi}
          className="btn-primary mt-8 w-full shadow-md flex items-center justify-center gap-2"
        >
          {isAskingAi ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : "✨ Optimize with AI"}
        </button>

        {aiAdvice && (
          <div className="mt-4 p-4 bg-white border border-blue-100 rounded-2xl text-[11px] text-gray-700 leading-relaxed max-h-40 overflow-y-auto hide-scrollbar">
            <span className="font-bold text-primary-blue block mb-1">🤖 AI Strategic Advice:</span>
            {aiAdvice}
          </div>
        )}
      </div>
    </div>
  );
}
