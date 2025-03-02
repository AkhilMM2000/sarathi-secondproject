import { injectable } from "tsyringe";
import { v2 as cloudinary } from "cloudinary";
import crypto from 'crypto'
import { IFileStorageService } from "../../domain/services/IFileStorageService";
type SignedUrlResponse = {
  cloud_name: string | undefined;
  api_key: string | undefined;
  public_id: string;
  timestamp: number;
  signature: string;
  folder: string;
};

@injectable()
export class CloudinaryFileStorageService implements IFileStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async getSignedUrl(fileType: string, fileName: string): Promise<SignedUrlResponse> {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const publicId = `uploads/${fileName}-${timestamp}`;
      const folder = "private"; // Ensure folder is included
      const signature = cloudinary.utils.api_sign_request(
     
        { folder, public_id: publicId, timestamp },
        process.env.CLOUDINARY_API_SECRET as string
      );

      return {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        public_id: publicId,
        timestamp,
        signature,
        folder
      };
    } catch (error) {
      throw new Error("Failed to generate signed URL for upload");
    }
  }
}
