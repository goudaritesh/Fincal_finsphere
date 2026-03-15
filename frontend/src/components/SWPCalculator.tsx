"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import InputGroup from './InputGroup';

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(1000000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(8);

  const [balance, setBalance] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const getAIAdvice = async () => {
    setIsAskingAi(true);
    try {
      const prompt = `I am planning a Systematic Withdrawal Plan (SWP). 
      Initial Corpus: ₹${corpus}, Monthly Withdrawal: ₹${withdrawal}, Years: ${years}, Expected Returns: ${returns}%. 
      Total withdrawn will be ${formatCurrency(totalWithdrawals)} and final balance will be ${formatCurrency(balance)}. 
      Can you provide a brief, professional analysis? 
      Is this withdrawal rate sustainable? Mention the importance of the withdrawal rate vs inflation.`;
      
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
    const pv = corpus;
    const w = withdrawal;
    const r = returns / 100 / 12;
    const n = years * 12;
    
    // FV = PV * (1 + r)^n - W * [((1 + r)^n - 1) / r]
    let fv = 0;
    if (r > 0) {
      fv = pv * Math.pow(1 + r, n) - w * ((Math.pow(1 + r, n) - 1) / r);
    } else {
      fv = pv - (w * n);
    }
    
    setBalance(Math.max(0, fv));
    setTotalWithdrawals(w * n);
  }, [corpus, withdrawal, years, returns]);

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
        <h2 className="text-xl font-bold text-primary-blue mb-6">SWP Calculator</h2>
        
        <InputGroup
          id="initial-corpus"
          label="Initial Corpus"
          value={corpus}
          min={100000}
          max={50000000}
          step={100000}
          onChange={setCorpus}
          prefix="₹"
          tooltip="The total amount you want to invest for withdrawal."
        />

        <InputGroup
          id="monthly-withdrawal"
          label="Monthly Withdrawal"
          value={withdrawal}
          min={1000}
          max={500000}
          step={1000}
          onChange={setWithdrawal}
          prefix="₹"
          tooltip="The amount you want to withdraw every month."
        />

        <InputGroup
          id="swp-years"
          label="Withdrawal Period"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
          suffix=" yrs"
          tooltip="Duration for which you want to make withdrawals."
        />

        <InputGroup
          id="swp-returns"
          label="Expected Annual Return"
          value={returns}
          min={1}
          max={20}
          step={0.5}
          onChange={setReturns}
          suffix="%"
          tooltip="Expected annual rate of return on the remaining corpus."
        />
      </div>

      <div className="p-8 md:w-1/2 bg-accent-light flex flex-col justify-center">
        <div className="text-center mb-10">
          <p className="text-sm text-primary-grey font-medium mb-1">Total Amount Withdrawn</p>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalWithdrawals)}</p>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow-sm border text-center relative overflow-hidden ${balance > 0 ? 'border-primary-blue/10' : 'border-primary-red/20'}`}>
          <div className={`absolute top-0 left-0 w-full h-1 ${balance > 0 ? 'bg-primary-blue' : 'bg-primary-red'}`}></div>
          <p className="text-sm text-primary-grey font-medium mb-2">Final Corpus Balance</p>
          <p className={`text-4xl font-extrabold ${balance > 0 ? 'text-primary-blue' : 'text-primary-red'}`}>{formatCurrency(balance)}</p>
          <p className="text-[10px] text-primary-grey mt-4">
            {balance > 0 
              ? `Your corpus will last for the entire ${years} years with this remaining balance.` 
              : `Caution: Your corpus may deplete before the end of ${years} years.`}
          </p>
        </div>

        <button 
          onClick={getAIAdvice}
          disabled={isAskingAi}
          className="btn-primary mt-8 w-full shadow-md flex items-center justify-center gap-2"
        >
          {isAskingAi ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : "✨ Analyze Sustainability with AI"}
        </button>

        {aiAdvice && (
          <div className="mt-4 p-4 bg-white border border-blue-100 rounded-2xl text-[11px] text-gray-700 leading-relaxed max-h-40 overflow-y-auto hide-scrollbar">
            <span className="font-bold text-primary-blue block mb-1">🤖 AI Sustainability Report:</span>
            {aiAdvice}
          </div>
        )}
      </div>
    </div>
  );
}
