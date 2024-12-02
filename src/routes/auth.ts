import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import signupValidator from '../validators/signup-validator';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

router.post(
  '/signup',
  signupValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.signup(req, res, next),
);

export default router;
