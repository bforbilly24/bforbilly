import { ENV } from '@/types/environment';

// Validasi apakah request berasal dari domain yang diizinkan
export const isAllowedDomain = (origin: string): boolean => {
  if (!origin) return false;
  
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    
    // Check jika hostname ada dalam daftar allowed domains
    return ENV.ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

// Middleware untuk API routes
export const validateCloudinaryRequest = (request: Request): boolean => {
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  
  // Development: allow all
  if (ENV.NODE_ENV === 'development') {
    return true;
  }
  
  // Production: validate domain
  return isAllowedDomain(origin) || isAllowedDomain(referer);
};

// Generate secure URL dengan domain validation
export const getSecureCloudinaryUrl = (publicId: string, transformations?: Record<string, any>) => {
  // Base implementation - bisa ditambah signature jika diperlukan
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  
  if (!transformations) {
    return `${baseUrl}/image/upload/${publicId}`;
  }
  
  const transformString = Object.entries(transformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
    
  return `${baseUrl}/image/upload/${transformString}/${publicId}`;
};
