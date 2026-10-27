'use client';

import React, { useState, useEffect } from 'react';
import { useResto } from '@/context/RestoContext';
import Navbar from '@/components/layout/Navbar';
import NavigationTabs, { TabType } from '@/components/layout/NavigationTabs';
import AdminOverview from '@/components/dashboard/AdminOverview';
import PosBilling from '@/components/pos/PosBilling';
import TableFloorPlan from '@/components/waiter/TableFloorPlan';
import KitchenDisplaySystem from '@/components/kitchen/KitchenDisplaySystem';
import DeliveryRiderPortal from '@/components/delivery/DeliveryRiderPortal';
import InventoryManagement from '@/components/inventory/InventoryManagement';
import StaffPayroll from '@/components/staff/StaffPayroll';
import AccountingProfitLoss from '@/components/accounting/AccountingProfitLoss';
import CustomerDigitalMenu from '@/components/menu/CustomerDigitalMenu';

export default function HomePage() {
  const { activeRole, isLoading } = useResto();
  const [currentTab, setCurrentTab] = useState<TabType>('admin-dashboard');
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Sync default tab when active actor role changes
  useEffect(() => {
    if (activeRole === 'CASHIER') setCurrentTab('pos-billing');
    else if (activeRole === 'WAITER') setCurrentTab('floor-waiter');
    else if (activeRole === 'KITCHEN') setCurrentTab('kitchen-kds');
    else if (activeRole === 'RIDER') setCurrentTab('delivery-rider');
    else if (activeRole === 'CUSTOMER') setCurrentTab('digital-menu');
    else if (activeRole === 'ADMIN') setCurrentTab('admin-dashboard');
  }, [activeRole]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation Bar with Role Switcher */}
      <Navbar />

      {/* Module Tabs Navigation */}
      <NavigationTabs currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-500">Loading RestoOS System...</p>
          </div>
        ) : (
          <>
            {currentTab === 'admin-dashboard' && <AdminOverview onNavigate={setCurrentTab} />}
            {currentTab === 'pos-billing' && <PosBilling />}
            {currentTab === 'floor-waiter' && (
              <TableFloorPlan
                onOpenPosForTable={(tableId) => {
                  setCurrentTab('pos-billing');
                }}
              />
            )}
            {currentTab === 'kitchen-kds' && <KitchenDisplaySystem />}
            {currentTab === 'delivery-rider' && <DeliveryRiderPortal />}
            {currentTab === 'inventory-stock' && <InventoryManagement />}
            {currentTab === 'staff-payroll' && <StaffPayroll />}
            {currentTab === 'accounting-pnl' && <AccountingProfitLoss />}
            {currentTab === 'digital-menu' && <CustomerDigitalMenu />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {year} RestoOS - Full Multi-Actor Restaurant Management System.</p>
          <div className="flex items-center gap-4">
            <span>Next.js 16 + Tailwind CSS</span>
            <span>•</span>
            <span>Prisma Database Schema</span>
            <span>•</span>
            <span>Role-Based Access Control</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
