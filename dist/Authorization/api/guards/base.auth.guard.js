"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseAuthGuard = exports.ADMIN_TOKEN_HEADER = exports.ADMIN_PASS = exports.ADMIN_LOGIN = void 0;
exports.ADMIN_LOGIN = "admin";
exports.ADMIN_PASS = "qwerty";
// 💡 Сначала переопределим ADMIN_TOKEN, чтобы он включал префикс "Basic "
exports.ADMIN_TOKEN_HEADER = `Basic ${Buffer.from(`${exports.ADMIN_LOGIN}:${exports.ADMIN_PASS}`).toString('base64')}`;
const baseAuthGuard = (req, res, next) => {
    // 🟢 ИСПРАВЛЕНИЕ: Сравниваем полный заголовок с полным ожидаемым заголовком
    if (req.headers.authorization !== exports.ADMIN_TOKEN_HEADER)
        return res.sendStatus(401);
    return next();
};
exports.baseAuthGuard = baseAuthGuard;
//# sourceMappingURL=base.auth.guard.js.map