import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import  contactsRouter  from './routes/contacts.js';
import{ notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import { authenticate } from './middlewares/authenticate.js';
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

   app.use('/auth', authRouter);
 app.set('json spaces', 2);
  app.use('/contacts',authenticate, contactsRouter);


  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
