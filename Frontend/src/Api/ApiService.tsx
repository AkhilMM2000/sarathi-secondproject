import axios from "axios";
import { DriverAPI, UserAPI } from "./AxiosInterceptor";


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
     
      throw error.response?.data?.error || "Registration failed";
    }
  }
  
  async verifyOtp(otp: string, email: string,type: "users" | "drivers") {
    try {
      const response = await axios.post(`${this.baseUrl}/${type}/verify-otp`, { otp, email,role:type },{withCredentials:true});
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
      formData.append("api_key",import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("timestamp", signedData.timestamp.toString());
      formData.append("signature", signedData.signature);
      formData.append("public_id", signedData.public_id);
      formData.append("folder", signedData.folder); // Optional but recommended
      // formData.append("transformation","c_fill,w_600,h_600");

  
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
  
   async chatSignedUrls(role: "driver" | "user",fileType: string) {
    try {
      const api=role=='user'?UserAPI:DriverAPI
      const response = await api.post('/chat/signature',{fileType})
        
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to get signed URL";
    }
  }

async uploadFileInChat(file: File, signedData: any): Promise<string> {
  try {
    console.log(signedData,'signature')
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append("timestamp", signedData.timestamp.toString());
    formData.append("signature", signedData.signature);
    formData.append("public_id", signedData.public_id);
    formData.append("folder", signedData.folder); // already provided
    formData.append('upload_preset', signedData.upload_preset
);

    // ✅ Use resource_type as per backend decision
    const resourceType = signedData.folder === "images" ? "image" : "raw";

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData
    );

    if (response.status === 200) {
      console.log(response.data, 'Upload successful');
      return response.data.secure_url;
    }

    throw new Error("File upload failed");
  } catch (error: any) {
   
    throw error.response?.data?.message || "File upload failed";
  }
}

  async Login(formData: Record<string, any>, type: "users" | "drivers"|"admin") {
    try {
      const payload = { ...formData,    role: type === "drivers" ? "driver" : type === "admin" ? "admin" : "user"  }; // Add role dynamically

      const response = await axios.post(`${this.baseUrl}/${type}/login`, payload, {
        withCredentials:true,
      
      });
      return response.data;
    } catch (error: any) {
      throw error; 
    }
  }
  
  handleLogout = async (role: "driver" | "user" | "admin") => {
    try {
        const response = await axios.post(`${this.baseUrl}/auth/logout`, {}, { 
          params: { role }, 
          withCredentials: true 
      });
      
     
        localStorage.removeItem(`${role}_accessToken`);

        return response.data.message; // Return the success message from the backend
    } catch (error:unknown) {
        console.error("Logout failed:", error);
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Logout failed");
      }
      throw new Error("An unknown error occurred");
    }

 }

}

export default new ApiService(); 


