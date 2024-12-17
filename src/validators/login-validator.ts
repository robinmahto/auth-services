import { checkSchema } from 'express-validator';

export default checkSchema({
  email: {
    errorMessage: 'Email is required!',
    notEmpty: true,
    isEmail: {
      errorMessage: 'Invalid email address',
    },
  },
  password: {
    errorMessage: 'Password is required!',
    notEmpty: true,
    trim: true,
  },
});
