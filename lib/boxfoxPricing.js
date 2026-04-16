/**
 * BoxFox Real Pricing Engine
 * ──────────────────────────
 * Exact replication of the Google Sheets Main tab formulas
 * from BoxFox_price_analyses- repository.
 *
 * Source: BoxFox_price_analyses-/dashboard/src/engine/pricing.js
 * Verified against: Bakery > Brownie 1, qty=10, SBS ITC 280GSM → ₹648.32/unit ✓
 */

// ─── PRINTING LOOKUP TABLE ─────────────────────────────────────────────────────
// Maps sheetQty ranges → printing cost per machine type
const PRINTING_TABLE = [
  { from: 1,     p1926: 300,  p2029: 750,  p2840: 0 },
  { from: 1081,  p1926: 425,  p2029: 750,  p2840: 0 },
  { from: 2081,  p1926: 550,  p2029: 750,  p2840: 0 },
  { from: 3081,  p1926: 675,  p2029: 925,  p2840: 0 },
  { from: 4081,  p1926: 800,  p2029: 875,  p2840: 0 },
  { from: 5081,  p1926: 925,  p2029: 1050, p2840: 0 },
  { from: 6081,  p1926: 1050, p2029: 1225, p2840: 0 },
  { from: 7081,  p1926: 1175, p2029: 1400, p2840: 0 },
  { from: 8081,  p1926: 1300, p2029: 1575, p2840: 0 },
  { from: 9081,  p1926: 1425, p2029: 1750, p2840: 0 },
  { from: 10081, p1926: 1550, p2029: 1925, p2840: 0 },
  { from: 11081, p1926: 1675, p2029: 2100, p2840: 0 },
  { from: 12081, p1926: 1800, p2029: 2275, p2840: 0 },
  { from: 13081, p1926: 1925, p2029: 2450, p2840: 0 },
  { from: 14081, p1926: 2050, p2029: 2625, p2840: 0 },
  { from: 15081, p1926: 2175, p2029: 2800, p2840: 0 },
  { from: 16081, p1926: 2300, p2029: 2975, p2840: 0 },
  { from: 17081, p1926: 2425, p2029: 3150, p2840: 0 },
  { from: 18081, p1926: 2550, p2029: 3325, p2840: 0 },
  { from: 19081, p1926: 2675, p2029: 3500, p2840: 0 },
  { from: 20081, p1926: 2800, p2029: 3675, p2840: 0 },
  { from: 25081, p1926: 3300, p2029: 4375, p2840: 0 },
  { from: 30081, p1926: 3800, p2029: 5075, p2840: 0 },
];

// ─── PLATE PRICES (one-time per colour per machine) ────────────────────────────
const PLATE_PRICE = { 1926: 250, 2029: 275, 2840: 650 };

// ─── MATERIAL RATES (₹ per 1000 sheets — CC5) ──────────────────────────────────
export const MATERIAL_RATES = {
  'SBS':          { 'ITC': 85, 'Century': 80, 'Normal': 82, 'Custom': 82 },
  'WhiteBack':    { 'Khanna': 78, 'Sinar Mas': 55, 'Normal': 52, 'Custom': 52 },
  'GreyBack':     { 'Khanna': 70, 'Sinar Mas': 50, 'Normal': 47, 'Custom': 47 },
  'Art Card':     { 'Normal': 115, 'Custom': 115 },
  'Maplitho':     { 'Normal': 78, 'Custom': 78 },
  'Duplex':       { 'Custom': 75 },
  'Other Type':   { 'Custom': 75 },
  'Custom Paper':  { 'Custom': 75 },
};

// ─── LAMINATION RATES (per sq cm per sheet) ────────────────────────────────────
export const LAM_RATES = {
  'Plain':                   0,
  'Lamination Thermal':      0.008,
  'Lamination Normal Gloss': 0.0033,
  'Lamination Normal Matt':  0.0044,
  'Varnish':                 0.0014,
  'UV Flat':                 0.0025,
  'UV Hybrid':               0.0045,
  'UV Crystal':              0.0055,
  'Spot UV':                 1,
};

// ─── COLOUR FACTORS ────────────────────────────────────────────────────────────
export const COLOUR_FACTORS = {
  'Without Print':      0,
  'Single Colour':      1,
  'Double Colour':      2,
  'Four Colour':        4,
  'Four + One Colour':  6.75,
  'Four + Two Colour':  7.75,
  'Four + Four Colour': 9.75,
};

// ─── MARKUP TYPES ──────────────────────────────────────────────────────────────
export const MARKUP_TYPES = {
  'Retail':    0.16,
  'Corporate': 0.28,
  'Special':   0.12,
  'None':      0,
};

// ─── ADD-ON OPTIONS ────────────────────────────────────────────────────────────
export const ADDON_OPTIONS = {
  'Plain':                   { type: 'lam',     rate: 0 },
  'Lamination Thermal':      { type: 'lam',     rate: 0.008 },
  'Lamination Normal Gloss': { type: 'lam',     rate: 0.0033 },
  'Lamination Normal Matt':  { type: 'lam',     rate: 0.0044 },
  'Varnish':                 { type: 'lam',     rate: 0.0014 },
  'UV Flat':                 { type: 'lam',     rate: 0.0025 },
  'UV Hybrid':               { type: 'lam',     rate: 0.0045 },
  'UV Crystal':              { type: 'lam',     rate: 0.0055 },
  'Spot UV':                 { type: 'lam',     rate: 1 },
  'Carry Bag Single Pasting': { type: 'carry',  rate: 5 },
  'Carry Bag Double Pasting': { type: 'carry',  rate: 6 },
  'Gumming Full':            { type: 'gumming', rate: 0.0125 },
  'Gumming Top Bottom':      { type: 'gumming', rate: 0.017 },
};

// ─── EXPORTED OPTION LISTS ─────────────────────────────────────────────────────
export const MATERIALS   = Object.keys(MATERIAL_RATES);
export const LAMINATIONS = Object.keys(LAM_RATES);
export const ADDONS      = Object.keys(ADDON_OPTIONS);
export const PRINT_TYPES = Object.keys(COLOUR_FACTORS);
export const GSM_OPTIONS = ['230', '250', '280', '300', '330', '350', '400'];

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

const ru = (x) => Math.ceil(x);

function lookupPrinting(sheetQty, machine) {
  let printVal = 0;
  const key = machine === 2029 ? 'p2029' : machine === 2840 ? 'p2840' : 'p1926';
  for (const row of PRINTING_TABLE) {
    if (sheetQty >= row.from) { printVal = row[key] ?? 0; }
    else break;
  }
  return printVal;
}

function getCC5(material, brand, customRate) {
  if (['Duplex', 'Other Type', 'Custom Paper'].includes(material)) return customRate ?? 75;
  return MATERIAL_RATES[material]?.[brand] ?? 82;
}

function calcPaper(W, H, sheetQty, gsm, cc5) {
  return ru(((W * H) / 1550) * (gsm / 1000) * (cc5 + 2) * sheetQty + (sheetQty / 144) * 15);
}

function calcLam(W, H, sheetQty, qty, lamType) {
  const rate = LAM_RATES[lamType] ?? 0;
  if (!lamType || lamType === 'Plain' || rate === 0) return 0;

  const thermal  = LAM_RATES['Lamination Thermal'];

  if (lamType === 'UV Flat') {
    return Math.max((W * H * 0.0025 * sheetQty) / qty + 350 / qty, 500 / qty);
  }
  if (lamType === 'UV Hybrid') {
    return Math.max((W * H * 0.0045 * sheetQty) / qty + 350 / qty, 2500 / qty);
  }
  if (lamType === 'UV Crystal') {
    const base = Math.max((W * H * 0.0055 * sheetQty) / qty + 350 / qty, 2500 / qty);
    const th   = Math.max((W * H * thermal * sheetQty) / qty, 300 / qty);
    return base + th;
  }
  return Math.max((W * H * rate * sheetQty) / qty, 300 / qty);
}

// ─── MAIN CALCULATOR ──────────────────────────────────────────────────────────

/**
 * Calculate accurate BoxFox pricing using the real Google Sheets formulas.
 *
 * @param {Object} params
 * @param {Object} params.spec       - Box specification (ups, machine, sheetW, sheetH, etc.)
 * @param {number} params.qty        - Order quantity
 * @param {number} params.gsm        - Paper weight (e.g. 280)
 * @param {string} params.material   - Material type ('SBS', 'WhiteBack', etc.)
 * @param {string} params.brand      - Material brand ('ITC', 'Normal', etc.)
 * @param {number} params.customRate - Custom material rate (for Duplex/Custom Paper)
 * @param {string} params.colours    - Print colour type ('Four Colour', etc.)
 * @param {string} params.lamination - Lamination type
 * @param {string} params.addon      - Add-on type ('Plain', 'Gumming Full', etc.)
 * @param {boolean} params.dieCutting - Whether die cutting is applied
 * @param {string} params.markupType - Sale type ('Retail', 'Corporate', 'Special', 'None')
 * @param {string} params.sides      - 'One' or 'Two'
 *
 * @returns {Object} Full price breakdown
 */
export function calculateBoxPrice({
  spec,
  qty,
  gsm = 300,
  material = 'SBS',
  brand = 'Normal',
  customRate = 75,
  colours = 'Four Colour',
  lamination = 'Plain',
  addon = 'Plain',
  dieCutting = true,
  markupType = 'Retail',
  sides = 'One',
}) {
  // Resolve spec properties with safe defaults
  const ups     = Math.max(parseFloat(spec?.ups)       || 1, 0.5);
  const machine = parseInt(spec?.machine)              || 2029;
  const W       = parseFloat(spec?.sheetW)             || 20;
  const H       = parseFloat(spec?.sheetH)             || 29;
  const design  = parseFloat(spec?.designing)          || 100;
  const pasting = parseFloat(spec?.pasting)            || 0;
  const leafing = parseFloat(spec?.leafing)            || 0;
  const window_ = parseFloat(spec?.window)             || 0;
  const dblChg  = parseFloat(spec?.double_charges)     || 1;

  const cc5 = getCC5(material, brand, customRate);

  // Step 1: Sheet Quantity = ceil(qty / ups) + 80 wastage
  const sheetQty = Math.ceil(qty / ups) + 80;

  // Step 2: Printing Cost (X2) = lookup(sheetQty) × colourFactor + platePrice × colourFactor
  const rawPrint  = lookupPrinting(sheetQty, machine);
  const cf        = COLOUR_FACTORS[colours] ?? 4;
  const plateCost = (PLATE_PRICE[machine] ?? 275) * cf;
  const X2        = ru(rawPrint * cf) + plateCost;

  // Step 3: Die Rate (Z2)
  const dieRatePerSheet = sheetQty <= 5080 ? 0.25 : 0.20;
  const Z2 = dieCutting ? dieRatePerSheet : 0;

  // Step 4: Fixed Charges (AE2) = ceil(designing + dieRate + leafing + window + pasting)
  const AE2 = ru(design + Z2 + leafing + window_ + pasting);

  // Step 5: Other Charges (AD2)
  const AD2 = ru((qty * window_ * 1.05) + Math.max(sheetQty * ups * pasting, 200) + 1);

  // Step 6: Paper Cost (P2)
  const P2 = calcPaper(W, H, sheetQty, gsm, cc5);

  // Step 7: Base Per Unit (AG2)
  const AG2 = (P2 + AE2 + X2 + AD2) / qty;

  // Step 8: Lamination Per Unit
  const sidesFactor = sides === 'Two' ? 2 : 1;
  const lamPerUnit  = calcLam(W, H, sheetQty, qty, lamination) * sidesFactor;

  // Step 9: Add-On Per Unit
  const addonDef = ADDON_OPTIONS[addon];
  let addonPerUnit = 0;
  if (addonDef && addon !== 'Plain') {
    if (addonDef.type === 'carry') {
      const carryRate = addon === 'Carry Bag Single Pasting' ? 5 : 6;
      addonPerUnit = Math.max(qty * carryRate, 300) / qty;
    } else if (addonDef.type === 'gumming') {
      const gRate = addon === 'Gumming Full' ? 0.0125 : 0.017;
      addonPerUnit = Math.max((W * H * gRate * sheetQty) / qty, 500 / qty);
    } else {
      // Coating add-on (same lamination formula)
      addonPerUnit = calcLam(W, H, sheetQty, qty, addon);
    }
  }

  // Step 10: Subtotal
  const subtotalPerUnit = (AG2 + lamPerUnit + addonPerUnit) * dblChg;

  // Step 11: Apply Markup
  const markup       = MARKUP_TYPES[markupType] ?? MARKUP_TYPES['Retail'];
  const finalPerUnit = subtotalPerUnit * (1 + markup);
  const finalTotal   = ru(finalPerUnit * qty);

  return {
    // Inputs echo
    qty,
    gsm,
    material,
    brand,
    colours,
    lamination,
    addon,
    dieCutting,
    markupType,
    sides,

    // Spec info
    ups,
    machine,
    sheetW: W,
    sheetH: H,
    sheetQty,
    cc5,

    // Individual cost components
    paperCost: P2,
    printCost: X2,
    fixedCharges: AE2,
    otherCharges: AD2,
    plateCost,
    printingRate: rawPrint,
    dieRate: Z2,

    // Per-unit breakdown
    basePerUnit: AG2,
    lamPerUnit,
    addonPerUnit,
    subtotalPerUnit,
    markup,
    markupAmount: finalPerUnit - subtotalPerUnit,
    finalPerUnit,
    finalTotal,

    // Separate one-time charges
    dieToolingCharge: dieCutting ? 1800 : 0,
  };
}

/**
 * Get the default brand for a material type.
 */
export function getDefaultBrand(material) {
  const brands = Object.keys(MATERIAL_RATES[material] || {});
  return brands[0] || 'Custom';
}

/**
 * Get available brands for a material type.
 */
export function getBrandsForMaterial(material) {
  return Object.keys(MATERIAL_RATES[material] || { 'Custom': 75 });
}
