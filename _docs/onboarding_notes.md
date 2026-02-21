Phase 1: The "Onboarding" Flow
You need a "Stripe Account ID" for every florist and affiliate so you have a target for the money.

User Trigger: A user clicks "Register as Affiliate" on your Django site.

Create Account (Django): Your server sends a request to Stripe to create a new Express Account. You save the resulting ID (e.g., acct_123) in your Django Profile model.

Create Session (Django): Your server calls the AccountSession API for that specific acct_ID. This gives you a Client Secret.

Embedded UI (Frontend): You pass that secret to your frontend. Using Stripe’s JS library, an onboarding form "pops up" inside your own page. The user enters their bank info and ID.

Status Sync: Once they finish, Stripe sends a webhook to your Django app. You update their status in your database to is_verified = True.

Phase 2: The "Money" Flow
This is the "Separate Charges and Transfers" part. You collect the cash first, then distribute it later.

The Customer Pays: A customer buys a bouquet for $100. You create a PaymentIntent and include a transfer_group (e.g., "ORDER_99"). The full $100 lands in your Australian Stripe balance.

The Logic (Django): Your server sees the payment succeeded. It looks up who the affiliate was and which florist is involved.

Logic: Affiliate gets $15. Florist gets $85.

The Transfers (Django): You send two separate requests to Stripe:

Request 1: Move $15 from your balance to acct_Affiliate.

Request 2: Move $85 from your balance to acct_Florist.

Note: You must include that same transfer_group: "ORDER_99" so Stripe knows these payouts are linked to that specific sale.

What do you actually need to do in the Stripe Dashboard?
You don't write code in the Dashboard, you just "turn on the pipes":

Enable Transfers: Go to Settings > Connect > Settings and make sure "Transfers" is enabled for your platform.

Set Up Webhooks: Go to Developers > Webhooks and add your Django URL (e.g., https://api.futureflower.com/stripe/webhook/). Subscribe to account.updated and checkout.session.completed.

Branding: In Settings > Connect > Onboarding, upload your logo so the embedded form looks like your site.