import app from "./app";
import { Config } from "./config/config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        logger.info("Database connected successfully.");
        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer().catch((error) => {
    if (error instanceof Error) {
        logger.error(error.message);
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }
});
