import express, { Request, Response, NextFunction } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).send(
        JSON.stringify({ message: "Welcome to the Auth services" }),
    );
});

// middlware for error handling
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
