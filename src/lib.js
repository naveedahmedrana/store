import catalog from "./data/catalog.json";

export const products = catalog.products;
export const suppliers = catalog.suppliers;

export const categories = [
  { slug: "textiles", name: "Textiles & Apparel", icon: "Shirt", hub: "Faisalabad" },
  { slug: "sports", name: "Sports Goods", icon: "Trophy", hub: "Sialkot" },
  { slug: "medical", name: "Surgical & Medical", icon: "Stethoscope", hub: "Sialkot" },
  { slug: "food", name: "Rice & Food", icon: "Wheat", hub: "Gujranwala" },
  { slug: "leather", name: "Leather Products", icon: "Briefcase", hub: "Lahore" },
  { slug: "home-decor", name: "Carpets & Home Decor", icon: "Sofa", hub: "Lahore" },
  { slug: "minerals", name: "Himalayan Salt & Minerals", icon: "Gem", hub: "Khewra" },
  { slug: "agriculture", name: "Fresh Fruit & Agriculture", icon: "Apple", hub: "Multan" },
];

export const hubs = [
  { city: "Sialkot", known: "Sports goods & surgical tools" },
  { city: "Faisalabad", known: "Home textiles & yarn" },
  { city: "Lahore", known: "Leather, apparel & furniture" },
  { city: "Karachi", known: "Rugs, seafood & logistics" },
];

export const payments = [
  { id: "cod", label: "Cash on delivery" },
  { id: "bank", label: "Bank transfer" },
  { id: "jazzcash", label: "JazzCash" },
  { id: "easypaisa", label: "Easypaisa" },
];

export const PHONE = /^(\+92|0)3\d{2}[- ]?\d{7}$/;

export function categoryBySlug(slug) {
  return categories.find((category) => category.slug === slug);
}

export function getSupplier(id) {
  return suppliers.find((supplier) => supplier.id === id);
}

export function filterProducts(list, supplierList, { category, q }) {
  const query = q?.trim().toLowerCase();
  return list.filter((product) => {
    if (category && product.category !== category) return false;
    if (query) {
      const supplier = supplierList.find((item) => item.id === product.supplierId);
      const haystack = `${product.title} ${product.description} ${supplier?.name ?? ""} ${supplier?.city ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function priceForQty(product, qty) {
  return (product.tiers.filter((tier) => qty >= tier.minQty).at(-1) ?? product.tiers[0]).price;
}

export function priceRange(product) {
  const prices = product.tiers.map((tier) => tier.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function formatRs(value) {
  return `Rs ${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function quoteCart(lines, catalogProducts) {
  if (lines.length === 0) return { ok: false, error: "Your cart is empty" };
  const priced = [];
  for (const line of lines) {
    const product = catalogProducts.find((item) => item.id === line.productId);
    if (!product) return { ok: false, error: "A product in your cart is no longer available" };
    if (line.quantity < product.moq) {
      return { ok: false, error: `Minimum order for "${product.title}" is ${product.moq} ${product.unit}s` };
    }
    const unitPrice = priceForQty(product, line.quantity);
    priced.push({
      productId: product.id,
      title: product.title,
      unit: product.unit,
      unitPrice,
      quantity: line.quantity,
      lineTotal: unitPrice * line.quantity,
      image: product.image,
      supplierId: product.supplierId,
    });
  }
  return { ok: true, lines: priced, total: priced.reduce((sum, line) => sum + line.lineTotal, 0) };
}

export function productsForSupplier(supplierId) {
  return products.filter((product) => product.supplierId === supplierId);
}
