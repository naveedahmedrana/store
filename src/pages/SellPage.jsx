import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, CircleCheck, Store, Users } from "lucide-react";
import { FeatureGrid, PageHero, btn, Field, inputClass, useDocumentTitle } from "../components/ui";
import { PHONE, categories } from "../lib";
import { useStore } from "../store";

export default function SellPage() {
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const { applySupplier, notify } = useStore();
  useDocumentTitle("Become a supplier — store.pk");

  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const next = {};
    if (!data.company_name || data.company_name.trim().length < 2) next.company_name = "Enter your company name";
    if (!data.contact_name || data.contact_name.trim().length < 2) next.contact_name = "Enter your name";
    if (!PHONE.test(String(data.phone).trim())) next.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) next.email = "Enter a valid email";
    if (!data.city || data.city.trim().length < 2) next.city = "Enter your city";
    if (!data.category) next.category = "Choose what you sell";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    applySupplier(data);
    setSending(false);
    setDone(true);
    notify("Application received", "Our team will call you within 2 working days.");
  }

  return (
    <div className="container-page space-y-14 pt-8">
      <PageHero
        tag="Sell on store.pk"
        title="Sell wholesale to buyers across Pakistan"
        text="List your products, receive orders and quotation requests from shops, distributors and businesses in every city."
      >
        <Link to="/seller-verification" className={btn("on-dark", "xl")}>How verification works</Link>
      </PageHero>
      <FeatureGrid
        items={[
          { icon: <Users className="size-5" />, title: "Nationwide buyers", text: "Reach retailers and distributors from Karachi to Gilgit." },
          { icon: <MessageIcon />, title: "Direct enquiries", text: "Buyers message you and send quotation requests." },
          { icon: <BadgeCheck className="size-5" />, title: "Verified badge", text: "Stand out with a badge buyers trust." },
          { icon: <Store className="size-5" />, title: "Your own profile", text: "A supplier page showing all your products and ratings." },
        ]}
      />
      <section id="apply" className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-card md:p-8">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <CircleCheck className="size-12 text-primary" />
            <h2 className="text-2xl font-bold">Application received</h2>
            <p className="max-w-sm text-sm text-muted-foreground">Thank you! Our team will call you on your mobile number within 2 working days.</p>
            <Link to="/" className={`${btn("outline-primary")} mt-2`}>Back to home</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div>
              <h2 className="text-2xl font-bold">Apply to become a supplier</h2>
              <p className="mt-1 text-sm text-muted-foreground">Free to apply. Takes 2 minutes.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company name" error={errors.company_name}><input name="company_name" placeholder="e.g. Sialkot Sports Works" className={inputClass} /></Field>
              <Field label="Your name" error={errors.contact_name}><input name="contact_name" placeholder="Full name" className={inputClass} /></Field>
              <Field label="Mobile number" error={errors.phone}><input name="phone" placeholder="0300 1234567" className={inputClass} /></Field>
              <Field label="Email" error={errors.email}><input name="email" type="email" placeholder="you@company.pk" className={inputClass} /></Field>
              <Field label="City" error={errors.city}><input name="city" placeholder="Sialkot" className={inputClass} /></Field>
              <Field label="What do you sell?" error={errors.category}>
                <select name="category" defaultValue="" className={inputClass}>
                  <option value="" disabled>Select category</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>{category.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="About your business (optional)">
              <textarea name="details" rows="4" placeholder="Products, production capacity, years in business…" className={`${inputClass} h-auto py-3`} />
            </Field>
            <button className={`${btn("cta", "xl")} w-full`} disabled={sending}>{sending ? "Sending…" : "Submit application"}</button>
          </form>
        )}
      </section>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
