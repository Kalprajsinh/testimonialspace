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
              name: 'Standard Plan - Testimonial Space',
              description: '3 organizations, unlimited testimonials, remove watermark',
            },
            unit_amount: 600, // $6.00 in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan: 'standard',
        amount: '6',
        userId: userId || '',
      },
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}&plan=standard&amount=6`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
    });

    return Response.json({ id: session.id });
  } catch (err) {
    console.error("Stripe standard session error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
