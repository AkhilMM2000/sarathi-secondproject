import { Booking } from "../models/Booking";
export type BookingWithUsername = Booking & {
  username: string;
 place:string,
 drivername?:string
 driverImage?:string,
userImage?:string,
};

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
export interface IBookingRepository {
  GetAllBookings(page: number, limit: number): Promise<PaginatedResult<BookingWithUsername>>;
  createBooking(booking: Booking): Promise<Booking>;
  findBookingById(id: string): Promise<Booking | null>;
  findBookingsByUser(userId: string, page: number, limit: number): Promise<PaginatedResult<BookingWithUsername>>;
  findBookingsByDriver(driverId: string, page: number, limit: number): Promise<PaginatedResult<BookingWithUsername>>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null>;
  checkDriverAvailability(driverId: string, start: Date, end?: Date): Promise<boolean>;
  


}
