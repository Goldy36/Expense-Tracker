# 💳 ExpenseFlow - Full-Stack Expense Tracker Web Application

A production-quality **Full-Stack Expense Tracker & Financial Dashboard** built with **React.js, Node.js, Express.js, and MongoDB**.

Designed for an **internship and portfolio project**, featuring a clean fintech/SaaS light-mode interface, JWT authentication, user data isolation, budget usage tracking, dynamic Recharts visualizations, and automated financial insights.

---

## 🌟 Key Features

* **🔐 Authentication & Security**
  * JWT-based authentication (`Bearer <token>`)
  * Password hashing using `bcryptjs`
  * Strict user data isolation (Users can only access their own transactions & budgets)
  * Protected API endpoints with Express middleware

* **📊 Interactive Financial Dashboard**
  * Live dynamic calculations: **Total Balance**, **Total Income**, **Total Expenses**, and **Savings**
  * Interactive **Income vs Expense Area Chart** (7 Days, 30 Days, 6 Months, 1 Year timeframes)
  * **Expense Breakdown Donut Chart** by category with interactive legends
  * Recent activity feed and active budget status meters

* **💸 Transaction Management (`/transactions` & `/add-expense`)**
  * Full CRUD operations (Add, View Details, Edit, Delete with modal dialogs)
  * Multi-filters: Type (Income/Expense), Category, Payment Method, Date Range
  * Real-time search by title, description, or notes
  * Sorting options (Newest, Oldest, Amount High to Low, Amount Low to High)
  * Desktop table layout & mobile-responsive cards layout
  * Receipt attachment file uploader

* **🎯 Category Budget Management (`/budgets`)**
  * Monthly category spending limits (Food, Transport, Shopping, Bills, Entertainment, etc.)
  * Live spending progress meters with dynamic status badges (**Normal**, **Near Limit**, **Over Budget**)
  * Overall monthly budget health summary

* **📈 Deep Financial Analytics (`/analytics`)**
  * Income vs Expense comparison line/area charts
  * Monthly expense trend bar charts over 6 months
  * Top spending categories ranking list
  * **Automated Rule-Based Financial Insights Engine** providing spending advice

* **⚙️ User Settings (`/settings`)**
  * Profile management (Name, Email, Profile Picture)
  * Currency preference selector (₹ INR, $ USD, € EUR, £ GBP)
  * Notification toggles (Budget alerts, weekly summary, monthly report)

---

## 🛠️ Technology Stack

### Frontend (`/client`)
* **Core**: React.js 19, JavaScript (ES6+)
* **Build Tool**: Vite
* **Routing**: React Router DOM v7
* **Styling**: Tailwind CSS v4 (Light-mode fintech palette `#F8FAFC`, `#FFFFFF`, `#6366F1`)
* **Charts**: Recharts
* **Icons**: Lucide React
* **HTTP Client**: Axios with JWT Interceptors

### Backend (`/server`)
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB & Mongoose ORM
* **Auth & Security**: JSON Web Tokens (JWT), bcryptjs, CORS
* **Validation**: Express Validator & Mongoose Schema validations

---

## 📁 Project Structure

```
expense-tracker/
├── client/                      # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/      # Recharts visualization modules
│   │   │   ├── budgets/        # Budget cards & creation modals
│   │   │   ├── layout/         # Sidebar, Header, MobileNav & Layout wrappers
│   │   │   ├── transactions/   # Transaction tables, cards & filter toolbars
│   │   │   └── ui/             # Reusable Buttons, Inputs, Modals, Cards & Toasts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # JWT session context
│   │   │   └── ExpenseContext.jsx # Transactions & Budgets state context
│   │   ├── data/               # Categories metadata and empty-state defaults
│   │   ├── pages/              # Dashboard, Transactions, Budgets, Analytics, Settings
│   │   ├── services/           # Axios API layer (authService, transactionService, etc.)
│   │   ├── utils/              # Currency formatters & insights generator
│   │   ├── App.jsx             # React Router configuration
│   │   ├── main.jsx
│   │   └── index.css           # Global light-mode styling & scrollbars
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js Express REST API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose MongoDB connection
│   │   ├── controllers/        # Auth, Transaction, Budget, Analytics & User controllers
│   │   ├── middleware/         # authMiddleware (JWT protect) & errorMiddleware
│   │   ├── models/             # Mongoose User, Transaction & Budget models
│   │   ├── routes/             # Express API routes (/api/auth, /api/transactions, etc.)
│   │   ├── utils/              # generateToken.js & seedData.js
│   │   ├── app.js              # Express app setup & CORS configuration
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
│
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/expenseflow.git
cd expenseflow

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `.env` in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expenseflow
JWT_SECRET=expenseflow_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

*(Note: For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string `mongodb+srv://<username>:<password>@cluster.mongodb.net/expenseflow`)*

### 3. Start the Backend API Server

```bash
cd server
npm run dev
```

Server will run at: `http://localhost:5000`

### 4. Start the Frontend Application

In a new terminal window:

```bash
cd client
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🔑 Starting Fresh

The app now starts with empty transactions, budgets, and a blank account state so users can enter everything from scratch.

---

## 🔌 API Documentation Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/api/auth/me` | Get current user session | Yes |
| `GET` | `/api/transactions` | Get transactions (supports search/filters) | Yes |
| `POST` | `/api/transactions` | Create new income/expense entry | Yes |
| `PUT` | `/api/transactions/:id` | Update existing transaction | Yes |
| `DELETE` | `/api/transactions/:id` | Delete transaction | Yes |
| `GET` | `/api/budgets` | Fetch monthly category budgets | Yes |
| `POST` | `/api/budgets` | Set or update category budget | Yes |
| `DELETE` | `/api/budgets/:id` | Remove category budget | Yes |
| `GET` | `/api/analytics/summary` | Fetch totals & period comparisons | Yes |
| `GET` | `/api/analytics/monthly` | Fetch 6-month spending trends | Yes |

---

## 🔮 Future Enhancements

* Recurring transactions automation (monthly subscriptions)
* PDF/CSV financial report export
* Receipt OCR scan & auto-parsing
* Multi-user shared family budgets
