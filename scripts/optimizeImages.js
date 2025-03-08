const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets/images');
const OUTPUT_DIR = path.join(__dirname, '../assets/optimized');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(filePath) {
  const fileName = path.basename(filePath);
  const outputPath = path.join(OUTPUT_DIR, fileName);

  try {
    await sharp(filePath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));

    console.log(`Optimized: ${fileName}`);
  } catch (error) {
    console.error(`Error optimizing ${fileName}:`, error);
  }
}

async function processDirectory() {
  const files = fs.readdirSync(ASSETS_DIR);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

  console.log(`Found ${imageFiles.length} images to optimize`);

  for (const file of imageFiles) {
    await optimizeImage(path.join(ASSETS_DIR, file));
  }

  console.log('Image optimization complete!');
}

processDirectory().catch(console.error);