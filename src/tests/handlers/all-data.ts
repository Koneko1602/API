import {Request, Response} from "express";
import {
    BlogsCollection,
    CommentsCollection,
    PostsCollection,
    RefreshTokensCollection,
    UsersCollection
} from "../../db/Mongo.db";
import {clearRateLimiterStore} from "../../core/Middlewares/rateLimiter.middleware";

export async function deleteAllDataHandler(req: Request, res: Response) {


    await BlogsCollection.deleteMany({});
    await PostsCollection.deleteMany({});
    await UsersCollection.deleteMany({});
    await CommentsCollection.deleteMany({});
    try {
        await RefreshTokensCollection.deleteMany({});
    } catch (e) {
        console.error('RefreshTokensCollection clear error', e);
    }

    // Очистим rate limiter
    try {
        clearRateLimiterStore();
    } catch (e) {
        console.error('clearRateLimiterStore error', e);
    }

    res.sendStatus(204);
}