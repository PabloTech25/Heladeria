
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const PRODUCTS_JSON = path.join(PROJECT_ROOT, 'src', 'data', 'products.json');

async function optimizeImages() {
    try {
        const data = await fs.readFile(PRODUCTS_JSON, 'utf-8');
        const products = JSON.parse(data);
        const updatedProducts = [];

        console.log(`Starting optimization for ${products.length} products...`);

        for (const product of products) {
            if (!product.image) {
                updatedProducts.push(product);
                continue;
            }

            const originalPath = path.join(PUBLIC_DIR, product.image);
            const directory = path.dirname(originalPath);
            const ext = path.extname(originalPath);
            const name = path.basename(originalPath, ext);
            const newFileName = `${name}.webp`;
            const newRelativePath = path.join(path.dirname(product.image), newFileName).replace(/\\/g, '/');
            const outputPath = path.join(directory, newFileName);

            try {
                await fs.access(originalPath);

                console.log(`Optimizing: ${product.image} -> ${newRelativePath}`);

                const image = sharp(originalPath);
                const metadata = await image.metadata();

                let pipeline = image;

                // Resize if wider than 800px
                if (metadata.width > 800) {
                    pipeline = pipeline.resize(800);
                }

                // Convert to webp
                await pipeline
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                // Update product reference
                updatedProducts.push({
                    ...product,
                    image: newRelativePath
                });

                // If the original was different from the output, we could delete it, 
                // but let's keep it for safety for now or delete if it's not the same path
                if (originalPath !== outputPath) {
                    // await fs.unlink(originalPath); // Uncomment to clean up
                    console.log(`  Done. Original kept for safety.`);
                }

            } catch (err) {
                console.error(`Error processing ${originalPath}:`, err.message);
                updatedProducts.push(product);
            }
        }

        await fs.writeFile(PRODUCTS_JSON, JSON.stringify(updatedProducts, null, 2));
        console.log('Successfully updated products.json and optimized images.');

    } catch (error) {
        console.error('Core error:', error);
    }
}

optimizeImages();
