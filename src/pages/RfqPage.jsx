import { useState } from "react";
import { CircleCheck, Users, Zap, FileText } from "lucide-react";
import { Button, Field, Input, Textarea, useDocumentTitle } from "../components/ui";
import { PHONE, categories } from "../lib";
import { useStore } from "../store";

export default function RfqPage() {
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const { postRfq, notify } = useStore();
  useDocumentTitle("Request for Quotation — store.pk");

  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const next = {};
    if (!data.product || data.product.trim().length < 3) next.product = "Tell us what product you need";
    if (!data.category) next.category = "Choose a category";
    if (!Number.isInteger(Number(data.quantity)) || Number(data.quantity) <= 0) next.quantity = "Enter a quantity";
    if (!data.city || data.city.trim().length < 2) next.city = "Enter a delivery city";
    if (!PHONE.test(String(data.phone).trim())) next.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567";
    setErrors(next);
    if (Object.keys(next).length) return;
    postRfq(data);
    setDone(true);
    notify("Request posted", "Suppliers will send quotes within 24 hours.");
  }

  return (
    <div className="container-page grid gap-10 pt-10 lg:grid-cols-[1fr_1.2fr]">
      <section className="space-y-6">
        <span className="w-fit rounded-full bg-cta-soft px-3 py-1 text-xs font-semibold text-cta">Request for Quotation</span>
        <h1 className="text-4xl font-extrabold leading-tight">One request. Multiple quotes from Pakistan's suppliers.</h1>
        <p className="text-muted-foreground">Describe what you want to buy and verified manufacturers will compete for your order.</p>
        <ul className="space-y-4">
          <Step icon={FileText} title="Describe your need" text="Product, quantity and delivery city." />
          <Step icon={Users} title="Suppliers respond" text="Matched suppliers send their best price." />
          <Step icon={Zap} title="Compare & order" text="Pick the best quote and start your order." />
        </ul>
      </section>
      <section className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <CircleCheck className="size-12 text-primary" />
            <h2 className="text-2xl font-bold">Your request is live</h2>
            <p className="max-w-sm text-sm text-muted-foreground">We've shared it with matching suppliers. Expect quotes on your phone within 24 hours.</p>
            <Button variant="outline-primary" className="mt-2" onClick={() => setDone(false)}>
              Post another request
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <Field label="Product name" error={errors.product}>
              <Input name="product" placeholder="e.g. Cotton bed sheets, king size" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category" error={errors.category}>
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
              <Field label="Quantity" error={errors.quantity}>
                <Input name="quantity" type="number" min={1} placeholder="500" />
              </Field>
              <Field label="Delivery city" error={errors.city}>
                <Input name="city" placeholder="Lahore" />
              </Field>
              <Field label="Mobile number" error={errors.phone}>
                <Input name="phone" placeholder="0300 1234567" />
              </Field>
            </div>
            <Field label="Details (optional)" error={errors.details}>
              <Textarea name="details" rows={4} placeholder="Size, material, colours, packaging, target price…" />
            </Field>
            <Button type="submit" variant="cta" size="xl" className="w-full">
              Get quotations
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}

function Step({ icon: Icon, title, text }) {
  return (
    <li className="flex gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </li>
  );
}
