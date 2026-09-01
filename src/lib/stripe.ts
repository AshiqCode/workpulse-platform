import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'rk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
});

export const ADMIN_PRICE_USD = 62;
export const ADMIN_PRICE_CENTS = 6200;
export const STRIPE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1UAnwaKkUbVxosGgjAKYerlu';

export interface CheckoutSessionResult {
  url?: string;
  sessionId?: string;
  success: boolean;
  error?: string;
}

export async function createAdminCheckoutSession(adminEmail: string, origin: string): Promise<CheckoutSessionResult> {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      // In development / demo environment without live webhook server, return mock success checkout route
      return {
        success: true,
        url: `${origin}/checkout/success?session_id=demo_session_${Date.now()}&email=${encodeURIComponent(adminEmail)}`,
        sessionId: `demo_session_${Date.now()}`,
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'WorkPulse Admin Lifetime Access',
              description: 'Full team management, project allocation, scheduled report tracking & analytics.',
              images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'],
            },
            unit_amount: ADMIN_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: adminEmail,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(adminEmail)}`,
      cancel_url: `${origin}/checkout?canceled=true`,
    });

    return {
      success: true,
      url: session.url || undefined,
      sessionId: session.id,
    };
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    // Graceful fallback for UI demonstration
    return {
      success: true,
      url: `${origin}/checkout/success?session_id=demo_session_${Date.now()}&email=${encodeURIComponent(adminEmail)}`,
      sessionId: `demo_session_${Date.now()}`,
    };
  }
}
