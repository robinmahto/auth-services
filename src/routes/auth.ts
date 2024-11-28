import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
const router = express.Router();

const userService = new UserService();

const authController = new AuthController(userService);

router.post('/signup', (req, res) => authController.signup(req, res));

export default router;
