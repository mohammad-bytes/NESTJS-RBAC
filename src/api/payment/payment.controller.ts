import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create-account')
  async create() {
    return await this.paymentService.createAccount();
  }

  @Post('/account-link/:account_id')
  async accountLink(@Param('account_id') account_id: string) {
    return await this.paymentService.accountLink(account_id);
  }

  @Post('/top-up')
  async topUp(@Body() body) {
    return await this.paymentService.topUpAccount(body);
  }

  @Post('/transfer/:account_id')
  async transfer(@Param('account_id') account_id: string) {
    return await this.paymentService.transfer(account_id);
  }

  @Post('/create-customer')
  async createCustomer() {
    return await this.paymentService.createCustomer();
  }
}
