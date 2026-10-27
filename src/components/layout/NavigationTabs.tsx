'use client';

import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  Users,
  ChefHat,
  Bike,
  PackageCheck,
  TrendingUp,
  BookOpen,
  DollarSign
} from 'lucide-react';

export type TabType =
  | 'admin-dashboard'
  | 'pos-billing'
  | 'floor-waiter'
  | 'kitchen-kds'
  | 'delivery-rider'
  | 'inventory-stock'
  | 'staff-payroll'
  | 'accounting-pnl'
  | 'digital-menu';

interface NavigationTabsProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export default function NavigationTabs({ currentTab, onSelectTab }: NavigationTabsProps) {
  const tabs = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, badge: 'Overview' },
    { id: 'pos-billing', label: 'POS & Billing', icon: ReceiptText, badge: 'Counter' },
    { id: 'floor-waiter', label: 'Tables & Waiter', icon: Users, badge: 'KOT' },
    { id: 'kitchen-kds', label: 'Kitchen KDS', icon: ChefHat, badge: 'Live' },
    { id: 'delivery-rider', label: 'Deliveries & Rider', icon: Bike, badge: 'Rider' },
    { id: 'inventory-stock', label: 'Inventory & Stock In', icon: PackageCheck, badge: 'Raw Items' },
    { id: 'staff-payroll', label: 'Staff & Payroll', icon: DollarSign, badge: 'Salary' },
    { id: 'accounting-pnl', label: 'Accounting & P&L', icon: TrendingUp, badge: 'Profits' },
    { id: 'digital-menu', label: 'Customer Menu', icon: BookOpen, badge: 'QR Code' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-3 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-200 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
