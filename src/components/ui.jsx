import { useEffect } from "react";
import {
  Apple,
  Briefcase,
  Gem,
  Shirt,
  Sofa,
  Stethoscope,
  Trophy,
  Wheat,
} from "lucide-react";

const icons = { Shirt, Trophy, Stethoscope, Wheat, Briefcase, Sofa, Gem, Apple };

export function CategoryIcon({ name, className }) {
  const Icon = icons[name] || Shirt;
  return <Icon className={className} strokeWidth={1.75} />;
}

export function btn(variant = "primary", size = "md", extra = "") {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:brightness-110",
    cta: "bg-cta text-cta-foreground hover:brightness-95",
    "outline-primary": "border border-primary bg-white text-primary hover:bg-primary-soft",
    "on-dark": "bg-white text-primary hover:bg-primary-soft",
    ghost: "bg-transparent text-primary hover:bg-primary-soft",
  };
  const sizes = {
    sm: "h-9 px-3.5 text-sm",
    md: "h-10 px-4 text-sm",
    xl: "h-12 px-6 text-[15px]",
  };
  return `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Field({ label, error, children }) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus:border-primary";

export function PageHero({ tag, title, text, children }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-rfq p-8 text-primary-foreground md:p-12">
      <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{tag}</span>
      <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight">{title}</h1>
      <p className="mt-3 max-w-xl text-primary-foreground/80">{text}</p>
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}

export function FeatureGrid({ items }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.title} className="rounded-xl border bg-card p-5 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">{item.icon}</span>
          <h2 className="mt-4 font-sans text-sm font-semibold">{item.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
        </article>
      ))}
    </section>
  );
}

export function Steps({ title, steps }) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ol className="grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border bg-card p-5 shadow-card">
            <span className="font-display text-2xl font-bold text-cta">{index + 1}</span>
            <h3 className="mt-2 text-base font-bold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
