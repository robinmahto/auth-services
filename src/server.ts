import { Config } from './config';
import app from './app';

const startServer = () => {
  try {
    app.listen(Config.PORT, () =>
      console.log(`server listing on port: ${Config.PORT}`),
    );
  } catch (error) {
    console.error(error);
  }
};

startServer();
