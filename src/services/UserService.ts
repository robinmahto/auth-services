import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        // email  must be unique
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw createHttpError(400, "Email already in exists");
        }

        // email should be valid
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            throw createHttpError(400, "Invalid email format");
        }

        // hashed password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
        } catch (err) {
            const error = createHttpError(500, "Failed to create new user");
            throw error;
        }
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
}
