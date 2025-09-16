import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import  contactsRouter  from './routes/contacts.js';
import{ notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
export function setupServer() {
  const app = express();
  app.use(pino({
    autoLogging: true,
    transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  }),
);
  app.use(cors());
  app.use(express.json());
 app.set('json spaces', 2);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
