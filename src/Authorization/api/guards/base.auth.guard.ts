import {NextFunction, Request, Response} from "express";

export const ADMIN_LOGIN = "admin";
export const ADMIN_PASS = "qwerty";
// 💡 Сначала переопределим ADMIN_TOKEN, чтобы он включал префикс "Basic "
export const ADMIN_TOKEN_HEADER = `Basic ${Buffer.from(`${ADMIN_LOGIN}:${ADMIN_PASS}`).toString('base64')}`;

export const baseAuthGuard = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 🟢 ИСПРАВЛЕНИЕ: Сравниваем полный заголовок с полным ожидаемым заголовком
    if (req.headers.authorization !== ADMIN_TOKEN_HEADER) return res.sendStatus(401);

    return next();
};