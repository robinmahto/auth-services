import { NextFunction, Response } from 'express';
import { SignupUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
import { TokenService } from '../services/TokenService';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';

export class AuthController {
  userService: UserService;
  constructor(
    userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
  ) {
    this.userService = userService;
  }
  async signup(req: SignupUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.isEmpty()) {
      res.status(400).json({ erros: result.array() });
      return;
    }

    const { firstName, lastName, email, password } = req.body;
    if (!email) {
      const err = createHttpError(400, 'Email is required');
      return next(err);
    }
    this.logger.debug('New request to register a user', {
      firstName,
      lastName,
      email,
      password: '**********',
    });
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info('User has been registered', { id: user.id });

      // Persist the refresh token
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);
      const payload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      // accessToken
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'strict',
        domain: 'localhost',
      });

      // refreshToken
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
        sameSite: 'strict',
        domain: 'localhost',
      });

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
}
