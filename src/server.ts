import { Config } from './config';
import app from './app';
import logger from './config/logger';
import { AppDataSource } from './config/data-source';

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully.');
    app.listen(Config.PORT, () =>
      logger.info(`server listing on port: `, { PORT: Config.PORT }),
    );
  } catch (error) {
    console.error(error);
  }
};

void startServer();
