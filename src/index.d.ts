
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId: string | null;

            // cookies от cookie-parser
            cookies: Record<string, string | undefined>;
        }
    }
}
export {};