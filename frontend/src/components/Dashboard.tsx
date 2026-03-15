"use client";

import React from 'react';
import { API_BASE_URL } from '@/config';


interface DashboardProps {
  onTabChange?: (tab: string) => void;
}

export default function Dashboard({ onTabChange }: DashboardProps) {
  const [isTourOpen, setIsTourOpen] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [marketAnalysis, setMarketAnalysis] = React.useState("");
  
  const [indices, setIndices] = React.useState<any[]>([]);
  const [gainers, setGainers] = React.useState<any[]>([]);
  const [losers, setLosers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
      console.error("Failed to fetch dashboard market data", error);
    } finally {
      setLoading(false);
    }
  };

  const getMarketAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const marketStr = indices.map(i => `${i.name}: ${i.value} (${i.change})`).join(', ');
      const prompt = `Can you provide a brief, professional market sentiment analysis based on these indices? 
      ${marketStr}. 
      What should a long-term investor do in this scenario? Keep it under 100 words.`;
      
      const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setMarketAnalysis(data?.answer || "AI service is currently unavailable.");
    } catch (error) {
      setMarketAnalysis("Failed to connect to AI market analyst.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* Tour Modal */}
      {isTourOpen && <TourModal onClose={() => setIsTourOpen(false)} />}
      
      {/* 1. Quick Tour Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a3a66] to-[#4A8FE7] p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold mb-2">New to Investing?</h2>
            <p className="text-blue-100">Take a quick tour of FinSphere AI.</p>
          </div>
          <button 
            onClick={() => setIsTourOpen(true)}
            className="px-8 py-3 bg-white text-primary-blue font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all hover:scale-105"
          >
            Start Tour
          </button>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6 font-primary">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {indices.length > 0 ? indices.map((idx, i) => (
            <IndexMiniItem key={i} label={idx.name} value={idx.value.toLocaleString()} change={idx.change} />
          )) : (
            <>
               <div className="h-10 bg-gray-100 animate-pulse rounded-lg"></div>
               <div className="h-10 bg-gray-100 animate-pulse rounded-lg"></div>
               <div className="h-10 bg-gray-100 animate-pulse rounded-lg"></div>
            </>
          )}
        </div>
      </div>

      {/* 3. Market Sentiment */}
      <div className="card px-6 py-4 flex flex-row items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Market Sentiment</h3>
        <div className="flex items-center gap-3 text-red-500 border border-red-100 rounded-full px-4 py-1.5 bg-red-50/50">
          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">
            ↓
          </div>
          <span className="text-sm font-bold tracking-tight">25% Stocks Rising</span>
        </div>
      </div>

      {/* 4. Top Gainers & Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Gainers</h3>
          <div className="space-y-4">
            {gainers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                <span className="font-medium text-gray-700">{stock.symbol}</span>
                <span className={`font-bold flex items-center gap-1 ${stock.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {stock.change} <span className="text-xs">{stock.change.startsWith('+') ? '▲' : '▼'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Losers</h3>
          <div className="space-y-4">
            {losers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                <span className="font-medium text-gray-700">{stock.symbol}</span>
                <span className={`font-bold flex items-center gap-1 ${stock.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {stock.change} <span className="text-xs">{stock.change.startsWith('+') ? '▲' : '▼'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Market Briefing */}
      <div className="card p-6 bg-blue-50/50 border border-blue-100">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <span>✨</span> AI Market Briefing
        </h3>
        
        <div className="p-4 bg-white rounded-2xl border border-blue-50 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed italic">
            {marketAnalysis || "Click the button below to get an AI-powered summary of today's market conditions."}
          </p>
        </div>

        <button 
          onClick={getMarketAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3 bg-primary-blue text-white font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : "🔄"}
          {isAnalyzing ? "Analyzing Market Data..." : "Refresh Market Analysis"}
        </button>
      </div>

    </div>
  );
}

function IndexMiniItem({ label, value, change }: { label: string; value: string; change: string }) {
  const isUp = change.startsWith('+');
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xl font-black text-gray-800 tracking-tighter">{value}</span>
        <span className={`text-[10px] font-black ${isUp ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-0.5 rounded-full`}>
          {isUp ? '↑' : '↓'} {change}
        </span>
      </div>
    </div>
  );
}

function ToolCard({ icon, title, onClick }: { icon: string; title: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="card p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:border-primary-blue/30 transition-all hover:-translate-y-1"
    >
      <div className="text-3xl bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-700 leading-tight uppercase tracking-wider">{title}</span>
    </button>
  );
}

function TourModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = React.useState(0);
  const pages = [
    { title: 'Welcome to FinSphere AI', desc: 'Your personal companion for smart, educated investing. We focus on teaching you the basics.', icon: '🎓' },
    { title: 'AI-Powered Insights', desc: 'Our integrated AI explains complex terms like SIP, LTCG, and Diversification in simple language.', icon: '🤖' },
    { title: 'Goal-Based Planning', desc: 'Decide what you want - a car, a house, or retirement. We help you calculate how to get there.', icon: '🎯' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
      <div className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 flex">
          {pages.map((_, i) => (
            <div key={i} className={`flex-grow transition-all duration-500 ${i <= step ? 'bg-primary-blue' : 'bg-gray-100'}`}></div>
          ))}
        </div>
        
        <div className="text-6xl mb-8 animate-bounce">{pages[step].icon}</div>
        <h3 className="text-2xl font-black text-primary-blue mb-4 leading-tight">{pages[step].title}</h3>
        <p className="text-gray-500 leading-relaxed mb-10 text-sm font-medium">{pages[step].desc}</p>
        
        <div className="flex gap-4">
          {step < pages.length - 1 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="w-full btn-primary py-4 text-sm"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="w-full btn-primary py-4 text-sm"
            >
              Get Started
            </button>
          )}
        </div>
        
        <button onClick={onClose} className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600">
          Skip Tour
        </button>
      </div>
    </div>
  );
}
