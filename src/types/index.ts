export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'WAITER' | 'KITCHEN' | 'RIDER' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  phone: string;
  baseSalary: number;
  joiningDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'OVERTIME';
  overtimeHours: number;
}

export interface SalaryAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "October 2026"
  baseSalary: number;
  overtimeBonus: number;
  advanceDeduction: number;
  netPaid: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'BANK' | 'BKASH';
  status: 'PAID' | 'PENDING';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface RecipeRequirement {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // Amount needed per 1 dish
  unit: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  costPrice: number; // Cost of raw ingredients to prepare
  description?: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  recipe: RecipeRequirement[];
}

export interface Ingredient {
  id: string;
  name: string;
  unit: 'kg' | 'liter' | 'pcs' | 'gm' | 'ml';
  currentStock: number;
  minStockAlert: number;
  unitCost: number; // Purchase price per unit
  supplier?: string;
}

export interface PurchaseItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  invoiceNo: string;
  date: string;
  totalAmount: number;
  status: 'RECEIVED' | 'ORDERED' | 'CANCELLED';
  items: PurchaseItem[];
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'BILLING';

export interface TableEntity {
  id: string;
  number: number;
  capacity: number;
  floor: string;
  status: TableStatus;
  currentOrderId?: string;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export type OrderStatus = 'PENDING' | 'COOKING' | 'READY' | 'SERVED' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  status: 'PENDING' | 'COOKING' | 'READY';
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  tableId?: string;
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: 'CASH' | 'CARD' | 'BKASH' | 'NAGAD' | 'SPLIT';
  paymentStatus: 'UNPAID' | 'PAID';
  waiterName?: string;
  riderName?: string;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

export type ExpenseCategory = 'RENT' | 'UTILITIES' | 'SALARY' | 'SUPPLIES' | 'MAINTENANCE' | 'MARKETING' | 'OTHER';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface FinancialAnalytics {
  totalRevenue: number;
  totalCOGS: number; // Cost of goods sold
  grossProfit: number;
  totalExpenses: number; // Operational + Utilities + Rent etc.
  totalPayroll: number; // Salaries paid
  netProfit: number; // Gross Profit - (Expenses + Payroll)
  todaySales: number;
  todayOrdersCount: number;
  pendingKitchenOrders: number;
  lowStockItemsCount: number;
}
