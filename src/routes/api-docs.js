import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';



const router = Router();

// __dirname для ES-модулів
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const swaggerJsonPath = path.resolve(__dirname, '../../docs/swagger.json');

if (fs.existsSync(swaggerJsonPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));

  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
  router.get('/openapi.json', (_req, res) => res.json(swaggerDocument));
} else {

  router.get('/', (_req, res) => {
    res.status(503).send('Swagger docs are not built yet. Run "npm run bundle-openapi" on this branch.');
  });
  router.get('/openapi.json', (_req, res) => {
    res.status(503).json({ message: 'Swagger docs are not built yet.' });
  });
}

export default router;
