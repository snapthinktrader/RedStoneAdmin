# RedStone - Crypto Growth Platform

A complete React-based platform with public landing page and admin panel for the RedStone crypto growth system.

## Features

### **Public Landing Page**
- **Homepage**: Marketing landing page with app download links
- **App Download**: Android APK and iOS App Store download buttons
- **Feature Showcase**: Highlighting 2% daily returns and referral system
- **How It Works**: 3-step onboarding process
- **Admin Login**: Direct access to admin panel

### **Admin Panel**
- **Dashboard**: Overview with KPI cards, charts, and recent activity
- **User Management**: View, filter, and manage user accounts
- **Withdrawal Management**: Review and process withdrawal requests
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Lucide React icons

## Routes

### Public Routes
- `/` - Homepage (landing page)
- `/login` - Admin login with 2FA

### Admin Routes (Protected)
- `/admin/dashboard` - Main dashboard with analytics
- `/admin/users` - User management interface
- `/admin/withdrawals` - Withdrawal processing
- `/admin/transactions` - Transaction history (planned)
- `/admin/settings` - System settings (planned)

## Components

### Public Components
- `Homepage.js` - Landing page with app download and features
- `Login.js` - Admin authentication with 2FA

### Admin Components
- `Dashboard.js` - Main dashboard with analytics
- `UserManagement.js` - User listing and detailed view
- `WithdrawalManagement.js` - Withdrawal request processing

### Supporting Components
- `Layout.js` - Admin layout wrapper
- `Sidebar.js` - Admin navigation sidebar
- `Header.js` - Admin page header with notifications
- `KPICard.js` - Key performance indicator cards
- `RecentActivity.js` - Recent activity feed
- `Charts.js` - Chart components using Chart.js

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Technology Stack

- **React 18** - Frontend framework
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Chart.js & React-Chartjs-2** - Data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client

## Design Features

- **Crimson Theme**: Custom color scheme matching the brand
- **Collapsible Sidebar**: Space-efficient navigation
- **Modal Dialogs**: For detailed views and confirmations
- **Interactive Charts**: User growth, financial flow, and distribution charts
- **Responsive Tables**: With pagination and filtering
- **Real-time Updates**: Activity feed and notifications

## File Structure

```
src/
├── components/
│   ├── Login.js
│   ├── Layout.js
│   ├── Sidebar.js
│   ├── Header.js
│   ├── Dashboard.js
│   ├── UserManagement.js
│   ├── WithdrawalManagement.js
│   ├── KPICard.js
│   ├── RecentActivity.js
│   └── Charts.js
├── App.js
├── index.js
└── index.css
```