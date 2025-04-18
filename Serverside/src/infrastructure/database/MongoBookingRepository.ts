import { BookingWithUsername, IBookingRepository, PaginatedResult } from "../../domain/repositories/IBookingrepository"; 
import { Booking } from "../../domain/models/Booking"; // Domain model
import BookingModel from "./modals/Bookingschema"; // Mongoose model
import { injectable } from "tsyringe";
import { AuthError } from "../../domain/errors/Autherror";
import { log } from "console";
@injectable()
export class MongoBookingRepository implements IBookingRepository {
  async createBooking(booking: Booking): Promise<Booking> {
    try {
      const created = await BookingModel.create(booking);
      return created.toObject();
    } catch (err: any) {
      console.error("MongoBookingRepository.createBooking error:", err);
     
      throw new AuthError(`Failed to create booking. Please try again.${err.message}`, 500);
    }
  }
  
    async findBookingById(id: string): Promise<Booking | null> {
      const booking = await BookingModel.findById(id);
      return booking ? booking.toObject() : null;
    }

    async GetAllBookings(page: number, limit: number): Promise<PaginatedResult<BookingWithUsername>> {
      try {
       const skip = (page - 1) * limit;
    
      const [bookings, total] = await Promise.all([
        BookingModel.find()
          .populate("userId", "name profile") 
          .populate("driverId", "name profileImage") 
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        BookingModel.countDocuments(),
      ]);
    
      const formattedBookings: BookingWithUsername[] = bookings.map((b) => {
        const plain = b.toObject() as Booking & { place?: string };
        return {
          ...plain,
          username: (plain.userId as any)?.name || "Unknown", 
          place: plain.place || "N/A", // safely access populated username
          drivername: (plain.driverId as any)?.name|| "Unknown",
          driverImage: (plain.driverId as any)?.profileImage || "N/A", // safely access populated username
           userImage: (plain.userId as any)?.profile || "N/A", // safely access populated username
        };
      });
    
      return {
        data: formattedBookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
      } catch (error:any) {
        console.error('Error fetching all bookings:', error.message);
        throw new AuthError(`${error.message}`, 500);
        
      }
    }


  
    async findBookingsByDriver(
      driverId: string,
      page: number,
      limit: number
    ): Promise<PaginatedResult<BookingWithUsername>> {
      const skip = (page - 1) * limit;
    
      const [bookings, total] = await Promise.all([
        BookingModel.find({ driverId })
          .populate("userId", "name") // Only get the `username` from `userId`
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        BookingModel.countDocuments({ driverId }),
      ]);
    
      const formattedBookings: BookingWithUsername[] = bookings.map((b) => {
        const plain = b.toObject() as Booking & { place?: string };
        return {
          ...plain,
          username: (plain.userId as any)?.name || "Unknown", 
          place: plain.place || "N/A", // safely access populated username
        };
      });
    
      return {
        data: formattedBookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }
     
  
    async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
      try {
        const updated = await BookingModel.findByIdAndUpdate(id, updates, { new: true });
        return updated ? updated.toObject() : null;
      } catch (error:any) {
        console.error('Error updating booking:', error.message);
        throw new AuthError(`${error.message}`, 500);
      }
    }
    
  
    async checkDriverAvailability(driverId: string, start: Date, end?: Date): Promise<boolean> {
      // If no end date provided, assume it's a one-day booking
      try{
      const effectiveEnd = end || start;
    console.log(effectiveEnd);  
     
const conflict = await BookingModel.findOne({
  driverId,
  status: { $ne: "CANCELLED" },
  $or: [
    {
      // Booking has both startDate and endDate
      startDate: { $lte: effectiveEnd },
      endDate: { $gte: start },
    },
    {
      // Booking has only startDate (no endDate field present)
      startDate: { $eq: effectiveEnd },
      endDate: { $exists: false },
    },
  ],
});
   
      return !conflict;
    }
   catch (error:any) {
    // Optionally, use a logger here
    console.error(`Error checking driver availability for ${driverId}:`, error);

    // costome error handling
    throw new AuthError(`failed to check availability of driver ${error.message}`, 500);
  }
    
  
}

async findBookingsByUser(userId: string, page: number, limit: number): Promise<PaginatedResult<BookingWithUsername>> {
  try {
    const skip = (page - 1) * limit;
    
    const [bookings, total] = await Promise.all([
      BookingModel.find({ userId })
        .populate("userId", "name") 
        .populate("driverId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BookingModel.countDocuments({ userId }),
    ]);
  
    const formattedBookings: BookingWithUsername[] = bookings.map((b) => {
      const plain = b.toObject() as Booking & { place?: string };
      return {
        ...plain,
        username: (plain.userId as any)?.name || "Unknown", 
        place: plain.place || "N/A", // safely access populated username
        drivername: (plain.driverId as any)?.name || "Unknown",
         driverImage: (plain.driverId as any)?.profileImage || "N/A", // safely access populated username
     
      };
    });
  
    return {
      data: formattedBookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (err: any) {
    console.error("MongoBookingRepository.findBookingsByUser error:", err);
    throw new AuthError(`Failed to fetch user bookings. ${err.message}`, 500);
  }
}




  }