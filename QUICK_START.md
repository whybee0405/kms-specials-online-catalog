# KMS Specials - Quick Start Guide

🚀 **Production-ready web application for Korean Motor Spares** - Complete searchable specials catalog with admin panel.

## ✅ Features Complete

- ✅ **Mobile-First Responsive Design** - Works on all devices
- ✅ **Advanced Search & Filtering** - Real-time search with categories
- ✅ **Excel/CSV Import/Export** - Full data management
- ✅ **Admin Panel** - Secure `/admin` interface
- ✅ **Sample Data** - 12 realistic Korean car parts included
- ✅ **Production Ready** - Built and tested

## 🏁 Quick Start

### 1. Set Environment Variables
```bash
# Copy and edit environment file
cp .env.example .env.local

# Edit .env.local and set:
ADMIN_TOKEN=your-secure-admin-password-here
```

### 2. Run Development Server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the specials catalog.

### 3. Access Admin Panel
- Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
- Enter your `ADMIN_TOKEN` to access admin features
- Import/Export Excel files, manage data

## 📊 Sample Data Included

The app comes with 12 sample Korean car parts:
- Hyundai Elantra brake pads - $64.49 (was $85.99)
- Kia Sorento air filter - $24.71 (was $32.95)
- Genesis G70 shock absorber - $183.75 (was $245.00)
- And 9 more realistic specials with proper part numbers

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)
1. Push to GitHub/GitLab
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variable: `ADMIN_TOKEN=your-secure-token`
4. Deploy automatically

### Option 2: Any Node.js Host
```bash
npm run build
npm start
# Ensure data/ directory is writable
```

## 📁 Data Management

**JSON Mode (Default)**: Stores data in `data/specials.json` - perfect for small/medium catalogs

**Import Process**: 
1. Go to `/admin`
2. Upload Excel/CSV with columns: systemNumber, description, partNumber, category, manufacturer, regularPrice, specialPrice
3. Choose "Append" (update existing) or "Replace All" (fresh start)

## 🔧 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Modern styling
- **shadcn/ui** - Beautiful UI components
- **TanStack Table** - Advanced data grid
- **Zod** - Data validation
- **SheetJS** - Excel file processing

## 📱 Mobile Support

- Responsive card layout on mobile
- Touch-friendly interface
- Optimized for all screen sizes
- Fast loading and smooth scrolling

---

**🎯 Ready for production!** Your Korean Motor Spares specials catalog is complete and ready to deploy.