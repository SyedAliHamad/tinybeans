# Brand assets

Assets for the places Shopify controls — checkout, customer account pages and
the sign-in page. These are **not** theme files; nothing here is read by the
theme or synced anywhere. Upload them in the admin.

| File | Use |
| --- | --- |
| `tinybeans-mark-512.png` | Checkout / accounts / sign-in header logo |

The mark is the same bean as the favicon: olive `#6c6e53` fill, beige `#ede1d1`
rim and crease, transparent background, with padding built in so Shopify's
header does not crop it tight. Rendered from the same two bezier paths as
`assets/tinybeans-favicon.svg`.

## Where it goes

**Settings → Checkout → (your configuration) → Customize → Header → Logo**

Upload the PNG, then set:

| Setting | Value | Why |
| --- | --- | --- |
| Logo width | ~90px | Large enough to read, small enough not to dominate |
| Position | Left or centre | Centre matches the current sign-in layout |

This logo applies to checkout, customer account pages **and** the sign-in page
together. There is no separate upload for the sign-in page.

## Colours to set in the same editor

| Slot | Hex | Matches |
| --- | --- | --- |
| Accent / primary | `#6c6e53` | `--olive`, the wordmark and buttons |
| Background | `#f8f5f0` | `--ivory`, the site background |
| Body text | `#34362d` | `--ink` |

**The sign-in button stays purple regardless.** Merchants report Shopify does
not allow that colour to be changed, and it is not affected by the accent
setting.

## Store name

**Settings → Store details → Store name**

Currently `tinybeans`, lowercase. The sign-in page renders the store name as
plain text when no logo is uploaded, which is why it appeared that way. The name
also shows in browser tab titles and as the sender name on notification emails,
so setting it to `Tiny Beans` fixes all three at once.

## Regenerating

`render-mark.js` (kept with the session scratch files, not committed) renders
this from the favicon paths. If the mark ever changes, the favicon SVG is the
source of truth — update that first.
