# Stripe Integration Setup

## Environment Variables Required

Add these to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret from Stripe Dashboard
FRONTEND_URL=http://localhost:5173 # Your frontend URL
```

## Stripe Dashboard Setup

1. **Create Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**:
   - Go to Developers → API Keys
   - Copy the "Secret key" (starts with `sk_test_` for test mode)
3. **Set up Webhooks**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`
   - Copy the "Webhook signing secret" (starts with `whsec_`)

## How It Works

### For Startups (Receiving Investments)
1. Startup connects their bank via Stripe onboarding
2. Stripe creates an Express account for the startup
3. When investors pay, 90% goes to startup, 10% to platform

### For Investors (Making Investments)
1. Investor sees connected startups/students
2. Clicks "Invest" and enters amount (minimum $10)
3. Redirected to Stripe checkout
4. Payment processed, funds distributed automatically

### Admin Fee
- Platform automatically takes 10% of each investment
- Remaining 90% goes directly to the startup's connected bank account

## Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

## Database Models

- **Investment**: Tracks all investments with status, amounts, and participants
- **User.stripeAccountId**: Stores Stripe Express account ID for startups

## API Endpoints

- `POST /api/stripe/onboard` - Start Stripe onboarding for startups
- `POST /api/stripe/invest` - Create investment checkout session
- `GET /api/stripe/connected-startups` - Get startups investor can invest in
- `GET /api/stripe/investments` - Get investments received (for startups)
- `POST /api/stripe/webhook` - Handle Stripe webhooks