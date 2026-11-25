import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, ChevronRight, Clock, MapPin, MessageSquare, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { btn, useDocumentTitle } from "../components/ui";
import { categoryBySlug, formatRs, getSupplier, priceForQty, products } from "../lib";
import { useStore } from "../store";

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const supplier = product ? getSupplier(product.supplierId) : null;
  const category = product ? categoryBySlug(product.category) : null;
  const [qty, setQty] = useState(product?.moq ?? 1);
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const { user, addToCart, sendMessage, notify } = useStore();
  const navigate = useNavigate();
  useDocumentTitle(product ? `${product.title} — store.pk` : "Product not found — store.pk");

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const unitPrice = priceForQty(product, qty);
  const belowMoq = qty < product.moq;
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const also = related.length ? related : products.filter((item) => item.id !== product.id).slice(0, 4);

  function requireUser() {
    if (user) return false;
    notify("Please sign in first", "Create a free account to order and message suppliers.");
    navigate(`/auth?redirect=${encodeURIComponent(`/product/${product.id}`)}`);
    return true;
  }

  function add(goToCart) {
    if (requireUser() || belowMoq) return;
    addToCart(product.id, qty);
    if (goToCart) navigate("/cart");
    else notify("Added to cart", `${qty} ${product.unit}s`);
  }

  function send(event) {
    event.preventDefault();
    if (requireUser() || !supplier) return;
    const result = sendMessage({ supplierId: supplier.id, productId: product.id, body });
    if (!result.ok) {
      notify("Couldn't send message", result.error);
      return;
    }
    setOpen(false);
    setBody("");
    notify("Message sent", `${supplier.name} usually replies within 24 hours.`);
  }

  return (
    <div className="container-page space-y-12 pt-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="size-3" />
        {category && (
          <>
            <Link to={`/products?category=${category.slug}`} className="hover:text-primary">{category.name}</Link>
            <ChevronRight className="size-3" />
          </>
        )}
        <span className="truncate text-foreground">{product.title}</span>
      </nav>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr_300px]">
        <div className="overflow-hidden rounded-xl border bg-card">
          <img src={product.image} alt={product.title} width="816" height="816" className="aspect-square size-full object-cover" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-tight md:text-3xl">{product.title}</h1>
            <p className="text-sm text-muted-foreground">
              {product.sold.toLocaleString("en-PK")} {product.unit}s sold · Ships in {product.leadTimeDays} days
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-cta-soft p-4">
            {product.tiers.map((tier, index) => {
              const next = product.tiers[index + 1];
              const active = unitPrice === tier.price && !belowMoq;
              return (
                <div key={tier.minQty} className={`rounded-lg p-2 ${active ? "bg-card shadow-card" : ""}`}>
                  <p className="font-display text-xl font-bold">{formatRs(tier.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    {next ? `${tier.minQty} – ${next.minQty - 1}` : `≥ ${tier.minQty}`} {product.unit}s
                  </p>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            <label htmlFor="qty" className="text-sm font-semibold">Quantity ({product.unit}s)</label>
            <div className="flex items-center gap-3">
              <input
                id="qty"
                type="number"
                min="1"
                value={qty}
                onChange={(event) => setQty(Math.max(0, Number(event.target.value) || 0))}
                className="h-11 w-32 rounded-full border bg-card px-4 text-sm outline-none focus:border-primary"
              />
              <p className="text-sm">
                Total: <span className="font-display text-lg font-bold">{formatRs(unitPrice * qty)}</span>
              </p>
            </div>
            {belowMoq && <p className="text-xs text-destructive">Minimum order is {product.moq} {product.unit}s.</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <button className={btn("cta", "xl")} disabled={belowMoq} onClick={() => add(true)}>Start order</button>
            <button className={btn("outline-primary", "xl")} disabled={belowMoq} onClick={() => add(false)}>
              <ShoppingCart className="size-4" /> Add to cart
            </button>
            <button className={btn("ghost", "xl")} onClick={() => (requireUser() ? null : setOpen(true))}>
              <MessageSquare className="size-4" /> Contact supplier
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <span>
              <Link to="/trade-assurance" className="font-semibold hover:underline">Trade Assurance</Link>
              {" "}— your payment is protected until you receive your order.
            </span>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Product details</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <dl className="divide-y rounded-xl border bg-card text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[140px_1fr] gap-4 px-4 py-2.5">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {supplier && (
          <aside className="h-fit space-y-4 rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-lg bg-primary-deep font-display text-xl font-bold text-primary-foreground">
                {supplier.name.charAt(0)}
              </span>
              <div>
                <Link to={`/supplier/${supplier.id}`} className="font-semibold leading-tight hover:text-primary">{supplier.name}</Link>
                {supplier.verified && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-verified">
                    <BadgeCheck className="size-3.5" /> Verified supplier
                  </p>
                )}
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><MapPin className="size-4" /> {supplier.city}, Pakistan</li>
              <li className="flex items-center gap-2"><Clock className="size-4" /> {supplier.years} years on store.pk</li>
              <li className="flex items-center gap-2"><Star className="size-4" /> {supplier.rating}/5 rating · {supplier.responseRate}% response</li>
            </ul>
            <Link to={`/supplier/${supplier.id}`} className={`${btn("outline-primary")} w-full`}>View supplier profile</Link>
          </aside>
        )}
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold">You may also like</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {also.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {open && supplier && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary-deep/40 p-4" onClick={() => setOpen(false)}>
          <form onSubmit={send} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-lift" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-xl font-bold">Message {supplier.name}</h2>
            <p className="text-sm text-muted-foreground">Ask about pricing, samples, customisation or delivery.</p>
            <textarea
              rows="5"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={`Hi, I'm interested in ${qty} ${product.unit}s. Could you share your best price and delivery time to Lahore?`}
              className="w-full rounded-xl border border-input p-3 text-sm outline-none focus:border-primary"
            />
            <div className="flex justify-end gap-2">
              <button type="button" className={btn("ghost")} onClick={() => setOpen(false)}>Cancel</button>
              <button className={btn("primary")} disabled={!body.trim()}>Send message</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
