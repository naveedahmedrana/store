import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button, Field, Input, Label, RadioGroup, RadioItem, useDocumentTitle } from "../components/ui";
import { PHONE, formatRs, getSupplier, payments, priceForQty, products, quoteCart } from "../lib";
import { useStore } from "../store";

export default function CartPage() {
  const { cart, user, setQty, removeFromCart, placeOrder, notify } = useStore();
  const quote = quoteCart(cart, products);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  useDocumentTitle("Your cart — store.pk");

  if (!user) return <Navigate to="/auth?redirect=%2Fcart" replace />;

  const total = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? sum + priceForQty(product, line.quantity) * line.quantity : sum;
  }, 0);

  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const next = {};
    if (!data.name || data.name.trim().length < 2) next.name = "Enter your name";
    if (!PHONE.test((data.phone || "").trim())) next.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567";
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
    notify("Order placed", `Order ${result.orderNumber}`);
    navigate(`/orders?placed=${result.orderNumber}`);
  }

  if (cart.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-3 py-24 text-center">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">Browse products from Pakistani suppliers and add them here.</p>
        <Button asChild variant="cta" className="mt-2">
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-8 pt-8 lg:grid-cols-[1fr_400px]">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Your cart</h1>
        {cart.map((line) => {
          const product = products.find((item) => item.id === line.productId);
          if (!product) return null;
          const supplier = getSupplier(product.supplierId);
          const unit = priceForQty(product, line.quantity);
          const low = line.quantity < product.moq;
          return (
            <div key={line.productId} className="flex gap-4 rounded-xl border bg-card p-4 shadow-card">
              <img
                src={product.image}
                alt={product.title}
                width={96}
                height={96}
                loading="lazy"
                className="size-24 shrink-0 rounded-lg object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-semibold hover:text-primary">
                  {product.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {supplier?.name} · {supplier?.city}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center rounded-full border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="p-2 hover:text-primary disabled:opacity-40"
                      disabled={line.quantity <= 1}
                      onClick={() => setQty(product.id, Math.max(1, line.quantity - 10))}
                    >
                      <Minus className="size-4" />
                    </button>
                    <input
                      key={line.quantity}
                      aria-label="Quantity"
                      type="number"
                      min={1}
                      defaultValue={line.quantity}
                      onBlur={(event) => {
                        const next = Math.max(1, Math.floor(Number(event.target.value) || 1));
                        if (next !== line.quantity) setQty(product.id, next);
                      }}
                      className="w-20 bg-transparent text-center text-sm outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="p-2 hover:text-primary"
                      onClick={() => setQty(product.id, line.quantity + 10)}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatRs(unit)} / {product.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
                {low && (
                  <p className="text-xs text-destructive">
                    Minimum order is {product.moq} {product.unit}s
                  </p>
                )}
              </div>
              <p className="shrink-0 font-display text-lg font-bold">{formatRs(unit * line.quantity)}</p>
            </div>
          );
        })}
      </section>

      <aside className="h-fit space-y-5 rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Order total</h2>
          <p className="font-display text-2xl font-extrabold">{formatRs(total)}</p>
        </div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Full name" error={errors.name}>
            <Input name="name" autoComplete="name" defaultValue={user?.fullName ?? ""} />
          </Field>
          <Field label="Mobile number" error={errors.phone}>
            <Input name="phone" placeholder="0300 1234567" autoComplete="tel" defaultValue={user?.phone ?? ""} />
          </Field>
          <Field label="City" error={errors.city}>
            <Input name="city" placeholder="Lahore" defaultValue={user?.city ?? ""} />
          </Field>
          <Field label="Delivery address" error={errors.address}>
            <Input name="address" placeholder="Shop / street / area" defaultValue={user?.address ?? ""} />
          </Field>
          <div className="space-y-2">
            <Label>Payment method</Label>
            <RadioGroup value={payment} className="grid grid-cols-2 gap-2">
              {payments.map((method) => (
                <RadioItem key={method.id} checked={payment === method.id} onSelect={() => setPayment(method.id)}>
                  {method.label}
                </RadioItem>
              ))}
            </RadioGroup>
          </div>
          {!quote.ok && <p className="text-xs text-destructive">{quote.error}</p>}
          <Button type="submit" variant="cta" size="xl" className="w-full" disabled={placing || !quote.ok}>
            {placing ? "Placing order…" : "Place order"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            The supplier will confirm your order and payment details by phone.
          </p>
        </form>
      </aside>
    </div>
  );
}
