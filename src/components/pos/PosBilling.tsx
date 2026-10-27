'use client';

import React, { useState } from 'react';
import { useResto } from '@/context/RestoContext';
import { MenuItem, TableEntity } from '@/types';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Send,
  CheckCircle,
  Receipt,
  User,
  Phone,
  MapPin,
  Utensils
} from 'lucide-react';

export default function PosBilling() {
  const { store, createOrder, settlePayment } = useResto();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Cart: Map of menuItemId -> { item: MenuItem, quantity: number, instructions: string }
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number; instructions: string }>>([]);

  // Printable Receipt Modal state
  const [receiptOrder, setReceiptOrder] = useState<any | null>(null);

  if (!store) return <div className="p-8 text-center text-gray-500">Loading POS terminal...</div>;

  const categories = store.categories;
  const menuItems = store.menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const availableTables = store.tables;

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, instructions: '' }];
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

  const updateInstructions = (itemId: string, instructions: string) => {
    setCart(prev =>
      prev.map(i => (i.item.id === itemId ? { ...i, instructions } : i))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setNotes('');
  };

  // Calculations
  const subtotal = cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Math.max(0, Number((subtotal + tax - discountAmount).toFixed(2)));

  const handleCreateOrder = async (payNowMethod?: 'CASH' | 'CARD' | 'BKASH' | 'NAGAD') => {
    if (cart.length === 0) {
      alert('Cart is empty. Please select food items.');
      return;
    }

    if (orderType === 'DINE_IN' && !selectedTableId) {
      alert('Please select a Dine-in Table.');
      return;
    }

    const payload = {
      type: orderType,
      tableId: orderType === 'DINE_IN' ? selectedTableId : undefined,
      customerName: customerName || (orderType === 'DINE_IN' ? `Table ${store.tables.find(t => t.id === selectedTableId)?.number}` : 'Walk-in Customer'),
      customerPhone,
      customerAddress: orderType === 'DELIVERY' ? customerAddress : undefined,
      items: cart.map(c => ({
        menuItemId: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        specialInstructions: c.instructions
      })),
      discount: discountAmount,
      paymentMethod: payNowMethod,
      paymentStatus: payNowMethod ? 'PAID' : 'UNPAID',
      notes
    };

    const created = await createOrder(payload);
    if (created) {
      setReceiptOrder(created);
      clearCart();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left side: Food Menu Items & Filters (8 columns) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        
        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search food by name (e.g. Kacchi, Burger, Biryani)..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Menu
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    selectedCategory === c.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-rose-200 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur text-white text-[10px] font-bold rounded-lg">
                    {item.preparationTime} min
                  </span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 group-hover:text-rose-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">Price</span>
                  <div className="text-base font-extrabold text-gray-900">৳{item.price}</div>
                </div>

                <button
                  type="button"
                  className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right side: Live Order Cart & Settlement (4/5 columns) */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full justify-between">
          
          <div className="space-y-4">
            
            {/* Order Type Tabs */}
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Channel</div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl">
                {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      orderType === type
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {type === 'DINE_IN' ? '🍽️ Dine-in' : type === 'TAKEAWAY' ? '🥡 Parcel' : '🛵 Delivery'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dine-in Table Selection */}
            {orderType === 'DINE_IN' && (
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Select Table Floor</label>
                <select
                  value={selectedTableId}
                  onChange={e => setSelectedTableId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="">-- Choose Table Number --</option>
                  {availableTables.map(t => (
                    <option key={t.id} value={t.id}>
                      Table {t.number} ({t.floor} - {t.capacity} Seats) [{t.status}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Customer Details for Takeaway/Delivery */}
            {orderType !== 'DINE_IN' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number (e.g. 017...)"
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
                {orderType === 'DELIVERY' && (
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    placeholder="Delivery Delivery Address..."
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                )}
              </div>
            )}

            {/* Cart Items List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Order Items ({cart.length})
                </span>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                  <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Click dishes from the menu to add here</p>
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {cart.map(c => (
                    <div key={c.item.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{c.item.name}</span>
                        <span className="text-xs font-extrabold text-gray-900">৳{c.item.price * c.quantity}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <input
                          type="text"
                          value={c.instructions}
                          onChange={e => updateInstructions(c.item.id, e.target.value)}
                          placeholder="Note (e.g. less spicy)..."
                          className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded-lg w-36"
                        />

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(c.item.id, -1)}
                            className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{c.quantity}</span>
                          <button
                            onClick={() => updateQuantity(c.item.id, 1)}
                            className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={() => removeFromCart(c.item.id)}
                            className="ml-1 text-gray-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT / Tax (5%)</span>
                <span>৳{tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Discount (৳)</span>
                <input
                  type="number"
                  value={discountAmount || ''}
                  onChange={e => setDiscountAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-20 px-2 py-0.5 text-right bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="text-rose-600">৳{total.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            
            {/* Pay Now Immediate Cashier Settle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={cart.length === 0}
                onClick={() => handleCreateOrder('CASH')}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Banknote className="w-4 h-4" />
                <span>Pay Cash (৳{total})</span>
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => handleCreateOrder('BKASH')}
                className="py-2.5 px-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay bKash / Card</span>
              </button>
            </div>

            {/* Send to Kitchen as Unpaid KOT */}
            <button
              disabled={cart.length === 0}
              onClick={() => handleCreateOrder()}
              className="w-full py-2.5 bg-gray-900 hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4 text-rose-400" />
              <span>Send KOT to Kitchen (Pay Later)</span>
            </button>

          </div>

        </div>

      </div>

      {/* Printable Thermal Receipt Modal */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Order Processed</span>
              </div>
              <button
                onClick={() => setReceiptOrder(null)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>

            {/* Thermal Receipt Paper representation */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs space-y-2 text-gray-800">
              <div className="text-center space-y-0.5">
                <h2 className="font-extrabold text-sm uppercase">RestoOS Grand Diner</h2>
                <p className="text-[10px] text-gray-500">Dhanmondi 27, Dhaka - 1209</p>
                <p className="text-[10px] text-gray-500">Phone: +8801700-000000</p>
                <div className="border-t border-dashed border-gray-300 my-2" />
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Invoice: #{receiptOrder.orderNumber}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Type: {receiptOrder.type}</span>
                  <span>{receiptOrder.tableNumber ? `Table ${receiptOrder.tableNumber}` : ''}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              <div className="space-y-1">
                {receiptOrder.items.map((i: any) => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.quantity}x {i.name}</span>
                    <span>৳{i.price * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{receiptOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (5%):</span>
                  <span>৳{receiptOrder.tax}</span>
                </div>
                {receiptOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>-৳{receiptOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-gray-300">
                  <span>Total Due:</span>
                  <span>৳{receiptOrder.total}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Payment:</span>
                  <span>{receiptOrder.paymentStatus} ({receiptOrder.paymentMethod || 'COUNTER'})</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />
              <p className="text-center text-[10px] text-gray-500">Thank you for dining with us! Come again.</p>
            </div>

            {/* Print & Settle actions */}
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setReceiptOrder(null)}
                className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
