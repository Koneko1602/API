import {Request, Response, NextFunction} from 'express';
import {ApiRequestsCollection} from "../../db/Mongo.db";

const MAX_REQUESTS_PER_10_SECONDS = 5;     // ← лимит попыток (можно изменить под требования курса)
const WINDOW_MS = 10 * 1000;

export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ip = req.ip;
    const url = req.baseUrl;

    if (!ip || !url) {
        return next();
    }

    const tenSecondsAgo = new Date(Date.now() - WINDOW_MS);

    try {
        // считаем количество обращений по фильтру (IP + URL + дата >= сейчас - 10 сек)
        const count = await ApiRequestsCollection.countDocuments({
            IP: ip,
            URL: url,
            date: { $gte: tenSecondsAgo }
        });

        if (count >= MAX_REQUESTS_PER_10_SECONDS) {
            return res.status(429).json({ error: 'Too Many Requests' });
            // или формат ошибок, который используется в вашем проекте
        }

        // сохраняем текущее обращение (все случаи обращения к API)
        await ApiRequestsCollection.insertOne({
            IP: ip,
            URL: url,
            date: new Date()
        });

        next();
    } catch (err) {
        console.error('Rate limit middleware error:', err);
        next(err);
    }
};