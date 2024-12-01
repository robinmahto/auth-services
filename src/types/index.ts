import { Request } from 'express';

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface SignupUserRequest extends Request {
  body: UserData;
}