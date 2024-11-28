import { Response } from 'express';
import { SignupUserRequest } from '../types';
import { UserService } from '../services/UserService';

export class AuthController {
  userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  async signup(req: SignupUserRequest, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    await this.userService.create({ firstName, lastName, email, password });
    res.status(201).json({});
  }
}
