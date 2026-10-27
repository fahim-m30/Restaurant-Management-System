'use client';

import React from 'react';
import { useResto } from '@/context/RestoContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ChefHat,
  AlertTriangle,
  Receipt,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminOverview({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const { store, analytics } = useResto();

  if (!store || !analytics) {
    return <div className="p-8 text-center text-gray-500">Loading business metrics...</div>;
  }

  // Financial summary data for Bar Chart
  const financialChartData = [
    { name: 'Total Revenue', amount: analytics.totalRevenue, fill: '#10b981' },
    { name: 'COGS (Food Cost)', amount: analytics.totalCOGS, fill: '#f59e0b' },
    { name: 'Operating Expenses', amount: analytics.totalExpenses, fill: '#ef4444' },
    { name: 'Staff Payroll', amount: analytics.totalPayroll, fill: '#8b5cf6' },
    { name: 'Net Profit', amount: Math.max(0, analytics.netProfit), fill: '#06b6d4' },
  ];

  // Expense categories breakdown for Pie Chart
  const expenseByCategory: Record<string, number> = {};
  store.expenses.forEach(e => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });
  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));
  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899'];

  const profitMargin = analytics.totalRevenue > 0
    ? ((analytics.netProfit / analytics.totalRevenue) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Highlights */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-rose-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                👑 Owner Dashboard
              </span>
              <span className="text-xs text-gray-300">Live Restaurant Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Restaurant Performance & Profit Overview
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Real-time monitoring of food sales, live kitchen status, raw ingredient inventory, and net profitability.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('pos-billing')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>New POS Order</span>
            </button>
            <button
              onClick={() => onNavigate('inventory-stock')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur transition-all flex items-center gap-2 border border-white/10"
            >
              <Package className="w-4 h-4" />
              <span>Record Stock In</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">৳{analytics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Today: ৳{analytics.todaySales.toLocaleString()} ({analytics.todayOrdersCount} orders)</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Net Business Profit</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">৳{analytics.netProfit.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-cyan-600 font-medium mt-1">
              <span className="font-semibold">{profitMargin}%</span>
              <span className="text-gray-500">net margin after COGS & expenses</span>
            </div>
          </div>
        </div>

        {/* Food Cost (COGS) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cost of Goods (COGS)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">৳{analytics.totalCOGS.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-1">
              <span>Gross Profit: ৳{analytics.grossProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Operational & Staff Costs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Payroll & Expenses</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-gray-900">৳{(analytics.totalExpenses + analytics.totalPayroll).toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1">
              <span>Payroll: ৳{analytics.totalPayroll.toLocaleString()} | Ops: ৳{analytics.totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart: P&L Structure */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Financial Revenue vs Costs Breakdown</h2>
              <p className="text-xs text-gray-500">Live comparison of Income, Raw Material Costs, Expenses and Net Gain</p>
            </div>
            <button
              onClick={() => onNavigate('accounting-pnl')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Full P&L Report →
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(val) => `৳${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category Pie */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-gray-900">Expenses Breakdown</h2>
              <PieIcon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mb-4">Rent, Utilities, Maintenance, Packaging</p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Spent']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
            {pieData.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-gray-600 truncate">{item.name}: ৳{(item.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Two Column Section: Live Orders & Stock Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent / Active Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Restaurant Orders</h2>
              <p className="text-xs text-gray-500">Live order status across Dine-in, Takeaway & Delivery</p>
            </div>
            <button
              onClick={() => onNavigate('pos-billing')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              View POS →
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {store.orders.slice(0, 5).map(order => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                    order.type === 'DINE_IN' ? 'bg-blue-50 text-blue-700' :
                    order.type === 'DELIVERY' ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {order.type === 'DINE_IN' ? 'Table' : order.type === 'DELIVERY' ? 'Del' : 'Take'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-gray-900">{order.orderNumber}</span>
                      <span className="text-xs text-gray-500">({order.customerName})</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs sm:text-sm font-bold text-gray-900">৳{order.total}</div>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    order.status === 'READY' ? 'bg-teal-100 text-teal-700' :
                    order.status === 'COOKING' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'DELIVERING' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock & Inventory Alert */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Raw Ingredients Stock Levels</h2>
              <p className="text-xs text-gray-500">Track kitchen raw materials & low-stock triggers</p>
            </div>
            <button
              onClick={() => onNavigate('inventory-stock')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Manage Stock In →
            </button>
          </div>

          <div className="space-y-3.5">
            {store.ingredients.slice(0, 6).map(ing => {
              const isLow = ing.currentStock <= ing.minStockAlert;
              const stockPercent = Math.min(100, Math.round((ing.currentStock / (ing.minStockAlert * 3)) * 100));

              return (
                <div key={ing.id} className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{ing.name}</span>
                      {isLow && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <span className={isLow ? 'text-rose-600 font-bold' : 'text-gray-700'}>
                      {ing.currentStock} {ing.unit} (Alert: {ing.minStockAlert})
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isLow ? 'bg-rose-500' : stockPercent < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
