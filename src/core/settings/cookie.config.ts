import { CookieOptions } from 'express';

export const REFRESH_COOKIE_NAME = 'refreshToken';

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,                    // защита от XSS
    secure: process.env.NODE_ENV === 'production',  // в dev = false, в проде = true (HTTPS)
    sameSite: 'strict' as const,       // самый безопасный вариант против CSRF
    // sameSite: 'lax' — если нужно разрешить переходы по ссылкам с других сайтов
    maxAge: 20 * 1000,                 // 20 секунд по Swagger
    path: '/',                         // или '/api/auth' если хотите сузить область
    // domain: если нужен поддомен — указывай явно
};