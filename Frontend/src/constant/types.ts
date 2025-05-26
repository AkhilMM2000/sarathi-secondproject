
export interface IUser{
  _id:string,
  name: string;
  email: string;
  mobile: string;
  password: string;
  referralCode?: string; // Optional field
  isBlock: boolean;
  role: "user" | "driver" | "admin"; // Role should be a specific type
  place: string;
  location: {
    latitude: number;
    longitude: number;
  };
  profile:string
  referalPay:boolean
  onlineStatus: 'online' | 'offline';
  lastSeen: Date;
}

  export type UserRole = "user" | "driver" | "admin";


  export interface UserWithVehicleCount {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    referralCode?: string; 
    profile?: string;  
    isBlock: boolean;
    role: UserRole; 
    createdAt: string; 
    __v: number;
    vehicleCount: number;
  }
  
  export interface DriverData {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    place:string;
    password: string;
    profileImage: string;
    aadhaarNumber: string;
    licenseNumber: string;
    aadhaarImage: string;
    licenseImage: string;
    status: "pending" | "approved" | "rejected"
    isBlock: boolean;
    onlineStatus: 'online' | 'offline';
  lastSeen: Date;
stripeAccountId?:string
activePayment?:boolean
    reason?:string
    role: "driver";
    averageRating?: number;
     totalRatings?: number;
    totalRatingPoints?: number;
  }
  export interface IVehicle {
    _id: string;
    userId: string;
    vehicleImage: string;
    rcBookImage: string;
    Register_No: string;
    ownerName: string;
    vehicleName: string;
    vehicleType: string;
    polution_expire: string; // ISO date string
  }
  //type for video call 
  export type CallerInfo = {
  fromId: string;
  callerName: string;
  role: "user" | "driver";
};

export interface RideHistory {
  fromLocation: string;
  toLocation: string;
  startDate: string;
  estimatedKm: number;
  estimatedFare: number;
  status: "CANCELLED" | "REJECTED";
  paymentStatus: "COMPLETED";
  bookingType: "RANGE_OF_DATES" | "ONE_RIDE";
  paymentMode: "stripe";
  createdAt: string;
  updatedAt: string;
  finalFare: number;
  paymentIntentId: string;
  driver_fee: number;
  platform_fee: number;
  reason?:string
  email: string;
  place: string;
  name: string;
  profile: string;
}
