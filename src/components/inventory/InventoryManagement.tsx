'use client';

import React, { useState } from 'react';
import { useResto } from '@/context/RestoContext';
import {
  PackagePlus,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  Plus,
  Trash2,
  TrendingDown,
  Info
} from 'lucide-react';

export default function InventoryManagement() {
  const { store, recordStockIn } = useResto();

  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [stockItems, setStockItems] = useState<Array<{ ingredientId: string; quantity: number; unitCost: number }>>([
    { ingredientId: '', quantity: 1, unitCost: 0 }
  ]);

  if (!store) return <div className="p-8 text-center text-gray-500">Loading Inventory...</div>;

  const ingredients = store.ingredients;
  const purchaseOrders = store.purchaseOrders;

  const handleAddItem = () => {
    setStockItems(prev => [...prev, { ingredientId: '', quantity: 1, unitCost: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setStockItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setStockItems(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          // If ingredient selected, prefill current unitCost
          if (field === 'ingredientId') {
            const ing = ingredients.find(ing => ing.id === value);
            if (ing) updated.unitCost = ing.unitCost;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const totalStockInCost = stockItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const handleSubmitStockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || !invoiceNo) {
      alert('Please enter Supplier Name and Invoice Number.');
      return;
    }
    const validItems = stockItems.filter(i => i.ingredientId && i.quantity > 0);
    if (validItems.length === 0) {
      alert('Please add at least one valid ingredient item.');
      return;
    }

    await recordStockIn({
      supplierName,
      invoiceNo,
      items: validItems
    });

    setIsStockInModalOpen(false);
    setSupplierName('');
    setInvoiceNo('');
    setStockItems([{ ingredientId: '', quantity: 1, unitCost: 0 }]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              📦 Raw Material Supply & Stock
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1">
            Kitchen Inventory, Recipes & Stock-In
          </h1>
          <p className="text-xs text-gray-500">
            Automated stock deduction per order based on recipes & supplier goods received logs
          </p>
        </div>

        <button
          onClick={() => {
            setInvoiceNo(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
            setIsStockInModalOpen(true);
          }}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
        >
          <PackagePlus className="w-4 h-4" />
          <span>New Stock-In (পণ্য রিসিভ)</span>
        </button>
      </div>

      {/* Raw Ingredients Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-gray-900">Current Raw Materials Stock</h2>
          <span className="text-xs text-gray-500">Total Items: {ingredients.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Ingredient Name</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">Min Alert Threshold</th>
                <th className="px-4 py-3">Unit Cost (৳)</th>
                <th className="px-4 py-3">Total Value (৳)</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ingredients.map(ing => {
                const isLow = ing.currentStock <= ing.minStockAlert;
                const totalVal = (ing.currentStock * ing.unitCost).toFixed(0);

                return (
                  <tr key={ing.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900">{ing.name}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {ing.currentStock} {ing.unit}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {ing.minStockAlert} {ing.unit}
                    </td>
                    <td className="px-4 py-3">৳{ing.unitCost} / {ing.unit}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">৳{Number(totalVal).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{ing.supplier || 'Local Market'}</td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                          <CheckCircle className="w-3 h-3" />
                          Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Stock-In Purchase Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-sm text-gray-900">Recent Supplier Invoices (Stock-In History)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchaseOrders.map(po => (
            <div key={po.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-900">Invoice: {po.invoiceNo}</span>
                <span className="text-emerald-700 font-extrabold text-sm">৳{po.totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-gray-500 flex justify-between">
                <span>Supplier: {po.supplierName}</span>
                <span>Date: {po.date}</span>
              </div>
              <div className="pt-2 border-t border-gray-200/60 space-y-1">
                {po.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>{item.quantity}x {item.ingredientName}</span>
                    <span className="font-semibold">৳{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock In Modal */}
      {isStockInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">Record New Stock-In (কাঁচামাল এন্ট্রি)</h3>
                <p className="text-xs text-gray-500">Increases ingredient inventory and logs purchase expense</p>
              </div>
              <button
                onClick={() => setIsStockInModalOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSubmitStockIn} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Supplier / Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={e => setSupplierName(e.target.value)}
                    placeholder="e.g. Bengal Halal Meats"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Invoice / Voucher No.</label>
                  <input
                    type="text"
                    required
                    value={invoiceNo}
                    onChange={e => setInvoiceNo(e.target.value)}
                    placeholder="e.g. INV-8821"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase">Received Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {stockItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-xl">
                    <select
                      required
                      value={item.ingredientId}
                      onChange={e => handleItemChange(index, 'ingredientId', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="">-- Choose Raw Material --</option>
                      {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.unit})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      required
                      value={item.quantity || ''}
                      onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                      placeholder="Qty"
                      className="w-20 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />

                    <input
                      type="number"
                      step="any"
                      min="1"
                      required
                      value={item.unitCost || ''}
                      onChange={e => handleItemChange(index, 'unitCost', Number(e.target.value))}
                      placeholder="Unit ৳"
                      className="w-24 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />

                    <span className="w-20 text-right text-xs font-bold text-gray-900">
                      ৳{(item.quantity * item.unitCost).toFixed(0)}
                    </span>

                    {stockItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-extrabold text-gray-900">
                <span>Total Invoice Bill:</span>
                <span className="text-amber-600 text-base">৳{totalStockInCost.toLocaleString()}</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Confirm & Update Stock
                </button>
                <button
                  type="button"
                  onClick={() => setIsStockInModalOpen(false)}
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
