# Damani Frontend (Next.js 14, JavaScript, SCSS)

## Run (backend must be running, see ../backend/README.md)
    cp .env.example .env.local      # BACKEND_URL=http://127.0.0.1:8000
    npm install
    npm run dev                     # http://localhost:3000
    npm run build && npm start      # production

## How it is wired
- The browser calls `/api/*` and `/uploads/*` on this site; `next.config.js` rewrites them to PHP (`BACKEND_URL`).
  Same origin means the admin session cookie just works.
- Server components (home, listing, product, sitemap) fetch PHP directly and cache for 15 s, so admin changes appear within ~15 seconds.
- `middleware.js` sends visitors without a session cookie from `/admin/*` to `/admin/login`; the PHP API does the real check.

## Pages
Shop: `/`, `/products` (filters in URL), `/products/[slug]`, `/cart`, `/checkout` (standalone step-by-step sheet, own layout in `app/(checkout)`), `/order-success`, `/about`, `/contact`, `/pages/[slug]` (FAQ, policies)
Admin: `/admin/login` (mobile + password), `/admin`, `/admin/orders`, `/admin/products` (+new, +[id]), `/admin/banners` (+new, +[id]), `/admin/categories`, `/admin/coupons`, `/admin/messages`, `/admin/settings`

## Customise
- Colors, fonts, spacing: `styles/_variables.scss` only. Font imports: `app/layout.js`.
- Logo: `components/Logo.js` (swap for your `<img src="/logo.svg">`).
- Menu, footer links, home-page tiles/images, story text, clients: `data/site.js`. Images live in `public/images/`.
- Optional social profiles and WhatsApp contact link: set the `NEXT_PUBLIC_*_URL` values in `.env.local`; unconfigured links stay hidden.
- FAQ/policy text: `data/pages.js`. Contact page and form: `app/(site)/contact/page.js`, `components/ContactForm.js`.
- Shipping display rule: `lib/utils.js` (must match `SHIPPING_*` in the backend `.env`).
- Volume pricing is shared by product, cart, checkout, and the server order calculation: 5+ items per product save 5%, 10+ save 10%, 30+ save 20%, and 50 items save 25%. The server recalculates prices and validates stock when an order is placed.
- Product photos and banners are managed in the admin panel. The bundled images are illustrative placeholders.
# digi-arts
