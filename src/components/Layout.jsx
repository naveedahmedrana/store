import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Globe,
  LayoutGrid,
  MessageSquare,
  Search,
  ShieldCheck,
  ShoppingCart,
  User,
} from "lucide-react";
import { categories } from "../lib";
import { useStore } from "../store";
import { CategoryIcon } from "./ui";

export default function Layout({ children }) {
  const { user, cart, signOut, toast, dismissToast } = useStore();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [children]);

  function onSearch(event) {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-primary-deep text-primary-foreground">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-xs">
          <p className="truncate">Pakistan's B2B marketplace — source direct from verified manufacturers</p>
          <div className="flex shrink-0 items-center gap-4 text-primary-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" /> Deliver to: Pakistan
            </span>
            <span>English · PKR</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="container-page flex h-[76px] items-center gap-4 lg:gap-8">
          <Link to="/" className="font-display text-[1.7rem] font-extrabold leading-none tracking-tight text-primary">
            store<span className="text-cta">.pk</span>
          </Link>
          <form onSubmit={onSearch} className="flex h-12 min-w-0 flex-1 items-center rounded-full border-2 border-primary bg-white pl-4 pr-1.5">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search products"
              placeholder="Search footballs, basmati rice, bed sheets…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
              <Search className="size-4" /> Search
            </button>
          </form>
          <nav className="flex items-center gap-1 sm:gap-3">
            <HeaderLink to="/messages" icon={MessageSquare} label="Messages" />
            <HeaderLink to="/orders" icon={ClipboardList} label="Orders" />
            <HeaderLink to="/cart" icon={ShoppingCart} label="Cart" badge={cart.length} />
            {user ? (
              <div className="relative">
                <button
                  className="flex flex-col items-center gap-0.5 px-1 text-xs font-medium text-primary"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <User className="size-5" />
                  <span className="max-w-[72px] truncate">{user.fullName.split(" ")[0]}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border bg-white p-1.5 text-sm shadow-lift">
                    <Link to="/orders" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMenuOpen(false)}>
                      My orders
                    </Link>
                    <Link to="/messages" className="block rounded-lg px-3 py-2 hover:bg-muted" onClick={() => setMenuOpen(false)}>
                      Messages
                    </Link>
                    <button
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted"
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <HeaderLink to="/auth" icon={User} label="Sign in" />
            )}
          </nav>
        </div>
        <div className="nav-scroll container-page flex h-11 items-center gap-6 overflow-x-auto text-sm font-medium">
          <Link to="/products" className="flex shrink-0 items-center gap-2 hover:text-primary">
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
            <Link to="/trade-assurance" className="hidden items-center gap-1.5 text-muted-foreground hover:text-primary xl:flex">
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

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-primary-deep text-primary-foreground">
        <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="font-display text-2xl font-extrabold">
              store<span className="text-cta">.pk</span>
            </Link>
            <p className="max-w-xs text-sm text-primary-foreground/70">
              Connecting buyers with manufacturers across Sialkot, Faisalabad, Lahore, Karachi and beyond.
            </p>
          </div>
          <FooterCol title="Categories">
            {categories.slice(0, 5).map((category) => (
              <Link key={category.slug} to={`/products?category=${category.slug}`} className="hover:text-white">
                {category.name}
              </Link>
            ))}
          </FooterCol>
          <FooterCol title="Buy on store.pk">
            <Link to="/rfq" className="hover:text-white">Request for Quotation</Link>
            <Link to="/products" className="hover:text-white">Browse products</Link>
            <Link to="/trade-assurance" className="hover:text-white">Trade Assurance</Link>
            <Link to="/logistics" className="hover:text-white">Logistics across Pakistan</Link>
          </FooterCol>
          <FooterCol title="Sell on store.pk">
            <Link to="/sell" className="hover:text-white">Become a supplier</Link>
            <Link to="/seller-verification" className="hover:text-white">Seller verification</Link>
            <Link to="/help" className="hover:text-white">Help centre</Link>
          </FooterCol>
        </div>
        <div className="border-t border-white/10">
          <div className="container-page flex h-14 items-center justify-between text-xs text-primary-foreground/60">
            <span>© 2026 store.pk — Made in Pakistan</span>
            <span>Prices shown in Pakistani Rupees (PKR)</span>
          </div>
        </div>
      </footer>

      {toast && (
        <button
          onClick={dismissToast}
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border bg-white px-4 py-3 text-left shadow-lift"
        >
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description && <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>}
        </button>
      )}
    </div>
  );
}

function HeaderLink({ to, icon: Icon, label, badge = 0 }) {
  return (
    <NavLink to={to} className="relative flex flex-col items-center gap-0.5 px-1 text-xs font-medium text-muted-foreground hover:text-primary">
      <Icon className="size-5" />
      <span className="hidden sm:block">{label}</span>
      {badge > 0 && (
        <span className="absolute -right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-cta px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function FooterCol({ title, children }) {
  return (
    <div className="space-y-3 text-sm text-primary-foreground/75">
      <h4 className="font-sans text-sm font-semibold text-white">{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
