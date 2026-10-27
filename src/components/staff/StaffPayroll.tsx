'use client';

import React, { useState } from 'react';
import { useResto } from '@/context/RestoContext';
import { Employee, SalaryPayment } from '@/types';
import {
  Users,
  CalendarCheck,
  DollarSign,
  Award,
  CreditCard,
  CheckCircle,
  Clock,
  Plus,
  FileText
} from 'lucide-react';

export default function StaffPayroll() {
  const { store, logAttendance, requestSalaryAdvance, paySalary } = useResto();

  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'payroll' | 'advances'>('employees');

  // Pay Salary Modal State
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [salaryMonth, setSalaryMonth] = useState('October 2026');
  const [overtimeBonus, setOvertimeBonus] = useState<number>(0);
  const [advanceDeduction, setAdvanceDeduction] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK' | 'BKASH'>('BANK');

  // Advance Modal State
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [advanceEmpId, setAdvanceEmpId] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [advanceReason, setAdvanceReason] = useState('');
  const [todayStr, setTodayStr] = useState('2026-10-28');

  React.useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  if (!store) return <div className="p-8 text-center text-gray-500">Loading Staff & Payroll...</div>;

  const employees = store.employees;
  const attendances = store.attendances;
  const salaryPayments = store.salaryPayments;
  const salaryAdvances = store.salaryAdvances;

  const handleOpenPayModal = (emp: Employee) => {
    setSelectedEmp(emp);
    // Find approved advances for this employee
    const empAdvances = salaryAdvances
      .filter(a => a.employeeId === emp.id && a.status === 'APPROVED')
      .reduce((sum, a) => sum + a.amount, 0);

    setAdvanceDeduction(empAdvances);
    setOvertimeBonus(0);
  };

  const handleConfirmSalaryPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    await paySalary({
      employeeId: selectedEmp.id,
      month: salaryMonth,
      overtimeBonus,
      advanceDeduction,
      paymentMethod
    });

    setSelectedEmp(null);
  };

  const handleCreateAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceEmpId || advanceAmount <= 0) return;

    await requestSalaryAdvance(advanceEmpId, advanceAmount, advanceReason);
    setIsAdvanceModalOpen(false);
    setAdvanceEmpId('');
    setAdvanceAmount(0);
    setAdvanceReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              👥 Human Resources & Payroll
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1">
            Staff Roster, Attendance & Salary Management
          </h1>
          <p className="text-xs text-gray-500">
            Track daily employee attendance, advance cash deductions, and automated monthly salary payouts
          </p>
        </div>

        <button
          onClick={() => setIsAdvanceModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Advance Salary Request (অগ্রিম বেতন)</span>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'employees', label: 'Employee Roster', icon: Users },
          { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
          { id: 'payroll', label: 'Salary Payments & Slips', icon: DollarSign },
          { id: 'advances', label: 'Advance Cash Records', icon: CreditCard },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EMPLOYEES ROSTER */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(emp => (
            <div
              key={emp.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{emp.name}</h3>
                    <span className="text-xs text-gray-500">{emp.role} • {emp.department}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {emp.status}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Phone Number:</span>
                  <span className="font-semibold text-gray-900">{emp.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Monthly Salary:</span>
                  <span className="font-extrabold text-gray-900">৳{emp.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Joining Date:</span>
                  <span>{emp.joiningDate}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenPayModal(emp)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <DollarSign className="w-4 h-4" />
                <span>Disburse Salary (বেতন প্রদান)</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900">Today&apos;s Attendance & Shift Log</h2>
            <span className="text-xs text-gray-500">Date: {todayStr}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">Overtime Hours</th>
                  <th className="px-4 py-3 text-right">Quick Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map(emp => {
                  const att = attendances.find(a => a.employeeId === emp.id && a.date === todayStr);

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">{emp.name}</td>
                      <td className="px-4 py-3 text-gray-500">{emp.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          att?.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                          att?.status === 'HALF_DAY' ? 'bg-amber-100 text-amber-800' :
                          att?.status === 'OVERTIME' ? 'bg-purple-100 text-purple-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {att?.status || 'NOT_MARKED'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {att?.overtimeHours || 0} hrs
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5">
                        <button
                          onClick={() => logAttendance(emp.id, 'PRESENT', 0)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => logAttendance(emp.id, 'OVERTIME', 2)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg"
                        >
                          +2h Overtime
                        </button>
                        <button
                          onClick={() => logAttendance(emp.id, 'ABSENT', 0)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg"
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SALARY PAYMENTS & SLIPS */}
      {activeTab === 'payroll' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-sm text-gray-900">Disbursed Salary History & Payslips</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salaryPayments.map(sal => (
              <div key={sal.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-900 text-sm">{sal.employeeName}</span>
                  <span className="text-purple-700 font-extrabold text-sm">৳{sal.netPaid.toLocaleString()}</span>
                </div>
                <div className="text-gray-500 flex justify-between">
                  <span>Month: {sal.month}</span>
                  <span>Date: {sal.paymentDate}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-gray-100 space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Salary:</span>
                    <span>৳{sal.baseSalary}</span>
                  </div>
                  {sal.overtimeBonus > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Overtime Bonus:</span>
                      <span>+৳{sal.overtimeBonus}</span>
                    </div>
                  )}
                  {sal.advanceDeduction > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Advance Deduction:</span>
                      <span>-৳{sal.advanceDeduction}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                    <span>Net Amount Disbursed:</span>
                    <span>৳{sal.netPaid} ({sal.paymentMethod})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADVANCE RECORDS */}
      {activeTab === 'advances' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900">Employee Advance Cash Taken</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {salaryAdvances.map(adv => (
              <div key={adv.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900">{adv.employeeName}</span>
                  <p className="text-gray-500 text-[11px]">Reason: {adv.reason} • Date: {adv.date}</p>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-rose-600">৳{adv.amount}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {adv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">Pay Monthly Salary</h3>
                <p className="text-xs text-gray-500">{selectedEmp.name} • {selectedEmp.role}</p>
              </div>
              <button
                onClick={() => setSelectedEmp(null)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSalaryPayment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Salary Month</label>
                <input
                  type="text"
                  required
                  value={salaryMonth}
                  onChange={e => setSalaryMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-700">
                  <span>Base Monthly Salary:</span>
                  <span className="font-bold text-gray-900">৳{selectedEmp.baseSalary}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Overtime Bonus (৳):</span>
                  <input
                    type="number"
                    value={overtimeBonus || ''}
                    onChange={e => setOvertimeBonus(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-right"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Advance Deduction (৳):</span>
                  <input
                    type="number"
                    value={advanceDeduction || ''}
                    onChange={e => setAdvanceDeduction(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-right text-rose-600"
                  />
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-sm text-gray-900">
                  <span>Net Payable Amount:</span>
                  <span className="text-purple-700">
                    ৳{(selectedEmp.baseSalary + overtimeBonus - advanceDeduction).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Payment Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BANK', 'BKASH', 'CASH'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        paymentMethod === m
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Confirm Payout & Record Expense
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEmp(null)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Advance Request Modal */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">Record Advance Salary (অগ্রিম)</h3>
                <p className="text-xs text-gray-500">Will be automatically deducted from monthly payroll</p>
              </div>
              <button
                onClick={() => setIsAdvanceModalOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdvance} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Select Employee</label>
                <select
                  required
                  value={advanceEmpId}
                  onChange={e => setAdvanceEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.role} - Base: ৳{e.baseSalary})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Advance Amount (৳)</label>
                <input
                  type="number"
                  required
                  min="500"
                  value={advanceAmount || ''}
                  onChange={e => setAdvanceAmount(Number(e.target.value) || 0)}
                  placeholder="e.g. 3000"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Reason / Purpose</label>
                <input
                  type="text"
                  required
                  value={advanceReason}
                  onChange={e => setAdvanceReason(e.target.value)}
                  placeholder="e.g. Medical, rent or family emergency"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Approve & Disburse Advance
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdvanceModalOpen(false)}
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
