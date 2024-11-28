import { Response, Request } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

interface SignupUserRequest extends Request {
  body: UserData;
}

export class AuthController {
  async signup(req: SignupUserRequest, res: Response) {
    const { firstName, lastName, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.save({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(201).json({});
  }
}
