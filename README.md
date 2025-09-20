# KMS Specials Webpage

A modern, production-ready web application for **Korean Motor Spares** to publish and manage a searchable, filterable specials list. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📱 **Mobile-First Responsive Design** - Optimized for all devices
- 🔍 **Advanced Search & Filtering** - Real-time search with category and pricing filters
- 📊 **Data Management** - Excel/CSV import/export with validation
- 🎨 **Modern UI** - Clean, professional design with shadcn/ui components
- ⚡ **Performance Optimized** - Fast loading with Next.js 14 App Router
- 🔒 **Admin Panel** - Secure data management interface
- 📈 **Data Validation** - Zod schema validation for data integrity

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Grid**: TanStack Table
- **Data Storage**: JSON-based repository (SQLite ready)
- **File Processing**: SheetJS (xlsx)
- **Validation**: Zod schemas
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd kms-specials-webpage
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and configure:
   ```env
   # Admin token for administrative functions
   ADMIN_TOKEN=your-secure-admin-token
   
   # Optional: Database configuration
   DATABASE_URL="file:./specials.db"
   ```

3. **Initialize data directory**:
   ```bash
   mkdir -p data
   echo '[]' > data/specials.json
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   └── page.tsx           # Main specials page
├── components/
│   ├── ui/                # shadcn/ui components
│   └── specials/          # Custom components
├── lib/
│   ├── data/              # Data access layer
│   ├── types/             # Type definitions
│   ├── validations/       # Zod schemas
│   └── utils.ts           # Utility functions
└── hooks/                 # Custom React hooks
```

## API Endpoints

### Public Endpoints
- `GET /api/specials` - Retrieve specials with filtering and pagination
- `GET /api/health` - Health check endpoint

### Admin Endpoints (require `x-admin-token` header)
- `POST /api/admin/import` - Import Excel/CSV data
- `GET /api/admin/export` - Export data to Excel/CSV
- `POST /api/admin/delete-all` - Delete all specials data

## Data Management

### Import Data

1. Navigate to `/admin`
2. Enter your admin token
3. Choose import mode:
   - **Append/Update**: Add new records, update existing by system number
   - **Replace All**: Delete existing data and replace with uploaded data
4. Select Excel (.xlsx, .xls) or CSV file
5. Click upload

### Expected Data Format

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| systemNumber | string | Yes | Unique identifier |
| description | string | Yes | Part description |
| partNumber | string | Yes | Manufacturer part number |
| category | string | Yes | Product category |
| manufacturer | string | Yes | Brand/manufacturer |
| regularPrice | number | Yes | Original price |
| specialPrice | number | Yes | Discounted price |
| savings | number | No | Auto-calculated if empty |
| availableQuantity | number | No | Stock quantity |
| validUntil | date | No | Offer expiry date |

### Export Data

1. Go to admin panel
2. Click "Export Excel" or "Export CSV"
3. File downloads automatically with timestamp

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   ADMIN_TOKEN=your-secure-admin-token
   ```
3. **Deploy** - Automatic deployments on git push

### Other Platforms

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Ensure data directory exists** and is writable:
   ```bash
   mkdir -p data
   chmod 755 data
   ```

## Configuration

### Environment Variables

- `ADMIN_TOKEN` - Secure token for admin access (required)
- `DATABASE_URL` - Database connection (optional, uses JSON if not set)
- `NODE_ENV` - Environment mode (development/production)

### Customization

#### Branding
- Update `src/app/layout.tsx` for title and metadata
- Modify logo and colors in `src/app/page.tsx`
- Adjust theme in `tailwind.config.js`

#### Data Schema
- Extend `src/lib/types/special.ts` for new fields
- Update `src/lib/validations/special.ts` for validation
- Modify table columns in `src/app/page.tsx`

## Development

### Code Structure
- **Repository Pattern**: `src/lib/data/repository/` abstracts data access
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Component Architecture**: Reusable UI components with proper separation

### Adding Features

1. **New API endpoint**: Add to `src/app/api/`
2. **New component**: Add to `src/components/`
3. **New data field**: Update types, validation, and components
4. **New page**: Add to `src/app/`

### Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## Data Storage

### JSON Mode (Default)
- Stores data in `data/specials.json`
- No external dependencies
- Perfect for small to medium datasets
- Automatic backups on import

### SQLite Mode (Optional)
- Enable by setting `DATABASE_URL="file:./specials.db"`
- Better performance for large datasets
- Requires SQLite installation
- Full ACID compliance

## Security

- **Admin Authentication**: Token-based admin access
- **Input Validation**: All inputs validated with Zod schemas
- **File Upload Security**: Validates file types and content
- **Error Handling**: Secure error messages without data leakage

## Performance

- **Optimized Bundle**: Next.js 14 with automatic code splitting
- **Responsive Images**: Optimized for all device sizes
- **Caching**: API responses cached for performance
- **Pagination**: Efficient data loading for large datasets

## Troubleshooting

### Common Issues

1. **Admin panel not accessible**
   - Verify `ADMIN_TOKEN` is set correctly
   - Check browser console for errors

2. **Import fails**
   - Ensure file format is Excel or CSV
   - Verify all required columns are present
   - Check data validation errors in response

3. **Data not persisting**
   - Ensure `data/` directory exists and is writable
   - Check file permissions
   - Verify `ADMIN_TOKEN` environment variable

4. **Build errors**
   - Run `npm install` to ensure dependencies
   - Check TypeScript errors with `npm run type-check`
   - Verify all environment variables are set

### Support

For technical support or feature requests, please create an issue in the repository with:
- Description of the problem
- Steps to reproduce
- Error messages (if any)
- Environment details (OS, Node.js version, browser)

## License

This project is private and proprietary to Korean Motor Spares.

---

**Built with ❤️ for Korean Motor Spares**