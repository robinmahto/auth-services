import express, { NextFunction, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import signupValidator from '../validators/signup-validator';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import loginValidator from '../validators/login-validator';
import { CredentialService } from '../services/CredentialService';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

router.post(
  '/signup',
  signupValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.signup(req, res, next),
);

router.post(
  '/login',
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

router.post('/whoami', (req: Request, res: Response) =>
  authController.whoami(req, res),
);

export default router;
