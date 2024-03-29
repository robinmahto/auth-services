import app from "./app";
import { Config } from "./config/config";
import logger from "./config/logger";

const startServer = () => {
    try {
        const PORT = Config.PORT;
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

startServer();
