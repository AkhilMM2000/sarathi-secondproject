
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
    
stripeAccountId?:string
activePayment?:boolean
    reason?:string
    role: "driver";
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
  