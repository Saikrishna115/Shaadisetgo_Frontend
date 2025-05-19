import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Paper,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  ZoomIn as ZoomIcon
} from '@mui/icons-material';
import { uploadImage, validateImage, compressImage } from '../utils/imageUpload';

const ImageUpload = ({
  onImageUpload,
  onImageDelete,
  initialImage,
  maxSize = 5,
  aspectRatio = 1,
  label = 'Upload Image',
  error,
  helperText,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  showPreview = true,
  customPreview,
  onPreviewClick,
  disabled = false,
  showZoom = true
}) => {
  const [preview, setPreview] = useState(initialImage || '');
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImage(file, allowedTypes);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setLoading(true);
    setUploadError('');

    try {
      // Compress image if needed
      const compressedFile = await compressImage(file, maxSize);
      const result = await uploadImage(compressedFile);
      
      if (result.success) {
        setPreview(result.url);
        onImageUpload(result);
      } else {
        setUploadError(result.error || 'Failed to upload image');
      }
    } catch (err) {
      setUploadError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setPreview('');
    onImageDelete();
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    if (onPreviewClick && preview) {
      onPreviewClick(preview);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        ref={fileInputRef}
        disabled={disabled}
      />

      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          p: 2,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' :
                     error || uploadError ? 'error.main' :
                     'grey.300',
          borderRadius: 2,
          textAlign: 'center',
          cursor: disabled ? 'default' : 'pointer',
          position: 'relative',
          aspectRatio: aspectRatio,
          overflow: 'hidden',
          opacity: disabled ? 0.7 : 1,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: disabled ? undefined : 'primary.main',
            '& .upload-overlay': {
              opacity: 1
            }
          }
        }}
      >
        {preview ? (
          <>
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <Box
              className="upload-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
            >
              {showZoom && (
                <Tooltip title="View Image">
                  <IconButton
                    onClick={handlePreviewClick}
                    sx={{ color: 'white' }}
                  >
                    <ZoomIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete Image">
                <IconButton
                  onClick={handleDelete}
                  sx={{ color: 'white' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            {loading ? (
              <CircularProgress size={40} />
            ) : (
              <>
                <UploadIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                <Typography variant="body1" color="textSecondary">
                  {label}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {isDragging ? 'Drop image here' : `Click or drag to upload (max ${maxSize}MB)`}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Paper>

      {(error || uploadError || helperText) && (
        <Typography
          variant="caption"
          color={error || uploadError ? 'error' : 'textSecondary'}
          sx={{ mt: 1, display: 'block' }}
        >
          {error || uploadError || helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload; 