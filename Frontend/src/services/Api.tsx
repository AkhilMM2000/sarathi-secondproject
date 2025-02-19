import axios from "axios";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/users";
  }

  async registerUser(formData: Record<string, any>) {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, formData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed";
    }
  }
  
  async verifyOtp(otp: string, email: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/verify-otp`, { otp, email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "OTP verification failed";
    }
  }

}

export default new ApiService(); // Export instance of the class
