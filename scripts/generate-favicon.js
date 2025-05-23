const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Ensure the directories exist
const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple HTML5 canvas favicon
const faviconSvg = `
<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="#FF1493"/>
  <text x="32" y="40" fill="white" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">SSG</text>
</svg>
`;

fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSvg);

// Create different sized PNGs
const sizes = [16, 32, 64, 192, 512];

// Function to convert SVG to PNG using ImageMagick
function convertToPng(size) {
  const inputPath = path.join(iconsDir, 'favicon.svg');
  const outputPath = path.join(publicDir, size === 64 ? 'favicon.ico' : `logo${size}.png`);
  
  const command = size === 64
    ? `magick convert ${inputPath} -resize ${size}x${size} ${outputPath}`
    : `magick convert ${inputPath} -resize ${size}x${size} ${outputPath}`;

  exec(command, (error) => {
    if (error) {
      console.error(`Error generating ${size}x${size} favicon:`, error);
    } else {
      console.log(`Generated ${size}x${size} favicon`);
    }
  });
}

// Generate all sizes
sizes.forEach(size => convertToPng(size)); 