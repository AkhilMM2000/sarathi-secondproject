import { inject, injectable } from "tsyringe";
import { BookingWithUsername, IBookingRepository, PaginatedResult } from "../../../domain/repositories/IBookingrepository"; 


@injectable()
export class GetAllBookings {
  constructor(
    @inject("IBookingRepository")
    private bookingRepo: IBookingRepository
  ) {}

  async execute( page: number = 1, limit: number = 3): Promise<PaginatedResult<BookingWithUsername>>{
    return await this.bookingRepo.GetAllBookings( page, limit);
  }

}
