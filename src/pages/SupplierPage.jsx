import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, Clock, MapPin, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { btn, useDocumentTitle } from "../components/ui";
import { getSupplier, productsForSupplier } from "../lib";
import { useStore } from "../store";

export default function SupplierPage() {
  const { id } = useParams();
  const supplier = getSupplier(id);
  const list = supplier ? productsForSupplier(supplier.id) : [];
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const { user, sendMessage, notify } = useStore();
  const navigate = useNavigate();
  useDocumentTitle(supplier ? `${supplier.name} — Supplier on store.pk` : "Supplier not found — store.pk");

  if (!supplier) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">Supplier not found</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse products</Link>
      </div>
    );
  }

  function send(event) {
    event.preventDefault();
    if (!user) {
      notify("Please sign in first", "Create a free account to message suppliers.");
      navigate(`/auth?redirect=${encodeURIComponent(`/supplier/${supplier.id}`)}`);
      return;
    }
    const result = sendMessage({ supplierId: supplier.id, body });
    if (!result.ok) {
      notify("Couldn't send message", result.error);
      return;
    }
    setBody("");
    setOpen(false);
    notify("Message sent", `${supplier.name} usually replies within 24 hours.`);
  }

  return (
    <div className="container-page space-y-10 pt-8">
      <section className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-card md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-xl bg-primary-deep font-display text-3xl font-bold text-primary-foreground">
            {supplier.name.charAt(0)}
          </span>
          <div>
            <h1 className="text-3xl font-bold">{supplier.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {supplier.verified && (
                <span className="inline-flex items-center gap-1 font-medium text-verified">
                  <BadgeCheck className="size-4" /> Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> {supplier.city}</span>
              <span className="inline-flex items-center gap-1"><Clock className="size-4" /> {supplier.years} years</span>
              <span className="inline-flex items-center gap-1"><Star className="size-4" /> {supplier.rating}/5 · {supplier.responseRate}% response</span>
            </p>
          </div>
        </div>
        <button className={btn("cta", "xl")} onClick={() => setOpen(true)}>Contact supplier</button>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Products from this supplier</h2>
        {list.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">This supplier has no products listed yet.</p>
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary-deep/40 p-4" onClick={() => setOpen(false)}>
          <form className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-lift" onSubmit={send} onClick={(event) => event.stopPropagation()}>
            <h2 className="text-xl font-bold">Message {supplier.name}</h2>
            <textarea
              rows="5"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Hi, I would like a quotation for a wholesale order."
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
