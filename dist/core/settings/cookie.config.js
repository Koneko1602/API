"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_COOKIE_OPTIONS = exports.REFRESH_COOKIE_NAME = void 0;
exports.REFRESH_COOKIE_NAME = 'refreshToken';
exports.REFRESH_COOKIE_OPTIONS = {
    httpOnly: true, // защита от XSS
    secure: true, // в dev = false, в проде = true (HTTPS)
    sameSite: 'strict', // самый безопасный вариант против CSRF
    // sameSite: 'lax' — если нужно разрешить переходы по ссылкам с других сайтов
    maxAge: 20 * 1000, // 20 секунд по Swagger
    path: '/', // или '/api/auth' если хотите сузить область
    // domain: если нужен поддомен — указывай явно
};
//# sourceMappingURL=cookie.config.js.map