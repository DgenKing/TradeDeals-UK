# Trade Deals UK

A UK Trade Deals & Price Comparison Engine focusing on promotions and discounts for building materials, tools, and hardware from top UK retailers.

## Features

- **Daily Deal Sync** - Automated feed syncing from affiliate networks (Awin, Impact)
- **Search & Filter** - Find deals by product name, category, or retailer
- **Savings Tracking** - Automatic calculation of discount percentages and amounts
- **Category Browsing** - Browse deals by category (Power Tools, Building Materials, etc.)
- **Retailer Directory** - View deals from specific retailers

## Tech Stack

- **Database**: Neon (Serverless PostgreSQL)
- **Backend**: TypeScript/Node.js with GitHub Actions
- **Frontend**: Astro + TypeScript + Tailwind CSS
- **Hosting**: Vercel (free tier)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon)
- Affiliate network accounts (Awin, Impact)

### Setup

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   - Create a Neon project at https://neon.tech
   - Run the SQL schema from `database/schema.sql` in the Neon console

4. **Configure environment**
   - Add your `NEON_DB_URL` to your environment
   - Update feed URLs in `src/sync.ts`

5. **Build and run**
   ```bash
   npm run build
   npm run dev
   ```

### Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add `NEON_DB_URL` environment variable in Vercel
4. Deploy!

## Project Structure

```
├── database/
│   └── schema.sql         # Database schema
├── src/
│   ├── sync.ts            # Feed sync script
│   ├── layouts/
│   │   └── Layout.astro   # Main layout
│   └── pages/
│       ├── index.astro    # Home/search page
│       ├── categories.astro
│       └── retailers.astro
├── .github/
│   └── workflows/
│       └── sync.yml       # Daily sync workflow
├── package.json
├── astro.config.mjs
└── tailwind.config.mjs
```

## License

MIT
