"use client";

import React from 'react';
import { useTab, TabType } from '@/context/TabContext';

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'Dashboard', label: 'Home', icon: '🏠' },
  { id: 'Markets', label: 'Markets', icon: '📊' },
  { id: 'AI-Chat', label: 'AI Chat', icon: '💬' },
  { id: 'Profile', label: 'Profile', icon: '👤' },
  { id: 'SIP', label: 'SIP', icon: '📈' },
  { id: 'Salary-Investment', label: 'Salary', icon: '💰' },
  { id: 'Goal-Based', label: 'Goal', icon: '🎯' },
  { id: 'AI-Stock', label: 'Stock', icon: '🚀' },
  { id: 'SWP', label: 'SWP', icon: '🏦' },
  { id: 'Top-Up SIP', label: 'Top-Up', icon: '🔝' },
  { id: 'Retirement', label: 'Retirement', icon: '🏖️' },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTab();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Universal Header & Sticky Nav Strip */}
      <div className="sticky top-0 z-50 flex flex-col shadow-sm">
        {/* Main Header */}
        <header className="bg-white border-b border-gray-100 py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
              <h1 className="text-2xl font-bold text-primary-blue tracking-tight">Smart Investor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('Profile')}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative"
              >
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => setActiveTab('Profile')}
                className="flex items-center justify-center w-10 h-10 bg-blue-50 text-primary-blue rounded-full font-bold hover:bg-blue-100 transition-colors"
              >
                👤
              </button>
            </div>
          </div>
        </header>

        {/* Action Bar (Sticky Tabs) */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 overflow-x-auto hide-scrollbar">
          <div className="container mx-auto px-4 flex flex-nowrap items-center gap-3 justify-start md:justify-center min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-2xl font-bold transition-all whitespace-nowrap border shadow-sm ${
                  activeTab === tab.id
                    ? 'bg-primary-blue text-white border-primary-blue shadow-lg shadow-blue-900/20 scale-105 z-10'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="text-xs">{tab.label === 'Dashboard' ? 'Home' : tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] text-gray-500 leading-relaxed mb-6">
              Disclaimer: This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
            </p>
            <div className="flex justify-center items-center space-x-4">
              <span className="text-xs font-semibold text-primary-blue">HDFC Mutual Fund</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-xs font-semibold text-primary-red">Investor Education Initiative</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
