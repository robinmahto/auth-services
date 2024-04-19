import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import createJwksMock from "mock-jwks";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("GET /auth/self", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJwksMock>;

    beforeAll(async () => {
        jwks = createJwksMock("http://localhost:5500");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all feilds", () => {
        it("shloud return the 200 status code", async () => {
            const response = await request(app).get("/auth/self").send();
            expect(response.statusCode).toBe(200);
        });

        it("shloud return the user data", async () => {
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Register user
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });
            // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data?.role,
            });
            // Add token to cookie
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();
            // Assert
            // check if users id matches with register user
            expect(response.body.id).toBe(data.id);
        });
    });
});
