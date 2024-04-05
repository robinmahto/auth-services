import { NextFunction, Response } from "express";
import { RegisterDataRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
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
            this.logger.info("user has been created", { id: user.id });
            // creating  the token and sending it back as response
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            const accessToken = this.tokenService.generateAccessToken(payload);

            // persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1hr
                httpOnly: true, // very important
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1hr
                httpOnly: true, // very important
            });
            res.status(201).json({ id: user });
        } catch (error) {
            next(error);
            return;
        }
    }
}
