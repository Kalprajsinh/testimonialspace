import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/** @type {import('next').NextRequest} */
export async function POST(req) {
  try {
    let email = undefined;
    let userId = undefined;
    try {
      const body = await req.json();
      email = body.email;
      userId = body.userId;
    } catch {
      // Body is optional
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Plan - Testimonial Space',
              description: 'Unlimited organizations, unlimited testimonials, all pro features',
            },
            unit_amount: 1200, // $12.00 in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan: 'pro',
        amount: '12',
        userId: userId || '',
      },
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}&plan=pro&amount=12`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
    });

    return Response.json({ id: session.id });
  } catch (err) {
    console.error("Stripe pro session error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
