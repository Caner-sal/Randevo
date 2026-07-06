# Premium UI Redesign Audit — REDESIGN-0

**Tarih:** 2026-07-06
**Branch:** feature/global-address-locale
**Kaynak plan:** `RANDEVO_PREMIUM_UI_REDESIGN_PLAN.md`
**Audit kapsamı:** Landing, Discover/Marketplace, Dashboard, Analytics, Billing, Staff Portal, Admin Panel, shared UI kütüphanesi, tasarım token sistemi, güvenlik/secrets tooling.

Bu doküman kod davranışını değiştirmez — sadece mevcut durumu tespit eder. REDESIGN-1'den itibaren yapılacak işler burada referans verilen dosya/satırlara göre planlanmıştır.

---

## Audit Sorularına Yanıtlar

- **Bu sayfa özel marka hissi veriyor mu?** Hayır. Landing page tamamen inline hex stiller ile yazılmış (§1), dashboard/analytics/billing üç ayrı ad-hoc "metric card" deseni kullanıyor (§3), hiçbiri paylaşılan `src/components/ui/` bileşenlerini kullanmıyor.
- **Componentler template gibi mi?** Kısmen — `src/components/ui/` (shadcn tabanlı) iyi kurulmuş ve tamamen token-driven, ama sayfa seviyesinde hiç kullanılmıyor.
- **Aynı kart düzeni fazla mı tekrar ediyor?** Evet — business-card markup'ı 3 farklı yerde neredeyse birebir kopyalanmış (§2), metric card 3 farklı şekilde yeniden yazılmış (§3).
- **CTA'lar güçlü mü?** Zayıf — "Başla" tarzı jenerik CTA'lar mevcut; kaynak plan §9'daki önerilerle güçlendirilecek (REDESIGN-3).
- **Kullanıcı neden devam etmek istesin?** Şu an net bir marka hikayesi yok; landing sadece text+card dizilimi.

---

## 1. Landing Page — Inline Hex Stil Sorunu

**Dosya:** `src/app/page.tsx` (338 satır)

Neredeyse tüm sayfa `style={{...}}` inline obje ile yazılmış (nav L140-160, hero L163-221, features L236-253, pricing L256-300, CTA L303-318), hardcoded hex renkler (`#09090e`, `#7768d4`, `#111120`, `#8a8aaa`) kullanıyor. Bu değerler `src/app/globals.css`'teki CSS token'larla (`--background`, `--primary`, `--card`, `--muted-foreground`) **aynı** ama iki ayrı yerde tanımlanmış — tek kaynak değil.

- Hiçbir `src/components/ui/*` bileşeni import edilmiyor; her buton/kart elle yazılmış `<Link style={...}>`/`<div style={...}>`.
- `--font-heading`/`--font-body` CSS değişkenleri `Outfit, sans-serif` / `Nunito, sans-serif` fallback'ine referans veriyor (L137, 148, 152...) ama `globals.css:30-31` bu değişkenleri gerçek bir Segoe UI sistem stack'i olarak tanımlıyor — Outfit/Nunito hiçbir zaman yüklenmiyor, sayfa sessizce Segoe UI ile render oluyor.
- Pricing için ayrı bir `/pricing` route yok; fiyatlandırma sadece bu dosyada gömülü (L106-134, L255-300) — dashboard/billing'den tamamen farklı üçüncü bir görsel dil.
- i18n: `next-intl` `getTranslations("landing")` ile tam kapsamlı (en/tr paralel, 58 key); fiyatlar (₺0/₺40/₺249) ise hardcoded ve TR dışı para birimlerine göre lokalize değil.

**Çözüm:** REDESIGN-1 (token konsolidasyonu + gerçek webfont), REDESIGN-3 (sayfanın token/shared component'lere taşınması).

---

## 2. Discover / Marketplace — İki Paralel, Tutarsız Uygulama

`/discover` (+ `/discover/business/[slug]`) ve `/marketplace` (+ `/marketplace/[slug]`, `/marketplace/location/[country]/[city]`) aynı özelliğin iki ayrı, birbirinden habersiz implementasyonu:

| | `/discover` | `/marketplace` |
|---|---|---|
| i18n | Yok — tüm string'ler hardcoded Türkçe | `next-intl` ile tam (en/tr, 9 key) |
| Konum UI | TR: `ProvinceSelect`/`DistrictSelect`, non-TR: plain `<input>` | TR: native `<select>`, non-TR: `AddressAutocomplete` |
| Kart | Ayrı `BusinessCard` component | Inline `<div>`, 3 farklı dosyada neredeyse birebir kopyalanmış |
| Detay sayfası | Hardcoded Türkçe, TRY/tr-TR format | Hardcoded İngilizce, USD/en-US format |

**Karar (kullanıcı onayı ile):** `/discover` kaldırılacak, `/marketplace` tek marketplace deneyimi olacak, eski linkler redirect edilecek (REDESIGN-4).

**Ek bulgu:** `src/components/address/AddressAutocomplete.tsx` (marketplace'te kullanılıyor) tamamen light-mode: `bg-white`, `border-gray-300`, `hover:bg-blue-50`, `text-gray-800` (L119-141) — dark marketplace sayfasında beyaz dropdown açılıyor.

---

## 3. Üç Farklı "Metric Card" Deseni + Kullanılmayan Shared Kütüphane

`src/components/ui/` (`button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `dialog.tsx`, `table.tsx`, `toast.tsx`) shadcn deseninde, tamamen `bg-card`/`border-border`/`text-muted-foreground` token'larıyla yazılmış, iyi durumda — ama dashboard/analytics/billing/landing sayfalarının hiçbiri bunu kullanmıyor.

Bunun yerine 3 ayrı, birbirinden bağımsız "büyük sayı kartı" implementasyonu var:
1. `StatCard` — `src/app/dashboard/page.tsx:34-48` (inline hex renk map'i)
2. İsimsiz inline `<div className="bg-card border border-border rounded-xl p-5">` blokları — aynı dosyada L118-142
3. `BigStat` — `src/app/dashboard/analytics/page.tsx:14-32` (Tailwind token + raw `text-*-600` renk prop'u)

Ayrıca admin panelinde `StatCard` deseni `subscriptions/page.tsx` ve `usage/page.tsx` arasında birebir kopyalanmış.

**Çözüm:** REDESIGN-2'de tek `MetricCard` inşa edilip REDESIGN-5/7'de bu 3+1 deseni yerine geçecek.

---

## 4. Dark Theme Renk Kalıntısı Bug'ı (Geniş Kapsamlı)

Uygulamada dark-mode toggle yok, `<html>`'e hiçbir zaman `.dark` class uygulanmıyor (`src/app/layout.tsx`, `globals.css` tek sabit koyu palet tanımlıyor). Buna rağmen birçok sayfa `dark:` varyantlı ham açık-renk Tailwind class'ları kullanıyor — bu varyantlar sadece ziyaretçinin **işletim sistemi** `prefers-color-scheme: dark` olduğunda aktif oluyor, uygulamanın kendi sabit koyu temasından tamamen bağımsız. Sonuç: açık-mod OS'li kullanıcılar siyah arayüz üzerinde literal beyaz/açık renkli status pill ve alert kutuları görüyor.

Doğru desen zaten mevcut ve kanıtlanmış: `billing/history/page.tsx` ve `billing/success|failure` sayfalarındaki opacity-token deseni (`bg-green-500/15 text-green-400`).

**Mevcut `src/tests/dashboard-theme-class-audit.test.ts`** sadece `bg-white`, `text-gray-\d{2,3}`, `border-gray-\d{2,3}` regex'ini yasaklıyor — `bg-yellow-100`, `bg-blue-100`, `bg-green-100`, `bg-red-100`, `bg-orange-100` gibi renkli-ama-açık-tonlu class'ları **yakalamıyor**. Bu yüzden aşağıdaki dosyalar testi geçiyor ama gerçek bug içeriyor:

- `dashboard/appointments/page.tsx:34-38` — `STATUS_COLORS` map'i tamamen açık palet (`bg-yellow-100 text-yellow-700` vb.)
- `dashboard/reminders/page.tsx:29-31,108` — aynı desen
- `dashboard/settings/page.tsx:144-170` — booking-URL kutusu `bg-blue-50` üzerinde `text-blue-300` (kontrast bug'ı), error/success alert'ler `bg-red-50`/`bg-green-50`
- `dashboard/services/page.tsx:182,193,205,237`, `dashboard/staff/page.tsx:173,214,225,235,247,276`, `dashboard/locations/page.tsx:129,164,169,177`, `dashboard/availability/page.tsx:216,222`, `dashboard/whatsapp/page.tsx:50,56,62`
- `dashboard/analytics/page.tsx` — `BigStat` kartlarında (L70-113) raw `text-blue-600`/`text-indigo-600`/`text-purple-600`/`text-green-600`/`text-red-600`/`text-orange-600`/`text-emerald-600` — light-bg için tasarlanmış tonlar, bu app'in `#111120` kartına karşı kontrast test edilmemiş. (Not: "Öne Çıkanlar" panelinin kendi arkaplanı BILLUI-1'de zaten düzeltildi — bu, panel içindeki üstteki 7 stat kartının **ayrı** bir sorunu.)
- `billing/page.tsx` — `PLAN_BADGE_COLORS` kısmen düzeltilmiş (BILLUI-1) ama `bg-blue-600`/`text-blue-600`/`ring-blue-500` CTA renkleri hâlâ raw.
- Literal `bg-white`: `AddressAutocomplete.tsx:125`, `LanguageSwitcher.tsx:148,166` (dropdown menüsü — landing nav + dashboard header'da kullanılıyor), `staff-invite-token-form.tsx:81-83` (tamamen light-themed, public unauthenticated davet kabul akışı), `booking/[slug]/portal/page.tsx:52`, `booking/[slug]/portal/dashboard/page.tsx:129`.

**Çözüm:** REDESIGN-6/7'de opacity-token deseni ile düzeltilecek; REDESIGN-8'de `dashboard-theme-class-audit.test.ts`'in FORBIDDEN listesi genişletilerek (renkli açık-ton class'ları da kapsayacak şekilde) gerçek bir regresyon kapısına dönüştürülecek.

---

## 5. Staff Portal & Admin Panel — Erişilebilirlik Boşluğu

`src/app/staff/**` ve `src/app/admin/**` içinde:
- Sıfır `aria-*` attribute (proje genelinde sadece 19 `aria-*` var, 7 dosyada yoğunlaşmış: whatsapp, booking, Sidebar, Header, LanguageSwitcher, BookingDatePicker — staff/admin'de yok).
- Sıfır `focus-visible`.
- Sıfır motion/transition (admin'de), staff'ta çok az.
- `prefers-reduced-motion` proje genelinde hiç yok — `framer-motion` da yüklü değil.

Mevcut `src/tests/booking-accessibility-theme-audit.test.ts` sadece booking sayfası/calendar/BookingDatePicker'ı kapsıyor (aria-live + focus-visible zorunlu, bg-white/text-gray/border-gray yasak) — staff/admin'i kapsamıyor.

**Çözüm:** REDESIGN-7 (görsel/renk düzeltmesi + baseline aria-label), REDESIGN-8 (tam a11y taraması + audit test'in staff/admin'e genişletilmesi, motion + reduced-motion).

---

## 6. Ölü Kod

`src/components/dashboard/header.tsx` ve `src/components/dashboard/sidebar.tsx` — hiçbir yerden import edilmiyor. Gerçekte kullanılan `src/components/Header.tsx`/`Sidebar.tsx` (root-level, büyük harfle başlıyor) `dashboard/layout.tsx` tarafından import ediliyor. İki çift dosya kafa karışıklığına yol açıyor.

**Çözüm:** REDESIGN-5'te silinecek.

---

## 7. Güvenlik / Secrets Tooling — Redesign Boyunca Uyulacak Kurallar

- `scripts/check-no-secrets.js`: `sk_live_`, `pk_live_`, `ghp_`/`gho_`/`github_pat_`, `AKIA[0-9A-Z]{16}`, Twilio `AC[a-f0-9]{32}`, `api_key=`, `password=`, `secret=`, uzun `Bearer` token'larını yakalıyor. PLACEHOLDER/example/changeme gibi işaretleyici kelimeler içermeyen hiçbir gerçekçi-görünümlü anahtar örneği (mockup, demo data, doküman) eklenmeyecek.
- `scripts/check-console-usage.ts`: sadece `src/app/api/**` ve `src/services/**` taranıyor — UI sayfalarına debug `console.log` eklenmemesi yine de genel kural.
- `scripts/check-production-env.ts`: `AUTH_SECRET`, `DATABASE_URL`, `NEXTAUTH_URL` zorunlu.
- `.env.example`'daki tüm sağlayıcılar (Stripe, iyzico/PayTR/Param, Resend, Twilio, Meta WhatsApp, Google Calendar OAuth, Anthropic AI, Xero/QuickBooks, Google Places/Maps/Mapbox/Apple MapKit/Nominatim) için gerçek değer asla hardcode edilmeyecek; redesign'ın dekoratif harita bileşenleri (`GlobalMapPreview`, `LocationPulseMap`) yeni bir ücretli API anahtarı gerektirmeyecek şekilde pure CSS/SVG olacak.
- Billing/checkout görsel değişiklikleri sadece sunum katmanını değiştirecek; ödeme onayının backend/webhook üzerinden geldiği güvenlik modeli korunacak (`CLAUDE.md` kuralı).
- CI (`check:node`, `check:secrets`, `validate:skills`, `agent:check`, prisma, lint, test, build, e2e-smoke) her push'ta çalışıyor; `check:logs`/`env:check`/`check:encoding` sadece lokal `phase:gate`'te — bu yüzden her faz sınırında `phase:gate` de çalıştırılacak.

---

## Sonraki Adımlar

REDESIGN-1 → REDESIGN-9, `RANDEVO_PREMIUM_UI_REDESIGN_PLAN.md` ve onaylanmış execution planına göre sırayla uygulanacak.
