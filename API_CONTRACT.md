# Digi Art’s Store API reference

All responses: `{ "success": bool, "data": ..., "message": "", "meta": {} }`.
Errors use HTTP 4xx/5xx with `success:false`; validation errors are **422** with `data:{field:"message"}`.
Admin write requests need the session cookie **and** header `X-CSRF-Token` (returned by login and `/admin/me`).
The browser always calls `/api/*` on the Next.js domain; `next.config.js` proxies to PHP.

## Public
| Method | Path | Notes |
|---|---|---|
| GET | `/api/banners` | active banners in their date range, ordered |
| GET | `/api/categories` | active categories with `product_count` |
| GET | `/api/products` | query: `category` (slug), `min`, `max`, `q`, `sort` (`newest`/`price_asc`/`price_desc`/`name_asc`, blank = featured), `bestseller=1`, `in_stock=1`, `page`, `limit` (max 60). meta: `total,page,limit,pages` |
| GET | `/api/products/{slug}` | full product with `images[]` (primary first) and `category` |
| GET | `/api/products/{slug}/related` | up to 4 |
| POST | `/api/orders` | JSON: `customer_name, phone, email?, address, city, state, pincode, notes?, coupon_code?, items:[{id,qty}]` -> `{order_number,subtotal,discount,coupon_code,shipping,total}`. Prices, bulk tiers and the coupon are recalculated on the server. 409 when stock is short, 422 when the coupon is invalid |
| POST | `/api/coupons/validate` | JSON `{code, subtotal}` -> `{code, discount, label}`; 422 with `data:{coupon:"reason"}` when it can't be used |
| POST | `/api/contact` | `name, phone?, email?, message` (phone or email required) |
| POST | `/api/newsletter` | `email` |

## Customer (`customer_token` cookie)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/otp/send` | `{phone}` |
| POST | `/api/auth/otp/verify` | `{phone, otp}` -> `{user}`; sets the session cookie |
| GET | `/api/auth/session` | `{user}` or `{user:null}` for guests (never 401) |
| GET/PUT | `/api/auth/me` | profile; PUT `{name?, email?}` |
| GET | `/api/auth/orders` | own orders, paginated |
| GET | `/api/auth/addresses` | saved addresses |
| POST | `/api/auth/addresses` | `{tag (Home/Office/Other), name, phone, line1, city, state, pincode, is_default?}`; max 10. Returns the full list |
| PUT/DELETE | `/api/auth/addresses/{id}` | edit / delete; returns the full list |
| POST | `/api/auth/addresses/{id}/default` | make default; returns the full list |
| POST | `/api/auth/logout` | |

## Admin (session + CSRF)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/admin/login` | JSON `{phone, password}` (10-digit Indian mobile, +91/spaces accepted) |
| POST | `/api/admin/logout` | |
| GET | `/api/admin/me` | current admin + fresh `csrf_token` |
| POST | `/api/admin/password` | `{current_password,new_password}` |
| GET | `/api/admin/stats` | dashboard counters |
| GET/POST | `/api/admin/products` | list (`page,limit,q,status,category`) / create (multipart) |
| GET/POST/PATCH/DELETE | `/api/admin/products/{id}` | read / **update (multipart POST)** / toggle `{status,is_bestseller}` / delete |
| GET/POST | `/api/admin/banners` | list / create (multipart) |
| GET/POST/PATCH/DELETE | `/api/admin/banners/{id}` | read / update (multipart POST) / `{status}` / delete |
| GET/POST | `/api/admin/categories` | list / create `{name,status}` |
| PUT/DELETE | `/api/admin/categories/{id}` | update / delete |
| GET | `/api/admin/orders` | `status,q,page,limit` |
| GET/POST | `/api/admin/coupons` | list / create `{code,type(percent|fixed),value,min_order,max_discount,usage_limit,expires_at,status}` |
| PUT/PATCH/DELETE | `/api/admin/coupons/{id}` | update / `{status}` / delete |
| GET/PATCH | `/api/admin/orders/{id}` | detail with items / `{status}` (`new,confirmed,shipped,delivered,cancelled`) |
| GET | `/api/admin/messages` | contact messages |
| PATCH/DELETE | `/api/admin/messages/{id}` | `{is_read}` / delete |
| GET | `/api/admin/subscribers` | newsletter subscribers |
| DELETE | `/api/admin/subscribers/{id}` | remove subscriber |

### Product multipart fields
`title, category_id, price, sale_price, stock, status, is_bestseller, description, meta_title, meta_description`,
`images[]` (new files, in order), `image_order` (JSON array of tokens `e<existingImageId>` or `n<indexInImages[]>`),
`primary_image` (one token), `delete_images` (JSON array of existing image ids, update only).
Limits: max 10 images, see **Images**.

### Banner multipart fields
`title, subtitle, link_url, sort_order, status, start_date, end_date, image_desktop (file, required on create), image_mobile (file), remove_mobile ("1")`. See **Images**.

## Images
Uploads: JPG/PNG/WebP, max 10 MB and 50 megapixels each (422 otherwise). The server strips metadata and saves three WebP versions, never enlarged:
`small` (480px wide, max 80 KB), `medium` (960px, max 200 KB), `large` (1920px, max 500 KB).

The existing path fields still hold the `large` path. Next to each is a variants object `{small, medium, large}` of paths, or `null` when the
image has no generated versions (external/public paths, videos, older uploads before `npm run images:optimize`):

| Resource | Path | Variants |
|---|---|---|
| Product | `primary_image`, `images[].image_path` | `primary_image_variants`, `images[].variants` |
| Category | `image` | `image_variants` |
| Banner | `image_desktop`, `image_mobile` | `image_desktop_variants`, `image_mobile_variants` |
| Blog | `cover_image`, `hero_image` | `cover_image_variants`, `hero_image_variants` |
| Order item | `image_path` | `image_variants` |

## Pricing rules (enforced on the server)
- **Bulk tiers per product line:** 5+ units 5% off, 10+ 10%, 30+ 20%, 50 25% (max 50 per product).
- **Coupon** applies to the subtotal after bulk pricing. Percent coupons can have a max discount; fixed coupons never exceed the subtotal.
- **Shipping:** free when the subtotal (before the coupon) reaches `SHIPPING_FREE_ABOVE`, otherwise `SHIPPING_FLAT`.
- `total = subtotal - discount + shipping`. Cancelling an order returns stock and gives the coupon use back.
