import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
   this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-12-15.clover',  
    });
  }

  async createPaymentIntent(amount: number, currency = 'usd') {
    return this.stripe.paymentIntents.create({ amount, currency });
  }

  async confirmPayment(paymentIntentId: string) {
    return this.stripe.paymentIntents.confirm(paymentIntentId);
  }
}