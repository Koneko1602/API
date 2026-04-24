import express from "express";
import { setupApp } from "./setup-app";
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/Mongo.db";


const bootstrap = async () => {
    const app = express();
    setupApp(app);
    const PORT = SETTINGS.PORT;

    await runDB(SETTINGS.MONGO_URL);

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
    app.set('trust proxy', true);   // для корректного req.ip
    return app;
};

bootstrap();

