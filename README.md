# 🍽️ RestoOS - Full Restaurant Management System

> **An Enterprise-Grade, Multi-Actor Restaurant ERP & POS Solution** built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/fahim-m30/Restaurant-Management-System)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 মূল বৈশিষ্ট্যসমূহ (Key Features & Highlights)

### ১. রোল ভিত্তিক অ্যাক্টর কন্ট্রোল (Multi-Actor Role-Based Architecture)
সিস্টেমে প্রতিটি কর্মীর জন্য আলাদা আলাদা বিশেষায়িত ভিউ ও অ্যাকশন কন্ট্রোল রাখা হয়েছে:
- **👑 Admin / Owner Dashboard**: সম্পূর্ণ রেস্টুরেন্ট কার্যক্রম মনিটরিং, সেলস অ্যানালিটিক্স, গ্রস ও নিট লাভ-ক্ষতি (P&L), স্টাফ পে-রোল অনুমোদন ও ইনভেন্টরি ট্র্যাকিং।
- **💳 Cashier & POS Terminal**: ডাইন-ইন ও টেকঅ্যাওয়ে/পার্সেল বিলিং, ডিসকাউন্ট, ৫% ভ্যাট হিসাব, নগদ টাকা/কার্ড/বিকাশ পেমেন্ট রিসিভ এবং থার্মাল প্রিন্ট উপযোগী ক্যাশ মেমো / ইনভয়েস জেনারেশন।
- **📝 Waiter & Floor Captain**: লাইভ ফ্লোর প্ল্যানে টেবিল (Ground Floor, 1st Floor Family, Rooftop Lounge, VIP Cabin) স্ট্যাটাস চেক (Free / Occupied / Reserved), অর্ডার টেকিং এবং কিচেনে ইনস্ট্যান্ট KOT পাঠানো।
- **👨‍🍳 Kitchen Display System (KDS)**: শেফদের জন্য লাইভ টিকিট ডিসপ্লে স্ক্রিন, অর্ডারের সময়কাল ট্র্যাকিং (সবুজ: &lt;10 মি., হলুদ: 10-20 মি., লাল/পালসিং: &gt;20 মি. আর্জেন্ট), এক ক্লিকে Cooking ও Ready স্ট্যাটাস আপডেট।
- **🛵 Delivery Rider Fleet**: কাস্টমারের নাম, ফোন নম্বর (ডায়াল শর্টকাট), পূর্ণ ঠিকানা ও ক্যাশ অন ডেলিভারি (COD) টাকা কালেকশন ট্র্যাকিং।
- **📱 Customer Digital QR Menu**: রেস্তোরাঁর টেবিলে বসে গ্রাহকের মোবাইল থেকে কিউআর কোড স্ক্যান করে ডিজিটাল মেনু ব্রাউজ ও সেলফ-অর্ডারিং সুবিধা।

---

### ২. কাঁচামাল ও ইনভেন্টরি ব্যবস্থাপনা (Inventory, Supply Chain & Recipe Engine)
- **পণ্য রিসিভ (Stock-In / Goods Received Note - GRN)**: ভেন্ডর/সরবরাহকারী থেকে চাল, তেল, মাংস, মসলা, পনির ইত্যাদির ইনভয়েস এন্ট্রি ও বর্তমান স্টক বৃদ্ধি।
- **স্বয়ংক্রিয় কাঁচামাল কর্তন (Auto Stock Deduction via Recipe)**: প্রতিবার যেকোনো খাবার (যেমন: খাসির কাচ্চি, বিফ কালা ভুনা, বার্গার) বিক্রি বা অর্ডার হলে রেসিপি অনুযায়ী নির্দিষ্ট পরিমাণ কাঁচামাল স্বয়ংক্রিয়ভাবে ইনভেন্টরি থেকে মাইনাস হয়ে যায়।
- **লো-স্টক অ্যালার্ট (Low Stock Warning)**: কোনো কাঁচামাল নির্ধারিত লেভেলের নিচে নেমে গেলে সাথে সাথে ড্যাশবোর্ডে সতর্কবার্তা প্রদর্শন।

---

### ৩. কর্মচারী ও বেতন ব্যবস্থাপনা (Staff & Payroll System)
- **স্টাফ প্রোফাইল ও ডিপার্টমেন্ট**: কিচেন শেফ, ওয়েটার, ক্যাশিয়ার, ডেলিভারি রাইডারদের তথ্য ও মূল বেতন সংরক্ষণ।
- **দৈনিক উপস্থিতি (Daily Attendance)**: এক ক্লিকে প্রেজেন্ট, অ্যাবসেন্ট, হাফ-ডে ও ওভারটাইম ঘণ্টা হিসাব।
- **অগ্রিম বেতন (Advance Salary Tracking)**: কোনো কর্মী অগ্রিম টাকা নিলে তা রেকর্ড রাখা এবং অনুমোদিত হিসাব সংরক্ষণ।
- **মাসিক পে-রোল ও পে-স্লিপ (Automated Monthly Payroll)**:
  $$\text{Net Salary} = \text{Base Salary} + \text{Overtime Bonus} - \text{Advance Deduction}$$
  এক ক্লিকে ব্যাংক, বিকাশ বা নগদে বেতন প্রদান এবং খরচের খাতায় অন্তর্ভুক্তকরণ।

---

### ৪. ফাইন্যান্সিয়াল অ্যানালিটিক্স ও লাভ-ক্ষতির হিসাব (P&L Accounting)
- **আসল লাভ-ক্ষতি বিবরণী (Executive P&L Statement)**:
  1. **Total Sales Revenue**: মোট বিক্রয়লব্ধ আয়।
  2. **Less: COGS (Cost of Goods Sold)**: খাবারে ব্যবহৃত কাঁচামালের সঠিক ক্রয়মূল্য।
  3. **= Gross Profit**: স্থূল লাভ।
  4. **Less: Staff Payroll**: কর্মীদের প্রদেয় বেতন-ভাতা।
  5. **Less: Operational Expenses**: দোকান ভাড়া, বিদ্যুৎ ও গ্যাস বিল, টেকঅ্যাওয়ে প্যাকেজিং, মেনটেন্যান্স ইত্যাদি।
  6. **= Net Business Profit**: ব্যবসার আসল নিট লাভ ও মার্জিন (%)।
- **ইন্টারেক্টিভ গ্রাফিক্যাল চার্ট**: Recharts দিয়ে ভিজ্যুয়াল রেভিনিউ বনাম খরচ ও ক্যাটাগরিভিত্তিক খরচের পাই-চার্ট।

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)

| কম্পোনেন্ট | ব্যবহৃত টেকনোলজি |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router & Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Data Visuals** | Recharts Data Visualization |
| **Database & Schema** | Prisma ORM (`prisma/schema.prisma`) + High-performance Reactive Data Store |
| **Version Control** | Git & GitHub |

---

## 🚀 লোকাল মেশিনে যেভাবে চালাবেন (Quick Start)

### ১. ক্লোন করুন ও প্রজেক্ট ফোল্ডারে যান:
```bash
git clone https://github.com/fahim-m30/Restaurant-Management-System.git
cd Restaurant-Management-System
```

### ২. ডিপেন্ডেন্সি ইন্সটল করুন:
```bash
npm install
```

### ৩. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```

ব্রাউজারে গিয়ে ওপেন করুন: [http://localhost:3000](http://localhost:3000)

---

## 📂 প্রজেক্ট স্ট্রাকচার (Project Structure)

```
restaurant-management-system/
├── prisma/
│   └── schema.prisma           # Complete Enterprise Prisma DB Schema
├── src/
│   ├── app/
│   │   ├── api/data/route.ts   # Unified Multi-Actor API Endpoint
│   │   ├── globals.css         # Tailwind & Theme Styling
│   │   ├── layout.tsx          # Root Layout & Context Wrapper
│   │   └── page.tsx            # Main Application & Navigation Hub
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Top Bar with Live Role Switcher & Stock Indicators
│   │   │   └── NavigationTabs.tsx # Module Navigation Tabs
│   │   ├── dashboard/
│   │   │   └── AdminOverview.tsx # P&L Analytics, Charts & Real-time KPIs
│   │   ├── pos/
│   │   │   └── PosBilling.tsx  # Counter Sales, VAT, Discounts & Printable Receipts
│   │   ├── waiter/
│   │   │   └── TableFloorPlan.tsx # Interactive Tables (Ground, 1st, Rooftop, VIP)
│   │   ├── kitchen/
│   │   │   └── KitchenDisplaySystem.tsx # Live KOT with Elapsed Timers
│   │   ├── delivery/
│   │   │   └── DeliveryRiderPortal.tsx # Rider Dispatch, Address & COD Collection
│   │   ├── inventory/
│   │   │   └── InventoryManagement.tsx # Raw Stock In (GRN) & Recipe Engine
│   │   ├── staff/
│   │   │   └── StaffPayroll.tsx # Attendance, Advances & Monthly Pay-slips
│   │   ├── accounting/
│   │   │   └── AccountingProfitLoss.tsx # Full P&L Statement & Expense Ledger
│   │   └── menu/
│   │       └── CustomerDigitalMenu.tsx # Mobile QR Self-Ordering
│   ├── context/
│   │   └── RestoContext.tsx    # Global Reactive State & Business Logic Actions
│   ├── lib/
│   │   └── store.ts            # Persistent Data Engine & Authentic Seed Records
│   └── types/
│       └── index.ts            # TypeScript Interfaces & Business Types
├── package.json
├── tsconfig.json
└── README.md
```

---

## 👨‍💻 Author & Maintainer
- **Developer**: Fahim Muntasir ([@fahim-m30](https://github.com/fahim-m30))
- **Repository**: [Restaurant-Management-System](https://github.com/fahim-m30/Restaurant-Management-System)
