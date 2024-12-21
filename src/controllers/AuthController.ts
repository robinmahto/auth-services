import { NextFunction, Request, Response } from 'express';
import { SignupUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
import { TokenService } from '../services/TokenService';
import { CredentialService } from '../services/CredentialService';

export class AuthController {
  userService: UserService;
  constructor(
    userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
  ) {
    this.userService = userService;
  }
  async signup(req: SignupUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() });
      return;
    }

    const { firstName, lastName, email, password } = req.body;

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

      res.status(201).json({ data: user.id });
    } catch (error) {
      next(error);
    }
  }

  async login(req: SignupUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() });
      return;
    }

    const { email, password } = req.body;

    this.logger.debug('New request to login a user', {
      email,
      password: '**********',
    });

    try {
      //check if email exists in database
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const error = createHttpError(400, 'Email or password does not match.');
        next(error);
        return;
      }

      // comapre password
      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );
      if (!passwordMatch) {
        const error = createHttpError(400, 'Email or password does not match.');
        next(error);
        return;
      }

      // generate token

      // Persist the refresh token in database
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      //generate Access token
      const payload = {
        sub: String(user.id),
        role: user.role,
      };
      const accessToken = this.tokenService.generateAccessToken(payload);

      // generate refresh token
      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      // add accessToken in cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'strict',
        domain: 'localhost',
      });

      // add refreshToken in cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
        sameSite: 'strict',
        domain: 'localhost',
      });
      this.logger.info('user has been login', { id: user.id });
      // return the response Id
      res.status(200).json({ data: user.id });
    } catch (error) {
      next(error);
    }
  }

  async whoami(req: Request, res: Response) {}
}
