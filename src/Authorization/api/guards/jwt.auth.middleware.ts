
import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../../adapters/jwt.service";


export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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

    if (!payload || !payload.userId) {
        console.log('❌ JWT Middleware: Invalid payload. Payload:', payload);
        return res.sendStatus(401);
    }

    (req as any).userId = payload.userId;
    (req as any).deviceId = payload.deviceId;

    console.log(`✅ JWT Middleware SUCCESS | userId: ${payload.userId} | deviceId: ${payload.deviceId}`);
    next();
};