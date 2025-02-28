
export interface IFileStorageService {
    getSignedUrl(fileType: string, fileName: string): Promise<{
      cloud_name: string | undefined; 
      api_key: string | undefined; 
      public_id: string; 
      timestamp: number; 
      signature: string; 
      folder: string; 
  }>;
    // uploadFile(file: Buffer, fileType: string): Promise<string>;
  }
  