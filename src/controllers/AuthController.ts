import { NextFunction, Response } from 'express';
import { SignupUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';

export class AuthController {
  userService: UserService;
  constructor(
    userService: UserService,
    private logger: Logger,
  ) {
    this.userService = userService;
  }
  async signup(req: SignupUserRequest, res: Response, next: NextFunction) {
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
      this.logger.info('User has been registered', { id: user });
      res.status(201).json({ id: user });
    } catch (error) {
      next(error);
      return;
    }
  }
}
