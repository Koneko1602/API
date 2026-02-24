import { Request } from 'express';

declare global {
    namespace Express {
        export interface Request {
            userId: string | null;           // уже есть у тебя

            // Добавляем cookies (от cookie-parser)
            cookies: Record<string, string | undefined>;
            // или ещё точнее:
            // cookies: { [key: string]: string | undefined; refreshToken?: string; };

        }
    }
}

