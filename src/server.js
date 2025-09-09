import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import  contactsRouter  from './routes/contacts.js';

export function setupServer() {
  const app = express();
  app.use(pino({
    autoLogging: true,
    transport: process.env.NODE_ENV !== 'development' ? { target: 'pino-pretty' } : undefined,
  }),
);
  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal Server Error'});
});

  return app;
};
