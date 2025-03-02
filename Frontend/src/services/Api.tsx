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
  
  async verifyOtp(otp: string, email: string,type: "users" | "drivers") {
    try {
      const response = await axios.post(`${this.baseUrl}/${type}/verify-otp`, { otp, email,role:type });
      return response.data;
    } catch (error: any) {
      throw error; 
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

  async getSignedUrls(fileType: string, fileName: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/files/signed-url`, {
        params: { fileType, fileName },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to get signed URL";
    }
  }
  
  async uploadFile(file: File, signedData: any): Promise<string> {
  
    try {
     
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signedData.api_key);
      formData.append("timestamp", signedData.timestamp.toString());
      formData.append("signature", signedData.signature);
      formData.append("public_id", signedData.public_id);
      formData.append("folder", signedData.folder); // Optional but recommended


  
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${signedData.cloud_name}/image/upload`,
        formData
      );
  
  
      if (response.status === 200) {
        return response.data.public_id;; // Store this in the database
      }
  
      throw new Error("File upload failed");
    } catch (error: any) {
      throw error.response?.data?.message || "File upload failed";
  
    }
  }
  
  
}

export default new ApiService(); // Export instance of the class
