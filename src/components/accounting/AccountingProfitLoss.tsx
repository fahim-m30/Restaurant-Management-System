'use client';

import React, { useState } from 'react';
import { useResto } from '@/context/RestoContext';
import { Expense } from '@/types';
import {
  TrendingUp,
  DollarSign,
  Plus,
  Receipt,
  Building,
  Zap,
  ShoppingBag,
  Wrench,
  Megaphone,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AccountingProfitLoss() {
  const { store, analytics, addExpense } = useResto();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseCategory, setExpenseCategory] = useState<Expense['category']>('UTILITIES');
  const [expenseNotes, setExpenseNotes] = useState('');

  if (!store || !analytics) {
    return <div className="p-8 text-center text-gray-500">Loading Profit & Loss...</div>;
  }

  const expenses = store.expenses;

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || expenseAmount <= 0) return;

    await addExpense({
      title: expenseTitle,
      amount: expenseAmount,
      category: expenseCategory,
      notes: expenseNotes
    });

    setIsExpenseModalOpen(false);
    setExpenseTitle('');
    setExpenseAmount(0);
    setExpenseNotes('');
  };

  const getCategoryIcon = (cat: Expense['category']) => {
    switch (cat) {
      case 'RENT': return Building;
      case 'UTILITIES': return Zap;
      case 'SUPPLIES': return ShoppingBag;
      case 'MAINTENANCE': return Wrench;
      case 'MARKETING': return Megaphone;
      default: return DollarSign;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              📊 Financial Accounting & P&L
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1">
            Restaurant Profit & Loss (P&L) Statement
          </h1>
          <p className="text-xs text-gray-500">
            Real-time balance of Sales Revenue, Raw Material Costs (COGS), Staff Payroll, and Operating Expenses
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Restaurant Expense (নতুন খরচ)</span>
        </button>
      </div>

      {/* P&L Statement Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="text-base font-extrabold text-gray-900">
          Executive Income & Expense Statement (লাভ-ক্ষতি বিবরণী)
        </h2>

        <div className="divide-y divide-gray-100 text-sm">
          
          {/* Revenue */}
          <div className="py-3 flex items-center justify-between font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>1. Total Sales Revenue (খাবার বিক্রয় থেকে মোট আয়)</span>
            </div>
            <span className="text-emerald-600 text-base">৳{analytics.totalRevenue.toLocaleString()}</span>
          </div>

          {/* COGS */}
          <div className="py-3 flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2 pl-4">
              <span className="text-gray-400">(-)</span>
              <span>Cost of Goods Sold - COGS (ব্যবহৃত কাঁচামাল ও খাদ্য উপাদান)</span>
            </div>
            <span className="text-amber-600 font-semibold">-৳{analytics.totalCOGS.toLocaleString()}</span>
          </div>

          {/* Gross Profit */}
          <div className="py-3.5 flex items-center justify-between font-extrabold bg-gray-50 px-4 rounded-xl text-gray-900">
            <span>= Gross Profit (গ্রস লাভ / স্থূল লাভ)</span>
            <span className="text-cyan-700 text-base">৳{analytics.grossProfit.toLocaleString()}</span>
          </div>

          {/* Payroll */}
          <div className="py-3 flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2 pl-4">
              <span className="text-gray-400">(-)</span>
              <span>Total Staff Payroll (কর্মচারীদের প্রদেয় বেতন-ভাতা)</span>
            </div>
            <span className="text-purple-600 font-semibold">-৳{analytics.totalPayroll.toLocaleString()}</span>
          </div>

          {/* Operating Expenses */}
          <div className="py-3 flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2 pl-4">
              <span className="text-gray-400">(-)</span>
              <span>Operational Overheads (ভাড়া, বিদ্যুৎ, গ্যাস, রিপেয়ারিং, সাপ্লাই)</span>
            </div>
            <span className="text-rose-600 font-semibold">-৳{analytics.totalExpenses.toLocaleString()}</span>
          </div>

          {/* NET PROFIT */}
          <div className="py-4 flex items-center justify-between font-black text-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-5 rounded-2xl border-2 border-emerald-300">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <span className="text-gray-900">= Net Business Profit (আসল নিট লাভ)</span>
            </div>
            <span className="text-emerald-700 text-xl">৳{analytics.netProfit.toLocaleString()}</span>
          </div>

        </div>
      </div>

      {/* Expense Log History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900">Expense Ledger & Vouchers (দৈনিক খরচ খাতা)</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Expense Title / Description</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Amount (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map(exp => {
                const Icon = getCategoryIcon(exp.category);
                return (
                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-gray-400" />
                        <span>{exp.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{exp.title}</td>
                    <td className="px-4 py-3 text-gray-500">{exp.date}</td>
                    <td className="px-4 py-3 text-gray-500">{exp.notes || '—'}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-rose-600">
                      ৳{exp.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">Add Operational Expense</h3>
                <p className="text-xs text-gray-500">Log utility bills, maintenance, rent, or supplies</p>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Expense Category</label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                >
                  <option value="UTILITIES">⚡ Utilities (Electricity, Gas, Water)</option>
                  <option value="RENT">🏢 Rent & Floor Lease</option>
                  <option value="MAINTENANCE">🔧 Repairs & Kitchen Maintenance</option>
                  <option value="SUPPLIES">📦 Takeaway Boxes & Cleaning Supplies</option>
                  <option value="MARKETING">📢 Social Media Ads & Promo</option>
                  <option value="OTHER">💡 Other Miscellaneous Expenses</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Expense Title / Payee</label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  placeholder="e.g. DESCO Commercial Electricity Bill"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Amount (৳)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={expenseAmount || ''}
                  onChange={e => setExpenseAmount(Number(e.target.value) || 0)}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Remarks / Voucher No.</label>
                <input
                  type="text"
                  value={expenseNotes}
                  onChange={e => setExpenseNotes(e.target.value)}
                  placeholder="e.g. Paid via bKash Merchant Account"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Expense & Deduct from Net Profit
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
