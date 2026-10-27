'use client';

import React from 'react';
import { useResto } from '@/context/RestoContext';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Flame,
  AlertCircle,
  BellRing
} from 'lucide-react';

export default function KitchenDisplaySystem() {
  const { store, updateOrderStatus } = useResto();

  if (!store) return <div className="p-8 text-center text-gray-500">Loading Kitchen Display...</div>;

  // Active kitchen orders: PENDING and COOKING
  const kitchenOrders = store.orders.filter(
    o => o.status === 'PENDING' || o.status === 'COOKING' || o.status === 'READY'
  );

  const getMinutesAgo = (isoDate: string) => {
    const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60));
    return Math.max(0, diff);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-gray-950">
                👨‍🍳 KDS Live Screen
              </span>
              <span className="text-xs text-gray-400">Kitchen Display System</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight mt-1">
              Active Kitchen Tickets ({kitchenOrders.length})
            </h1>
          </div>
        </div>

        {/* Priority legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-300">Fresh (&lt; 10m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-300">Moderate (10-20m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-gray-300">Urgent (&gt; 20m)</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {kitchenOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">All Kitchen Tickets Cleared!</h2>
          <p className="text-xs text-gray-500">No pending food orders. Ready for the next hungry customer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kitchenOrders.map(order => {
            const minutesElapsed = getMinutesAgo(order.createdAt);
            const isUrgent = minutesElapsed > 20;
            const isModerate = minutesElapsed > 10 && minutesElapsed <= 20;

            const timerBadgeColor = isUrgent
              ? 'bg-rose-500 text-white animate-pulse'
              : isModerate
              ? 'bg-amber-500 text-gray-950 font-bold'
              : 'bg-emerald-500 text-white';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                  isUrgent
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : order.status === 'READY'
                    ? 'border-teal-400 bg-teal-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Header: Ticket & Elapsed Timer */}
                <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-black text-sm text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {order.type === 'DINE_IN' ? `Table ${order.tableNumber}` : order.type}
                    </span>
                  </div>

                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${timerBadgeColor}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{minutesElapsed}m ago</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 space-y-3 flex-1">
                  {order.items.map(item => (
                    <div key={item.id} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-gray-900">
                          {item.quantity}x {item.name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.status === 'READY' ? 'bg-teal-100 text-teal-700' :
                          item.status === 'COOKING' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {item.specialInstructions && (
                        <div className="mt-1 px-2 py-1 bg-amber-50 text-amber-800 text-[11px] font-semibold rounded-lg border border-amber-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Note: {item.specialInstructions}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {order.notes && (
                    <div className="p-2 bg-gray-100 rounded-lg text-[11px] text-gray-700 font-medium">
                      Special: {order.notes}
                    </div>
                  )}
                </div>

                {/* Chef Actions */}
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'COOKING')}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Start Cooking</span>
                    </button>
                  )}

                  {order.status === 'COOKING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'READY')}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <BellRing className="w-4 h-4" />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <div className="text-center py-1.5 text-xs font-bold text-teal-700 bg-teal-100 rounded-xl">
                      ✓ Ready for Server / Waiter
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
