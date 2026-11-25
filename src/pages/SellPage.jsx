import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, CircleCheck, MessageSquare, Store, Users } from "lucide-react";
import { Button, FeatureGrid, Field, Input, PageHero, Textarea, useDocumentTitle } from "../components/ui";
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
        <Button asChild variant="on-dark" size="xl">
          <Link to="/seller-verification">How verification works</Link>
        </Button>
      </PageHero>
      <FeatureGrid
        items={[
          { icon: <Users className="size-5" />, title: "Nationwide buyers", text: "Reach retailers and distributors from Karachi to Gilgit." },
          { icon: <MessageSquare className="size-5" />, title: "Direct enquiries", text: "Buyers message you and send quotation requests." },
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
            <Button asChild variant="outline-primary" className="mt-2">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div>
              <h2 className="text-2xl font-bold">Apply to become a supplier</h2>
              <p className="mt-1 text-sm text-muted-foreground">Free to apply. Takes 2 minutes.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company name" error={errors.company_name}><Input name="company_name" placeholder="e.g. Sialkot Sports Works" /></Field>
              <Field label="Your name" error={errors.contact_name}><Input name="contact_name" placeholder="Full name" /></Field>
              <Field label="Mobile number" error={errors.phone}><Input name="phone" placeholder="0300 1234567" /></Field>
              <Field label="Email" error={errors.email}><Input name="email" type="email" placeholder="you@company.pk" /></Field>
              <Field label="City" error={errors.city}><Input name="city" placeholder="Sialkot" /></Field>
              <Field label="What do you sell?" error={errors.category}>
                <select
                  name="category"
                  defaultValue=""
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-primary"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>{category.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="About your business (optional)">
              <Textarea name="details" rows={4} placeholder="Products, production capacity, years in business…" />
            </Field>
            <Button type="submit" variant="cta" size="xl" className="w-full" disabled={sending}>
              {sending ? "Sending…" : "Submit application"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
