import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'welcome to auth service' });
});

// Routes
app.use('/auth', authRouter);

// global error handler
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errors: [
      {
        message: err.message,
        type: err.name,
      },
    ],
  });
});

export default app;
