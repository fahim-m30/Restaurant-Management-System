import type { Metadata } from 'next';
import './globals.css';
import { RestoProvider } from '@/context/RestoContext';

export const metadata: Metadata = {
  title: 'RestoOS - Full Restaurant Management System',
  description: 'Enterprise Multi-Actor Restaurant ERP: POS Billing, Live Table Floor, Kitchen KDS, Raw Inventory & Recipes, Staff Payroll & P&L Accounting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <RestoProvider>
          {children}
        </RestoProvider>
      </body>
    </html>
  );
}
