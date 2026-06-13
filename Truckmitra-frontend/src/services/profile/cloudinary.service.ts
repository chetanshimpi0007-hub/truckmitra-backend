// src/services/cloudinary.service.ts

import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dmtrmiad3';
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'truckmitra_preset';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

class CloudinaryService {
  
  /**
   * Upload image to Cloudinary
   * @param file - File object or base64 string
   * @param folder - Folder name in Cloudinary (optional)
   * @returns Promise with Cloudinary response
   */
  async uploadImage(file: File | string, folder: string = 'truckmitra'): Promise<string> {
    try {
      const formData = new FormData();
      
      // If file is base64 string
      if (typeof file === 'string') {
        formData.append('file', file);
      } else {
        // If file is File object
        formData.append('file', file);
      }
      
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folder);
      
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload multiple images to Cloudinary
   * @param files - Array of files or base64 strings
   * @param folder - Folder name in Cloudinary
   * @returns Promise with array of Cloudinary URLs
   */
  async uploadMultipleImages(files: (File | string)[], folder: string = 'truckmitra'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Get optimized image URL with transformations
   * @param url - Original Cloudinary URL
   * @param options - Transformation options (width, height, crop, etc.)
   * @returns Optimized URL
   */
  getOptimizedUrl(url: string, options: { width?: number; height?: number; crop?: string } = {}): string {
    if (!url) return '';
    
    const { width, height, crop = 'fill' } = options;
    let transformations = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    
    if (transformations.length === 0) return url;
    
    // Insert transformations before version
    return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
  }

  /**
   * Delete image from Cloudinary (requires backend API)
   * @param publicId - Cloudinary public ID
   */
  async deleteImage(publicId: string): Promise<void> {
    // Note: This should be handled by backend for security
    // Frontend cannot delete directly due to security restrictions
    console.warn('Delete image should be handled by backend API');
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Cloudinary URL
   * @returns Public ID
   */
  getPublicIdFromUrl(url: string): string {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
    return matches ? matches[1] : '';
  }
}

export default new CloudinaryService();