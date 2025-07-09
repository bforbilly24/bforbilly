import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '@/types/environment';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
  secure: true,
});

// Helper function untuk upload image
export const uploadImage = async (file: File | string, options?: {
  folder?: string;
  public_id?: string;
  transformation?: any;
}) => {
  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder: options?.folder || 'portfolio',
      public_id: options?.public_id,
      transformation: options?.transformation,
      resource_type: 'auto', // auto-detect file type
    });
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      }
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

// Helper function untuk upload video
export const uploadVideo = async (file: File | string, options?: {
  folder?: string;
  public_id?: string;
}) => {
  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder: options?.folder || 'portfolio/videos',
      public_id: options?.public_id,
      resource_type: 'video',
    });
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        duration: result.duration,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      }
    };
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Video upload failed'
    };
  }
};

// Helper function untuk upload text/raw files
export const uploadRawFile = async (content: string, options: {
  public_id: string;
  folder?: string;
  format?: string;
}) => {
  try {
    const result = await cloudinary.uploader.upload(`data:text/plain;base64,${Buffer.from(content).toString('base64')}`, {
      folder: options.folder || 'portfolio/texts',
      public_id: options.public_id,
      resource_type: 'raw',
      format: options.format || 'txt',
    });
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        bytes: result.bytes,
      }
    };
  } catch (error) {
    console.error('Cloudinary raw file upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Raw file upload failed'
    };
  }
};

// Helper function untuk get file/image
export const getCloudinaryUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}) => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: {
      width: options?.width,
      height: options?.height,
      crop: options?.crop || 'fill',
      quality: options?.quality || 'auto',
      format: options?.format || 'auto',
    }
  });
};

// Helper function untuk delete file
export const deleteCloudinaryFile = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    return {
      success: result.result === 'ok',
      data: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    };
  }
};

// Helper function untuk list files dalam folder
export const listCloudinaryFiles = async (folder: string = '', resourceType: 'image' | 'video' | 'raw' = 'image') => {
  try {
    const apiParams: any = {
      type: 'upload',
      resource_type: resourceType,
      max_results: 500,
    };
    
    // Only add prefix if folder is specified
    if (folder && folder.length > 0) {
      apiParams.prefix = folder;
    }
    
    const result = await cloudinary.api.resources(apiParams);
    
    return {
      success: true,
      data: result.resources
    };
  } catch (error) {
    console.error('Cloudinary list error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'List failed'
    };
  }
};

export default cloudinary;
