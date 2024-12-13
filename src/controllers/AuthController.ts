import { NextFunction, Response } from 'express';
import { SignupUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';

export class AuthController {
  userService: UserService;
  constructor(
    userService: UserService,
    private logger: Logger,
  ) {
    this.userService = userService;
  }
  async signup(req: SignupUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return res.status(400).json({ erros: result.array() });
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
      this.logger.info('User has been registered', { id: user });
      const accessToken = 'rewrwetergerert';
      const refreshToken = 'efsfsdvdfgdfgdfg';

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

      res.status(201).json({ id: user });
    } catch (error) {
      next(error);
      return;
    }
  }
}
