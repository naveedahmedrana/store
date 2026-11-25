import { Children, cloneElement, forwardRef, isValidElement, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Apple,
  Briefcase,
  Check,
  ChevronDown,
  Gem,
  Shirt,
  Sofa,
  Stethoscope,
  Trophy,
  Circle,
  Wheat,
  X,
} from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const icons = { Shirt, Trophy, Stethoscope, Wheat, Briefcase, Sofa, Gem, Apple };

export function CategoryIcon({ name, className }) {
  const Icon = icons[name] || Shirt;
  return <Icon className={className} />;
}

/* ---------- Button (same variants/sizes as the original design system) ---------- */
const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const buttonVariants = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  cta: "bg-cta text-cta-foreground shadow-sm hover:bg-cta/90 font-semibold",
  "outline-primary": "border border-primary text-primary bg-card hover:bg-primary-soft font-semibold",
  "on-dark": "bg-primary-foreground text-primary-deep hover:bg-primary-foreground/90 font-semibold",
};

const buttonSizes = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  xl: "h-12 rounded-full px-8 text-base",
  icon: "h-9 w-9",
};

export const Button = forwardRef(function Button(
  { className, variant = "default", size = "default", asChild = false, children, ...props },
  ref
) {
  const classes = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
  if (asChild) {
    const child = Children.only(children);
    if (isValidElement(child)) {
      return cloneElement(child, { ...props, ref, className: cn(classes, child.props.className) });
    }
  }
  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

/* ---------- Form controls ---------- */
export const Input = forwardRef(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});

export const Label = forwardRef(function Label({ className, ...props }, ref) {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});

/* ---------- Field (label + control + error) ---------- */
export function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ---------- Select (trigger + popover list, same look as the original) ---------- */
export function Select({ value, onValueChange, placeholder, options, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selected = options.find((option) => option.value === value);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        data-placeholder={selected ? undefined : ""}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[8rem] w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value);
                setOpen(false);
              }}
              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              {option.label}
              {option.value === value && (
                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Radio group (same look as the original) ---------- */
export function RadioGroup({ value, onValueChange, className, children }) {
  return (
    <div role="radiogroup" className={cn("grid gap-2", className)} data-value={value}>
      {children}
    </div>
  );
}

export function RadioItem({ checked, onSelect, children }) {
  return (
    <label
      className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft"
    >
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        onClick={onSelect}
        className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {checked && (
          <span className="flex items-center justify-center">
            <Circle className="h-3.5 w-3.5 fill-primary" />
          </span>
        )}
      </button>{" "}
      {children}
    </label>
  );
}

/* ---------- Dialog (same overlay / content as the original modal) ---------- */
export function Dialog({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
      >
        {children}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
}

export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
export const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
export const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);
export const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

/* ---------- Static-page building blocks ---------- */
export function PageHero({ tag, title, text, children }) {
  return (
    <section className="rounded-2xl bg-gradient-rfq p-8 text-primary-foreground md:p-12">
      <span className="w-fit rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">{tag}</span>
      <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-primary-foreground/80">{text}</p>
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}

export function FeatureGrid({ items }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="rounded-xl border bg-card p-6 shadow-card">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
            {item.icon}
          </span>
          <p className="mt-4 font-semibold">{item.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

export function Steps({ title, steps }) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border bg-card p-6 shadow-card">
            <span className="font-display text-3xl font-extrabold text-cta">{index + 1}</span>
            <p className="mt-2 font-semibold">{step.title}</p>
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
