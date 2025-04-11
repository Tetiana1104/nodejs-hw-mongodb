import cookieParser from 'cookie-parser';
import * as fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import swaggerUiExpress from 'swagger-ui-express';

import contactsRouters from './routers/contactsRouters.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
);

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(
    '/api-docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerDocument),
  );

  app.use(cookieParser());
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(cors());
  app.use(pino());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouters);
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
