import { Link, useParams } from "react-router-dom";
import { BadgeCheck, Clock, MapPin, MessageSquare, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Button, useDocumentTitle } from "../components/ui";
import { getSupplier, productsForSupplier } from "../lib";

export default function SupplierPage() {
  const { id } = useParams();
  const supplier = getSupplier(id);
  const list = supplier ? productsForSupplier(supplier.id) : [];
  useDocumentTitle(supplier ? `${supplier.name} — Supplier on store.pk` : "Supplier not found — store.pk");

  if (!supplier) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">Supplier not found</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page space-y-10 pt-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{supplier.name}</span>
      </nav>

      <section className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-card md:flex-row md:items-center md:p-8">
        <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary-deep font-display text-4xl font-bold text-primary-foreground">
          {supplier.name.charAt(0)}
        </span>
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-extrabold">{supplier.name}</h1>
          {supplier.verified ? (
            <Link
              to="/seller-verification"
              className="flex w-fit items-center gap-1 text-sm font-medium text-verified hover:underline"
            >
              <BadgeCheck className="size-4" /> Verified supplier
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">Not yet verified</p>
          )}
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {supplier.city}, Pakistan
            </li>
            <li className="flex items-center gap-1.5">
              <Clock className="size-4" /> {supplier.years} years on store.pk
            </li>
            <li className="flex items-center gap-1.5">
              <Star className="size-4" /> {supplier.rating}/5 · {supplier.responseRate}% response rate
            </li>
          </ul>
        </div>
        <Button asChild variant="cta" size="xl">
          <Link to={`/messages?supplier=${supplier.id}`}>
            <MessageSquare /> Message supplier
          </Link>
        </Button>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Products ({list.length})</h2>
        {list.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">This supplier hasn't listed products yet.</p>
        )}
      </section>
    </div>
  );
}
