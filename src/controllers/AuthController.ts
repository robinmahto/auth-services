import { Response, Request } from 'express';

export class AuthController {
  signup(req: Request, res: Response) {
    res.status(201).json({});
  }
}
