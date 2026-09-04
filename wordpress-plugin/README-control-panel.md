# Atulya Control Panel (WordPress plugin)

Team ke liye website ki settings ek jagah se manage karne ka panel — **bina coding**. Save karte hi Next.js frontend ~1 min me update ho jata hai.

## Ye plugin kyun (architecture)
Frontend **custom Next.js** hai (apna cart/checkout/pricing). WooCommerce ke offer/tax/coupon plugins is frontend pe apne aap nahi aate. Isliye ye plugin settings ko ek **REST API** pe deta hai:

```
GET /wp-json/atulya/v1/config
```

Frontend isse padhke apply karta hai (Next.js `/api/site-config` ke through, CORS-safe).

## Install
1. `atulya-control-panel.php` ko `wp-content/plugins/` me upload karo (ya ZIP se Plugins → Add New → Upload).
2. **Activate** karo.
3. Left menu me **"Atulya Control Panel"** khulega.

## Kya-kya control hota hai
- **Shipping**: delivery charge (₹99), free delivery above (₹999). → live on checkout.
- **GST**: on/off + rate (%). → live on checkout.
- **Announcement bar**: on/off + text (jaise "✦ Rakhi Special — Flat 20% Off"). → live on top bar. *(khali chhodo to default)*
- **WhatsApp button**: on/off + number + message. → floating button site pe.
- **First-order popup**: on/off + title + text + coupon code. → naye visitor ko ek baar dikhta hai.
- **COD**: on/off toggle. *(checkout flow Phase 4 me wire hoga)*
- **Offers (Buy X Get Y Free)**: 6 rows. Har offer me — Match (products ke slug/keyword, comma se), Buy, Free. → product page, cards, cart, drawer, checkout sab jagah apne aap.

### Offers kaise set karein (example)
| On | Label | Match | Buy | Free |
|----|-------|-------|-----|------|
| ✅ | Buy 1 Get 2 Free | `face wash, atulya-cucumber-toner` | 1 | 2 |
| ✅ | Buy 2 Get 1 Free | `green-tea-face-wash-100ml` | 2 | 1 |

- **Match** = product ka slug (jaise `aloe-vera-face-wash-100ml`) ya keyword (jaise `face wash` = saare facewash). Comma se alag.
- **Buy 1 Free 2** = "1 ke paise, 3 milenge". **Buy 2 Free 1** = "2 ke paise, 3 milenge".
- Charge sirf paid qty ka; free units order me apne aap add + WooCommerce order me ship hote hain.

> Jab tak plugin install nahi, frontend safe defaults use karta hai (₹99 / free above ₹999 / GST 5% / default BOGO on facewash). Kuch tootega nahi.

- **Lucky Customer Coupon Generator**: pick discount type/amount/usage-limit/expiry → **Generate Coupon** → a random code is created (works at checkout instantly). Share it with your lucky customer.

## Returns / Refunds
Customers can request a return on delivered orders from **My Account** — this adds a note on the order in WooCommerce (WooCommerce → Orders → the order → Order notes). Process the refund there; the order status becomes **Refunded** and the customer sees it in My Account.

## Aage (roadmap)
Combos (buy 2 of X + 1 different product free) — a later phase.
