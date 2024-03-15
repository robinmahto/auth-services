import { NextFunction, Response } from "express";
import { RegisterDataRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(
        req: RegisterDataRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ erros: result.array() });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.logger.debug("new request to register a user", {
            firstName,
            lastName,
            email,
            password: "*****",
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info("user has been created", { id: user });
            res.status(201).json({ id: user });
        } catch (error) {
            next(error);
            return;
        }
    }
}
