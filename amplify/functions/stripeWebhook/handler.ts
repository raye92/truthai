import Stripe from 'stripe';

// Webhook handler: ensure API route is configured to pass raw body
export const handler = async (event: any) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    return { statusCode: 500, body: 'Missing STRIPE secrets' };
  }

  const stripe = new Stripe(stripeSecretKey);

  const signature = event?.headers?.['stripe-signature'] || event?.headers?.['Stripe-Signature'];
  const body = event?.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event?.body;

  if (!signature || !body) {
    return { statusCode: 400, body: 'Invalid webhook payload' };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      // TODO: grant entitlements for userId
    }

    return { statusCode: 200, body: 'ok' };
  } catch (err: any) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
};


