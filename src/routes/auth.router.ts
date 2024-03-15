import express, { Request, NextFunction, Response } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";
const authRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, logger);

authRouter.get("/", (_req, res) => {
    res.status(200).send(
        JSON.stringify({ message: "Welcome to the Auth services" }),
    );
});

authRouter.post(
    "/register",
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

export default authRouter;
