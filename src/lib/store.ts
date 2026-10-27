import {
  User,
  Employee,
  Attendance,
  SalaryAdvance,
  SalaryPayment,
  Category,
  MenuItem,
  Ingredient,
  PurchaseOrder,
  TableEntity,
  Order,
  Expense,
  FinancialAnalytics,
  UserRole,
  OrderStatus
} from '@/types';
import fs from 'fs';
import path from 'path';

export interface AppStore {
  currentUserRole: UserRole;
  users: User[];
  employees: Employee[];
  attendances: Attendance[];
  salaryAdvances: SalaryAdvance[];
  salaryPayments: SalaryPayment[];
  categories: Category[];
  menuItems: MenuItem[];
  ingredients: Ingredient[];
  purchaseOrders: PurchaseOrder[];
  tables: TableEntity[];
  orders: Order[];
  expenses: Expense[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'restaurant_data.json');

// Initial seed data with authentic Bangladeshi Restaurant items & recipes
const initialStore: AppStore = {
  currentUserRole: 'ADMIN',
  users: [
    { id: 'u1', name: 'Fahim Muntasir', email: 'owner@restoos.com', role: 'ADMIN', phone: '+8801700000001' },
    { id: 'u2', name: 'Tanvir Ahmed', email: 'cashier@restoos.com', role: 'CASHIER', phone: '+8801700000002' },
    { id: 'u3', name: 'Rakib Hasan', email: 'waiter@restoos.com', role: 'WAITER', phone: '+8801700000003' },
    { id: 'u4', name: 'Chef Monir Hossain', email: 'chef@restoos.com', role: 'KITCHEN', phone: '+8801700000004' },
    { id: 'u5', name: 'Sabbir Hossain', email: 'rider@restoos.com', role: 'RIDER', phone: '+8801700000005' },
  ],
  employees: [
    { id: 'emp-1', name: 'Monir Hossain', role: 'KITCHEN', department: 'Main Kitchen', phone: '01811223344', baseSalary: 32000, joiningDate: '2024-01-15', status: 'ACTIVE' },
    { id: 'emp-2', name: 'Rakib Hasan', role: 'WAITER', department: 'Service Floor', phone: '01722334455', baseSalary: 18000, joiningDate: '2024-03-01', status: 'ACTIVE' },
    { id: 'emp-3', name: 'Tanvir Ahmed', role: 'CASHIER', department: 'Front Counter', phone: '01933445566', baseSalary: 22000, joiningDate: '2024-02-10', status: 'ACTIVE' },
    { id: 'emp-4', name: 'Sabbir Hossain', role: 'RIDER', department: 'Delivery Fleet', phone: '01644556677', baseSalary: 16000, joiningDate: '2024-05-20', status: 'ACTIVE' },
    { id: 'emp-5', name: 'Sohel Rana', role: 'KITCHEN', department: 'Grill & Fry', phone: '01555667788', baseSalary: 25000, joiningDate: '2024-04-12', status: 'ACTIVE' },
    { id: 'emp-6', name: 'Al-Amin', role: 'WAITER', department: 'Service Floor', phone: '01366778899', baseSalary: 17500, joiningDate: '2024-06-01', status: 'ACTIVE' },
  ],
  attendances: [
    { id: 'att-1', employeeId: 'emp-1', employeeName: 'Monir Hossain', date: '2026-10-28', status: 'PRESENT', overtimeHours: 1 },
    { id: 'att-2', employeeId: 'emp-2', employeeName: 'Rakib Hasan', date: '2026-10-28', status: 'PRESENT', overtimeHours: 0 },
    { id: 'att-3', employeeId: 'emp-3', employeeName: 'Tanvir Ahmed', date: '2026-10-28', status: 'PRESENT', overtimeHours: 0 },
    { id: 'att-4', employeeId: 'emp-4', employeeName: 'Sabbir Hossain', date: '2026-10-28', status: 'PRESENT', overtimeHours: 2 },
    { id: 'att-5', employeeId: 'emp-5', employeeName: 'Sohel Rana', date: '2026-10-28', status: 'PRESENT', overtimeHours: 0 },
    { id: 'att-6', employeeId: 'emp-6', employeeName: 'Al-Amin', date: '2026-10-28', status: 'HALF_DAY', overtimeHours: 0 },
  ],
  salaryAdvances: [
    { id: 'adv-1', employeeId: 'emp-2', employeeName: 'Rakib Hasan', amount: 3000, date: '2026-10-15', reason: 'Family medical emergency', status: 'APPROVED' },
    { id: 'adv-2', employeeId: 'emp-4', employeeName: 'Sabbir Hossain', amount: 2000, date: '2026-10-18', reason: 'Bike servicing', status: 'APPROVED' },
  ],
  salaryPayments: [
    { id: 'sal-1', employeeId: 'emp-1', employeeName: 'Monir Hossain', month: 'September 2026', baseSalary: 32000, overtimeBonus: 3000, advanceDeduction: 0, netPaid: 35000, paymentDate: '2026-10-01', paymentMethod: 'BANK', status: 'PAID' },
    { id: 'sal-2', employeeId: 'emp-2', employeeName: 'Rakib Hasan', month: 'September 2026', baseSalary: 18000, overtimeBonus: 1200, advanceDeduction: 2000, netPaid: 17200, paymentDate: '2026-10-01', paymentMethod: 'BKASH', status: 'PAID' },
    { id: 'sal-3', employeeId: 'emp-3', employeeName: 'Tanvir Ahmed', month: 'September 2026', baseSalary: 22000, overtimeBonus: 0, advanceDeduction: 0, netPaid: 22000, paymentDate: '2026-10-01', paymentMethod: 'BANK', status: 'PAID' },
    { id: 'sal-4', employeeId: 'emp-4', employeeName: 'Sabbir Hossain', month: 'September 2026', baseSalary: 16000, overtimeBonus: 2500, advanceDeduction: 1500, netPaid: 17000, paymentDate: '2026-10-01', paymentMethod: 'CASH', status: 'PAID' },
  ],
  categories: [
    { id: 'cat-1', name: 'Biryani & Rice', slug: 'biryani-rice', icon: '🍚', description: 'Dum Kacchi, Polao & Khichuri' },
    { id: 'cat-2', name: 'Grill & Kebab', slug: 'grill-kebab', icon: '🍗', description: 'Chicken Chaap, Beef Tikka, BBQ' },
    { id: 'cat-3', name: 'Burgers & Wraps', slug: 'burgers-wraps', icon: '🍔', description: 'Smash burgers & Shawarma' },
    { id: 'cat-4', name: 'Curry & Gravy', slug: 'curry-gravy', icon: '🍲', description: 'Butter Chicken, Beef Kala Bhuna' },
    { id: 'cat-5', name: 'Drinks & Beverages', slug: 'drinks', icon: '🥤', description: 'Fresh juices, Borhani & Shakes' },
    { id: 'cat-6', name: 'Desserts', slug: 'desserts', icon: '🍧', description: 'Falooda, Kulfi & Gulab Jamun' },
  ],
  ingredients: [
    { id: 'ing-1', name: 'Basmati / Chinigura Rice', unit: 'kg', currentStock: 78.5, minStockAlert: 20, unitCost: 140, supplier: 'Green Valley Agro' },
    { id: 'ing-2', name: 'Mutton / Khashi Meat', unit: 'kg', currentStock: 34.0, minStockAlert: 15, unitCost: 1150, supplier: 'Bengal Halal Meats' },
    { id: 'ing-3', name: 'Broiler / Deshi Chicken', unit: 'kg', currentStock: 45.0, minStockAlert: 20, unitCost: 220, supplier: 'Bismillah Poultry' },
    { id: 'ing-4', name: 'Beef (Solid Meat)', unit: 'kg', currentStock: 28.5, minStockAlert: 15, unitCost: 780, supplier: 'Bengal Halal Meats' },
    { id: 'ing-5', name: 'Mustard Oil / Pure Ghee', unit: 'liter', currentStock: 18.0, minStockAlert: 10, unitCost: 650, supplier: 'Pran Agro' },
    { id: 'ing-6', name: 'Aloo / Potatoes', unit: 'kg', currentStock: 65.0, minStockAlert: 25, unitCost: 45, supplier: 'Karwan Bazar Wholesale' },
    { id: 'ing-7', name: 'Spices Mix (Jafran, Cardamom, Clove)', unit: 'kg', currentStock: 6.5, minStockAlert: 3, unitCost: 1200, supplier: 'Spice Kingdom' },
    { id: 'ing-8', name: 'Yogurt / Tok Doi', unit: 'kg', currentStock: 14.0, minStockAlert: 8, unitCost: 110, supplier: 'Aarong Dairy' },
    { id: 'ing-9', name: 'Burger Buns', unit: 'pcs', currentStock: 52.0, minStockAlert: 30, unitCost: 25, supplier: 'Coopers Bakery' },
    { id: 'ing-10', name: 'Cheddar Cheese Slices', unit: 'pcs', currentStock: 60.0, minStockAlert: 25, unitCost: 35, supplier: 'Imported Dairy' },
  ],
  menuItems: [
    {
      id: 'item-1',
      name: 'Special Mutton Dum Kacchi',
      categoryId: 'cat-1',
      price: 450,
      costPrice: 245,
      description: 'Fragrant chinigura rice slow-cooked with tender marinated mutton & ghee-roasted potato.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
      isAvailable: true,
      preparationTime: 10,
      recipe: [
        { ingredientId: 'ing-1', ingredientName: 'Basmati / Chinigura Rice', quantity: 0.25, unit: 'kg' },
        { ingredientId: 'ing-2', ingredientName: 'Mutton / Khashi Meat', quantity: 0.22, unit: 'kg' },
        { ingredientId: 'ing-5', ingredientName: 'Mustard Oil / Pure Ghee', quantity: 0.05, unit: 'liter' },
        { ingredientId: 'ing-6', ingredientName: 'Aloo / Potatoes', quantity: 0.15, unit: 'kg' },
        { ingredientId: 'ing-7', ingredientName: 'Spices Mix', quantity: 0.02, unit: 'kg' },
      ]
    },
    {
      id: 'item-2',
      name: 'Old Dhaka Chicken Biryani',
      categoryId: 'cat-1',
      price: 320,
      costPrice: 160,
      description: 'Classic aromatic rice cooked with half roasted chicken and golden potato.',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80',
      isAvailable: true,
      preparationTime: 12,
      recipe: [
        { ingredientId: 'ing-1', ingredientName: 'Basmati / Chinigura Rice', quantity: 0.25, unit: 'kg' },
        { ingredientId: 'ing-3', ingredientName: 'Broiler / Deshi Chicken', quantity: 0.30, unit: 'kg' },
        { ingredientId: 'ing-5', ingredientName: 'Mustard Oil / Pure Ghee', quantity: 0.04, unit: 'liter' },
        { ingredientId: 'ing-6', ingredientName: 'Aloo / Potatoes', quantity: 0.12, unit: 'kg' },
      ]
    },
    {
      id: 'item-3',
      name: 'Traditional Beef Kala Bhuna',
      categoryId: 'cat-4',
      price: 420,
      costPrice: 230,
      description: 'Slow-roasted Chittagong style black beef with rich aromatic caramelized spices.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
      isAvailable: true,
      preparationTime: 15,
      recipe: [
        { ingredientId: 'ing-4', ingredientName: 'Beef (Solid Meat)', quantity: 0.28, unit: 'kg' },
        { ingredientId: 'ing-5', ingredientName: 'Mustard Oil / Pure Ghee', quantity: 0.06, unit: 'liter' },
        { ingredientId: 'ing-7', ingredientName: 'Spices Mix', quantity: 0.04, unit: 'kg' },
      ]
    },
    {
      id: 'item-4',
      name: 'Charcoal Grilled Quarter Chicken',
      categoryId: 'cat-2',
      price: 260,
      costPrice: 120,
      description: 'Charcoal smoked chicken thigh with garlic naan & mint raita dip.',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&q=80',
      isAvailable: true,
      preparationTime: 15,
      recipe: [
        { ingredientId: 'ing-3', ingredientName: 'Broiler / Deshi Chicken', quantity: 0.35, unit: 'kg' },
        { ingredientId: 'ing-8', ingredientName: 'Yogurt / Tok Doi', quantity: 0.08, unit: 'kg' },
        { ingredientId: 'ing-7', ingredientName: 'Spices Mix', quantity: 0.02, unit: 'kg' },
      ]
    },
    {
      id: 'item-5',
      name: 'Double Cheese Smash Beef Burger',
      categoryId: 'cat-3',
      price: 360,
      costPrice: 175,
      description: 'Two smashed beef patties, caramelized onions, double cheddar cheese & secret sauce.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
      isAvailable: true,
      preparationTime: 12,
      recipe: [
        { ingredientId: 'ing-9', ingredientName: 'Burger Buns', quantity: 1, unit: 'pcs' },
        { ingredientId: 'ing-4', ingredientName: 'Beef (Solid Meat)', quantity: 0.18, unit: 'kg' },
        { ingredientId: 'ing-10', ingredientName: 'Cheddar Cheese Slices', quantity: 2, unit: 'pcs' },
      ]
    },
    {
      id: 'item-6',
      name: 'Royal Shahi Borhani',
      categoryId: 'cat-5',
      price: 90,
      costPrice: 35,
      description: 'Traditional spiced yogurt digestive drink with mint, coriander and roasted cumin.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80',
      isAvailable: true,
      preparationTime: 5,
      recipe: [
        { ingredientId: 'ing-8', ingredientName: 'Yogurt / Tok Doi', quantity: 0.20, unit: 'kg' },
        { ingredientId: 'ing-7', ingredientName: 'Spices Mix', quantity: 0.01, unit: 'kg' },
      ]
    },
    {
      id: 'item-7',
      name: 'Royal Shahi Falooda',
      categoryId: 'cat-6',
      price: 180,
      costPrice: 75,
      description: 'Chilled dessert with rose syrup, basil seeds, vermicelli, seasonal fruits & vanilla scoop.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80',
      isAvailable: true,
      preparationTime: 8,
      recipe: []
    }
  ],
  tables: [
    { id: 'tbl-1', number: 1, capacity: 2, floor: 'Ground Floor', status: 'OCCUPIED', currentOrderId: 'ord-101' },
    { id: 'tbl-2', number: 2, capacity: 4, floor: 'Ground Floor', status: 'AVAILABLE' },
    { id: 'tbl-3', number: 3, capacity: 4, floor: 'Ground Floor', status: 'OCCUPIED', currentOrderId: 'ord-102' },
    { id: 'tbl-4', number: 4, capacity: 6, floor: 'Ground Floor', status: 'AVAILABLE' },
    { id: 'tbl-5', number: 5, capacity: 4, floor: '1st Floor Family', status: 'RESERVED' },
    { id: 'tbl-6', number: 6, capacity: 6, floor: '1st Floor Family', status: 'AVAILABLE' },
    { id: 'tbl-7', number: 7, capacity: 8, floor: '1st Floor Family', status: 'AVAILABLE' },
    { id: 'tbl-8', number: 8, capacity: 2, floor: 'Rooftop Lounge', status: 'AVAILABLE' },
    { id: 'tbl-9', number: 9, capacity: 4, floor: 'Rooftop Lounge', status: 'AVAILABLE' },
    { id: 'tbl-10', number: 10, capacity: 4, floor: 'Rooftop Lounge', status: 'AVAILABLE' },
    { id: 'tbl-11', number: 11, capacity: 6, floor: 'Rooftop Lounge', status: 'AVAILABLE' },
    { id: 'tbl-12', number: 12, capacity: 10, floor: 'VIP Cabin', status: 'AVAILABLE' },
  ],
  purchaseOrders: [
    {
      id: 'po-1',
      supplierName: 'Bengal Halal Meats',
      invoiceNo: 'BHM-8841',
      date: '2026-10-25',
      totalAmount: 38250,
      status: 'RECEIVED',
      items: [
        { ingredientId: 'ing-2', ingredientName: 'Mutton / Khashi Meat', quantity: 20, unitCost: 1150, total: 23000 },
        { ingredientId: 'ing-4', ingredientName: 'Beef (Solid Meat)', quantity: 15, unitCost: 780, total: 11700 },
        { ingredientId: 'ing-3', ingredientName: 'Broiler / Deshi Chicken', quantity: 16, unitCost: 220, total: 3520 },
      ]
    },
    {
      id: 'po-2',
      supplierName: 'Green Valley Agro',
      invoiceNo: 'GVA-1204',
      date: '2026-10-26',
      totalAmount: 14000,
      status: 'RECEIVED',
      items: [
        { ingredientId: 'ing-1', ingredientName: 'Basmati / Chinigura Rice', quantity: 100, unitCost: 140, total: 14000 }
      ]
    }
  ],
  orders: [
    {
      id: 'ord-101',
      orderNumber: 'KOT-201',
      type: 'DINE_IN',
      tableId: 'tbl-1',
      tableNumber: 1,
      customerName: 'Dine-in Guest',
      status: 'COOKING',
      items: [
        { id: 'oi-1', menuItemId: 'item-1', name: 'Special Mutton Dum Kacchi', price: 450, quantity: 2, status: 'COOKING', specialInstructions: 'Extra aloo & raita' },
        { id: 'oi-2', menuItemId: 'item-6', name: 'Royal Shahi Borhani', price: 90, quantity: 2, status: 'READY' }
      ],
      subtotal: 1080,
      tax: 54,
      discount: 0,
      total: 1134,
      paymentStatus: 'UNPAID',
      waiterName: 'Rakib Hasan',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'ord-102',
      orderNumber: 'KOT-202',
      type: 'DINE_IN',
      tableId: 'tbl-3',
      tableNumber: 3,
      customerName: 'Mr. Rafiqul',
      status: 'PENDING',
      items: [
        { id: 'oi-3', menuItemId: 'item-3', name: 'Traditional Beef Kala Bhuna', price: 420, quantity: 1, status: 'PENDING' },
        { id: 'oi-4', menuItemId: 'item-4', name: 'Charcoal Grilled Quarter Chicken', price: 260, quantity: 2, status: 'PENDING' }
      ],
      subtotal: 940,
      tax: 47,
      discount: 0,
      total: 987,
      paymentStatus: 'UNPAID',
      waiterName: 'Al-Amin',
      createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ord-103',
      orderNumber: 'DEL-301',
      type: 'DELIVERY',
      customerName: 'Shakil Mahmud',
      customerPhone: '01711998877',
      customerAddress: 'House 42, Road 11, Banani, Dhaka',
      status: 'DELIVERING',
      items: [
        { id: 'oi-5', menuItemId: 'item-5', name: 'Double Cheese Smash Beef Burger', price: 360, quantity: 3, status: 'READY' },
        { id: 'oi-6', menuItemId: 'item-6', name: 'Royal Shahi Borhani', price: 90, quantity: 3, status: 'READY' }
      ],
      subtotal: 1350,
      tax: 67.5,
      discount: 50,
      total: 1367.5,
      paymentMethod: 'CASH',
      paymentStatus: 'UNPAID',
      riderName: 'Sabbir Hossain',
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'ord-100',
      orderNumber: 'BILL-199',
      type: 'DINE_IN',
      tableNumber: 2,
      customerName: 'Dr. Kamal',
      status: 'COMPLETED',
      items: [
        { id: 'oi-7', menuItemId: 'item-1', name: 'Special Mutton Dum Kacchi', price: 450, quantity: 4, status: 'READY' },
        { id: 'oi-8', menuItemId: 'item-6', name: 'Royal Shahi Borhani', price: 90, quantity: 4, status: 'READY' }
      ],
      subtotal: 2160,
      tax: 108,
      discount: 100,
      total: 2168,
      paymentMethod: 'BKASH',
      paymentStatus: 'PAID',
      waiterName: 'Rakib Hasan',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    }
  ],
  expenses: [
    { id: 'exp-1', category: 'RENT', title: 'Monthly Restaurant Floor Rent', amount: 85000, date: '2026-10-05', notes: 'Advance paid to building owner' },
    { id: 'exp-2', category: 'UTILITIES', title: 'DESCO Electricity & Gas Bill', amount: 32400, date: '2026-10-12', notes: 'Peak commercial meter bill' },
    { id: 'exp-3', category: 'MAINTENANCE', title: 'Kitchen Exhaust & Hood Deep Cleaning', amount: 8500, date: '2026-10-18', notes: 'Serviced by CoolTech Solutions' },
    { id: 'exp-4', category: 'SUPPLIES', title: 'Packaging boxes, cups & thermal paper rolls', amount: 12000, date: '2026-10-22', notes: 'Takeaway packaging bulk' },
    { id: 'exp-5', category: 'MARKETING', title: 'Facebook Page Ads & Food Influencer Review', amount: 9500, date: '2026-10-20', notes: 'Promo campaign for Falooda' },
  ]
};

// In-memory fallback if fs is constrained, with server disk persistence
let memoryStore: AppStore | null = null;

export function getStore(): AppStore {
  if (memoryStore) return memoryStore;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryStore = JSON.parse(data);
      return memoryStore as AppStore;
    }
  } catch (err) {
    console.warn('Could not read store from disk, using initial store:', err);
  }

  memoryStore = JSON.parse(JSON.stringify(initialStore));
  saveStore(memoryStore!);
  return memoryStore!;
}

export function saveStore(store: AppStore): void {
  memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write store to disk:', err);
  }
}

// ---------------- BUSINESS LOGIC HELPERS ----------------

/**
 * Switch Active Actor Role
 */
export function setActorRole(role: UserRole): AppStore {
  const store = getStore();
  store.currentUserRole = role;
  saveStore(store);
  return store;
}

/**
 * Deduct Raw Ingredients Stock automatically according to MenuItem recipe
 */
export function deductStockForOrder(order: Order, store: AppStore): void {
  for (const item of order.items) {
    const menuItem = store.menuItems.find(m => m.id === item.menuItemId);
    if (!menuItem || !menuItem.recipe) continue;

    for (const req of menuItem.recipe) {
      const ingredient = store.ingredients.find(ing => ing.id === req.ingredientId);
      if (ingredient) {
        const totalDeduction = req.quantity * item.quantity;
        ingredient.currentStock = Math.max(0, Number((ingredient.currentStock - totalDeduction).toFixed(3)));
      }
    }
  }
}

/**
 * Create Order (Dine-in, Takeaway, Delivery)
 */
export function createOrder(payload: {
  type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: Array<{ menuItemId: string; name: string; price: number; quantity: number; specialInstructions?: string }>;
  discount?: number;
  paymentMethod?: 'CASH' | 'CARD' | 'BKASH' | 'NAGAD' | 'SPLIT';
  paymentStatus?: 'UNPAID' | 'PAID';
  waiterName?: string;
  notes?: string;
}): Order {
  const store = getStore();
  const subtotal = payload.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discount = payload.discount || 0;
  const tax = Number((subtotal * 0.05).toFixed(2)); // 5% VAT
  const total = Number((subtotal + tax - discount).toFixed(2));

  let tableNumber: number | undefined;
  if (payload.tableId) {
    const table = store.tables.find(t => t.id === payload.tableId);
    if (table) {
      tableNumber = table.number;
      table.status = 'OCCUPIED';
    }
  }

  const prefix = payload.type === 'DINE_IN' ? 'KOT' : payload.type === 'DELIVERY' ? 'DEL' : 'TAK';
  const orderNumber = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    type: payload.type,
    tableId: payload.tableId,
    tableNumber,
    customerName: payload.customerName || (payload.type === 'DINE_IN' ? `Table ${tableNumber}` : 'Customer'),
    customerPhone: payload.customerPhone,
    customerAddress: payload.customerAddress,
    status: 'PENDING',
    items: payload.items.map((i, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      ...i,
      status: 'PENDING'
    })),
    subtotal,
    tax,
    discount,
    total,
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentStatus || 'UNPAID',
    waiterName: payload.waiterName || 'Staff',
    notes: payload.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (payload.tableId) {
    const table = store.tables.find(t => t.id === payload.tableId);
    if (table) table.currentOrderId = newOrder.id;
  }

  // Deduct raw ingredients inventory
  deductStockForOrder(newOrder, store);

  store.orders.unshift(newOrder);
  saveStore(store);
  return newOrder;
}

/**
 * Update Order Status (Pending -> Cooking -> Ready -> Served -> Delivering -> Completed)
 */
export function updateOrderStatus(orderId: string, status: OrderStatus, riderName?: string): Order | null {
  const store = getStore();
  const order = store.orders.find(o => o.id === orderId);
  if (!order) return null;

  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (riderName) order.riderName = riderName;

  if (status === 'COOKING') {
    order.items.forEach(i => i.status = 'COOKING');
  } else if (status === 'READY') {
    order.items.forEach(i => i.status = 'READY');
  } else if (status === 'COMPLETED') {
    // If table was attached, mark table available
    if (order.tableId) {
      const table = store.tables.find(t => t.id === order.tableId);
      if (table && table.currentOrderId === order.id) {
        table.status = 'AVAILABLE';
        table.currentOrderId = undefined;
      }
    }
  }

  saveStore(store);
  return order;
}

/**
 * Settle Bill / Cashier Payment
 */
export function settleOrderPayment(orderId: string, paymentMethod: 'CASH' | 'CARD' | 'BKASH' | 'NAGAD' | 'SPLIT'): Order | null {
  const store = getStore();
  const order = store.orders.find(o => o.id === orderId);
  if (!order) return null;

  order.paymentStatus = 'PAID';
  order.paymentMethod = paymentMethod;
  order.updatedAt = new Date().toISOString();

  // If order was served, mark completed
  if (order.status === 'SERVED' || order.type === 'TAKEAWAY') {
    order.status = 'COMPLETED';
    if (order.tableId) {
      const table = store.tables.find(t => t.id === order.tableId);
      if (table) {
        table.status = 'AVAILABLE';
        table.currentOrderId = undefined;
      }
    }
  }

  saveStore(store);
  return order;
}

/**
 * Record Stock In (Goods Received Note / Raw Ingredient Purchase)
 */
export function recordStockIn(payload: {
  supplierName: string;
  invoiceNo: string;
  items: Array<{ ingredientId: string; quantity: number; unitCost: number }>;
}): PurchaseOrder {
  const store = getStore();

  let totalAmount = 0;
  const processedItems = payload.items.map(p => {
    const ing = store.ingredients.find(i => i.id === p.ingredientId);
    const ingredientName = ing ? ing.name : 'Unknown Ingredient';
    const total = p.quantity * p.unitCost;
    totalAmount += total;

    // Update ingredient current stock and latest unit cost
    if (ing) {
      ing.currentStock = Number((ing.currentStock + p.quantity).toFixed(2));
      ing.unitCost = p.unitCost;
      ing.supplier = payload.supplierName;
    }

    return {
      ingredientId: p.ingredientId,
      ingredientName,
      quantity: p.quantity,
      unitCost: p.unitCost,
      total
    };
  });

  const purchaseOrder: PurchaseOrder = {
    id: `po-${Date.now()}`,
    supplierName: payload.supplierName,
    invoiceNo: payload.invoiceNo,
    date: new Date().toISOString().split('T')[0],
    totalAmount,
    status: 'RECEIVED',
    items: processedItems
  };

  store.purchaseOrders.unshift(purchaseOrder);

  // Automatically log as Expense under SUPPLIES
  store.expenses.unshift({
    id: `exp-${Date.now()}`,
    category: 'SUPPLIES',
    title: `Raw Inventory Stock In - Invoice ${payload.invoiceNo} (${payload.supplierName})`,
    amount: totalAmount,
    date: new Date().toISOString().split('T')[0],
    notes: `Purchased ${payload.items.length} raw ingredients.`
  });

  saveStore(store);
  return purchaseOrder;
}

/**
 * Log Daily Attendance
 */
export function logAttendance(employeeId: string, status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'OVERTIME', overtimeHours: number = 0): Attendance {
  const store = getStore();
  const emp = store.employees.find(e => e.id === employeeId);
  const employeeName = emp ? emp.name : 'Unknown Employee';
  const today = new Date().toISOString().split('T')[0];

  // Remove existing attendance for today if any
  store.attendances = store.attendances.filter(a => !(a.employeeId === employeeId && a.date === today));

  const attendance: Attendance = {
    id: `att-${Date.now()}`,
    employeeId,
    employeeName,
    date: today,
    status,
    overtimeHours
  };

  store.attendances.push(attendance);
  saveStore(store);
  return attendance;
}

/**
 * Record Advance Salary
 */
export function recordSalaryAdvance(employeeId: string, amount: number, reason: string): SalaryAdvance {
  const store = getStore();
  const emp = store.employees.find(e => e.id === employeeId);

  const advance: SalaryAdvance = {
    id: `adv-${Date.now()}`,
    employeeId,
    employeeName: emp ? emp.name : 'Unknown',
    amount,
    date: new Date().toISOString().split('T')[0],
    reason,
    status: 'APPROVED'
  };

  store.salaryAdvances.unshift(advance);
  saveStore(store);
  return advance;
}

/**
 * Process Monthly Payroll Payment
 */
export function payEmployeeSalary(payload: {
  employeeId: string;
  month: string;
  overtimeBonus: number;
  advanceDeduction: number;
  paymentMethod: 'CASH' | 'BANK' | 'BKASH';
}): SalaryPayment | null {
  const store = getStore();
  const emp = store.employees.find(e => e.id === payload.employeeId);
  if (!emp) return null;

  const netPaid = emp.baseSalary + payload.overtimeBonus - payload.advanceDeduction;

  const payment: SalaryPayment = {
    id: `sal-${Date.now()}`,
    employeeId: emp.id,
    employeeName: emp.name,
    month: payload.month,
    baseSalary: emp.baseSalary,
    overtimeBonus: payload.overtimeBonus,
    advanceDeduction: payload.advanceDeduction,
    netPaid,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: payload.paymentMethod,
    status: 'PAID'
  };

  store.salaryPayments.unshift(payment);

  // Automatically record under expenses as SALARY
  store.expenses.unshift({
    id: `exp-${Date.now()}`,
    category: 'SALARY',
    title: `Staff Salary: ${emp.name} (${emp.role}) - ${payload.month}`,
    amount: netPaid,
    date: new Date().toISOString().split('T')[0],
    notes: `Base: ৳${emp.baseSalary}, Overtime: ৳${payload.overtimeBonus}, Advance: -৳${payload.advanceDeduction}`
  });

  saveStore(store);
  return payment;
}

/**
 * Add General Expense
 */
export function addExpense(payload: {
  category: Expense['category'];
  title: string;
  amount: number;
  notes?: string;
}): Expense {
  const store = getStore();
  const expense: Expense = {
    id: `exp-${Date.now()}`,
    category: payload.category,
    title: payload.title,
    amount: payload.amount,
    date: new Date().toISOString().split('T')[0],
    notes: payload.notes
  };

  store.expenses.unshift(expense);
  saveStore(store);
  return expense;
}

/**
 * Compute Comprehensive Profit & Loss & Financial Analytics
 */
export function getFinancialAnalytics(): FinancialAnalytics {
  const store = getStore();

  // 1. Total Sales Revenue
  const totalRevenue = store.orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  // 2. Cost of Goods Sold (COGS) based on recipes or cost price of menu items sold
  let totalCOGS = 0;
  for (const order of store.orders) {
    if (order.status === 'CANCELLED') continue;
    for (const item of order.items) {
      const menuItem = store.menuItems.find(m => m.id === item.menuItemId);
      if (menuItem) {
        totalCOGS += menuItem.costPrice * item.quantity;
      }
    }
  }

  // 3. Gross Profit = Revenue - COGS
  const grossProfit = totalRevenue - totalCOGS;

  // 4. Operational Expenses (Rent, Utilities, Maintenance, Marketing, Supplies)
  const totalExpenses = store.expenses
    .filter(e => e.category !== 'SALARY') // avoid double counting salaries
    .reduce((sum, e) => sum + e.amount, 0);

  // 5. Total Payroll Paid
  const totalPayroll = store.salaryPayments
    .reduce((sum, s) => sum + s.netPaid, 0);

  // 6. Net Profit = Gross Profit - (Total Operational Expenses + Total Payroll)
  const netProfit = grossProfit - (totalExpenses + totalPayroll);

  // Today specific metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = store.orders.filter(o => o.createdAt.startsWith(todayStr) && o.status !== 'CANCELLED');
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingKitchenOrders = store.orders.filter(o => o.status === 'PENDING' || o.status === 'COOKING').length;
  const lowStockItemsCount = store.ingredients.filter(i => i.currentStock <= i.minStockAlert).length;

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalCOGS: Number(totalCOGS.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2)),
    totalPayroll: Number(totalPayroll.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    todaySales: Number(todaySales.toFixed(2)),
    todayOrdersCount: todayOrders.length,
    pendingKitchenOrders,
    lowStockItemsCount
  };
}
