import {Request, Response, NextFunction} from 'express';

interface RateLimitStore {
    [ip: string]: { count: number; resetTime: number }
}

// Экспортируем store и функцию очистки
export const store: RateLimitStore = {};
const REQUESTS_LIMIT = 5;
const TIME_WINDOW = 10 * 1000; // 10 секунд

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const url = req.originalUrl || req.url;
    const key = `${ip}:${url}`;
    const now = Date.now();

    if (!store[key]) {
        store[key] = {count: 1, resetTime: now + TIME_WINDOW};
        return next();
    }
    const record = store[key];


    if (now >= record.resetTime) {
        record.count = 1;
        record.resetTime = now + TIME_WINDOW;
        return next();
    }

    record.count++;

    if (record.count > REQUESTS_LIMIT) {
        return res.sendStatus(429);
    }

    next();
};

export const clearRateLimiterStore = (): void => {
    Object.keys(store).forEach(key => delete store[key]);
};