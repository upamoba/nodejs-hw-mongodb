import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';



const router = Router();

const swaggerJsonPath = path.resolve(process.cwd(), 'docs', 'swagger.json');

let swaggerDocument = { openapi: '3.0.0', info: { title: 'API', version: '1.0.0' } };
if (fs.existsSync(swaggerJsonPath)) {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));
}

  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

  router.get('/openapi.json', (_req, res) => res.json(swaggerDocument));


export default router;
