'use client';

import React, { useState } from 'react';
import { useResto } from '@/context/RestoContext';
import { MenuItem } from '@/types';
import {
  QrCode,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  Flame,
  Search
} from 'lucide-react';

export default function CustomerDigitalMenu() {
  const { store, createOrder } = useResto();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number }>>([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('1');
  const [orderPlaced, setOrderPlaced] = useState<any | null>(null);

  if (!store) return <div className="p-8 text-center text-gray-500">Loading Menu...</div>;

  const categories = store.categories;
  const menuItems = store.menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.item.id === item.id);
      if (exists) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.item.id === itemId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as any
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handlePlaceCustomerOrder = async () => {
    if (cart.length === 0) return;

    const tableObj = store.tables.find(t => t.number === Number(tableNumber)) || store.tables[0];

    const payload = {
      type: 'DINE_IN',
      tableId: tableObj?.id,
      customerName: customerName || `Table ${tableNumber} Guest`,
      items: cart.map(c => ({
        menuItemId: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity
      })),
      notes: 'Customer QR Self-Order'
    };

    const res = await createOrder(payload);
    if (res) {
      setOrderPlaced(res);
      setCart([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-amber-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur">
              📱 QR Code Digital Menu
            </span>
          </div>
          <h1 className="text-2xl font-black mt-2">Browse, Dine & Self-Order</h1>
          <p className="text-xs text-rose-100 mt-1">
            Order directly from your phone screen. Sent instantly to the kitchen!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur p-3 rounded-2xl flex items-center gap-3 border border-white/20">
          <QrCode className="w-10 h-10 text-white" />
          <div className="text-xs">
            <div className="font-bold">Table #{tableNumber}</div>
            <div className="text-rose-100">Dhanmondi Branch</div>
          </div>
        </div>
      </div>

      {/* If Order Placed Banner */}
      {orderPlaced && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Order #{orderPlaced.orderNumber} Sent to Kitchen!</span>
            </div>
            <button
              onClick={() => setOrderPlaced(null)}
              className="text-xs text-emerald-600 font-semibold"
            >
              Order More
            </button>
          </div>
          <p className="text-xs text-emerald-700">
            Our chef has received your order and is preparing your food. Your waiter will serve it hot!
          </p>
          <div className="flex items-center gap-2 pt-2 border-t border-emerald-200 text-xs font-bold text-emerald-800">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Estimated preparation time: 10 - 15 minutes</span>
          </div>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search our delicious dishes..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Items
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menuItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
          >
            <img
              src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-black text-rose-600">৳{item.price}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Plate</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {cart.length > 0 && (
        <div className="sticky bottom-4 z-40 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </div>
            <div>
              <div className="text-xs text-gray-300">Total with 5% VAT:</div>
              <div className="text-base font-extrabold text-white">৳{total}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Your Name (Optional)"
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              onClick={handlePlaceCustomerOrder}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm & Order Now</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
