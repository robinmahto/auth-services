import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import RefreshToken from "../../src/entity/RefreshToken";

describe("POST /auth/register", () => {
    let connection: DataSource;
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // database truncate
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("it should return the 201 status code", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //  Assert
            expect(response.statusCode).toBe(201);
        });

        it("it should return valid json", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //  Assert
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should persist user in the database", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Act
            await request(app).post("/auth/register").send(userData);
            //  Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it("should assign a customer role", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //  Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe("customer");
        });

        it("should store the hashed password in the database", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //  Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should return 400 status code if email is already exists", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //  Assert
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it("should return the access token and refresh token inside a cookie", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            interface Headers {
                ["set-cookie"]: string[];
            }
            // Assert
            let accessToken = null;
            let refreshToken = null;
            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(accessToken).toBeTruthy();
            expect(refreshToken).toBeTruthy();
        });

        it("should store refresh token in the database", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            //  Assert
            const refreshTokenRepo = connection.getRepository(RefreshToken);
            const tokens = await refreshTokenRepo.find();
            expect(tokens).toHaveLength(1);
        });
    });

    describe("Missing all fields", () => {
        it("should return 400 status code if email field is missing", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it("should return 400 status code if firstName is missing", async () => {
            // Arrange
            const userData = {
                firstName: "",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it("should return 400 status code if lastName is missing", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "",
                email: "robin@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it("should return 400 status code if password is missing", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robin@gmail.com",
                password: "",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });

    describe("missing email feild proper formate", () => {
        it("should trim the email feild", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: " robin@gmail.com ",
                password: "secret",
            };
            // Act
            await request(app).post("/auth/register").send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].email).toBe(userData.email.trim());
        });
        it("shoudl return 400 status code if email is not valid", async () => {
            // Arrange
            const userData = {
                firstName: "robin",
                lastName: "mahto",
                email: "robingmail.com", // invalid email
                password: "secret",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
        });
    });
});
