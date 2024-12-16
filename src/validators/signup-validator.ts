import { checkSchema } from 'express-validator';

export default checkSchema({
  firstName: {
    errorMessage: 'First Name is required!',
    notEmpty: true,
    trim: true,
  },
  lastName: {
    errorMessage: 'Last Name is required!',
    notEmpty: true,
    trim: true,
  },
  email: {
    errorMessage: 'Email is required!',
    notEmpty: true,
    trim: true,
  },
  password: {
    errorMessage: 'Password is required!',
    notEmpty: true,
    trim: true,
  },
});
