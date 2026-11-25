import { useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { CircleCheck, MessageSquare, Package } from "lucide-react";
import { btn, useDocumentTitle } from "../components/ui";
import { formatRs, getSupplier, payments } from "../lib";
import { useStore } from "../store";

const statusClass = {
  pending: "bg-cta-soft text-cta",
  confirmed: "bg-primary-soft text-primary",
  shipped: "bg-primary-soft text-primary",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

export function OrdersPage() {
  const { user, orders } = useStore();
  const [params] = useSearchParams();
  const placed = params.get("placed");
  useDocumentTitle("My orders — store.pk");

  if (!user) {
    const next = placed ? `/orders?placed=${placed}` : "/orders";
    return <Navigate to={`/auth?redirect=${encodeURIComponent(next)}`} replace />;
  }

  const mine = orders.filter((order) => order.userId === user.id);

  return (
    <div className="container-page space-y-6 pt-8">
      <h1 className="text-3xl font-bold">My orders</h1>
      {placed && (
        <div className="flex items-center gap-3 rounded-xl border border-primary bg-primary-soft p-4 text-sm">
          <CircleCheck className="size-5 shrink-0 text-primary" />
          <span>Order <strong>{placed}</strong> placed. The supplier will call you to confirm delivery and payment.</span>
        </div>
      )}
      {mine.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center shadow-card">
          <Package className="size-10 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">No orders yet</p>
          <Link to="/products" className={btn("cta")}>Start sourcing</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mine.map((order) => (
            <article key={order.id} className="rounded-xl border bg-card shadow-card">
              <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-5 py-3 text-sm">
                <span className="font-semibold">{order.orderNumber}</span>
                <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="text-muted-foreground">Deliver to {order.deliveryCity}</span>
                <span className="text-muted-foreground">{payments.find((method) => method.id === order.paymentMethod)?.label}</span>
                <span className={`ml-auto rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${statusClass[order.status] || ""}`}>{order.status}</span>
              </header>
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                    <span className="min-w-0 truncate">{item.title}</span>
                    <span className="shrink-0 text-muted-foreground">{item.quantity} {item.unit}s × {formatRs(item.unitPrice)}</span>
                  </li>
                ))}
              </ul>
              <footer className="flex justify-end border-t px-5 py-3 text-sm">
                Total: <span className="ml-2 font-display font-bold">{formatRs(order.total)}</span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function MessagesPage() {
  const { user, messages, sendMessage, notify } = useStore();
  const [params] = useSearchParams();
  const supplierQuery = params.get("supplier") || "";
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState(supplierQuery);
  useDocumentTitle("Messages — store.pk");

  const mine = useMemo(() => (user ? messages.filter((message) => message.userId === user.id) : []), [messages, user]);
  const threads = useMemo(() => {
    const map = new Map();
    for (const message of mine) {
      if (!map.has(message.supplierId)) map.set(message.supplierId, []);
      map.get(message.supplierId).push(message);
    }
    if (supplierQuery && !map.has(supplierQuery)) map.set(supplierQuery, []);
    return [...map.entries()];
  }, [mine, supplierQuery]);

  if (!user) {
    const redirect = supplierQuery ? `/messages?supplier=${supplierQuery}` : "/messages";
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  const current = active || threads[0]?.[0] || "";
  const thread = mine.filter((message) => message.supplierId === current);
  const supplier = current ? getSupplier(current) : null;

  function send(event) {
    event.preventDefault();
    if (!current) return;
    const result = sendMessage({ supplierId: current, body: draft });
    if (!result.ok) {
      notify("Couldn't send message", result.error);
      return;
    }
    setDraft("");
    notify("Message sent", supplier ? `${supplier.name} usually replies within 24 hours.` : "Sent");
  }

  return (
    <div className="container-page space-y-6 pt-8">
      <h1 className="text-3xl font-bold">Messages</h1>
      {threads.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center shadow-card">
          <MessageSquare className="size-10 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">No messages yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">Contact a supplier from a product page. Your conversations appear here.</p>
          <Link to="/products" className={btn("cta")}>Browse products</Link>
        </div>
      ) : (
        <div className="grid overflow-hidden rounded-xl border bg-card shadow-card md:grid-cols-[260px_1fr]">
          <aside className="border-b md:border-b-0 md:border-r">
            {threads.map(([supplierId, items]) => {
              const name = getSupplier(supplierId)?.name || "Supplier";
              return (
                <button
                  key={supplierId}
                  onClick={() => setActive(supplierId)}
                  className={`block w-full px-4 py-3 text-left text-sm ${current === supplierId ? "bg-primary-soft" : "hover:bg-muted"}`}
                >
                  <span className="block font-semibold">{name}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">{items.at(-1)?.body || "New conversation"}</span>
                </button>
              );
            })}
          </aside>
          <section className="flex min-h-[420px] flex-col">
            <header className="border-b px-5 py-3 text-sm font-semibold">{supplier?.name || "Conversation"}</header>
            <div className="flex-1 space-y-3 p-5">
              {thread.length === 0 && <p className="text-sm text-muted-foreground">Send the first message to this supplier.</p>}
              {thread.map((message) => (
                <div key={message.id} className="ml-auto max-w-[80%] rounded-2xl bg-primary-soft px-4 py-2 text-sm">
                  <p>{message.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{new Date(message.createdAt).toLocaleString("en-GB")}</p>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t p-4">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a message…"
                className="h-11 flex-1 rounded-full border px-4 text-sm outline-none focus:border-primary"
              />
              <button className={btn("primary")} disabled={!draft.trim()}>Send</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
