import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../domain/repositories/IBookingrepository"; 
@injectable()
export class GetRideHistory {
  constructor(
     @inject("IBookingRepository")
    private bookingRepo: IBookingRepository

  ) {}

  async execute(role:"user"|"driver", id: string,page: number = 1, limit: number = 2) {
   
    const ride= await this.bookingRepo.getRideHistoryByRole(id,role,page,limit)
   
    return ride
  }
}
