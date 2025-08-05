import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { sessionId, plan, amount } = await req.json();

    if (!sessionId || !plan || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session is valid and paid
    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ isValid: false, error: 'Payment not completed' }),
        { status: 200 }
      );
    }

    // Verify the amount matches the plan
    const expectedAmount = plan === 'standard' ? 600 : 1200; // amounts in cents
    if (session.amount_total !== expectedAmount) {
      return new Response(
        JSON.stringify({ isValid: false, error: 'Invalid payment amount' }),
        { status: 200 }
      );
    }

    // Verify the session hasn't been used before
    const existingSubscription = await fetch('https://testimonialspace-63bp.vercel.app/api/check-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId })
    }).then(res => res.json());

    if (existingSubscription.used) {
      return new Response(
        JSON.stringify({ isValid: false, error: 'Session already used' }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ isValid: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying session:', error);
    return new Response(
      JSON.stringify({ isValid: false, error: 'Invalid session' }),
      { status: 200 }
    );
  }
} 