

import { inject, injectable } from 'tsyringe';
import { IStripeService } from '../../../domain/services/IStripeService'; 
import { am } from '@upstash/redis/zmscore-BdNsMd17';
import { IDriverRepository } from '../../../domain/repositories/IDriverepository';
import { AuthError } from '../../../domain/errors/Autherror';

interface CreatePaymentIntentRequest {
  amount: number;
  driverId: string;
}

@injectable()
export class CreatePaymentIntent {
  constructor(
    @inject('StripePaymentService')
    private stripeService: IStripeService,
     @inject("IDriverRepository") private driverRepository: IDriverRepository,
  ) {}

  async execute({
    amount,
    driverId,
  }: CreatePaymentIntentRequest): Promise<{ clientSecret: string,paymentIntentId:string }> {
    const platformFee = Math.floor(amount * 0.1); // 10% platform fee
const driver = await this.driverRepository.findDriverById(driverId);
console.log(driver,'driver')
console.log(driver?.stripeAccountId)
if(driver){
  if(!driver.stripeAccountId){
    throw new AuthError("Driver not found or not onboarded",  404);
  }
  
}
    return await this.stripeService.createPaymentIntent({
      amount,
      driverStripeAccountId: driver?.stripeAccountId || '',
      platformFee,
    });
  }
}
