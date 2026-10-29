
import "dotenv/config";
import app from "./app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/Mongo.db";

const bootstrap = async () => {
    if (!SETTINGS.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in .env");
    }

    await runDB(SETTINGS.MONGO_URL);

    app.listen(SETTINGS.PORT, () => {
        console.log(`Example app listening on port ${SETTINGS.PORT}`);
    });
};

bootstrap();
