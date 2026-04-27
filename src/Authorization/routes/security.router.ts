import { Router, Request, Response } from 'express';
import { refreshTokenRepository } from '../repository/refreshToken.repository';
import {jwtAuthMiddleware} from "../api/guards/jwt.auth.middleware";


export const securityRouter = Router();

// GET /security/devices — список всех активных сессий текущего пользователя
securityRouter.get('/devices', jwtAuthMiddleware, async (req: any, res: Response) => {
    const userId = req.userId;

    const sessions = await refreshTokenRepository.findAllByUserId(userId);

    const viewModel = sessions.map(s => ({
        ip: s.ip,
        title: s.title,
        lastActiveDate: s.lastActiveDate.toISOString(),
        deviceId: s.deviceId,
    }));

    res.status(200).json(viewModel);
});

// DELETE /security/devices — удалить все сессии кроме текущей
securityRouter.delete('/devices', jwtAuthMiddleware, async (req: any, res: Response) => {
    const userId = req.userId;
    const currentDeviceId = req.deviceId;

    if (!currentDeviceId) return res.sendStatus(401);

    await refreshTokenRepository.deleteAllOther(userId, currentDeviceId);
    res.sendStatus(204);
});

// DELETE /security/devices/:deviceId — удалить конкретную сессию
securityRouter.delete('/devices/:deviceId', jwtAuthMiddleware, async (req: any, res: Response) => {
    const userId = req.userId;
    const { deviceId } = req.params;

    await refreshTokenRepository.deleteByDeviceId(userId, deviceId);
    res.sendStatus(204);
});