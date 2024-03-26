import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import { RegisterDataRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";

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
            console.log(user);
            this.logger.info("user has been created", { id: user.id });
            // creating  the token and sending it back as response
            const refreshToken = "";
            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, "../../certs/privateKey.pem"),
                );
            } catch (err) {
                const error = createHttpError(
                    500,
                    "Error while reading private key",
                );
                return next(error);
            }
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1hr
                httpOnly: true, // very important
            });
            res.status(201).json({ id: user });
        } catch (error) {
            next(error);
            return;
        }
    }
}
