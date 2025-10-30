import Stripe from 'stripe';

// Minimal APIGW handler to create a Stripe Checkout Session
export const handler = async (event: any) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return { statusCode: 500, body: 'Missing STRIPE_SECRET_KEY' };
    }

    const stripe = new Stripe(stripeSecretKey);

    const authSub = event?.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!authSub) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    let body: any = {};
    try {
      if (event?.body) body = JSON.parse(event.body);
    } catch (_) {}

    const price = 'price_1S2d5jRxuH96HMkzF23EO2vY';
    if (!price) {
      return { statusCode: 500, body: 'Missing PRICE_ID' };
    }

    const successUrl = 'https://curateai.app/success';
    const cancelUrl = 'https://curateai.app/cancel';
    if (!successUrl || !cancelUrl) {
      return { statusCode: 500, body: 'Missing SUCCESS_URL or CANCEL_URL' };
    }

    const quantity = typeof body?.quantity === 'number' && body.quantity > 0 ? body.quantity : 1;

    // Resolve or create a Stripe Customer once per user (by email if present)
    let customerId: string | undefined;
    const email = event?.requestContext?.authorizer?.jwt?.claims?.email as string | undefined;
    if (email) {
      const existing = await stripe.customers.list({ email, limit: 1 });
      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
      } else {
        const created = await stripe.customers.create({ email, metadata: { userId: authSub } });
        customerId = created.id;
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price, quantity }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: authSub,
      customer: customerId,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error: any) {
    return { statusCode: 500, body: error?.message ?? 'Internal error' };
  }
};


