
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public', 'productos');

async function cleanupOriginals(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await cleanupOriginals(fullPath);
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const webpPath = fullPath.substring(0, fullPath.length - ext.length) + '.webp';
                try {
                    await fs.access(webpPath);
                    console.log(`Deleting original: ${fullPath}`);
                    await fs.unlink(fullPath);
                } catch (e) {
                    // WebP doesn't exist, keep original
                }
            }
        }
    }
}

cleanupOriginals(PUBLIC_DIR)
    .then(() => console.log('Cleanup complete.'))
    .catch(err => console.error('Cleanup failed:', err));
