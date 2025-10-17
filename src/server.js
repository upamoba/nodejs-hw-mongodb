import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import  contactsRouter  from './routes/contacts.js';
import{ notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import apiDocsRouter from './routes/api-docs.js';

export function setupServer() {
  const app = express();
  app.use(pino({
    autoLogging: true,
    transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  }),
);
  app.use(cors({ origin: true, credentials: true }));

  app.use(express.json());
  app.use(cookieParser());
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));


app.use('/api-docs', apiDocsRouter);


app.get('/', (_req, res) => res.redirect('/api-docs'));
   app.use('/auth', authRouter);
 app.set('json spaces', 2);
  app.use('/contacts',contactsRouter);


  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
