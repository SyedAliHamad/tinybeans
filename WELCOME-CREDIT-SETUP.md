# Welcome store credit — admin setup

The theme now *talks about* the credit. It does not create it. Granting the
credit happens in Shopify admin, and until that part is done the storefront
will tell new customers their credit is on its way and it never will be.

## 1. Turn the feature on

**Settings → Customer accounts**

- Customer accounts must be the *new* ones. (Already the case — `/account`
  redirects to Shopify's hosted passwordless login.)
- Turn on **store credit** if it is not already on.

Store credit only appears at checkout for customers who are **signed in**.
Guest checkout never sees it. This is the single biggest thing to watch.

## 2. Install Shopify Flow

Free, from the Shopify App Store. Grant it permission to read and write
customers and store credit when prompted.

## 3. Build the workflow

**Trigger:** `Customer created`

**Action 1 — grant the credit.** Flow has no built-in store credit action, so
use **Send Admin API request** with the `storeCreditAccountCredit` mutation.

> Verify the exact argument names against the current Admin API reference
> before saving — this is written from documentation, not from a run against
> your store, and Shopify changes these signatures between API versions.

```graphql
mutation Credit($id: ID!, $creditInput: StoreCreditAccountCreditInput!) {
  storeCreditAccountCredit(id: $id, creditInput: $creditInput) {
    storeCreditAccountTransaction {
      amount { amount currencyCode }
      account { id balance { amount currencyCode } }
    }
    userErrors { field message }
  }
}
```

Variables — `id` is the customer from the trigger, as a GID:

```json
{
  "id": "{{ customer.id }}",
  "creditInput": {
    "creditAmount": { "amount": "500.00", "currencyCode": "PKR" },
    "expiresAt": "..."
  }
}
```

Set `expiresAt` to roughly 60–90 days out. Credit with no expiry sits on your
books forever and gives abandoned signups an indefinite discount.

**Action 2 — tag the customer.** Add customer tag `welcome-credit-granted`.

This is not optional. Liquid can only read the *total* balance, not its
history, so without the tag a balance of zero is ambiguous: it could mean the
credit never arrived, or that the customer spent it. The theme uses the tag to
tell those apart and show the right message — or no message at all.

The tag must match **Theme settings → Welcome credit → Customer tag**.

## 4. Match the theme settings

**Theme settings → Welcome credit**

| Setting | Value |
| --- | --- |
| Show the welcome credit offer | on |
| Amount shown to new visitors | `Rs. 500` |
| Customer tag set when credit is granted | `welcome-credit-granted` |

The amount here is display copy only — signed-in customers always see their
real balance from Shopify, never this string. If you change the amount in
Flow, change it here too or the storefront will advertise the wrong number.

## 5. Test end to end

1. Sign up with an address you control, in a private window.
2. Confirm the customer gets the tag and a Rs. 500 balance in admin.
3. Confirm the top bar changes from the offer to "You have Rs. 500 store
   credit to spend at checkout."
4. Add something to the cart and reach checkout **signed in** — the credit
   should be offered as payment.
5. Spend it, then reload the storefront. The bar should fall back to the
   seasonal message, not re-offer the credit.

## 6. Watch for silent failures

Flow runs asynchronously and does not tell the customer when it fails. If the
API call errors, the customer is tagged or not depending on where it broke,
and nobody finds out until they complain.

- Check **Flow → the workflow → run history** for failed runs, daily at first.
- Search customers by the `welcome-credit-granted` tag and spot-check that
  they actually hold a balance.

## 7. Known gaps

- **Guest checkout.** Credit is invisible to anyone not signed in. The cart
  now nudges them to sign in first, but some will still check out as guests.
- **Draft orders.** Store credit cannot be applied to draft or edited orders,
  so orders you create manually from WhatsApp conversations cannot use it.
- **No minimum order value.** Unlike a discount code, store credit has no
  spend threshold. Your cheapest items are around Rs. 900, so Rs. 500 is more
  than half off. If that is too generous, a welcome discount code with a
  minimum spend is the better instrument.
- **Cash on delivery.** Free credit plus pay-on-delivery means a throwaway
  email can order at a discount and refuse the parcel, leaving you the
  shipping cost. Consider requiring prepayment on orders that use credit.
