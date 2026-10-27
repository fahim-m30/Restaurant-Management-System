'use client';

import React, { useState } from 'react';
import { useResto } from '@/context/RestoContext';
import { TableEntity } from '@/types';
import {
  Users,
  Utensils,
  Clock,
  CheckCircle,
  PlusCircle,
  FileText,
  DollarSign
} from 'lucide-react';

export default function TableFloorPlan({ onOpenPosForTable }: { onOpenPosForTable?: (tableId: string) => void }) {
  const { store, updateOrderStatus, settlePayment } = useResto();
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [activeTable, setActiveTable] = useState<TableEntity | null>(null);

  if (!store) return <div className="p-8 text-center text-gray-500">Loading Floor Plan...</div>;

  const floors = ['all', 'Ground Floor', '1st Floor Family', 'Rooftop Lounge', 'VIP Cabin'];

  const filteredTables = store.tables.filter(t =>
    selectedFloor === 'all' || t.floor === selectedFloor
  );

  const getTableOrder = (tableId: string) => {
    return store.orders.find(o => o.tableId === tableId && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Floor Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
              📝 Floor & Captain View
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1">Live Table Management & Floor Layout</h1>
          <p className="text-xs text-gray-500">Real-time table occupancy, guest counts, and active KOT tickets</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <span className="text-gray-600 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100" />
            <span className="text-gray-600 font-medium">Occupied / Dining</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
            <span className="text-gray-600 font-medium">Reserved</span>
          </div>
        </div>
      </div>

      {/* Floor Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {floors.map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFloor === floor
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {floor === 'all' ? 'All Sections' : floor}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredTables.map(table => {
          const currentOrder = getTableOrder(table.id);
          const isOccupied = table.status === 'OCCUPIED' || !!currentOrder;
          const isReserved = table.status === 'RESERVED';

          return (
            <div
              key={table.id}
              onClick={() => setActiveTable(table)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-44 ${
                isOccupied
                  ? 'bg-rose-50/50 border-rose-300 hover:border-rose-500 shadow-xs'
                  : isReserved
                  ? 'bg-amber-50/50 border-amber-300 hover:border-amber-500'
                  : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              {/* Top: Table Number and Floor */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-gray-900">
                  T-{table.number}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isOccupied ? 'bg-rose-100 text-rose-700' :
                  isReserved ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {isOccupied ? 'BUSY' : isReserved ? 'RESERVED' : 'FREE'}
                </span>
              </div>

              {/* Middle: Capacity & Section */}
              <div className="my-auto text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                  <Users className="w-3.5 h-3.5" />
                  <span>{table.capacity} Seats</span>
                </div>
                <div className="text-[10px] text-gray-400 truncate">{table.floor}</div>
              </div>

              {/* Bottom: Active order badge or free action */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                {currentOrder ? (
                  <>
                    <span className="font-bold text-rose-700 text-[11px] truncate">
                      ৳{currentOrder.total}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-rose-200 text-rose-800 rounded font-bold uppercase">
                      {currentOrder.status}
                    </span>
                  </>
                ) : (
                  <span className="text-emerald-600 font-semibold text-[11px]">
                    Ready to Seat
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Details & Order Action Modal */}
      {activeTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">
                  Table {activeTable.number} Details
                </h3>
                <p className="text-xs text-gray-500">{activeTable.floor} • Capacity: {activeTable.capacity} Persons</p>
              </div>
              <button
                onClick={() => setActiveTable(null)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>

            {/* Check if active order exists */}
            {(() => {
              const order = getTableOrder(activeTable.id);
              if (order) {
                return (
                  <div className="space-y-3">
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-900">
                        <span>Ticket: #{order.orderNumber}</span>
                        <span className="text-rose-600 uppercase">{order.status}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Waiter: {order.waiterName}</span>
                        <span>Payment: {order.paymentStatus}</span>
                      </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl p-2 text-xs">
                      {order.items.map(item => (
                        <div key={item.id} className="py-1.5 flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-bold">৳{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1">
                      <span>Total Amount:</span>
                      <span className="text-rose-600">৳{order.total}</span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      {order.status === 'READY' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(order.id, 'SERVED');
                            setActiveTable(null);
                          }}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                        >
                          Mark Food Served
                        </button>
                      )}
                      <button
                        onClick={() => {
                          settlePayment(order.id, 'CASH');
                          setActiveTable(null);
                        }}
                        className="flex-1 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Settle Bill & Free Table</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Table is Currently Free</h4>
                    <p className="text-xs text-gray-500">Seat walking guests and take their order immediately</p>
                  </div>
                  {onOpenPosForTable && (
                    <button
                      onClick={() => {
                        const tblId = activeTable.id;
                        setActiveTable(null);
                        onOpenPosForTable(tblId);
                      }}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      Open POS Order for Table {activeTable.number}
                    </button>
                  )}
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}
