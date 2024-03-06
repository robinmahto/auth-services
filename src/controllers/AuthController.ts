import { Response } from "express";
import { RegisterDataRequest } from "../types";
import { UserService } from "../services/UserService";

export class AuthController {
    constructor(private userService: UserService) {}

    async register(req: RegisterDataRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;

        try {
            await this.userService
                .create({ firstName, lastName, email, password })
                .catch((err) => {
                    if (err.message === "ValidationError")
                        throw new Error("Invalid data");
                    else throw err;
                })
                .then(() => {
                    return res.status(201).json({ message: "User created" });
                });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Error registering user" });
        }
    }
}
