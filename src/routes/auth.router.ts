import express from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
const authRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

authRouter.get("/", (_req, res) => {
    res.status(200).send(
        JSON.stringify({ message: "Welcome to the Auth services" }),
    );
});

authRouter.post("/register", (req, res) => authController.register(req, res));

export default authRouter;
