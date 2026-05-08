const stripeKey = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('paste_your_key_here') 
  ? process.env.STRIPE_SECRET_KEY 
  : null;

const stripe = stripeKey ? require('stripe')(stripeKey) : null;
const User = require('../models/User');

exports.createCheckoutSession = async (req, res) => {
  try {
    // 💡 LOCAL TESTING BYPASS: If no real Stripe key is provided, fake the checkout!
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('paste_your_key_here')) {
      console.log('Mocking Stripe Checkout and instantly upgrading user to Pro!');
      await User.findByIdAndUpdate(req.user.id, { isPro: true, stripeCustomerId: 'mock_cus_123' });
      return res.json({ success: true, url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?payment=success` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ATS Analyzer Pro',
              description: 'Unlimited analyses, bulk comparison, and priority AI.',
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?payment=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?payment=cancel`,
      customer_email: req.user.email,
      client_reference_id: req.user.id,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!stripe) return res.status(400).send('Stripe not configured');

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Upgrade user to Pro
    await User.findByIdAndUpdate(session.client_reference_id, {
      isPro: true,
      stripeCustomerId: session.customer,
      subscriptionId: session.subscription,
    });
  }

  res.json({ received: true });
};
