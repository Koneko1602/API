import {NextFunction} from "express";
import {jwtService} from "../../Authorization/adapters/jwt.service";
import {AuthenticatedRequest} from "../../Authorization/api/guards/jwt.auth.middleware";
import {Request,Response} from "express";

export const refreshTokenMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.sendStatus(401);
    }

    const payload = await jwtService.verifyToken(token);

    if (!payload) {
        return res.sendStatus(401);
    }

    (req as AuthenticatedRequest).userId = payload.userId;
    (req as AuthenticatedRequest).deviceId = payload.deviceId;

    next();
};