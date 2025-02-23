import axios from "axios";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL 
  }

  async registerUser(formData: Record<string, any>, type: "users" | "drivers") {
    try {
      const response = await axios.post(`${this.baseUrl}/${type}/register`, formData);
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
  async uploadImage(image: File) {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "Sarathi");
    formData.append("cloud_name", "dcoo56p7a");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcoo56p7a/image/upload",
        formData
      );

      if (response.status === 200) {
        return response.data.secure_url; // Return the uploaded image URL
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; 
    }
  }
}

export default new ApiService(); // Export instance of the class
