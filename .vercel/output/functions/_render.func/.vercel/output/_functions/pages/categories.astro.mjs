/* empty css                                      */
import { c as createComponent, g as renderComponent, e as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_C1URRwWy.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B8vtkh1r.mjs';
import { Pool } from '@neondatabase/serverless';
export { renderers } from '../renderers.mjs';

const $$Categories = createComponent(async ($$result, $$props, $$slots) => {
  const NEON_DB_URL = process.env.NEON_DB_URL;
  let categoryStats = [];
  try {
    if (NEON_DB_URL) {
      const pool = new Pool({ connectionString: NEON_DB_URL });
      categoryStats = (await pool.query(`
      SELECT
        category,
        COUNT(*) as count,
        ROUND(AVG(savings_percent)) as avg_savings,
        MODE() WITHIN GROUP (ORDER BY retailer_name) as top_retailer
      FROM product_deals
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `)).rows;
      await pool.end();
    }
  } catch (error) {
    console.error("Database error:", error);
  }
  const categories = [
    { slug: "power_tools", name: "Power Tools", icon: "\u{1F527}", description: "Drills, saws, sanders, grinders, and more" },
    { slug: "hand_tools", name: "Hand Tools", icon: "\u{1F6E0}\uFE0F", description: "Hammers, screwdrivers, pliers, wrenches" },
    { slug: "building_materials", name: "Building Materials", icon: "\u{1F9F1}", description: "Plasterboard, insulation, bricks, cement" },
    { slug: "plumbing", name: "Plumbing", icon: "\u{1F6BF}", description: "Pipes, fittings, valves, taps, showers" },
    { slug: "electrical", name: "Electrical", icon: "\u{1F4A1}", description: "Wire, cable, switches, sockets, lights" },
    { slug: "paint_decorating", name: "Paint & Decorating", icon: "\u{1F3A8}", description: "Paints, varnishes, wallpapers, brushes" },
    { slug: "garden_outdoor", name: "Garden & Outdoor", icon: "\u{1F33F}", description: "Fencing, patio, decking, plants" },
    { slug: "hardware", name: "Hardware", icon: "\u{1F529}", description: "Screws, bolts, hinges, handles, locks" }
  ];
  function getCategoryStats(slug) {
    return categoryStats.find((c) => c.category === slug);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Categories - Trade Deals UK" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-primary-700 py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-4xl font-bold text-white mb-4">Browse by Category</h1> <p class="text-primary-100 text-lg">Find deals across different trade categories</p> </div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ${categories.map((cat) => {
    const stats = getCategoryStats(cat.slug);
    return renderTemplate`<a${addAttribute(`/?category=${cat.slug}`, "href")} class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"> <div class="flex items-start justify-between mb-4"> <span class="text-4xl">${cat.icon}</span> ${stats && renderTemplate`<span class="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-medium"> ${stats.count} deals
</span>`} </div> <h2 class="text-xl font-bold text-gray-900 mb-2">${cat.name}</h2> <p class="text-gray-600 text-sm mb-4">${cat.description}</p> ${stats && stats.avgSavings && renderTemplate`<p class="text-sm text-gray-500">
Avg. savings: <span class="font-semibold text-deal-good">${stats.avgSavings}%</span> </p>`} </a>`;
  })} </div> </div> ` })}`;
}, "/home/user/projects/TradeDeals-UK/src/pages/categories.astro", void 0);

const $$file = "/home/user/projects/TradeDeals-UK/src/pages/categories.astro";
const $$url = "/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
