import { Pool } from '@neondatabase/serverless';
import Papa from 'papaparse';
import { parseStringPromise } from 'xml2js';
import fs from 'fs/promises';

// Configuration - hardcode API keys directly per CLAUDE.md instructions
const NEON_DB_URL = process.env.NEON_DB_URL;

interface Product {
  sku: string;
  product_name: string;
  retailer_name: string;
  retail_price: number;
  original_price?: number;
  savings_amount?: number;
  savings_percent?: number;
  image_url?: string;
  category?: string;
  promo_start?: Date;
  promo_end?: Date;
  affiliate_link?: string;
}

interface FeedConfig {
  url: string;
  retailer: string;
  format: 'csv' | 'xml';
  category_mapping?: Record<string, string>;
}

// Retailer configurations - replace with actual feed URLs
const FEEDS: FeedConfig[] = [
  // Add your affiliate feed URLs here
  // Example:
  // { url: 'https://example.com/feed/wicks.csv', retailer: 'Wickes', format: 'csv' },
  // { url: 'https://example.com/feed/toolstation.xml', retailer: 'Toolstation', format: 'xml' },
];

// Filter categories to focus on trade-relevant items
const ALLOWED_CATEGORIES = [
  'power_tools',
  'hand_tools',
  'building_materials',
  'plumbing',
  'electrical',
  'paint_decorating',
  'garden_outdoor',
  'hardware',
];

function calculateSavings(retailPrice: number, originalPrice?: number): { amount: number; percent: number } | null {
  if (!originalPrice || originalPrice <= retailPrice) return null;
  const amount = originalPrice - retailPrice;
  const percent = Math.round((amount / originalPrice) * 100);
  return { amount, percent };
}

function categorizeProduct(productName: string, retailer: string): string | undefined {
  const name = productName.toLowerCase();

  if (name.match(/drill|sander|circular saw|jigsaw|angle grinder|impact driver|multitool/)) {
    return 'power_tools';
  }
  if (name.match(/hammer|screwdriver|pliers|wrench|spanner|tape measure|level/)) {
    return 'hand_tools';
  }
  if (name.match(/plasterboard|insulation|bricks|blocks|cement|sand|aggregates/)) {
    return 'building_materials';
  }
  if (name.match(/pipe|fitting|valve|tap|shower|toilet|sink|bath/)) {
    return 'plumbing';
  }
  if (name.match(/wire|cable|switch|socket|light fitting|consumer unit/)) {
    return 'electrical';
  }
  if (name.match(/paint|varnish|stain|wallpaper|roller|brush/)) {
    return 'paint_decorating';
  }
  if (name.match(/fence|patio|decking|soil|compost|plants|tools/)) {
    return 'garden_outdoor';
  }
  if (name.match(/screw|bolt|nut|washer|hinge|handle|lock/)) {
    return 'hardware';
  }

  return undefined;
}

async function parseCSV(data: string, retailer: string): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const products = (results.data as any[])
          .map((row: any): Product | null => {
            const name = row.name || row.product_name || row.title || row.Product || '';
            const price = parseFloat(row.price || row.sale_price || row.Price || '0');
            const rrp = parseFloat(row.rrp || row.old_price || row.original_price || row.RRP || '0');
            const sku = row.sku || row.id || row.SKU || '';
            const image = row.image || row.image_url || row.image_url || row.ImageURL || '';
            const category = categorizeProduct(name, retailer);

            // Skip if no valid price or category
            if (!price || price <= 0) return null;
            if (!ALLOWED_CATEGORIES.includes(category || '')) return null;

            const savings = calculateSavings(price, rrp > 0 ? rrp : undefined);

            return {
              sku: String(sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
              product_name: name,
              retailer_name: retailer,
              retail_price: price,
              original_price: rrp > 0 ? rrp : undefined,
              savings_amount: savings?.amount,
              savings_percent: savings?.percent,
              image_url: image || undefined,
              category,
            };
          })
          .filter((p: Product | null): p is Product => p !== null);

        resolve(products);
      },
      error: (error: Error) => reject(error),
    });
  });
}

async function parseXML(data: string, retailer: string): Promise<Product[]> {
  try {
    const result = await parseStringPromise(data);
    const products: Product[] = [];

    // Try different XML structures
    const items = result?.products?.product || result?.feed?.product || result?.rss?.channel?.[0]?.item || [];

    for (const item of items) {
      const name = item.name?.[0] || item.title?.[0] || item.description?.[0] || '';
      const price = parseFloat(item.price?.[0] || item.sale_price?.[0] || '0');
      const rrp = parseFloat(item.rrp?.[0] || item.old_price?.[0] || '0');
      const sku = item.sku?.[0] || item.id?.[0] || '';
      const image = item.image?.[0] || item.image_url?.[0] || '';
      const category = categorizeProduct(name, retailer);

      if (!price || price <= 0) continue;
      if (!ALLOWED_CATEGORIES.includes(category || '')) continue;

      const savings = calculateSavings(price, rrp > 0 ? rrp : undefined);

      products.push({
        sku: String(sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
        product_name: name,
        retailer_name: retailer,
        retail_price: price,
        original_price: rrp > 0 ? rrp : undefined,
        savings_amount: savings?.amount,
        savings_percent: savings?.percent,
        image_url: image || undefined,
        category,
      });
    }

    return products;
  } catch (error) {
    console.error('XML parsing error:', error);
    return [];
  }
}

async function downloadFeed(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function syncFeed(feed: FeedConfig, pool: Pool): Promise<number> {
  console.log(`Syncing ${feed.retailer} feed...`);

  try {
    // Check if it's a local file for testing
    let data: string;
    if (feed.url.startsWith('http')) {
      data = await downloadFeed(feed.url);
    } else {
      data = await fs.readFile(feed.url, 'utf-8');
    }

    let products: Product[];
    if (feed.format === 'csv') {
      products = await parseCSV(data, feed.retailer);
    } else {
      products = await parseXML(data, feed.retailer);
    }

    console.log(`Found ${products.length} products from ${feed.retailer}`);

    // Upsert products to database
    let inserted = 0;
    for (const product of products) {
      await pool.query(
        `INSERT INTO product_deals
         (sku, product_name, retailer_name, retail_price, original_price, savings_amount, savings_percent, image_url, category, promo_start, promo_end, affiliate_link, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
         ON CONFLICT (sku, retailer_name) DO UPDATE SET
           retail_price = EXCLUDED.retail_price,
           original_price = EXCLUDED.original_price,
           savings_amount = EXCLUDED.savings_amount,
           savings_percent = EXCLUDED.savings_percent,
           image_url = EXCLUDED.image_url,
           category = EXCLUDED.category,
           updated_at = CURRENT_TIMESTAMP`,
        [
          product.sku,
          product.product_name,
          product.retailer_name,
          product.retail_price,
          product.original_price,
          product.savings_amount,
          product.savings_percent,
          product.image_url,
          product.category,
          product.promo_start,
          product.promo_end,
          product.affiliate_link,
        ]
      );
      inserted++;
    }

    console.log(`Synced ${inserted} products from ${feed.retailer}`);
    return inserted;
  } catch (error) {
    console.error(`Error syncing ${feed.retailer}:`, error);
    return 0;
  }
}

async function cleanupExpiredDeals(pool: Pool): Promise<void> {
  console.log('Cleaning up expired deals...');
  const result = await pool.query(
    `DELETE FROM product_deals WHERE promo_end < CURRENT_TIMESTAMP AND promo_end IS NOT NULL`
  );
  console.log(`Removed ${result.rowCount} expired deals`);
}

async function syncFeeds(): Promise<void> {
  if (!NEON_DB_URL) {
    console.error('NEON_DB_URL not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: NEON_DB_URL });

  try {
    console.log('Starting feed sync...');

    let totalSynced = 0;
    for (const feed of FEEDS) {
      const count = await syncFeed(feed, pool);
      totalSynced += count;
    }

    await cleanupExpiredDeals(pool);

    console.log(`\nSync complete! Total products synced: ${totalSynced}`);
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

syncFeeds();
