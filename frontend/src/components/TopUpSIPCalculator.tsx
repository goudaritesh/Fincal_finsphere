"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import InputGroup from './InputGroup';

export default function TopUpSIPCalculator() {
  const [initialSIP, setInitialSIP] = useState(5000);
  const [topUpRate, setTopUpRate] = useState(10);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);

  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const getAIAdvice = async () => {
    setIsAskingAi(true);
    try {
      const prompt = `I am using a Top-Up SIP Calculator. 
      Initial SIP: ₹${initialSIP}, Annual Top-up: ${topUpRate}%, Tenure: ${years} years, Expected Returns: ${returns}%. 
      Total Invested: ${formatCurrency(totalInvestment)}, Future Value: ${formatCurrency(totalValue)}. 
      Can you provide a brief, professional analysis? 
      Compare this to a normal SIP (without top-up) and highlight the efficiency of this strategy for wealth creation.`;
      
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
    const r = returns / 100 / 12;
    let currentSIP = initialSIP;
    let runningFV = 0;
    let totalInvested = 0;

    for (let year = 1; year <= years; year++) {
      // Future Value of 1 year of currentSIP contributions
      // This is local to the year, but we need to compound the existing FV too
      
      // Calculate FV Contribution of all contributions in THIS year until the end of the TOTAL tenure
      for (let month = 1; month <= 12; month++) {
        const remainingMonths = (years - year) * 12 + (12 - month);
        runningFV += currentSIP * Math.pow(1 + r, remainingMonths + 1);
        totalInvested += currentSIP;
      }

      // Increase SIP for next year
      currentSIP = currentSIP * (1 + topUpRate / 100);
    }
    
    setTotalInvestment(totalInvested);
    setTotalValue(runningFV);
  }, [initialSIP, topUpRate, years, returns]);

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
        <h2 className="text-xl font-bold text-primary-blue mb-6">Top-Up SIP Calculator</h2>
        
        <InputGroup
          id="initial-sip"
          label="Initial Monthly SIP"
          value={initialSIP}
          min={500}
          max={100000}
          step={500}
          onChange={setInitialSIP}
          prefix="₹"
        />

        <InputGroup
          id="top-up-rate"
          label="Annual Top-up Rate (%)"
          value={topUpRate}
          min={1}
          max={50}
          step={1}
          onChange={setTopUpRate}
          suffix="%"
          tooltip="Percentage by which you'll increase your SIP amount every year."
        />

        <InputGroup
          id="top-up-years"
          label="Investment Period"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
          suffix=" yrs"
        />

        <InputGroup
          id="top-up-returns"
          label="Expected Annual Return"
          value={returns}
          min={1}
          max={30}
          step={0.5}
          onChange={setReturns}
          suffix="%"
        />
      </div>

      <div className="p-8 md:w-1/2 bg-accent-light flex flex-col justify-center">
        <div className="space-y-6 text-center">
          <div>
            <p className="text-sm text-primary-grey font-medium mb-1">Total Amount Invested</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalInvestment)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-blue/10">
            <p className="text-sm text-primary-grey font-medium mb-2">Total Future Value</p>
            <p className="text-4xl font-extrabold text-primary-blue">{formatCurrency(totalValue)}</p>
            <p className="text-[10px] text-primary-grey mt-4">
              Step-up SIPs use the power of compounding on ever-increasing principal.
            </p>
          </div>
        </div>

        <button 
          onClick={getAIAdvice}
          disabled={isAskingAi}
          className="btn-primary mt-8 w-full shadow-md flex items-center justify-center gap-2"
        >
          {isAskingAi ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : "✨ Compound Analysis with AI"}
        </button>

        {aiAdvice && (
          <div className="mt-4 p-4 bg-white border border-blue-100 rounded-2xl text-[11px] text-gray-700 leading-relaxed max-h-40 overflow-y-auto hide-scrollbar">
            <span className="font-bold text-primary-blue block mb-1">🤖 AI Efficiency Report:</span>
            {aiAdvice}
          </div>
        )}
      </div>
    </div>
  );
}
