import express from "express";
import { AuthController } from "../controllers/AuthController";
const authRouter = express.Router();
const authController = new AuthController();

authRouter.get("/", (_req, res) => {
    res.status(200).send(
        JSON.stringify({ message: "Welcome to the Auth services" }),
    );
});

authRouter.post("/register", (req, res) => authController.register(req, res));

export default authRouter;
