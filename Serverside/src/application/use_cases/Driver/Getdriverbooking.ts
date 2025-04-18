import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../domain/repositories/IBookingrepository";
import { BookingWithUsername } from "../../../domain/repositories/IBookingrepository";
import { PaginatedResult } from "../../../domain/repositories/IBookingrepository";

@injectable()
export class GetUserBookings {
  constructor(
    @inject("IBookingRepository")
    private bookingRepo: IBookingRepository
  ) {}

  async execute(driverId: string, page: number = 1, limit: number = 2): Promise<PaginatedResult<BookingWithUsername>> {
   
    return await this.bookingRepo.findBookingsByDriver(driverId, page, limit);
  }
}

