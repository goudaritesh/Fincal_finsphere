"use client";

import React, { useState } from 'react';
import { API_BASE_URL } from '@/config';

export default function AIStockCalculator() {
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1200);
  const [quantity, setQuantity] = useState(10);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const profit = (sellPrice - buyPrice) * quantity;
  const profitPct = buyPrice > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0;
  const isProfit = profit >= 0;

  const calculateAndAskAi = async () => {
    setIsAskingAi(true);
    try {
      const prompt = `I bought a stock at ₹${buyPrice} and sold at ₹${sellPrice} (Quantity: ${quantity}). My total profit is ₹${profit.toFixed(2)} (${profitPct.toFixed(2)}%). Can you explain the potential tax implications (like Short Term vs Long Term Capital Gains in India) and give a quick tip on what to do with this profit?`;
      const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setAiAdvice(data.answer || "AI service is currently unavailable.");
    } catch (error) {
      setAiAdvice("Failed to connect to AI advisor. Please try again later.");
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="card p-8 max-w-4xl mx-auto shadow-xl space-y-8">
      <h2 className="text-2xl font-bold text-primary-blue">AI Stock Profit Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Buy Price (₹)" value={buyPrice} onChange={setBuyPrice} />
            <InputField label="Sell Price (₹)" value={sellPrice} onChange={setSellPrice} />
          </div>
          <InputField label="Quantity" value={quantity} onChange={setQuantity} />
          
          <button 
            onClick={calculateAndAskAi}
            disabled={isAskingAi}
            className="w-full btn-primary"
          >
            {isAskingAi ? 'Thinking...' : 'Calculate & Get AI Advice 🧠'}
          </button>
        </div>

        <div className={`p-8 rounded-3xl text-white flex flex-col items-center justify-center space-y-2 shadow-lg transition-colors duration-500 ${isProfit ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
          <span className="text-sm font-bold opacity-80 uppercase tracking-widest">{isProfit ? 'Estimated Profit' : 'Estimated Loss'}</span>
          <span className="text-4xl font-black">₹{Math.abs(profit).toLocaleString()}</span>
          <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
            {isProfit ? '+' : ''}{profitPct.toFixed(2)}%
          </span>
        </div>
      </div>

      {(aiAdvice || isAskingAi) && (
        <div className="p-6 bg-white border border-blue-100 rounded-3xl shadow-sm">
          <h3 className="font-bold text-primary-blue mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <span>✨</span> AI Tax & Strategy Advice
          </h3>
          {isAskingAi ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {aiAdvice}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{label}</label>
      <input 
        type="number" 
        className="input-field" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
