// src/infrastructure/services/StripeService.ts

import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { IStripeService, CreatePaymentIntentParams } from '../../domain/services/IStripeService';
import { AuthError } from '../../domain/errors/Autherror';

@injectable()
export class PaymentService  implements IStripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async createPaymentIntent({
    amount,
    driverStripeAccountId,
    platformFee,
  }: CreatePaymentIntentParams): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
     
      const account =await this.stripe.accounts.retrieve(driverStripeAccountId);
      console.log(account.capabilities?.transfers);
  
      const paymentIntent = await this.stripe.paymentIntents.create(
        {
          amount, 
          currency: 'inr', // Use INR for testing
          automatic_payment_methods: { enabled: true }, // Supports cards, Google Pay, etc.
          application_fee_amount: platformFee, // Platform fee (10%)
          transfer_data: {
            destination: driverStripeAccountId, // Transfer to the driver’s connected account
          },
        }
      );

      return { clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
       };



    } catch (err: any) {
      console.error('Stripe Payment Intent Creation Error:', err.message);
      throw new AuthError(`${err.message}`, 500);
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }
}
