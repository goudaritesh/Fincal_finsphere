"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';

export default function Markets() {
  const [loading, setLoading] = useState(true);
  const [indices, setIndices] = useState<any[]>([]);
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const [idxRes, gainerRes, loserRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/market-indices`),
        fetch(`${API_BASE_URL}/api/top-gainers`),
        fetch(`${API_BASE_URL}/api/top-losers`)
      ]);
      const idxData = await idxRes.json();
      const gainerData = await gainerRes.json();
      const loserData = await loserRes.json();
      
      setIndices(Array.isArray(idxData) ? idxData : []);
      setGainers(Array.isArray(gainerData) ? gainerData : []);
      setLosers(Array.isArray(loserData) ? loserData : []);
    } catch (error) {
      console.error("Failed to fetch market data", error);
      setIndices([]);
      setGainers([]);
      setLosers([]);
    } finally {
      setLoading(false);
    }
  };

  const askAIInsight = async () => {
    setIsAskingAi(true);
    try {
      const marketDataStr = indices.map(i => `${i.name}: ${i.value} (${i.change})`).join(', ');
      const prompt = `Here is today's stock market indices: ${marketDataStr}. Can you give a short 2-3 sentence summary of the market sentiment for a beginner investor?`;
      const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setAiAdvice(data.answer);
    } catch (e) {
      setAiAdvice("Failed to fetch AI insights.");
    } finally {
      setIsAskingAi(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-primary-blue font-bold">Loading Live Markets...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#1a3a66] tracking-tight">Financial Markets</h2>
        <button onClick={fetchMarketData} className="p-2 hover:bg-gray-100 rounded-full transition-colors">🔄</button>
      </div>

      {/* Indices Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {indices.map((idx, i) => (
          <div key={i} className="card p-6 border-b-4 border-b-primary-blue">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{idx.name}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-gray-800 tracking-tighter">{idx.value.toLocaleString()}</span>
              <span className={`text-sm font-bold ${idx.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {idx.change}
              </span>
            </div>
            {/* Tiny Mock Chart */}
            <div className="mt-4 h-8 flex items-end gap-1 opacity-20">
              {[...Array(12)].map((_, j) => (
                <div key={j} className="bg-primary-blue flex-grow rounded-t" style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight Section */}
      <div className="card p-6 bg-gradient-to-br from-[#1a3a66] to-primary-blue text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-grow">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>🧠</span> AI Market Sentiment Analysis
            </h3>
            {aiAdvice ? (
              <p className="mt-4 text-sm font-medium text-blue-50 leading-relaxed max-w-2xl">{aiAdvice}</p>
            ) : (
              <p className="mt-2 text-sm text-blue-100 italic">Get an AI-generated summary of today's market conditions.</p>
            )}
          </div>
          <button 
            onClick={askAIInsight}
            disabled={isAskingAi}
            className="whitespace-nowrap btn-primary bg-white text-primary-blue hover:bg-blue-50"
          >
            {isAskingAi ? 'Thinking...' : 'Get Insight ✨'}
          </button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <span className="text-8xl">📊</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="p-2 bg-green-50 text-green-600 rounded-lg font-bold">▲</span>
            <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm">Top Gainers</h3>
          </div>
          <div className="space-y-4">
            {gainers.map((g, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-all group">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{g.symbol}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{g.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-800">₹{g.price}</p>
                  <p className="text-xs font-bold text-green-600">{g.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="p-2 bg-red-50 text-red-600 rounded-lg font-bold">▼</span>
            <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm">Top Losers</h3>
          </div>
          <div className="space-y-4">
            {losers.map((l, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-all group">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{l.symbol}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{l.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-800">₹{l.price}</p>
                  <p className="text-xs font-bold text-red-600">{l.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
