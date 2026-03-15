"use client";

import React from 'react';
import { API_BASE_URL } from '@/config';

export default function Profile() {
  const user = {
    name: "Ritesh",
    email: "ritesh@example.com",
    invested: 125000,
    savings: 45000,
    risk: "Moderate"
  };

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [report, setReport] = React.useState("");

  const analyzeHealth = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `User Profile - Name: ${user.name}, Total Invested: ₹${user.invested}, Monthly Savings: ₹${user.savings}, Risk Profile: ${user.risk}. 
      Can you provide a brief AI health check on this portfolio? 
      Suggest if the savings rate is optimized for wealth building and provide one personalized tip.`;
      
      const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setReport(data?.answer || "AI analyst is thinking...");
    } catch (e) {
      setReport("Service busy. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Profile Header */}
      <div className="relative h-64 rounded-[40px] bg-gradient-to-br from-primary-blue to-[#1a3a66] flex flex-col items-center justify-center text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/50 flex items-center justify-center text-4xl font-black mb-4 animate-in zoom-in-50 duration-500">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
          <p className="text-blue-100 font-medium opacity-80">{user.email}</p>
        </div>
        {/* Abstract background shape */}
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Financial Overview Card */}
      <div className="card -mt-12 relative z-20 p-8 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <StatItem icon="💳" label="Total Invested" value={`₹${(user.invested / 1000).toFixed(0)}k`} />
        <StatItem icon="🐷" label="Monthly Savings" value={`₹${(user.savings / 1000).toFixed(0)}k`} />
        <StatItem icon="⚡" label="Risk Profile" value={user.risk} />
      </div>

      {/* AI Financial Health Check */}
      <div className="card p-8 bg-gradient-to-br from-[#1a3a66] to-primary-blue text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                <span>🛡️</span> AI Portfolio Health Check
              </h3>
              <p className="text-blue-100 text-xs mt-1 font-medium italic opacity-80">Personalized for {user.name}</p>
            </div>
            <button 
              onClick={analyzeHealth}
              disabled={isAnalyzing}
              className="bg-white text-primary-blue px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-blue-50 transition-all active:scale-95"
            >
              {isAnalyzing ? "Analyzing..." : "Run Analysis ✨"}
            </button>
          </div>
          
          {report ? (
            <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-in fade-in slide-in-from-top-4">
              <p className="text-sm leading-relaxed font-medium">{report}</p>
            </div>
          ) : (
            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
              <p className="text-xs text-blue-200 uppercase tracking-widest font-bold">Press &apos;Run Analysis&apos; to see AI findings</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8">
          <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-6 px-2">Account Settings</h3>
          <div className="space-y-2">
            <SettingsItem icon="👤" label="Personal Information" />
            <SettingsItem icon="🔐" label="Security & Password" />
            <SettingsItem icon="🔔" label="Notifications" />
            <SettingsItem icon="💳" label="Payment Methods" />
          </div>
        </div>

        <div className="card p-8">
          <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-6 px-2">Preferences</h3>
          <div className="space-y-2">
            <SettingsItem icon="🌐" label="Language" />
            <SettingsItem icon="🌙" label="Dark Mode" />
            <SettingsItem icon="🎧" label="Help & Support" />
            <SettingsItem icon="📜" label="Privacy Policy" />
          </div>
        </div>
      </div>

      <button className="w-full py-5 rounded-3xl bg-red-50 text-red-600 font-black tracking-wider uppercase text-sm hover:bg-red-100 transition-colors border border-red-100">
        Logout from FinSphere
      </button>

    </div>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center py-4 md:py-0">
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-2xl font-black text-gray-800 tracking-tighter">{value}</span>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

function SettingsItem({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group">
      <div className="flex items-center gap-4">
        <span className="w-10 h-10 bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white transition-colors">
          {icon}
        </span>
        <span className="font-bold text-gray-700 text-sm">{label}</span>
      </div>
      <span className="text-gray-300 group-hover:text-primary-blue transition-colors text-xs">➡️</span>
    </button>
  );
}
