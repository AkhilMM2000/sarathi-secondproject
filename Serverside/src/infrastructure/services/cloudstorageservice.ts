import { injectable } from "tsyringe";
import { v2 as cloudinary } from "cloudinary";
import crypto from 'crypto';
import { IFileStorageService } from "../../domain/services/IFileStorageService";

type SignedUrlResponse = {
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

  async getSignedUrl(fileType: string, userId: string): Promise<SignedUrlResponse> {
    try {
      // ✅ Validate file type (only allow specific formats)
      if (!['image/png', 'image/jpeg', 'application/pdf'].includes(fileType)) {
        throw new Error("Invalid file type");
      }

      // ✅ Generate secure random filename
      const timestamp = Math.round(new Date().getTime() / 1000);
      const randomString = crypto.randomBytes(8).toString('hex'); 
      const publicId = `uploads/${userId}-${randomString}-${timestamp}`;
      // const transformation = "c_fill,w_600,h_600"; 
      // ✅ Dynamically assign folder based on file type
      const folder = fileType.startsWith('image/') ? 'images' : 'documents';

      // ✅ Generate a secure signature
      const signature = cloudinary.utils.api_sign_request(
        { folder, public_id: publicId, timestamp },
        process.env.CLOUDINARY_API_SECRET as string
      );

      return { public_id: publicId, timestamp, signature, folder };
    } catch (error) {
      throw new Error("Failed to generate signed URL for upload");
    }
  }
}
