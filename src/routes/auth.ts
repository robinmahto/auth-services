import express from 'express';
import { AuthController } from '../controllers/AuthController';
const router = express.Router();

const authController = new AuthController();

router.post('/signup', (req, res) => authController.signup(req, res));

export default router;
