import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../domain/repositories/IBookingrepository"; 
import { Booking, paymentStatus } from "../../../domain/models/Booking"; 
import { AuthError } from "../../../domain/errors/Autherror";
import { IStripeService } from "../../../domain/services/IStripeService";

@injectable()
export class AttachPaymentIntentIdToBooking {
  constructor(
    @inject("IBookingRepository")
    private bookingRepo: IBookingRepository,
      @inject('StripePaymentService')
        private stripeService: IStripeService
  ) {}

  async execute(bookingId: string, paymentIntentId?: string,paymentstatus?:paymentStatus): Promise<void> {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new AuthError('Booking not found', 404);
    }
    if(paymentIntentId){

    booking.paymentIntentId = paymentIntentId;
  }
  if(paymentstatus){
    booking.paymentStatus = paymentstatus;
  }
  if(paymentStatus&&paymentIntentId){
    const payment=await this.stripeService.retrievePaymentIntent(paymentIntentId);
    booking.driver_fee=(payment.amount-payment.application_fee_amount!)*.01;
    booking.platform_fee=payment.application_fee_amount!*.01;
  }

    await this.bookingRepo.updateBooking(bookingId, booking);
  }
}
