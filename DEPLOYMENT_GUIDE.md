# RedStone Admin Panel - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: Update Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your RedStoneAdmin project
3. Go to **Settings** → **Environment Variables**
4. Add/Update the following variables:

```env
REACT_APP_API_BASE_URL=https://redstonebackend.onrender.com/api
REACT_APP_BACKEND_URL=https://redstonebackend.onrender.com
REACT_APP_ENV=production
```

### Step 2: Redeploy

Option A: **Automatic Deployment**
- Push to GitHub (already done!)
- Vercel will automatically detect the changes and redeploy

Option B: **Manual Deployment**
- Go to Vercel Dashboard → Deployments
- Click "Redeploy" on the latest deployment

### Step 3: Verify

After deployment, test the admin panel:
1. Visit your admin panel URL (e.g., `https://redstoneadmin.vercel.app`)
2. Login with admin credentials
3. Check that data loads correctly from Render backend

## 📝 What Was Changed

### Files Updated:
1. `.env.production` - Changed backend URL from Vercel to Render
   ```diff
   - REACT_APP_API_BASE_URL=https://red-stone-backend.vercel.app/api
   + REACT_APP_API_BASE_URL=https://redstonebackend.onrender.com/api
   ```

### Files Using Environment Variable:
- `src/services/api.js` - Main API service (used by all components)
  ```javascript
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://redstonebackend.onrender.com/api';
  ```

## 🔧 Local Development

### Setup:
```bash
npm install
```

### Run Development Server:
```bash
npm start
```

The app will use the fallback URL: `https://redstonebackend.onrender.com/api`

### Build for Production:
```bash
npm run build
```

## 🌐 Backend Configuration

The admin panel connects to:
- **Production Backend:** https://redstonebackend.onrender.com
- **API Base URL:** https://redstonebackend.onrender.com/api

### Available Endpoints:
- `/api/auth/admin/login` - Admin authentication
- `/api/admin/stats` - Dashboard statistics
- `/api/admin/users` - User management
- `/api/admin/transactions` - Transaction management
- `/api/admin/payment/withdrawals` - Withdrawal management
- `/api/admin/settings` - System settings

## 🔐 Admin Credentials

Default admin account:
- **Email:** admin@redstone.com
- **Password:** adminajay
- **Username:** adminajay

(Update these in backend environment variables)

## 📊 Features

- ✅ Real-time dashboard statistics
- ✅ User management
- ✅ Transaction monitoring
- ✅ Withdrawal approval system
- ✅ System settings management
- ✅ Analytics and charts

## 🐛 Troubleshooting

### Issue: "Failed to fetch" errors
**Solution:** Check that Vercel environment variables are set correctly

### Issue: Login fails
**Solution:** Verify backend is running at https://redstonebackend.onrender.com

### Issue: Old data showing
**Solution:** Clear browser cache and hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## 📞 Support

For issues or questions:
- Check backend logs on Render
- Verify environment variables in Vercel
- Test API endpoints directly using curl or Postman

## ✅ Deployment Checklist

- [x] Updated `.env.production` with Render backend URL
- [x] Pushed changes to GitHub
- [ ] Updated Vercel environment variables
- [ ] Redeployed on Vercel
- [ ] Tested admin login
- [ ] Verified data loads correctly
- [ ] Checked all admin features work

---

**Last Updated:** March 6, 2026  
**Backend:** Render (https://redstonebackend.onrender.com)  
**Frontend:** Vercel (https://redstoneadmin.vercel.app)
