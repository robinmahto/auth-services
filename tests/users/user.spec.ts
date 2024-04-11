import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("GET /auth/self", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
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
            const response = await request(app).get("/auth/self").send();
            expect(response.statusCode).toBe(200);
        });
    });
});
