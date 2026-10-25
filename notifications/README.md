# Notification emails

**Shopify does not read these files.** Customer notification templates live in the
Shopify admin database, not in the theme, so the GitHub integration never syncs
them. The copies here exist only so the templates have version history — without
them, each template exists in exactly one place with no undo beyond "Revert to
default", which throws away every edit at once.

## Installing a template

1. **Settings → Notifications**
2. Confirm your sender email address if you have not already. Shopify blocks
   editing the subject and body until you do.
3. Pick the notification, click **Edit code**.
4. Replace the body with the contents of the matching file here.
5. Use **Preview** and **Send test email** before saving. Preview renders with
   placeholder data; the test email is what actually lands in a client.

Set the shared logo and colours first, under the same Settings → Notifications
screen. Those apply across every template at once, so doing it before hand-editing
saves redoing work.

## Keeping a copy in sync

Edit the file here, commit, then paste into the admin. If someone edits in the
admin instead, paste it back into the file so the two do not drift.

## Values that are hardcoded

Notification templates cannot read theme settings, so these are written into the
markup and have to be kept in step with the storefront by hand:

| Value | In the email | Source of truth |
| --- | --- | --- |
| WhatsApp number | `+92 371 4202012` | Theme settings → Contact details |
| Delivery window | `3–5 working days` | Product information → Shop information |
| Sign-off name | `Syed` | — |

## Why the fonts differ from the site

Email clients will not load the theme's self-hosted woff2 files, so Cormorant
Garamond is unavailable. Headings fall back to Georgia, which ships on
effectively every device and is the closest match in feel. Body text uses Arial.
The emails read as the same brand; they will not be pixel-identical to the site.

## Templates

| File | Shopify notification |
| --- | --- |
| `order-confirmation.liquid` | Order confirmation |
