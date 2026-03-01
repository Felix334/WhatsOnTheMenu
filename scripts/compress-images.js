const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, '../src/app/components/img');

const images = [
  { name: 'image.png', options: { width: 1920, quality: 80 } },
  { name: 'Beispiel-Karte.png', options: { width: 800, quality: 80 } },
  { name: 'Beispiel-Karte2.png', options: { width: 800, quality: 80 } },
];

async function compressImages() {
  console.log('Starting image compression...\n');
  
  for (const img of images) {
    const inputPath = path.join(imagesDir, img.name);
    const outputName = img.name.replace('.png', '.webp');
    const outputPath = path.join(imagesDir, outputName);
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSize = (originalStats.size / 1024).toFixed(2);
      
      // Compress with sharp
      await sharp(inputPath)
        .resize(img.options.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: img.options.quality })
        .toFile(outputPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSize = (compressedStats.size / 1024).toFixed(2);
      const savings = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`✓ ${img.name} -> ${outputName}`);
      console.log(`  Original: ${originalSize} KB -> Compressed: ${compressedSize} KB (${savings}% smaller)\n`);
    } catch (error) {
      console.error(`Error processing ${img.name}:`, error.message);
    }
  }
  
  console.log('Compression complete!');
}

compressImages();
