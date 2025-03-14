import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import cors from 'cors';
import { Config } from './config';
import cookieParse from 'cookie-parser';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'welcome to auth service' });
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());
app.use(
  cors({
    origin: [`${Config.CORS_ORIGIN_URL}`],
    credentials: true,
  }),
);

// Routes
app.use('/auth', authRouter);

// global error handler
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message);
  console.log(err);
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
