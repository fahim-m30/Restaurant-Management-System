'use client';

import React from 'react';
import { useResto } from '@/context/RestoContext';
import {
  Bike,
  Phone,
  MapPin,
  CheckCircle2,
  DollarSign,
  Package,
  Clock
} from 'lucide-react';

export default function DeliveryRiderPortal() {
  const { store, updateOrderStatus, settlePayment } = useResto();

  if (!store) return <div className="p-8 text-center text-gray-500">Loading Delivery Fleet...</div>;

  const deliveryOrders = store.orders.filter(o => o.type === 'DELIVERY');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                🛵 Delivery Fleet
              </span>
              <span className="text-xs text-gray-500">Rider App & Parcel Dispatch</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 mt-1">Home Delivery & Parcel Tracking</h1>
          </div>
        </div>
      </div>

      {/* Delivery Cards Grid */}
      {deliveryOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <Package className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800">No Delivery Orders Right Now</h3>
          <p className="text-xs text-gray-500">New delivery orders from the website or POS will show up here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveryOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-gray-900">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-gray-400 block">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  order.status === 'DELIVERING' ? 'bg-orange-100 text-orange-800 animate-pulse' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <span>{order.customerName}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <a href={`tel:${order.customerPhone}`} className="text-rose-600 hover:underline font-semibold">
                      {order.customerPhone}
                    </a>
                  </div>
                )}
                {order.customerAddress && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{order.customerAddress}</span>
                  </div>
                )}
              </div>

              {/* Items summary */}
              <div className="text-xs space-y-1">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold text-gray-900">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Financial Total & COD amount */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500">Collect from Customer:</span>
                <span className="text-base font-extrabold text-rose-600">৳{order.total}</span>
              </div>

              {/* Rider Actions */}
              <div className="pt-2">
                {order.status === 'READY' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'DELIVERING', 'Sabbir Hossain')}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Pick Up & Start Delivery</span>
                  </button>
                )}

                {order.status === 'DELIVERING' && (
                  <button
                    onClick={() => {
                      settlePayment(order.id, 'CASH');
                      updateOrderStatus(order.id, 'COMPLETED');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Delivered & Cash Collected (৳{order.total})</span>
                  </button>
                )}

                {order.status === 'COMPLETED' && (
                  <div className="py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                    ✓ Order Delivered & Paid
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
