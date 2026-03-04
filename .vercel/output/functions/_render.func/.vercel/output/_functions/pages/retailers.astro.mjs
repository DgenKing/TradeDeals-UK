/* empty css                                      */
import { c as createComponent, g as renderComponent, e as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_C1URRwWy.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B8vtkh1r.mjs';
import { Pool } from '@neondatabase/serverless';
export { renderers } from '../renderers.mjs';

const $$Retailers = createComponent(async ($$result, $$props, $$slots) => {
  const NEON_DB_URL = process.env.NEON_DB_URL;
  let retailerStats = [];
  try {
    if (NEON_DB_URL) {
      const pool = new Pool({ connectionString: NEON_DB_URL });
      retailerStats = (await pool.query(`
      SELECT
        retailer_name,
        COUNT(*) as count,
        ROUND(AVG(savings_percent)) as avg_savings
      FROM product_deals
      WHERE retailer_name IS NOT NULL
      GROUP BY retailer_name
      ORDER BY count DESC
    `)).rows;
      await pool.end();
    }
  } catch (error) {
    console.error("Database error:", error);
  }
  const retailers = [
    { name: "Wickes", slug: "wickes", logo: "W", color: "bg-orange-500", description: "Building materials, tools, and home improvement" },
    { name: "Toolstation", slug: "toolstation", logo: "T", color: "bg-blue-600", description: "Tools, hardware, and building supplies" },
    { name: "B&Q TradePoint", slug: "bq_tradepoint", logo: "B&Q", color: "bg-yellow-500", description: "Trade counter and bulk orders" },
    { name: "Travis Perkins", slug: "travis_perkins", logo: "TP", color: "bg-red-600", description: "Professional building materials" },
    { name: "Jewsons", slug: "jewsons", logo: "J", color: "bg-blue-800", description: "Building and timber merchants" },
    { name: "City Plumbing", slug: "city_plumbing", logo: "CP", color: "bg-cyan-600", description: "Plumbing and heating supplies" },
    { name: "Homebase Trade", slug: "homebase_trade", logo: "HB", color: "bg-red-500", description: "Trade and professional range" },
    { name: "Screwfix", slug: "screwfix", logo: "S", color: "bg-yellow-600", description: "Tools and hardware specialist" }
  ];
  function getRetailerStats(name) {
    return retailerStats.find((r) => r.retailer_name === name);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Retailers - Trade Deals UK" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-primary-700 py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-4xl font-bold text-white mb-4">Browse by Retailer</h1> <p class="text-primary-100 text-lg">Find deals from top UK trade retailers</p> </div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ${retailers.map((retailer) => {
    const stats = getRetailerStats(retailer.name);
    return renderTemplate`<a${addAttribute(`/?retailer=${encodeURIComponent(retailer.name)}`, "href")} class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"> <div class="flex items-center gap-4 mb-4"> <div${addAttribute(`${retailer.color} text-white rounded-lg w-14 h-14 flex items-center justify-center font-bold text-lg`, "class")}> ${retailer.logo} </div> ${stats && renderTemplate`<span class="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-medium"> ${stats.count} deals
</span>`} </div> <h2 class="text-xl font-bold text-gray-900 mb-2">${retailer.name}</h2> <p class="text-gray-600 text-sm mb-4">${retailer.description}</p> ${stats && stats.avgSavings && renderTemplate`<p class="text-sm text-gray-500">
Avg. savings: <span class="font-semibold text-deal-good">${stats.avgSavings}%</span> </p>`} </a>`;
  })} </div> </div> ` })}`;
}, "/home/user/projects/TradeDeals-UK/src/pages/retailers.astro", void 0);

const $$file = "/home/user/projects/TradeDeals-UK/src/pages/retailers.astro";
const $$url = "/retailers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Retailers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
