import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Paper,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ZoomIn as ZoomIcon,
  Reorder as ReorderIcon
} from '@mui/icons-material';
import ImageUpload from './ImageUpload';

const MultipleImageUpload = ({
  images = [],
  onImagesChange,
  maxImages = 10,
  aspectRatio = 16/9,
  label = 'Upload Images',
  gridSpacing = 2,
  columns = { xs: 12, sm: 6, md: 4 },
  showImageNumbers = true,
  allowReorder = true,
  onReorder,
  customImageComponent,
  disabled = false,
  showPreview = true
}) => {
  const [error, setError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (result, index) => {
    const newImages = [...images];
    newImages[index] = result;
    onImagesChange(newImages);
    setError('');
  };

  const handleImageDelete = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleAddImage = () => {
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }
    onImagesChange([...images, null]);
  };

  const handleDragStart = (index) => {
    if (!allowReorder) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || !allowReorder) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && onReorder) {
      onReorder(images);
    }
    setDraggedIndex(null);
  };

  const handlePreviewClick = (image) => {
    setPreviewImage(image);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{label}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {allowReorder && (
            <Tooltip title="Drag to reorder images">
              <IconButton size="small" color="primary">
                <ReorderIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Add Image">
            <IconButton
              onClick={handleAddImage}
              disabled={disabled || images.length >= maxImages}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={gridSpacing}>
        {images.map((image, index) => (
          <Grid item {...columns} key={index}>
            <Box
              draggable={allowReorder && !disabled}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              sx={{
                cursor: allowReorder && !disabled ? 'move' : 'default',
                opacity: draggedIndex === index ? 0.5 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {customImageComponent ? (
                customImageComponent(image, index)
              ) : (
                <ImageUpload
                  initialImage={image?.url}
                  onImageUpload={(result) => handleImageUpload(result, index)}
                  onImageDelete={() => handleImageDelete(index)}
                  aspectRatio={aspectRatio}
                  label={showImageNumbers ? `Image ${index + 1}` : 'Upload Image'}
                  disabled={disabled}
                  showPreview={showPreview}
                  onPreviewClick={() => handlePreviewClick(image)}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}

      {images.length === 0 && (
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Typography color="textSecondary">
            No images uploaded yet. Click the + button to add images.
          </Typography>
        </Paper>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {previewImage && (
            <Box
              component="img"
              src={previewImage.url}
              alt="Preview"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultipleImageUpload; 