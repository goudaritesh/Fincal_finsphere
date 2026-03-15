"use client";

import React from 'react';
import SIPCalculator from '@/components/SIPCalculator';
import SWPCalculator from '@/components/SWPCalculator';
import GoalBasedCalculator from '@/components/GoalBasedCalculator';
import RetirementCalculator from '@/components/RetirementCalculator';
import TopUpSIPCalculator from '@/components/TopUpSIPCalculator';
import Dashboard from '@/components/Dashboard';
import Markets from '@/components/Markets';
import AIChat from '@/components/AIChat';
import Profile from '@/components/Profile';
import SalaryPlanner from '@/components/SalaryPlanner';
import AIStockCalculator from '@/components/AIStockCalculator';
import { useTab, TabType } from '@/context/TabContext';

export default function Home() {
  const { activeTab, setActiveTab } = useTab();

  return (
    <div className="space-y-12">
      <div className="transition-all duration-500 transform">
        {activeTab === 'Dashboard' && <Dashboard onTabChange={(tab) => setActiveTab(tab as TabType)} />}
        {activeTab === 'Markets' && <Markets />}
        {activeTab === 'AI-Chat' && <AIChat />}
        {activeTab === 'Profile' && <Profile />}
        {activeTab === 'SIP' && <SIPCalculator />}
        {activeTab === 'SWP' && <SWPCalculator />}
        {activeTab === 'Top-Up SIP' && <TopUpSIPCalculator />}
        {activeTab === 'Goal-Based' && <GoalBasedCalculator />}
        {activeTab === 'Retirement' && <RetirementCalculator />}
        {activeTab === 'Salary-Investment' && <SalaryPlanner />}
        {activeTab === 'AI-Stock' && <AIStockCalculator />}
      </div>

      {/* Educational Footer Sections (Always shown at bottom of active page) */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto border-t border-gray-100 pt-16">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-primary-blue flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Calculation Methodology
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            All projections are calculated using mathematically correct, industry-standard financial formulas. We use the **Future Value of an Annuity Due** model for SIPs, assuming investments are made at the beginning of each period to maximize compounding benefits.
          </p>
          <ul className="text-xs text-primary-grey space-y-2 list-disc pl-5">
            <li>SIP Formula: FV = P × [((1 + r)ⁿ − 1) ÷ r] × (1 + r)</li>
            <li>Inflation is compounded annually to estimate future purchasing power.</li>
            <li>Tax impacts and exit loads are not considered in these illustrative models.</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-primary-red flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Assumptions & Disclosures
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Financial planning involves various assumptions which are inherently uncertain. We allow full transparency by making all assumptions user-editable.
          </p>
          <div className="grid grid-cols-2 gap-4 text-[10px] font-semibold text-primary-grey uppercase">
            <div className="bg-gray-100 p-2 rounded border border-gray-200 italic">User-Editable Returns</div>
            <div className="bg-gray-100 p-2 rounded border border-gray-200 italic">Inflation variability</div>
            <div className="bg-gray-100 p-2 rounded border border-gray-200 italic">Dynamic Tenures</div>
            <div className="bg-gray-100 p-2 rounded border border-gray-200 italic">Illustrative Projections</div>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="mt-20 p-10 rounded-[40px] bg-gradient-to-br from-primary-blue to-[#1a3a66] text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <svg className="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.3,-69.2,70.1,-59.1,78.7,-46.5C87.3,-33.9,92.7,-18.9,91.8,-4.1C90.9,10.7,83.7,25.3,74.1,38.1C64.5,50.9,52.5,61.9,38.9,69.5C25.3,77.1,10.1,81.4,-4.4,89.1C-18.9,96.8,-32.7,107.9,-44.8,105.7C-56.9,103.5,-67.3,88,-75.4,72.4C-83.5,56.8,-89.3,41.1,-91.1,25.3C-92.9,9.5,-90.7,-6.4,-84.9,-20.9C-79.1,-35.4,-69.7,-48.5,-57.8,-56.3C-45.9,-64.1,-31.5,-66.6,-18.2,-73.4C-4.9,-80.2,7.3,-91.3,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black mb-4">Start Your Financial Journey</h3>
          <p className="text-blue-100 mb-10 leading-relaxed text-lg font-medium">
            Understanding mutual funds doesn&apos;t have to be complicated. Our tools provide a clear picture of how systematic investing can help you achieve your life goals responsibly.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-10 py-4 bg-white text-primary-blue font-black rounded-2xl hover:bg-blue-50 transition-all hover:scale-105 shadow-xl">
              Explore SIP Funds
            </button>
            <button className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
              Contact Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
