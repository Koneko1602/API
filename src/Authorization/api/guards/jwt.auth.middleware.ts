import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../../adapters/jwt.service";

export interface AuthenticatedRequest extends Request {
    userId: string;
    deviceId: string;
}

export const jwtAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ JWT Middleware: No Bearer token');
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('❌ JWT Middleware: Token is empty');
        return res.sendStatus(401);
    }

    const payload = await jwtService.verifyToken(token);

    if (!payload) {
        console.log('❌ JWT Middleware: Invalid token');
        return res.sendStatus(401);
    }

    req.userId = payload.userId;
    req.deviceId = payload.deviceId;

    if (process.env.DEBUG) {
        console.log(`✅ JWT Middleware SUCCESS`);
    }

    next();
};
