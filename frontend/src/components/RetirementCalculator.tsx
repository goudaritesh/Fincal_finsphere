"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import InputGroup from './InputGroup';

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentExpenses, setCurrentExpenses] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [preReturn, setPreReturn] = useState(12);
  const [postReturn, setPostReturn] = useState(8);

  const [retirementCorpus, setRetirementCorpus] = useState(0);
  const [requiredSIP, setRequiredSIP] = useState(0);
  const [monthlyExpenseAtRetirement, setMonthlyExpenseAtRetirement] = useState(0);

  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const getAIAdvice = async () => {
    setIsAskingAi(true);
    try {
      const prompt = `I am planning for retirement. 
      Current Age: ${currentAge}, Retirement Age: ${retirementAge}, Life Expectancy: ${lifeExpectancy}. 
      Current Monthly Expenses: ₹${currentExpenses}, Inflation: ${inflation}%. 
      Required Corpus: ${formatCurrency(retirementCorpus)}, Required Monthly SIP: ${formatCurrency(requiredSIP)}. 
      Can you provide a brief, professional retirement roadmap analysis? 
      Is this plan sustainable? Give one tip for the post-retirement phase.`;
      
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
    const yearsToRetirement = retirementAge - currentAge;
    const retirementDuration = lifeExpectancy - retirementAge;

    if (yearsToRetirement <= 0 || retirementDuration <= 0) return;

    // Step 1: Inflate Monthly Expenses
    const inflatedMonthlyExpense = currentExpenses * Math.pow(1 + inflation / 100, yearsToRetirement);
    const inflatedAnnualExpense = inflatedMonthlyExpense * 12;
    setMonthlyExpenseAtRetirement(inflatedMonthlyExpense);

    // Step 2: Calculate Retirement Corpus (Present Value of Annuity)
    const rPost = postReturn / 100;
    // Corpus needed to generate inflatedAnnualExpense for retirementDuration years
    // Formula: PV = PMT * [1 - (1+r)^-n] / r
    const corpus = inflatedAnnualExpense * (1 - Math.pow(1 + rPost, -retirementDuration)) / rPost;
    setRetirementCorpus(corpus);

    // Step 3: Calculate Required SIP Until Retirement
    const rPre = preReturn / 100 / 12;
    const n = yearsToRetirement * 12;
    // SIP = FV * r / [((1 + r)^n - 1) * (1 + r)]
    const sip = (corpus * rPre) / ((Math.pow(1 + rPre, n) - 1) * (1 + rPre));
    setRequiredSIP(sip);

  }, [currentAge, retirementAge, lifeExpectancy, currentExpenses, inflation, preReturn, postReturn]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="card max-w-5xl mx-auto flex flex-col md:flex-row">
      <div className="p-8 md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-x-8 border-b md:border-b-0 md:border-r border-gray-100">
        <h2 className="text-xl font-bold text-primary-blue mb-6 col-span-full">Retirement Planner</h2>
        
        <div className="col-span-full mb-4 px-4 py-2 bg-blue-50 text-primary-blue text-[10px] font-bold rounded uppercase tracking-wider">Demographics</div>
        
        <InputGroup
          id="current-age"
          label="Current Age"
          value={currentAge}
          min={18}
          max={60}
          step={1}
          onChange={setCurrentAge}
          suffix=" yrs"
        />

        <InputGroup
          id="retirement-age"
          label="Retirement Age"
          value={retirementAge}
          min={currentAge + 1}
          max={75}
          step={1}
          onChange={setRetirementAge}
          suffix=" yrs"
        />

        <InputGroup
          id="life-expectancy"
          label="Life Expectancy"
          value={lifeExpectancy}
          min={retirementAge + 1}
          max={100}
          step={1}
          onChange={setLifeExpectancy}
          suffix=" yrs"
          tooltip="How long you expect to live after retirement."
        />

        <div className="col-span-full mb-4 px-4 py-2 bg-blue-50 text-primary-blue text-[10px] font-bold rounded uppercase tracking-wider">Financials</div>

        <InputGroup
          id="monthly-expenses"
          label="Current Monthly Expenses"
          value={currentExpenses}
          min={10000}
          max={500000}
          step={5000}
          onChange={setCurrentExpenses}
          prefix="₹"
        />

        <InputGroup
          id="ret-inflation"
          label="Inflation Rate"
          value={inflation}
          min={1}
          max={12}
          step={0.5}
          onChange={setInflation}
          suffix="%"
        />

        <div className="col-span-full mb-4 px-4 py-2 bg-blue-50 text-primary-blue text-[10px] font-bold rounded uppercase tracking-wider">Returns</div>

        <InputGroup
          id="pre-return"
          label="Pre-Retirement Return"
          value={preReturn}
          min={1}
          max={20}
          step={0.5}
          onChange={setPreReturn}
          suffix="%"
          tooltip="Return on investments before retirement (Accumulation phase)."
        />

        <InputGroup
          id="post-return"
          label="Post-Retirement Return"
          value={postReturn}
          min={1}
          max={15}
          step={0.5}
          onChange={setPostReturn}
          suffix="%"
          tooltip="Return on investments after retirement (Distribution phase)."
        />
      </div>

      <div className="p-8 md:w-2/5 bg-accent-light flex flex-col justify-center">
        <div className="space-y-6 text-center">
          <div className="mb-4">
            <p className="text-sm text-primary-grey font-medium mb-1">Monthly Expense at retirement</p>
            <p className="text-xl font-bold text-gray-700">{formatCurrency(monthlyExpenseAtRetirement)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary-blue/10">
            <p className="text-sm text-primary-grey font-medium mb-2">Total Corpus Required</p>
            <p className="text-3xl font-extrabold text-primary-blue">{formatCurrency(retirementCorpus)}</p>
          </div>

          <div className="bg-primary-blue p-6 rounded-2xl shadow-lg text-white">
            <p className="text-xs text-blue-200 font-medium mb-2 uppercase tracking-widest">Required Monthly SIP</p>
            <p className="text-4xl font-extrabold">{formatCurrency(requiredSIP)}</p>
            <p className="text-[10px] text-blue-200 mt-4 leading-relaxed">
              Invest this amount monthly until age {retirementAge} to build your dream retirement corpus.
            </p>
          </div>
        </div>

        <button 
          onClick={getAIAdvice}
          disabled={isAskingAi}
          className="btn-primary mt-8 w-full bg-white !text-primary-blue hover:!bg-blue-50 shadow-md flex items-center justify-center gap-2"
        >
          {isAskingAi ? (
            <div className="w-5 h-5 border-2 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
          ) : "✨ Generate AI Roadmap"}
        </button>

        {aiAdvice && (
          <div className="mt-4 p-4 bg-white/50 border border-blue-100 rounded-2xl text-[11px] text-gray-700 leading-relaxed max-h-40 overflow-y-auto hide-scrollbar">
            <span className="font-bold text-primary-blue block mb-1">🤖 AI Retirement Insight:</span>
            {aiAdvice}
          </div>
        )}
      </div>
    </div>
  );
}
