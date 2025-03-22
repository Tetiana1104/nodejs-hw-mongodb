import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRoutes from './routes/contactsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(pino());

  app.use('/contacts', contactsRoutes);
  app.get('/', (req, res) => res.send('API is running'));

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
