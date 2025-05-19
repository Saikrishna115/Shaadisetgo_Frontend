import axios from 'axios';

const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

if (!IMGBB_API_KEY) {
  console.error('IMGBB_API_KEY is not defined in environment variables');
}

export const uploadImage = async (file, retries = 3) => {
  if (!IMGBB_API_KEY) {
    return {
      success: false,
      error: 'Image upload service is not configured'
    };
  }

  for (let i = 0; i < retries; i++) {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Make the request to ImgBB
      const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
        params: {
          key: IMGBB_API_KEY
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return {
          success: true,
          url: response.data.data.url,
          deleteUrl: response.data.data.delete_url,
          thumbnail: response.data.data.thumb?.url || response.data.data.url,
          size: response.data.data.size,
          time: response.data.data.time,
          title: response.data.data.title,
          mime: response.data.data.mime
        };
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error(`Upload attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        return {
          success: false,
          error: error.message || 'Failed to upload image after multiple attempts'
        };
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

export const validateImage = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Please upload a valid image file (${allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')})`
    };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size should be less than 5MB'
    };
  }

  return { valid: true };
};

export const compressImage = async (file, maxSizeMB = 5) => {
  if (file.size <= maxSizeMB * 1024 * 1024) return file;

  try {
    const imageCompression = (await import('browser-image-compression')).default;
    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
};

export const deleteImage = async (deleteUrl) => {
  try {
    await axios.delete(deleteUrl);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete image'
    };
  }
}; 