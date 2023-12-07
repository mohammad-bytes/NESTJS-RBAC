import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
@Injectable()
export class PaymentService {
  public stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: '2023-10-16',
    });
  }

  async createAccount() {
    try {
      const account = await this.stripe.accounts.create({
        country: 'US',
        type: 'express',
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });
      console.log(
        '🚀 ~ file: payment.service.ts:26 ~ PaymentService ~ createAccount ~ account:',
        account,
      );

      return account;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async accountLink(account_id: string) {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: account_id,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://example.com/return',
        type: 'account_onboarding',
      });
      return accountLink;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async topUpAccount(body) {
    try {
      const topup = await this.stripe.topups.create({
        amount: body.amount * 100,
        currency: 'usd',
        description: body.description,
        statement_descriptor: 'Top-up',
      });
      return topup;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async transfer(account_id: string) {
    try {
      const transfer = await this.stripe.transfers.create({
        amount: 1,
        currency: 'USD',
        destination: account_id,
        transfer_group: `${account_id}-account-id`,
      });
      return transfer;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async createCustomer() {
    try {
      // const customer = await this.stripe.customers.create({
      //   name: 'Mohammad Husain',
      //   email: 'mohammad@gmail.com',
      //   address: {
      //     city: 'delhi',
      //     country: 'india',
      //     state: 'DL',
      //     line1: 'main road delhi',
      //     postal_code: '110001',
      //   },
      // });

      // const token = await this.stripe.tokens.create({
      //   bank_account: {
      //     country: 'US',
      //     currency: 'usd',
      //     account_holder_name: 'Mohammad',
      //     account_holder_type: 'individual',
      //     routing_number: '110000000',
      //     account_number: '000123456789',
      //   },
      // });

      // const bankAccount = await this.stripe.customers.createSource(
      //   'cus_P8vwxj2kl8EXMZ',
      //   {source: token.id}
      // );

      // const verifyBankAccount = await this.stripe.customers.verifySource(
      //   'cus_P8vwxj2kl8EXMZ',
      //   'ba_1OKeepCXwn1h2ptn89PKr4Rh',
      //   {
      //     amounts: [32, 45],
      //   }
      // );

      // const payment = await this.stripe.paymentIntents.create({
      //   customer:'cus_P8vwxj2kl8EXMZ',
      //   currency:'USD',
      //   amount:1000,
      //   confirm:true,
      //   automatic_payment_methods: {
      //     enabled: true,
      //   },
      //   capture_method:'automatic',
      //   return_url:'www.return.com'
      // });

      // const paymentIntent = await this.stripe.paymentIntents.create({
      //   amount: 1099,
      //   currency: 'usd',
      //   customer:'cus_P8vwxj2kl8EXMZ'
      // });

      const charge = await this.stripe.charges.create({
        amount: 1099,
        currency: 'usd',
        customer: 'cus_P8vwxj2kl8EXMZ',
      });

      return {
        charge,
      };
    } catch (error) {
      console.log(
        '🚀 ~ file: payment.service.ts:86 ~ PaymentService ~ createCustomer ~ error:',
        error,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
