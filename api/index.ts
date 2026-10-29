
import "dotenv/config";
import app from "../src/app";
import { SETTINGS } from "../src/core/settings/settings";
import { runDB } from "../src/db/Mongo.db";

let dbPromise: Promise<void> | null = null;

export default async function handler(
    req: import("express").Request,
    res: import("express").Response
) {
    if (!dbPromise) {
        dbPromise = runDB(SETTINGS.MONGO_URL).catch((error) => {
            dbPromise = null;
            throw error;
        });
    }

    await dbPromise;
    return app(req, res);
}
