import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { formatRs, getSupplier, priceRange } from "../lib";

export default function ProductCard({ product }) {
  const supplier = getSupplier(product.supplierId);
  const { min, max } = priceRange(product);
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width="816"
          height="816"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 font-sans text-sm font-medium leading-snug tracking-normal group-hover:text-primary">
          {product.title}
        </h3>
        <p className="mt-1 font-display text-lg font-bold text-foreground">
          {formatRs(min)} – {formatRs(max)}
        </p>
        <p className="text-xs text-muted-foreground">
          Min. order: {product.moq} {product.unit}s
        </p>
        {supplier && (
          <p className="mt-auto flex items-center gap-1 pt-2 text-xs text-muted-foreground">
            {supplier.verified && <BadgeCheck className="size-3.5 shrink-0 text-verified" />}
            <span className="truncate">{supplier.name}</span>
            <span className="shrink-0">· {supplier.city}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
