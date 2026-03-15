"use client";

import React, { createContext, useContext, useState } from 'react';

export type TabType = 'Dashboard' | 'SIP' | 'SWP' | 'Top-Up SIP' | 'Goal-Based' | 'Retirement' | 'Salary-Investment' | 'AI-Stock' | 'Markets' | 'AI-Chat' | 'Profile';

interface TabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
}
