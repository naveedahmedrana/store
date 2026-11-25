import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Globe,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Search,
  ShieldCheck,
  ShoppingCart,
  User,
} from "lucide-react";
import { categories } from "../lib";
import { useStore } from "../store";
import { Button } from "./ui";

function Logo({ inverted = false }) {
  return (
    <Link to="/" className="flex items-baseline gap-0.5 font-display text-2xl font-extrabold tracking-tight">
      <span className={inverted ? "text-primary-foreground" : "text-primary"}>store</span>
      <span className="text-cta">.pk</span>
    </Link>
  );
}

function AccountMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const item =
    "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex flex-col items-center gap-1 outline-none hover:text-primary"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold uppercase text-primary-foreground">
          {user.email?.charAt(0) ?? "U"}
        </span>
        Account
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <div className="truncate px-2 py-1.5 text-sm font-normal text-muted-foreground">{user.email}</div>
          <div className="-mx-1 my-1 h-px bg-muted" />
          <Link to="/orders" className={item}>
            <FileText /> My orders
          </Link>
          <Link to="/messages" className={item}>
            <MessageSquare /> Messages
          </Link>
          <Link to="/cart" className={item}>
            <ShoppingCart /> Cart
          </Link>
          <div className="-mx-1 my-1 h-px bg-muted" />
          <button type="button" onClick={onSignOut} className={`${item} w-full`}>
            <LogOut /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">{children}</div>
    </div>
  );
}

export default function Layout({ children }) {
  const { user, cart, signOut, toast, dismissToast } = useStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const count = user ? cart.length : 0;

  function onSearch(event) {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  const footerLink = "hover:text-primary-foreground";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="bg-primary-deep text-primary-foreground">
          <div className="container-page flex h-8 items-center justify-between text-xs">
            <span className="hidden sm:inline">
              Pakistan's B2B marketplace — source direct from verified manufacturers
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Globe className="size-3.5" /> Deliver to: Pakistan
              </span>
              <span>English · PKR</span>
            </div>
          </div>
        </div>

        <div className="container-page flex h-20 items-center gap-4 md:gap-8">
          <Logo />
          <form
            onSubmit={onSearch}
            className="flex flex-1 items-center rounded-full border-2 border-primary bg-card pl-5 pr-1.5"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search footballs, basmati rice, bed sheets…"
              aria-label="Search products"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" className="h-9 px-5">
              <Search /> <span className="hidden sm:inline">Search</span>
            </Button>
          </form>
          <nav className="flex items-center gap-4 text-xs font-medium text-muted-foreground md:gap-5">
            <Link to="/messages" className="hidden flex-col items-center gap-1 hover:text-primary md:flex">
              <MessageSquare className="size-5" /> Messages
            </Link>
            <Link to="/orders" className="hidden flex-col items-center gap-1 hover:text-primary md:flex">
              <FileText className="size-5" /> Orders
            </Link>
            <Link to="/cart" className="relative flex flex-col items-center gap-1 hover:text-primary">
              <ShoppingCart className="size-5" /> Cart
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-cta text-[10px] font-bold text-cta-foreground">
                  {count}
                </span>
              )}
            </Link>
            {user ? (
              <AccountMenu user={user} onSignOut={signOut} />
            ) : (
              <Link to="/auth" className="flex flex-col items-center gap-1 hover:text-primary">
                <User className="size-5" /> Sign in
              </Link>
            )}
          </nav>
        </div>

        <div className="container-page flex h-11 items-center gap-6 overflow-x-auto text-sm font-medium">
          <Link to="/products" className="flex shrink-0 items-center gap-2 text-foreground hover:text-primary">
            <LayoutGrid className="size-4" /> All categories
          </Link>
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="hidden shrink-0 text-muted-foreground hover:text-primary md:block"
            >
              {category.name}
            </Link>
          ))}
          <div className="ml-auto flex shrink-0 items-center gap-6">
            <Link
              to="/trade-assurance"
              className="hidden items-center gap-1.5 text-muted-foreground hover:text-primary xl:flex"
            >
              <ShieldCheck className="size-4 text-primary" /> Trade Assurance
            </Link>
            <Link to="/sell" className="hidden text-muted-foreground hover:text-primary lg:block">
              Sell on store.pk
            </Link>
            <Link to="/rfq" className="text-cta hover:underline">
              Request for Quotation
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 bg-primary-deep text-primary-foreground">
        <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo inverted />
            <p className="max-w-xs text-sm text-primary-foreground/70">
              Connecting buyers with manufacturers across Sialkot, Faisalabad, Lahore, Karachi and beyond.
            </p>
          </div>
          <FooterColumn title="Categories">
            {categories.slice(0, 5).map((category) => (
              <Link key={category.slug} to={`/products?category=${category.slug}`} className={footerLink}>
                {category.name}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Buy on store.pk">
            <Link to="/rfq" className={footerLink}>Request for Quotation</Link>
            <Link to="/products" className={footerLink}>Browse products</Link>
            <Link to="/trade-assurance" className={footerLink}>Trade Assurance</Link>
            <Link to="/logistics" className={footerLink}>Logistics across Pakistan</Link>
          </FooterColumn>
          <FooterColumn title="Sell on store.pk">
            <Link to="/sell" className={footerLink}>Become a supplier</Link>
            <Link to="/seller-verification" className={footerLink}>Seller verification</Link>
            <Link to="/help" className={footerLink}>Help centre</Link>
          </FooterColumn>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="container-page flex h-14 items-center justify-between text-xs text-primary-foreground/60">
            <span>© 2026 store.pk — Made in Pakistan</span>
            <span>Prices shown in Pakistani Rupees (PKR)</span>
          </div>
        </div>
      </footer>

      {toast && (
        <button
          type="button"
          onClick={dismissToast}
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 356,
            maxWidth: "calc(100vw - 32px)",
            padding: 16,
            textAlign: "left",
            fontSize: 13,
            color: "#171717",
            background: "#fff",
            border: "1px solid #ededed",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,.1)",
            cursor: "pointer",
          }}
        >
          <span style={{ fontWeight: 500 }}>{toast.title}</span>
          {toast.description && <span style={{ color: "#666" }}>{toast.description}</span>}
        </button>
      )}
    </div>
  );
}
