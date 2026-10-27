'use client';

import React from 'react';
import { useResto } from '@/context/RestoContext';
import { UserRole } from '@/types';
import {
  UtensilsCrossed,
  Bell,
  AlertTriangle,
  ChefHat,
  UserCheck,
  ShieldCheck,
  Receipt,
  Bike,
  Sparkles
} from 'lucide-react';

const ROLES: { role: UserRole; label: string; icon: any; color: string }[] = [
  { role: 'ADMIN', label: '👑 Admin (Owner)', icon: ShieldCheck, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { role: 'CASHIER', label: '💳 Cashier / POS', icon: Receipt, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { role: 'WAITER', label: '📝 Waiter (Floor)', icon: UserCheck, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { role: 'KITCHEN', label: '👨‍🍳 Kitchen / Chef', icon: ChefHat, color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { role: 'RIDER', label: '🛵 Delivery Rider', icon: Bike, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { role: 'CUSTOMER', label: '📱 Customer View', icon: Sparkles, color: 'bg-rose-100 text-rose-700 border-rose-300' },
];

export default function Navbar() {
  const { activeRole, switchRole, analytics } = useResto();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-gray-900">Resto<span className="text-rose-600">OS</span></span>
                <span className="text-xs px-2 py-0.5 font-medium rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  Full RMS
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">Multi-Actor Restaurant ERP & POS</p>
            </div>
          </div>

          {/* Quick Actor / Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:inline">
              Active Actor:
            </span>
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto max-w-[420px] sm:max-w-none">
              {ROLES.map(({ role, label }) => {
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm font-semibold scale-102 ring-1 ring-black/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live System Indicators */}
          <div className="flex items-center gap-3">
            {/* Low Stock Warning */}
            {analytics && analytics.lowStockItemsCount > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{analytics.lowStockItemsCount} Low Stock</span>
              </div>
            )}

            {/* Kitchen Queue Badge */}
            {analytics && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium">
                <ChefHat className="w-3.5 h-3.5 text-blue-600" />
                <span>{analytics.pendingKitchenOrders} KOT Active</span>
              </div>
            )}

            {/* Current Currency */}
            <div className="hidden sm:flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
              BDT (৳)
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
