import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "storepk-state-v1";

const StoreContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const empty = {
  user: null,
  users: [],
  cart: [],
  orders: [],
  messages: [],
  rfqs: [],
  applications: [],
};

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => ({ ...empty, ...(load() || {}) }));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(timer);
  }, [toast]);

  const api = useMemo(() => {
    function notify(title, description) {
      setToast({ title, description });
    }

    function signUp(account) {
      const exists = state.users.some((user) => user.email.toLowerCase() === account.email.toLowerCase());
      if (exists) return { ok: false, error: "An account with this email already exists." };
      const user = { id: crypto.randomUUID(), ...account };
      setState((current) => ({ ...current, users: [...current.users, user], user }));
      notify("Welcome to store.pk", "Your free account is ready.");
      return { ok: true };
    }

    function signIn(email, password) {
      const user = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
      if (!user) return { ok: false, error: "Email or password is incorrect." };
      setState((current) => ({ ...current, user }));
      notify("Signed in", user.email);
      return { ok: true };
    }

    function signOut() {
      setState((current) => ({ ...current, user: null }));
    }

    function resetPassword(email, password) {
      const index = state.users.findIndex((user) => user.email.toLowerCase() === email.toLowerCase());
      if (index === -1) return { ok: false, error: "We couldn't find an account with that email." };
      setState((current) => {
        const users = current.users.map((user, i) => (i === index ? { ...user, password } : user));
        const user = current.user?.email.toLowerCase() === email.toLowerCase() ? { ...current.user, password } : current.user;
        return { ...current, users, user };
      });
      notify("Password updated", "You can sign in with your new password.");
      return { ok: true };
    }

    function addToCart(productId, quantity) {
      setState((current) => {
        const existing = current.cart.find((line) => line.productId === productId);
        const cart = existing
          ? current.cart.map((line) => (line.productId === productId ? { ...line, quantity: line.quantity + quantity } : line))
          : [...current.cart, { productId, quantity }];
        return { ...current, cart };
      });
    }

    function setQty(productId, quantity) {
      setState((current) => ({
        ...current,
        cart: current.cart.map((line) => (line.productId === productId ? { ...line, quantity: Math.max(1, quantity) } : line)),
      }));
    }

    function removeFromCart(productId) {
      setState((current) => ({ ...current, cart: current.cart.filter((line) => line.productId !== productId) }));
    }

    function placeOrder(details, quote) {
      if (!state.user) return { ok: false, error: "Please sign in first" };
      const orderNumber = `PK${Date.now().toString().slice(-8)}`;
      const order = {
        id: crypto.randomUUID(),
        orderNumber,
        userId: state.user.id,
        status: "pending",
        total: quote.total,
        deliveryCity: details.city,
        address: details.address,
        phone: details.phone,
        name: details.name,
        paymentMethod: details.payment,
        createdAt: new Date().toISOString(),
        items: quote.lines,
      };
      setState((current) => ({
        ...current,
        orders: [order, ...current.orders],
        cart: [],
        user: {
          ...current.user,
          fullName: current.user.fullName || details.name,
          phone: details.phone,
          city: details.city,
          address: details.address,
        },
      }));
      return { ok: true, orderNumber };
    }

    function sendMessage({ supplierId, productId, body }) {
      if (!state.user) return { ok: false, error: "Please sign in first" };
      const text = body.trim();
      if (!text) return { ok: false, error: "Message is empty" };
      if (text.length > 2000) return { ok: false, error: "Message is too long (max 2000 characters)" };
      const message = {
        id: crypto.randomUUID(),
        userId: state.user.id,
        supplierId,
        productId: productId || null,
        sender: "buyer",
        body: text,
        createdAt: new Date().toISOString(),
      };
      setState((current) => ({ ...current, messages: [...current.messages, message] }));
      return { ok: true };
    }

    function postRfq(rfq) {
      setState((current) => ({ ...current, rfqs: [...current.rfqs, { id: crypto.randomUUID(), ...rfq, createdAt: new Date().toISOString() }] }));
    }

    function applySupplier(application) {
      setState((current) => ({
        ...current,
        applications: [...current.applications, { id: crypto.randomUUID(), ...application, createdAt: new Date().toISOString() }],
      }));
    }

    return { notify, signUp, signIn, signOut, resetPassword, addToCart, setQty, removeFromCart, placeOrder, sendMessage, postRfq, applySupplier };
  }, [state]);

  const value = { ...state, ...api, toast, dismissToast: () => setToast(null) };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
