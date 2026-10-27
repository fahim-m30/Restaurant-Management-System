import { NextResponse } from 'next/server';
import {
  getStore,
  setActorRole,
  createOrder,
  updateOrderStatus,
  settleOrderPayment,
  recordStockIn,
  logAttendance,
  recordSalaryAdvance,
  payEmployeeSalary,
  addExpense,
  getFinancialAnalytics
} from '@/lib/store';

export async function GET() {
  try {
    const store = getStore();
    const analytics = getFinancialAnalytics();
    return NextResponse.json({ success: true, store, analytics });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case 'SET_ACTOR_ROLE': {
        const store = setActorRole(payload.role);
        return NextResponse.json({ success: true, store, analytics: getFinancialAnalytics() });
      }

      case 'CREATE_ORDER': {
        const order = createOrder(payload);
        return NextResponse.json({ success: true, order, store: getStore(), analytics: getFinancialAnalytics() });
      }

      case 'UPDATE_ORDER_STATUS': {
        const order = updateOrderStatus(payload.orderId, payload.status, payload.riderName);
        return NextResponse.json({ success: true, order, store: getStore(), analytics: getFinancialAnalytics() });
      }

      case 'SETTLE_PAYMENT': {
        const order = settleOrderPayment(payload.orderId, payload.paymentMethod);
        return NextResponse.json({ success: true, order, store: getStore(), analytics: getFinancialAnalytics() });
      }

      case 'STOCK_IN': {
        const po = recordStockIn(payload);
        return NextResponse.json({ success: true, purchaseOrder: po, store: getStore(), analytics: getFinancialAnalytics() });
      }

      case 'LOG_ATTENDANCE': {
        const att = logAttendance(payload.employeeId, payload.status, payload.overtimeHours);
        return NextResponse.json({ success: true, attendance: att, store: getStore() });
      }

      case 'SALARY_ADVANCE': {
        const adv = recordSalaryAdvance(payload.employeeId, payload.amount, payload.reason);
        return NextResponse.json({ success: true, advance: adv, store: getStore() });
      }

      case 'PAY_SALARY': {
        const payment = payEmployeeSalary(payload);
        return NextResponse.json({ success: true, payment, store: getStore(), analytics: getFinancialAnalytics() });
      }

      case 'ADD_EXPENSE': {
        const expense = addExpense(payload);
        return NextResponse.json({ success: true, expense, store: getStore(), analytics: getFinancialAnalytics() });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
