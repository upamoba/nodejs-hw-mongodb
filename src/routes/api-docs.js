import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';



const router = Router();


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const candidates = [
  path.resolve(__dirname, '../../docs/swagger.json'),
  path.resolve(__dirname, '../docs/swagger.json'),
  path.resolve(process.cwd(), 'docs/swagger.json'),
];
const swaggerJsonPath = candidates.find((p) => fs.existsSync(p));

if (!swaggerJsonPath) {

  router.get('/', (_req, res) => {
    res.status(500).json({
      status: 500,
      message:
        'docs/swagger.json not found. Ensure `npm run bundle-openapi` runs during build.',
    });
  });
} else {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));

  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

  router.get('/openapi.json', (_req, res) => res.json(swaggerDocument));
}

export default router;
