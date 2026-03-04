/* empty css                                      */
import { c as createComponent, g as renderComponent, e as renderTemplate, f as createAstro, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_C1URRwWy.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B8vtkh1r.mjs';
import { Pool } from '@neondatabase/serverless';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const NEON_DB_URL = process.env.NEON_DB_URL;
  const searchQuery = Astro2.url.searchParams.get("q") || "";
  const category = Astro2.url.searchParams.get("category") || "";
  const retailer = Astro2.url.searchParams.get("retailer") || "";
  const sort = Astro2.url.searchParams.get("sort") || "savings_percent";
  const minSavings = Astro2.url.searchParams.get("minSavings") || "0";
  let query = "SELECT * FROM product_deals WHERE 1=1";
  const params = [];
  let paramIndex = 1;
  if (searchQuery) {
    query += ` AND (product_name ILIKE $${paramIndex} OR category ILIKE $${paramIndex})`;
    params.push(`%${searchQuery}%`);
    paramIndex++;
  }
  if (category) {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }
  if (retailer) {
    query += ` AND retailer_name = $${paramIndex}`;
    params.push(retailer);
    paramIndex++;
  }
  if (parseInt(minSavings) > 0) {
    query += ` AND savings_percent >= $${paramIndex}`;
    params.push(parseInt(minSavings));
    paramIndex++;
  }
  const sortOptions = {
    savings_percent: "savings_percent DESC NULLS LAST",
    retail_price: "retail_price ASC",
    retail_price_desc: "retail_price DESC",
    product_name: "product_name ASC",
    updated_at: "updated_at DESC"
  };
  query += ` ORDER BY ${sortOptions[sort] || sortOptions.savings_percent} LIMIT 100`;
  let deals = [];
  let categories = [];
  let retailers = [];
  try {
    if (NEON_DB_URL) {
      const pool = new Pool({ connectionString: NEON_DB_URL });
      deals = (await pool.query(query, params)).rows;
      categories = (await pool.query("SELECT DISTINCT category FROM product_deals WHERE category IS NOT NULL ORDER BY category")).rows;
      retailers = (await pool.query("SELECT DISTINCT retailer_name FROM product_deals ORDER BY retailer_name")).rows;
      await pool.end();
    }
  } catch (error) {
    console.error("Database error:", error);
  }
  function getSavingsClass(percent) {
    if (!percent) return "text-gray-500";
    if (percent >= 30) return "text-deal-hot font-bold";
    if (percent >= 20) return "text-deal-good font-semibold";
    if (percent >= 10) return "text-deal-ok";
    return "text-gray-600";
  }
  function formatCategory(slug) {
    if (!slug) return "";
    return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Trade Deals UK - Find the Best Discounts on Building Materials & Tools" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-primary-700 py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-4xl font-bold text-white mb-4">Trade Deals UK</h1> <p class="text-primary-100 text-lg mb-8">Find the best discounts on building materials, power tools, and hardware</p> <!-- Search Form --> <form action="/" method="get" class="bg-white rounded-lg shadow-lg p-4"> <div class="grid grid-cols-1 md:grid-cols-5 gap-4"> <div class="md:col-span-2"> <input type="text" name="q"${addAttribute(searchQuery, "value")} placeholder="Search products..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"> </div> <div> <select name="category" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"> <option value="">All Categories</option> ${categories.map((cat) => renderTemplate`<option${addAttribute(cat.category, "value")}${addAttribute(cat.category === category, "selected")}>${formatCategory(cat.category)}</option>`)} </select> </div> <div> <select name="retailer" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"> <option value="">All Retailers</option> ${retailers.map((r) => renderTemplate`<option${addAttribute(r.retailer_name, "value")}${addAttribute(r.retailer_name === retailer, "selected")}>${r.retailer_name}</option>`)} </select> </div> <div> <select name="sort" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"> <option value="savings_percent"${addAttribute(sort === "savings_percent", "selected")}>Best Savings</option> <option value="retail_price"${addAttribute(sort === "retail_price", "selected")}>Price: Low to High</option> <option value="retail_price_desc"${addAttribute(sort === "retail_price_desc", "selected")}>Price: High to Low</option> <option value="product_name"${addAttribute(sort === "product_name", "selected")}>Name A-Z</option> <option value="updated_at"${addAttribute(sort === "updated_at", "selected")}>Recently Updated</option> </select> </div> </div> <div class="mt-4 flex items-center gap-4"> <label class="flex items-center gap-2"> <span class="text-sm text-gray-600">Min savings:</span> <select name="minSavings" class="px-3 py-2 border border-gray-300 rounded-lg"> <option value="0"${addAttribute(minSavings === "0", "selected")}>Any</option> <option value="10"${addAttribute(minSavings === "10", "selected")}>10%+</option> <option value="20"${addAttribute(minSavings === "20", "selected")}>20%+</option> <option value="30"${addAttribute(minSavings === "30", "selected")}>30%+</option> <option value="50"${addAttribute(minSavings === "50", "selected")}>50%+</option> </select> </label> <button type="submit" class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold">
Search Deals
</button> </div> </form> </div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Results Count --> <div class="flex justify-between items-center mb-6"> <p class="text-gray-600"> ${deals.length} ${deals.length === 1 ? "deal" : "deals"} found
${searchQuery && renderTemplate`<span class="font-semibold"> for "${searchQuery}"</span>`} </p> </div> <!-- Demo Message if no DB --> ${!NEON_DB_URL && renderTemplate`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"> <h3 class="text-yellow-800 font-semibold mb-2">Demo Mode</h3> <p class="text-yellow-700">Connect a Neon database to see live deals. Add your <code class="bg-yellow-100 px-2 py-1 rounded">NEON_DB_URL</code> environment variable to get started.</p> </div>`} <!-- Sample Deals Grid (demo data) --> ${deals.length === 0 && NEON_DB_URL && renderTemplate`<div class="text-center py-12"> <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <h3 class="text-xl font-semibold text-gray-600 mb-2">No deals found</h3> <p class="text-gray-500">Try adjusting your search or filters</p> </div>`} <!-- Deals Grid --> ${deals.length > 0 && renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ${deals.map((deal) => renderTemplate`<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"> <div class="relative"> ${deal.image_url ? renderTemplate`<img${addAttribute(deal.image_url, "src")}${addAttribute(deal.product_name, "alt")} class="w-full h-48 object-cover" loading="lazy">` : renderTemplate`<div class="w-full h-48 bg-gray-200 flex items-center justify-center"> <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div>`} ${deal.savings_percent && deal.savings_percent >= 20 && renderTemplate`<div class="absolute top-2 right-2 bg-deal-hot text-white px-2 py-1 rounded-full text-sm font-bold"> ${deal.savings_percent}% OFF
</div>`} </div> <div class="p-4"> <p class="text-xs text-gray-500 mb-1">${deal.retailer_name}</p> <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${deal.product_name}</h3> <div class="flex items-baseline gap-2 mb-2"> <span class="text-xl font-bold text-primary-600">£${deal.retail_price.toFixed(2)}</span> ${deal.original_price && renderTemplate`<span class="text-sm text-gray-400 line-through">£${deal.original_price.toFixed(2)}</span>`} </div> ${deal.savings_amount && renderTemplate`<p${addAttribute(`text-sm ${getSavingsClass(deal.savings_percent)}`, "class")}>
Save £${deal.savings_amount.toFixed(2)} (${deal.savings_percent}% off)
</p>`} <div class="mt-3 flex items-center justify-between"> <span class="text-xs text-gray-500">${formatCategory(deal.category)}</span> ${deal.affiliate_link ? renderTemplate`<a${addAttribute(deal.affiliate_link, "href")} target="_blank" rel="nofollow" class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700">
View Deal
</a>` : renderTemplate`<span class="text-xs text-gray-400">Link coming soon</span>`} </div> </div> </div>`)} </div>`} </div> ` })}`;
}, "/home/user/projects/TradeDeals-UK/src/pages/index.astro", void 0);

const $$file = "/home/user/projects/TradeDeals-UK/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
