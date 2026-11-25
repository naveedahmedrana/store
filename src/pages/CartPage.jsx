import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { btn, Field, inputClass, useDocumentTitle } from "../components/ui";
import { PHONE, formatRs, getSupplier, payments, products, quoteCart } from "../lib";
import { useStore } from "../store";

export default function CartPage() {
  const { cart, user, setQty, removeFromCart, placeOrder, notify } = useStore();
  const quote = quoteCart(cart, products);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  useDocumentTitle("Your cart — store.pk");

  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const next = {};
    if (!data.name || data.name.trim().length < 2) next.name = "Enter your name";
    if (!PHONE.test(data.phone.trim())) next.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567";
    if (!data.city || data.city.trim().length < 2) next.city = "Enter your city";
    if (!data.address || data.address.trim().length < 5) next.address = "Enter a delivery address";
    setErrors(next);
    if (Object.keys(next).length || !quote.ok) return;
    if (!user) {
      notify("Please sign in first", "Create a free account to place your order.");
      navigate("/auth?redirect=/cart");
      return;
    }
    setPlacing(true);
    const result = placeOrder({ ...data, payment }, quote);
    setPlacing(false);
    if (!result.ok) {
      notify("Couldn't place order", result.error);
      return;
    }
    navigate(`/orders?placed=${result.orderNumber}`);
  }

  if (cart.length === 0) {
    return (
      <div className="container-page pt-8">
        <h1 className="text-3xl font-bold">Your cart</h1>
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center shadow-card">
          <ShoppingBag className="size-10 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">Your cart is empty</p>
          <p className="max-w-sm text-sm text-muted-foreground">Browse products from Pakistani suppliers and add them here.</p>
          <Link to="/products" className={btn("cta")}>Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-8 pt-8 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Your cart</h1>
        {cart.map((line) => {
          const product = products.find((item) => item.id === line.productId);
          if (!product) return null;
          const supplier = getSupplier(product.supplierId);
          const low = line.quantity < product.moq;
          const unit = quote.ok ? quote.lines.find((item) => item.productId === product.id)?.unitPrice : product.tiers[0].price;
          return (
            <article key={line.productId} className="flex gap-4 rounded-xl border bg-card p-4 shadow-card">
              <img src={product.image} alt="" className="size-24 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <Link to={`/product/${product.id}`} className="font-medium hover:text-primary">{product.title}</Link>
                <p className="mt-1 text-xs text-muted-foreground">{supplier?.name} · {supplier?.city}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setQty(product.id, line.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <input
                    aria-label="Quantity"
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(event) => setQty(product.id, Number(event.target.value) || 1)}
                    className="h-8 w-16 rounded-full border text-center text-sm outline-none focus:border-primary"
                  />
                  <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setQty(product.id, line.quantity + 1)} aria-label="Increase quantity">+</button>
                  <button className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(product.id)}>
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
                {low && <p className="mt-2 text-xs text-destructive">Minimum order is {product.moq} {product.unit}s</p>}
              </div>
              <p className="font-display font-bold">{formatRs((unit || 0) * line.quantity)}</p>
            </article>
          );
        })}
      </section>

      <aside className="h-fit space-y-4 rounded-xl border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-sm font-semibold">Order total</h2>
          <p className="font-display text-xl font-bold">{quote.ok ? formatRs(quote.total) : "—"}</p>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Full name" error={errors.name}>
            <input name="name" autoComplete="name" defaultValue={user?.fullName || ""} className={inputClass} />
          </Field>
          <Field label="Mobile number" error={errors.phone}>
            <input name="phone" placeholder="0300 1234567" autoComplete="tel" defaultValue={user?.phone || ""} className={inputClass} />
          </Field>
          <Field label="City" error={errors.city}>
            <input name="city" placeholder="Lahore" defaultValue={user?.city || ""} className={inputClass} />
          </Field>
          <Field label="Delivery address" error={errors.address}>
            <input name="address" placeholder="Shop / street / area" defaultValue={user?.address || ""} className={inputClass} />
          </Field>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Payment method</legend>
            {payments.map((method) => (
              <label key={method.id} className="flex items-center gap-2 text-sm">
                <input type="radio" name="payment" checked={payment === method.id} onChange={() => setPayment(method.id)} />
                {method.label}
              </label>
            ))}
          </fieldset>
          {!quote.ok && <p className="text-xs text-destructive">{quote.error}</p>}
          <button className={`${btn("cta", "xl")} w-full`} disabled={placing || !quote.ok}>
            {placing ? "Placing order…" : "Place order"}
          </button>
          <p className="text-xs text-muted-foreground">The supplier will confirm your order and payment details by phone.</p>
        </form>
      </aside>
    </div>
  );
}
