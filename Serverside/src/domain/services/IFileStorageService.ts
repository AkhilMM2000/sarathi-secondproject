export interface IFileStorageService {
  getSignedUrl(fileType: string, userId: string): Promise<{
    
      public_id: string; 
      timestamp: number; 
      signature: string; 
      folder: string; 
  }>;
}
