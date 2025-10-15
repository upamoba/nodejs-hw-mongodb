import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerJsonPath = path.resolve(__dirname, '../docs/swagger.json');


if (fs.existsSync(swaggerJsonPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/openapi.json', (_req, res) => res.json(swaggerDocument));
}
