# store.pk

Pakistan's B2B wholesale marketplace — buyers source directly from verified manufacturers.

Built with **React 18**, **Vite**, **React Router** and **Tailwind CSS**. No backend or third-party platform is required: products and suppliers live in `src/data/catalog.json`, and accounts, cart, orders, messages, quotation requests and supplier applications are stored in the browser (`localStorage`).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

## Pages

`/` home · `/products` · `/product/:id` · `/supplier/:id` · `/cart` · `/orders` · `/messages` · `/auth` · `/reset-password` · `/rfq` · `/sell` · `/trade-assurance` · `/seller-verification` · `/logistics` · `/help`

## Deploy

`netlify.toml` is included (build `npm run build`, publish `dist`, SPA redirect to `index.html`).
