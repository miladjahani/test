# ⚡ پنل مدیریت پروکسی

پنل مدیریت، استقرار و کنترل کاربران زیرمجموعه برای Cloudflare Workers

## 🚀 امکانات

- ✅ استقرار خودکار ورکر پروکسی با یک کلیک
- ✅ مدیریت کاربران زیرمجموعه با محدودیت حجم، زمان و دستگاه
- ✅ تولید لینک اشتراک اختصاصی برای هر کاربر
- ✅ پشتیبانی از VLESS، Trojan، Shadowsocks، WebSocket، gRPC، XHTTP
- ✅ رابط کاربری کاملاً فارسی (RTL)
- ✅ استقرار روی Cloudflare Pages + Workers

## 📦 ساختار پروژه

```
├── src/                  ← فرانت‌اند React (Vite + Tailwind)
├── worker/               ← بک‌اند CF Worker (TypeScript)
├── d1/                   ← اسکیمای D1 Database
├── .github/workflows/    ← استقرار خودکار Cloudflare Pages
└── wrangler.toml         ← کانفیگ Cloudflare Worker
```

## 🛠️ راه‌اندازی محلی

```bash
# نصب وابستگی‌ها
bun install

# اجرای محلی
bun run dev
```

## 🚀 استقرار

### مرحله ۱: ساخت D1 Database

```bash
npx wrangler d1 create proxy-panel
```

`database_id` دریافتی را در `wrangler.toml` جایگزین کنید.

### مرحله ۲: اعمال اسکیما

```bash
npx wrangler d1 execute proxy-panel --remote --file=d1/schema.sql
```

### مرحله ۳: استقرار Worker

```bash
npx wrangler deploy
```

### مرحله ۴: اتصال GitHub به Cloudflare Pages

1. مخزن را به GitHub Push کنید
2. در [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create
3. مخزن GitHub را متصل کنید
4. Build settings:
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
5. هر Push خودکار مستقر می‌شود ✅

## ⚙️ توکن Cloudflare

برای استقرار ورکر از داخل پنل، یک API Token بسازید:

1. به [API Tokens](https://dash.cloudflare.com/profile/api-tokens) بروید
2. Create Token → Custom token
3. دسترسی‌ها:
   - `Cloudflare Workers: Edit`
   - `Cloudflare KV Storage: Edit`
   - `Account Settings: Read`
4. توکن را در پنل اضافه کنید

## 📝 لایسنس

MIT
