import app from "./app";
import { Config } from "./config/config";

const startServer = () => {
    try {
        const PORT = Config.PORT;
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    } catch (error) {
        console.error(error);
    }
};

startServer();
