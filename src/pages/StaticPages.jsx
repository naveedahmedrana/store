import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  Clock,
  FileCheck,
  Headphones,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  Timer,
  Truck,
} from "lucide-react";
import { FeatureGrid, PageHero, Steps, btn, useDocumentTitle } from "../components/ui";

const routes = [
  { from: "Sialkot", to: "Karachi", days: "2–3 days" },
  { from: "Faisalabad", to: "Lahore", days: "1 day" },
  { from: "Karachi", to: "Peshawar", days: "3–4 days" },
  { from: "Lahore", to: "Quetta", days: "3–5 days" },
  { from: "Multan", to: "Islamabad", days: "1–2 days" },
  { from: "Karachi", to: "Gilgit", days: "5–7 days" },
];

export function TradePage() {
  useDocumentTitle("Trade Assurance — store.pk");
  return (
    <div className="container-page space-y-14 pt-8">
      <PageHero
        tag="Trade Assurance"
        title="Order with confidence from Pakistani suppliers"
        text="Every order placed on store.pk is covered: if the goods don't arrive on time or don't match what was agreed, we help you get your money back."
      >
        <Link to="/products" className={btn("cta", "xl")}>Start sourcing</Link>
        <Link to="/help" className={btn("on-dark", "xl")}>Questions? Visit Help centre</Link>
      </PageHero>
      <FeatureGrid
        items={[
          { icon: <ShieldCheck className="size-5" />, title: "Payment protection", text: "Your payment is held until you confirm the order arrived as described." },
          { icon: <Clock className="size-5" />, title: "On-time delivery", text: "If the supplier misses the agreed shipping date, you can claim a refund." },
          { icon: <FileCheck className="size-5" />, title: "Product quality", text: "Goods must match the specs, quantity and packaging on your order." },
          { icon: <BadgeCheck className="size-5" />, title: "Verified suppliers", text: "Suppliers with the Verified badge passed our document and factory checks." },
        ]}
      />
      <Steps
        title="How it works"
        steps={[
          { title: "Place your order", text: "Add products to your cart and place the order on store.pk." },
          { title: "Supplier ships", text: "The supplier prepares and dispatches your goods to your city." },
          { title: "Check the goods", text: "Inspect quantity and quality when the delivery reaches you." },
          { title: "Confirm or claim", text: "Confirm the order, or raise a claim within 7 days of delivery." },
        ]}
      />
    </div>
  );
}

export function VerifyPage() {
  useDocumentTitle("Seller verification — store.pk");
  return (
    <div className="container-page space-y-14 pt-8">
      <PageHero
        tag="Seller verification"
        title="The Verified badge, explained"
        text="Buyers trust suppliers who have been checked. Verified suppliers have shown us their business documents and passed a visit to their factory or warehouse."
      >
        <Link to="/sell" className={btn("cta", "xl")}>Become a supplier</Link>
      </PageHero>
      <FeatureGrid
        items={[
          { icon: <FileCheck className="size-5" />, title: "Business documents", text: "NTN, SECP or chamber registration, and a CNIC of the owner." },
          { icon: <Building2 className="size-5" />, title: "Factory visit", text: "Our team confirms the address, production capacity and staff." },
          { icon: <Star className="size-5" />, title: "Track record", text: "Response rate and buyer ratings are tracked on every profile." },
          { icon: <BadgeCheck className="size-5" />, title: "Renewed yearly", text: "Verification is checked again every year to keep the badge." },
        ]}
      />
      <Steps
        title="How to get verified"
        steps={[
          { title: "Apply", text: "Send your company details from the Become a supplier page." },
          { title: "Share documents", text: "Our team contacts you on your mobile to collect documents." },
          { title: "Site visit", text: "We visit your factory or warehouse at a time that suits you." },
          { title: "Get the badge", text: "The Verified badge appears on your profile and products." },
        ]}
      />
    </div>
  );
}

export function LogisticsPage() {
  useDocumentTitle("Logistics across Pakistan — store.pk");
  return (
    <div className="container-page space-y-14 pt-8">
      <PageHero
        tag="Logistics"
        title="Wholesale delivery to every city in Pakistan"
        text="Suppliers on store.pk ship by road freight and courier partners, door to door, with tracking shared on your order."
      >
        <Link to="/products" className={btn("cta", "xl")}>Browse products</Link>
      </PageHero>
      <FeatureGrid
        items={[
          { icon: <Truck className="size-5" />, title: "Road freight", text: "Full and part truckloads for bulk orders between cities." },
          { icon: <Package className="size-5" />, title: "Courier for samples", text: "Small parcels and samples delivered in 1–3 days." },
          { icon: <MapPin className="size-5" />, title: "Door to door", text: "Pickup from the factory, delivery to your shop or warehouse." },
          { icon: <Timer className="size-5" />, title: "Lead times shown", text: "Each product page shows how long the supplier needs to dispatch." },
        ]}
      />
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Typical transit times</h2>
        <div className="overflow-hidden rounded-xl border bg-card shadow-card">
          <div className="grid grid-cols-3 bg-muted px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>From</span><span>To</span><span>Transit</span>
          </div>
          {routes.map((route) => (
            <div key={`${route.from}-${route.to}`} className="grid grid-cols-3 border-t px-5 py-3 text-sm">
              <span className="font-medium">{route.from}</span>
              <span>{route.to}</span>
              <span className="text-muted-foreground">{route.days}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Transit times are estimates after dispatch and can vary with weather and road conditions.</p>
      </section>
    </div>
  );
}

const faqs = [
  {
    title: "Buying",
    faqs: [
      { q: "What is MOQ?", a: "MOQ is the minimum order quantity — the smallest amount a supplier will sell in one order. It's shown on every product page, and the cart won't let you order less." },
      { q: "Why does the price change with quantity?", a: "Wholesale prices are tiered: the more you order, the lower the price per piece. The product page shows each price level and your total." },
      { q: "Can I ask a supplier a question before ordering?", a: "Yes. Use Contact supplier on any product page. Your conversations appear on the Messages page." },
      { q: "I can't find what I need.", a: "Post a Request for Quotation and matching suppliers will send you their prices." },
    ],
  },
  {
    title: "Payment & orders",
    faqs: [
      { q: "Which payment methods are available?", a: "You can choose Cash on delivery, Bank transfer, JazzCash or Easypaisa when placing an order." },
      { q: "Where can I see my orders?", a: "Open Orders in the top menu after signing in. Each order shows its number, status, items and total." },
      { q: "What if my order arrives damaged or late?", a: "Orders are covered by Trade Assurance. Raise a claim within 7 days of delivery." },
    ],
  },
  {
    title: "Delivery",
    faqs: [
      { q: "Do you deliver to my city?", a: "Suppliers ship to every city in Pakistan by road freight or courier." },
      { q: "How long does delivery take?", a: "Each product shows the supplier's dispatch time. Transit usually takes 1–7 days depending on the route." },
    ],
  },
  {
    title: "Selling",
    faqs: [
      { q: "How do I sell on store.pk?", a: "Apply on the Become a supplier page. Our team will contact you on your mobile number." },
      { q: "How do I get the Verified badge?", a: "Share your business documents and pass a short factory or warehouse visit. See Seller verification for details." },
    ],
  },
];

export function HelpPage() {
  useDocumentTitle("Help centre — store.pk");
  return (
    <div className="container-page space-y-10 pt-8">
      <PageHero tag="Help centre" title="How can we help?" text="Quick answers about buying, paying, delivery and selling on store.pk.">
        <Link to="/rfq" className={btn("cta", "xl")}>Post a request</Link>
        <Link to="/sell" className={btn("on-dark", "xl")}>Become a supplier</Link>
      </PageHero>
      <div className="grid gap-6 lg:grid-cols-2">
        {faqs.map((group) => (
          <section key={group.title} className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="text-lg font-bold">{group.title}</h2>
            <div className="mt-3 divide-y">
              {group.faqs.map((item) => (
                <details key={item.q} className="group py-3">
                  <summary className="cursor-pointer list-none font-medium">{item.q}</summary>
                  <p className="pt-2 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-card p-6 shadow-card sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Headphones className="size-6 text-primary" />
          <div>
            <h2 className="font-sans text-base font-semibold">Still need help with an order?</h2>
            <p className="text-sm text-muted-foreground">Message your supplier or read how Trade Assurance covers a claim.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/trade-assurance" className={btn("outline-primary")}>Trade Assurance</Link>
          <Link to="/messages" className={btn("primary")}>Messages</Link>
        </div>
      </section>
    </div>
  );
}

export function NotFound() {
  useDocumentTitle("Page not found — store.pk");
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">That link is not on store.pk.</p>
      <Link to="/" className={`${btn("cta")} mt-6`}>Back to home</Link>
    </div>
  );
}
