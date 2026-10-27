'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppStore } from '@/lib/store';
import { FinancialAnalytics, UserRole, Order, OrderStatus } from '@/types';

interface RestoContextType {
  store: AppStore | null;
  analytics: FinancialAnalytics | null;
  isLoading: boolean;
  activeRole: UserRole;
  switchRole: (role: UserRole) => Promise<void>;
  createOrder: (payload: any) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus, riderName?: string) => Promise<void>;
  settlePayment: (orderId: string, paymentMethod: 'CASH' | 'CARD' | 'BKASH' | 'NAGAD' | 'SPLIT') => Promise<void>;
  recordStockIn: (payload: any) => Promise<void>;
  logAttendance: (employeeId: string, status: any, overtimeHours?: number) => Promise<void>;
  requestSalaryAdvance: (employeeId: string, amount: number, reason: string) => Promise<void>;
  paySalary: (payload: any) => Promise<void>;
  addExpense: (payload: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const RestoContext = createContext<RestoContextType | undefined>(undefined);

export function RestoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<AppStore | null>(null);
  const [analytics, setAnalytics] = useState<FinancialAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('ADMIN');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
        setActiveRole(data.store.currentUserRole || 'ADMIN');
      }
    } catch (err) {
      console.error('Failed to load resto data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto polling every 10 seconds to keep live tables, orders, kitchen synced
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const switchRole = async (role: UserRole) => {
    setActiveRole(role);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SET_ACTOR_ROLE', payload: { role } })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error switching role', err);
    }
  };

  const createOrder = async (payload: any): Promise<Order | null> => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_ORDER', payload })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
        return data.order;
      }
    } catch (err) {
      console.error('Error creating order', err);
    }
    return null;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, riderName?: string) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_ORDER_STATUS', payload: { orderId, status, riderName } })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error updating order status', err);
    }
  };

  const settlePayment = async (orderId: string, paymentMethod: 'CASH' | 'CARD' | 'BKASH' | 'NAGAD' | 'SPLIT') => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SETTLE_PAYMENT', payload: { orderId, paymentMethod } })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error settling payment', err);
    }
  };

  const recordStockIn = async (payload: any) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'STOCK_IN', payload })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error recording stock in', err);
    }
  };

  const logAttendance = async (employeeId: string, status: any, overtimeHours: number = 0) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOG_ATTENDANCE', payload: { employeeId, status, overtimeHours } })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
      }
    } catch (err) {
      console.error('Error logging attendance', err);
    }
  };

  const requestSalaryAdvance = async (employeeId: string, amount: number, reason: string) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SALARY_ADVANCE', payload: { employeeId, amount, reason } })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
      }
    } catch (err) {
      console.error('Error recording advance', err);
    }
  };

  const paySalary = async (payload: any) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PAY_SALARY', payload })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error paying salary', err);
    }
  };

  const addExpense = async (payload: any) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_EXPENSE', payload })
      });
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error adding expense', err);
    }
  };

  return (
    <RestoContext.Provider
      value={{
        store,
        analytics,
        isLoading,
        activeRole,
        switchRole,
        createOrder,
        updateOrderStatus,
        settlePayment,
        recordStockIn,
        logAttendance,
        requestSalaryAdvance,
        paySalary,
        addExpense,
        refreshData: fetchData
      }}
    >
      {children}
    </RestoContext.Provider>
  );
}

export function useResto() {
  const context = useContext(RestoContext);
  if (!context) {
    throw new Error('useResto must be used within a RestoProvider');
  }
  return context;
}
