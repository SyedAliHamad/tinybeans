TINY BEANS – SHOPIFY THEME v7
=============================

Upload: Online Store › Themes › Add theme › Upload zip file.
Keep it UNPUBLISHED until you have checked it with Preview.

Theme Check (Shopify's official checker): 0 errors, 0 warnings.


SET UP ONCE
-----------
1. Theme settings › Contact details
   WhatsApp number (with country code, e.g. 923001234567), email,
   Instagram and Facebook URLs. Used everywhere on the site.

2. Theme settings › Brand
   Favicon, and a default sharing image (1200 × 630) for WhatsApp,
   Instagram and Facebook link previews.

3. Navigation (Online Store › Navigation)
   - Main menu  → Header › Navigation menu
   - Shop menu  → Footer › Shop menu
   - Help menu  → Footer › Help menu
   - Info menu (Our story, Delivery, Exchanges, FAQs, Contact)
     → Information page › Information pages menu

4. Policies (Settings › Policies)
   Add refund, privacy, terms and shipping policies. They appear
   in the footer automatically.

5. Contact page
   Create a page called "Contact", and choose the template
   "page.contact" for it. It shows WhatsApp/email/Instagram cards
   and a contact form (messages go to your store email).

6. Collection filters
   Install Shopify Search & Discovery and add filters for Size,
   Age, Girls/Boys and Availability. They appear on collection
   pages automatically and apply as soon as a shopper taps them.

7. Optional product metafields (Settings › Custom data › Products)
   - custom.short_description  (single line text)  intro under price
   - custom.size_guide         (multi-line or rich text) per-product size guide
   - custom.care               (multi-line or rich text) per-product care
   Products without these use the defaults in the Product section.

8. Homepage hero
   Add images as blocks. Optionally add a desktop video and a
   lighter portrait video for phones. Phones without a phone video,
   visitors on data saver, and people who turn off motion see the
   images only.

9. Password page (before launch)
   Online Store › Preferences › Password protection. The "coming
   soon" page collects emails, tagged "prospect".


WHAT'S NEW IN v7
----------------
Low-stock messages (Theme settings › Stock messages)
- Product page, on by default: "Only 2 left in Rose / 0–3M" under
  Add to bag, for the size/colour the shopper has chosen. Updates
  as options change. Hidden above the threshold and when sold out.
- Product cards, off by default: a small "Few left" line under the
  price when the product's total stock is at or below the threshold.
- Threshold: 3 by default (1–10).
- Only for products where Shopify tracks stock and "Continue selling
  when out of stock" is off. Other products show nothing.
- Stock counts above the threshold are never sent to the browser,
  so they can't be read from the page source.

Keep stock accurate in Shopify: if you sell through Instagram or
WhatsApp, reduce stock in Shopify when those orders come in, so
"Only 1 left" is always true.

WHAT'S NEW IN v6
----------------
- Product photos stay in view on computers while the details
  scroll. Thumbnails sit in a column beside the photo, and the
  gallery is sized to fit the screen below the header.
  (Phones: photos scroll normally, which suits small screens.)

- Star rating under the product name, e.g. "4.6 · 26 reviews",
  linking down to the reviews. Shown only when a product has a
  rating from a reviews app.

- "What parents say" section below the product:
  * Score card (average stars and number of reviews).
  * A slot for your reviews app's review list (Theme editor ›
    Product page › Product reviews › Add block › your app).
  * Optional "Shop review" blocks for real shop-wide reviews
    (shown on every product).
  The section hides itself on products with nothing to show.

- WhatsApp button: shows once a number is entered in Theme
  settings › Contact details. Until then, a yellow note in the
  theme editor (never shown to visitors) says where to add it.

- Floating video fades out once shoppers scroll past the product
  (reviews, footer) and comes back when they scroll up.

REVIEWS: SETTING UP
  Shopify needs a reviews app to collect and store reviews.
  Most apps (e.g. Judge.me, which has a free plan) save each
  product's rating in Shopify's standard review fields, which
  this theme reads automatically for the stars and score card.
  After installing, add the app's review block to the
  "Product reviews" section in the theme editor.

WHAT'S NEW IN v5
----------------
Built on v4.1 (your wordmark, four-link navigation, 1150px
breakpoint, bean favicon and contact menu are all kept).

- Product cards: on computers, hovering a card fades to the
  product's second photo. Phones never download that photo.
  Products with one photo don't change.

- Product page: floating video. If a product has a video in its
  media, a small silent clip floats in the bottom corner of the
  page. Tapping it opens the full video with sound. Shoppers can
  hide it (it stays hidden for the rest of their visit).
  * Phones: 96 px wide, moves up above the Add to bag bar.
  * Data saver or "reduce motion": shows a still image with a
    play icon instead of playing automatically.
  * The bubble uses the smallest version Shopify makes of the
    video; the full video only downloads if someone opens it.
  * Theme editor › Product page › Product details › Floating
    video: turn it on or off, choose bottom left or bottom right.

ADDING A PRODUCT VIDEO
  Products › [product] › Media › Add › upload a video file
  (MP4 or MOV). It does not need to be the first media item.
  Best results: 5–15 seconds, portrait (3:4 or 9:16), no
  important sound, since the bubble plays muted.
  YouTube/Vimeo links are not used for the bubble; upload the file.

WHAT'S NEW IN v4
----------------
- Header switches to the menu button whenever the links don't fit,
  at any screen width and with any number of menu links
- Header now stays at the top while scrolling (Shopify's section
  wrapper was stopping it before); the announcement bar scrolls away
- Product: colour swatches (uses Shopify's colour swatches on option
  values; falls back to text buttons), sizes in an even grid,
  "Size guide" pop-up, sticky Add to bag bar on phones
- Sold-out options: disabled on single-option products; on
  colour + size products they stay tappable but are labelled
  "sold out" for screen readers, with a note such as
  "3–6M is sold out in Mist blue. Available in Rose."
- Collection on phones: sticky Filter + Sort bar, filters open in a
  bottom sheet with a live "Show N pieces" button
- Bag on phones: sticky total + Checkout bar; price per item when
  quantity is more than 1

COLOUR SWATCHES: in the product editor, link the Colour option to
Shopify's Color category metafield (or set swatches on each colour
value). Without swatch data, colours show as text buttons.

WHAT'S IN v3
------------
- 404 page, password page, contact page template, locale file
- Store policy links in the footer
- Open Graph / Twitter tags, canonical link, meta description, favicon
- Product structured data for Google
- Contact details set once in Theme settings
- Product page: variant photo switching, sold-out options greyed out,
  sale price, shareable ?variant= links, WhatsApp link with product
  name and URL, no duplicate size dropdown
- Collections: all list filters (incl. Size), filters apply on tap,
  clear filters, no-results message, breadcrumb keeps collection
- Bag: discounts, line savings, "You save" total, +/− buttons
- Speed: only the first hero image loads straight away; separate
  phone video; fonts served from Shopify's CDN (self-hosted)
- Text at least 13px; tap targets at least 44px; SVG icons
- All shop text editable in Online Store › Themes › … › Edit default
  theme content


NOT INCLUDED (on request)
-------------------------
Search page, gift packaging, reviews, hardcoded delivery/COD/exchange
terms. Delivery, payment and exchange notes on the product page stay
hidden until you fill them in with confirmed details.


FONTS
-----
DM Sans and Cormorant Garamond, SIL Open Font License 1.1.
