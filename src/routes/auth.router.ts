import express, { Request, NextFunction, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";
import loginValidator from "../validators/login-validator";
import { TokenService } from "../services/TokenService";
import { CredentialService } from "../services/CredentialService";

const authRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const tokenService = new TokenService();
const credentialService = new CredentialService();
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

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

authRouter.post(
    "/login",
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
);

authRouter.get("/self", (req: Request, res: Response, next: NextFunction) =>
    authController.self(req, res, next),
);

export default authRouter;
