import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { BadgeCheck, CircleCheck, MessageSquare, Package, Send } from "lucide-react";
import { Button, Textarea, useDocumentTitle } from "../components/ui";
import { formatRs, getSupplier, payments, products } from "../lib";
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
          <Button asChild variant="cta">
            <Link to="/products">Start sourcing</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {mine.map((order) => (
            <article key={order.id} className="rounded-xl border bg-card shadow-card">
              <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-5 py-3 text-sm">
                <span className="font-semibold">{order.orderNumber}</span>
                <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="text-muted-foreground">Deliver to {order.deliveryCity}</span>
                <span className="text-muted-foreground">{payments.find((method) => method.id === order.paymentMethod)?.label ?? order.paymentMethod}</span>
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
  const supplierParam = params.get("supplier") || undefined;
  const [draft, setDraft] = useState("");
  useDocumentTitle("Messages — store.pk");

  if (!user) {
    const redirect = supplierParam ? `/messages?supplier=${supplierParam}` : "/messages";
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  const mine = messages.filter((message) => message.userId === user.id);
  const newestFirst = [...mine].reverse();
  const supplierIds = Array.from(new Set(newestFirst.map((message) => message.supplierId)));
  const activeId = supplierParam ?? supplierIds[0];
  const active = activeId ? getSupplier(activeId) : undefined;
  const thread = mine.filter((message) => message.supplierId === activeId);

  function send(event) {
    event.preventDefault();
    if (!activeId) return;
    const result = sendMessage({ supplierId: activeId, body: draft });
    if (!result.ok) {
      notify("Couldn't send", result.error);
      return;
    }
    setDraft("");
  }

  if (supplierIds.length === 0 && !supplierParam) {
    return (
      <div className="container-page flex flex-col items-center gap-3 py-24 text-center">
        <MessageSquare className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">No messages yet</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Open any product and tap “Contact supplier” to ask about prices, samples or delivery.
        </p>
        <Button asChild variant="cta" className="mt-2">
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  const listIds = supplierParam && !supplierIds.includes(supplierParam) ? [supplierParam, ...supplierIds] : supplierIds;

  return (
    <div className="container-page pt-8">
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>
      <div className="grid min-h-[520px] overflow-hidden rounded-2xl border bg-card shadow-card md:grid-cols-[280px_1fr]">
        <aside className="border-b md:border-b-0 md:border-r">
          {listIds.map((id) => {
            const supplier = getSupplier(id);
            const last = newestFirst.find((message) => message.supplierId === id);
            return (
              <Link
                key={id}
                to={`/messages?supplier=${id}`}
                className={`flex items-center gap-3 border-b px-4 py-3 ${id === activeId ? "bg-primary-soft" : "hover:bg-muted"}`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-deep font-display font-bold text-primary-foreground">
                  {supplier?.name.charAt(0) ?? "?"}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{supplier?.name ?? id}</span>
                  <span className="block truncate text-xs text-muted-foreground">{last?.body ?? "New conversation"}</span>
                </span>
              </Link>
            );
          })}
        </aside>
        <section className="flex flex-col">
          {active && (
            <header className="flex items-center gap-2 border-b px-5 py-3">
              <p className="font-semibold">{active.name}</p>
              {active.verified && <BadgeCheck className="size-4 text-verified" />}
              <span className="text-xs text-muted-foreground">· {active.city} · replies within 24 hours</span>
            </header>
          )}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
            {thread.length === 0 && <p className="m-auto text-sm text-muted-foreground">Start the conversation below.</p>}
            {thread.map((message) => {
              const product = message.productId ? products.find((item) => item.id === message.productId) : undefined;
              const mineMessage = message.sender === "buyer";
              return (
                <div
                  key={message.id}
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    mineMessage ? "self-end bg-primary text-primary-foreground" : "self-start bg-muted"
                  }`}
                >
                  {product && <p className="mb-1 text-xs opacity-75">Re: {product.title}</p>}
                  <p className="whitespace-pre-wrap">{message.body}</p>
                  <p className="mt-1 text-right text-[10px] opacity-60">
                    {new Date(message.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
          {activeId && (
            <form onSubmit={send} className="flex items-end gap-2 border-t p-3">
              <Textarea
                rows={2}
                value={draft}
                maxLength={2000}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a message…"
                className="resize-none"
              />
              <Button type="submit" size="icon" aria-label="Send" disabled={!draft.trim()}>
                <Send />
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}