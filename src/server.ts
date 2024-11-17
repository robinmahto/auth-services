import { Config } from './config';
import app from './app';
import logger from './config/logger';

const startServer = () => {
  try {
    app.listen(Config.PORT, () =>
      logger.info(`server listing on port: `, { PORT: Config.PORT }),
    );
  } catch (error) {
    console.error(error);
  }
};

startServer();
