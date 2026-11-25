import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ChevronRight, FileText, Headphones, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Button, CategoryIcon, useDocumentTitle } from "../components/ui";
import { categories, hubs, products, suppliers } from "../lib";
import { useStore } from "../store";

export default function Home() {
  useDocumentTitle("store.pk — Wholesale from Pakistan's Manufacturers");
  const verified = suppliers.filter((supplier) => supplier.verified).slice(0, 4);

  return (
    <div className="container-page space-y-14 pt-6">
      <section className="grid gap-4 lg:grid-cols-[240px_1fr_280px]">
        <aside className="hidden rounded-xl border bg-card p-2 shadow-card lg:block">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-primary-soft hover:text-primary"
            >
              <CategoryIcon name={category.icon} className="size-4 text-muted-foreground group-hover:text-primary" />
              <span className="flex-1">{category.name}</span>
              <ChevronRight className="size-4 opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </aside>

        <div className="relative min-h-[380px] overflow-hidden rounded-xl">
          <img
            src="/assets/hero-warehouse.jpg"
            alt="Pakistani export warehouse with textiles, footballs and rice"
            width="1600"
            height="800"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="relative flex h-full max-w-md flex-col justify-center gap-5 p-8 text-primary-foreground md:p-12">
            <span className="w-fit rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">Made in Pakistan</span>
            <h1 className="text-4xl font-extrabold leading-[1.05] md:text-5xl">Source direct from Pakistan's factories</h1>
            <p className="text-primary-foreground/80">
              Thousands of verified manufacturers. Wholesale prices in rupees. Delivery to every city.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="cta" size="xl">
                <Link to="/products">
                  Start sourcing <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="flex flex-1 flex-col justify-between gap-4 rounded-xl bg-gradient-rfq p-6 text-primary-foreground">
            <div className="space-y-2">
              <FileText className="size-7" />
              <h2 className="text-xl font-bold">Request for Quotation</h2>
              <p className="text-sm text-primary-foreground/75">Tell suppliers what you need and get quotes within 24 hours.</p>
            </div>
            <Button asChild variant="on-dark">
              <Link to="/rfq">Post a request</Link>
            </Button>
          </div>
          <WelcomeCard />
        </aside>
      </section>

      <section className="grid gap-4 rounded-xl border bg-card p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4">
        <Trust to="/trade-assurance" icon={ShieldCheck} title="Trade Assurance" text="Payment protected until delivery" />
        <Trust to="/seller-verification" icon={BadgeCheck} title="Verified suppliers" text="Factory visits & documents checked" />
        <Trust to="/logistics" icon={Truck} title="Nationwide logistics" text="Karachi to Gilgit, door to door" />
        <Trust to="/help" icon={Headphones} title="Urdu & English support" text="Help 7 days a week" />
      </section>

      <section className="space-y-5">
        <SectionTitle title="Shop by category" link="/products" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-all hover:border-primary hover:shadow-lift"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <CategoryIcon name={category.icon} className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold group-hover:text-primary">{category.name}</span>
                <span className="text-xs text-muted-foreground">Hub: {category.hub}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Top deals from Pakistani suppliers" link="/products" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Source from industrial hubs" />
        <div className="grid gap-4 md:grid-cols-4">
          {hubs.map((hub) => (
            <Link
              key={hub.city}
              to={`/products?q=${encodeURIComponent(hub.city)}`}
              className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <p className="font-display text-2xl font-bold text-primary">{hub.city}</p>
              <p className="mt-1 text-sm text-muted-foreground">{hub.known}</p>
              <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-cta">
                View suppliers <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle title="Top-ranked verified suppliers" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {verified.map((supplier) => (
            <Link
              key={supplier.id}
              to={`/supplier/${supplier.id}`}
              className="rounded-xl border bg-card p-5 shadow-card transition-all hover:border-primary hover:shadow-lift"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary-deep font-display text-lg font-bold text-primary-foreground">
                  {supplier.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{supplier.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BadgeCheck className="size-3.5 text-verified" /> Verified · {supplier.years} yrs · {supplier.city}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-muted p-2">
                  <p className="font-display text-base font-bold">{supplier.rating}/5</p>
                  <p className="text-[11px] text-muted-foreground">Rating</p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="font-display text-base font-bold">{supplier.responseRate}%</p>
                  <p className="text-[11px] text-muted-foreground">Response rate</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function WelcomeCard() {
  const { user } = useStore();
  if (user) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <p className="truncate font-display text-sm font-semibold">Hi, {user.email}</p>
        <p className="mt-1 text-xs text-muted-foreground">Pick up where you left off.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button asChild size="sm">
            <Link to="/orders">My orders</Link>
          </Button>
          <Button asChild size="sm" variant="outline-primary">
            <Link to="/messages">Messages</Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <p className="font-display text-sm font-semibold">Welcome to store.pk</p>
      <p className="mt-1 text-xs text-muted-foreground">Sign in for personalised deals and order tracking.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button asChild size="sm">
          <Link to="/auth?mode=signup">Join free</Link>
        </Button>
        <Button asChild size="sm" variant="outline-primary">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}

function Trust({ to, icon: Icon, title, text }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-lg hover:text-primary">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{text}</p>
      </div>
    </Link>
  );
}

function SectionTitle({ title, link }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      {link && (
        <Link to={link} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          View more <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
