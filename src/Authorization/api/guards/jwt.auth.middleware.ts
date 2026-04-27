
import { NextFunction, Request, Response } from 'express';
import {jwtService} from "../../adapters/jwt.service";


export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    const payload = await jwtService.verifyToken(token);

    if (!payload) {
        return res.sendStatus(401);
    }

    (req as any).userId = payload.userId;
    (req as any).deviceId = payload.deviceId;   // ← добавлено

    next();
};