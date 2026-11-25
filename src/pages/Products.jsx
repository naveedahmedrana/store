import { Link, useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { CategoryIcon, useDocumentTitle } from "../components/ui";
import { categories, categoryBySlug, filterProducts, products, suppliers } from "../lib";

export default function Products() {
  const [params] = useSearchParams();
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const results = filterProducts(products, suppliers, { category, q });
  const active = category ? categoryBySlug(category) : null;
  const title = q ? `Results for “${q}”` : active?.name ?? "All products";
  useDocumentTitle(`${title} — store.pk`);

  return (
    <div className="container-page grid gap-8 pt-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-1">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
        <FilterLink active={!category} to={q ? `/products?q=${encodeURIComponent(q)}` : "/products"} label="All categories" />
        {categories.map((item) => (
          <FilterLink
            key={item.slug}
            active={category === item.slug}
            to={`/products?category=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            label={item.name}
            icon={item.icon}
          />
        ))}
      </aside>
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "product" : "products"} from suppliers in Pakistan
            </p>
          </div>
          {(q || category) && (
            <Link to="/products" className="text-sm font-semibold text-primary hover:underline">
              Clear filters
            </Link>
          )}
        </div>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center shadow-card">
            <SearchX className="size-10 text-muted-foreground" />
            <p className="font-display text-lg font-semibold">No products found</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Try a different word, or post a Request for Quotation and let suppliers come to you.
            </p>
            <Link to="/rfq" className="mt-2 text-sm font-semibold text-cta hover:underline">
              Post a request
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterLink({ active, to, label, icon }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? "bg-primary-soft font-semibold text-primary" : "hover:bg-muted"}`}
    >
      {icon && <CategoryIcon name={icon} className="size-4" />}
      {label}
    </Link>
  );
}
