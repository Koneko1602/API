"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const http_statuses_1 = require("../../core/types/http-statuses");
const validation_user_1 = require("../../Users/validation/validation.user");
const input_validation_result_middleware_1 = require("../../core/Middlewares/validation/input-validation-result.middleware");
const auth_service_1 = require("../domain/auth.service");
const resultCode_1 = require("../../Users/common/result/resultCode");
const express_validator_1 = require("express-validator");
const FieldError_1 = require("../../core/errors/FieldError");
const validation_auth_middleware_1 = require("../../core/Middlewares/validation/validation-auth.middleware");
const cookie_config_1 = require("../../core/settings/cookie.config");
const jwt_auth_middleware_1 = require("../api/guards/jwt.auth.middleware");
// '/login',
// userValidation.passwordValidation,
// userValidation.loginOrEmailValidation,
// inputValidationResultMiddleware,
//
// async (req: RequestWithBody<LoginDto>, res: Response) => {
//     const {loginOrEmail, password} = req.body;
//
//     // 1. Получаем Result объект
//     const result = await authService.loginUser(loginOrEmail, password);
//
//     // 2. Проверяем статус: если ошибка аутентификации
//     if (result.status === ResultStatus.Unauthorized) {
//
//         // Отправляем ожидаемый 401 статус
//         return res.status(HttpStatus.Unauthorized).end();
//
//
//     }
//     res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);
//     // 3. Если статус "Успех"
//     if (result.status === ResultStatus.Success|| !result.data) {
//         // Отправляем 200 OK и токен
//         return res.status(HttpStatus.Ok).send({ accessToken: result.data.accessToken });
//     }
//
//     // На всякий случай обрабатываем неожиданный статус
//     return res.sendStatus(HttpStatus.InternalServerError);
// },
// authRouter.post(
//     '/login',
//     // твои валидации...
//     async (req: RequestWithBody<LoginDto>, res: Response) => {
//         const result = await authService.loginUser(req.body.loginOrEmail, req.body.password);
//
//         if (result.status !== ResultStatus.Success || !result.data) {
//             return res.sendStatus(401);
//         }
//
//         res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);
//
//         // Swagger показывает text/plain, но пример ответа — JSON → делаем json (безопаснее)
//         res.status(200).json({accessToken: result.data.accessToken});
//         // Если строго text/plain: res.type('text/plain').send(result.data.accessToken);
//     }
// );
// authRouter.post(
//     '/registration-confirmation',
//     // Валидация
//     body('code')
//         .trim()
//         .isString()
//         .notEmpty()
//         .withMessage('Code is required and must be a non-empty string'),
//
//     // Общий middleware обработки ошибок валидации
//     inputValidationResultMiddleware,
//
//     // Основная логика
//     async (req: RequestWithBody<{ code: string }>, res: Response) => {
//         const {code} = req.body;
//
//         const result = await authService.confirmRegistration(code);
//
//         if (result.status !== ResultStatus.Success) {
//             // Правильно формируем массив ошибок
//             let errors: FieldError[];
//
//             if (result.extensions && result.extensions.length > 0) {
//                 // Если есть extensions — преобразуем их, заменяя null на 'code'
//                 errors = result.extensions.map(ext => ({
//                     message: ext.message,
//                     field: ext.field ?? 'code'  // ← ext объявлен как параметр map
//                 }));
//             } else {
//                 // Если extensions пустой или null — создаём fallback ошибку
//                 errors = [{
//                     message: result.errorMessage || 'Invalid or expired confirmation code',
//                     field: 'code'
//                 }];
//             }
//
//             return res.status(HttpStatus.BadRequest).json(createErrorsMessages(errors));
//         }
//
//         return res.sendStatus(HttpStatus.NoContent); // 204
//     },
// );
// authRouter.post(
//     '/registration',
//     // Валидация (используем твои из userValidation)
//     userValidation.loginValidation,    // Проверяет дубликат login
//     userValidation.passwordValidation,
//     userValidation.emailValidation,    // Проверяет дубликат email
//     inputValidationAuthMiddleware,
//
//     async (req: RequestWithBody<{ login: string, password: string, email: string }>, res: Response) => {
//         const {login, password, email} = req.body;
//         console.log('[REG ROUTER] Received body:', req.body);
//         const result = await authService.registerUser(login, password, email);
//         console.log('[REG ROUTER] Service result status:', result.status);
//         if (result.status !== ResultStatus.Success) {
//             // Преобразование extensions, чтобы field был всегда string
//             const safeErrors: FieldError[] = (result.extensions || []).map(ext => ({
//                 message: ext.message,
//                 field: ext.field ?? 'general'  // Заменяем null на 'general' (или 'code')
//             }));
//
//             // Если extensions пустой — fallback ошибка
//             if (safeErrors.length === 0) {
//                 safeErrors.push({
//                     message: result.errorMessage || 'Registration failed (duplicate or invalid data)',
//                     field: 'general'
//                 });
//             }
//
//             return res.status(HttpStatus.BadRequest).json(createErrorsMessages(safeErrors));
//         }
//         if (result.status === ResultStatus.Success) {
//             return res.sendStatus(HttpStatus.NoContent);
//         }
//         console.log('[REG ROUTER] Returning 204');
//         return res.sendStatus(HttpStatus.NoContent);  // 204
//
//     }
// );
// authRouter.post(
//     '/registration-email-resending',
//     userValidation.emailValidation,
//     inputValidationResultMiddleware,
//
//     async (req: RequestWithBody<{ email: string }>, res: Response) => {
//         const {email} = req.body;
//         console.log('[RESEND/CONFIRM] Received:', req.body);
//
//         const result = await authService.resendConfirmationEmail(email);
//
//         if (result.status !== ResultStatus.Success) {
//             const errors = result.extensions.length > 0
//                 ? result.extensions.map(ext => ({
//                     message: ext.message,
//                     field: ext.field ?? 'email'
//                 }))
//                 : [{
//                     field: 'email',
//                     message: result.errorMessage || 'Email not found or already confirmed'
//                 }];
//
//             return res.status(HttpStatus.BadRequest).json(createErrorsMessages(errors as FieldError[]));
//         }
//
//         return res.sendStatus(HttpStatus.NoContent); // 204
//     }
// );   // ← ЗДЕСЬ ЗАКРЫВАЕМ ВЫЗОВ — БЕЗ ЗАПЯТОЙ ПОСЛЕ ЭТОЙ СКОБКИ!
//
// // Теперь отдельный роут — без запятой перед ним
// authRouter.post(
//     '/refresh-token',
//     async (req: Request, res: Response) => {
//         const oldRefresh = req.cookies[REFRESH_COOKIE_NAME];
//
//         if (!oldRefresh) {
//             return res.sendStatus(401);
//         }
//
//         const result = await authService.refreshTokens(oldRefresh);
//
//         if (result.status !== ResultStatus.Success || !result.data) {
//             res.clearCookie(REFRESH_COOKIE_NAME);
//             return res.sendStatus(401);
//         }
//
//         res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);
//
//         res.status(200).json({ accessToken: result.data.accessToken });
//     }
// );  // ← Закрываем — БЕЗ запятой
//
// authRouter.post(
//     '/logout',
//     async (req: Request, res: Response) => {
//         const refresh = req.cookies[REFRESH_COOKIE_NAME];
//
//         if (refresh) {
//             await authService.logout(refresh);
//         }
//
//         res.clearCookie(REFRESH_COOKIE_NAME);
//         res.sendStatus(204);
//     }
// );  // ← Закрываем — БЕЗ запятой
//
// authRouter.get(
//     '/me',
//     jwtAuthMiddleware,
//     async (req: any, res: Response) => {
//         const userId = req.userId;
//
//         const result = await authService.getCurrentUser(userId);
//
//         if (result.status !== ResultStatus.Success || !result.data) {
//             return res.sendStatus(401);
//         }
//
//         res.status(200).json(result.data);
//     }
// );
exports.authRouter = (0, express_1.Router)();
// POST /auth/login
exports.authRouter.post('/login', validation_user_1.userValidation.passwordValidation, validation_user_1.userValidation.loginOrEmailValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    const ip = req.ip;
    const title = req.headers['user-agent'] || 'Unknown device';
    const result = yield auth_service_1.authService.loginUser(loginOrEmail, password, ip, title);
    if (result.status !== resultCode_1.ResultStatus.Success || !result.data) {
        return res.status(http_statuses_1.HttpStatus.Unauthorized).end();
    }
    res.cookie(cookie_config_1.REFRESH_COOKIE_NAME, result.data.refreshToken, cookie_config_1.REFRESH_COOKIE_OPTIONS);
    return res.status(http_statuses_1.HttpStatus.Ok).json({ accessToken: result.data.accessToken });
}));
// POST /auth/registration-confirmation
exports.authRouter.post('/registration-confirmation', (0, express_validator_1.body)('code')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Code is required and must be a non-empty string'), input_validation_result_middleware_1.inputValidationResultMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const result = yield auth_service_1.authService.confirmRegistration(code);
    if (result.status !== resultCode_1.ResultStatus.Success) {
        let errors;
        if (result.extensions && result.extensions.length > 0) {
            errors = result.extensions.map(ext => {
                var _a;
                return ({
                    message: ext.message,
                    field: (_a = ext.field) !== null && _a !== void 0 ? _a : 'code'
                });
            });
        }
        else {
            errors = [{
                    message: result.errorMessage || 'Invalid or expired confirmation code',
                    field: 'code'
                }];
        }
        return res.status(http_statuses_1.HttpStatus.BadRequest).json((0, FieldError_1.createErrorsMessages)(errors));
    }
    return res.sendStatus(http_statuses_1.HttpStatus.NoContent); // 204
}));
// POST /auth/registration
exports.authRouter.post('/registration', validation_user_1.userValidation.loginValidation, validation_user_1.userValidation.passwordValidation, validation_user_1.userValidation.emailValidation, validation_auth_middleware_1.inputValidationAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password, email } = req.body;
    console.log('[REG ROUTER] Received body:', req.body);
    const result = yield auth_service_1.authService.registerUser(login, password, email);
    console.log('[REG ROUTER] Service result status:', result.status);
    if (result.status !== resultCode_1.ResultStatus.Success) {
        const safeErrors = (result.extensions || []).map(ext => {
            var _a;
            return ({
                message: ext.message,
                field: (_a = ext.field) !== null && _a !== void 0 ? _a : 'general'
            });
        });
        if (safeErrors.length === 0) {
            safeErrors.push({
                message: result.errorMessage || 'Registration failed (duplicate or invalid data)',
                field: 'general'
            });
        }
        return res.status(http_statuses_1.HttpStatus.BadRequest).json((0, FieldError_1.createErrorsMessages)(safeErrors));
    }
    return res.sendStatus(http_statuses_1.HttpStatus.NoContent); // 204
}));
// POST /auth/registration-email-resending
exports.authRouter.post('/registration-email-resending', validation_user_1.userValidation.emailValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log('[RESEND/CONFIRM] Received:', req.body);
    const result = yield auth_service_1.authService.resendConfirmationEmail(email);
    if (result.status !== resultCode_1.ResultStatus.Success) {
        const errors = result.extensions.length > 0
            ? result.extensions.map(ext => {
                var _a;
                return ({
                    message: ext.message,
                    field: (_a = ext.field) !== null && _a !== void 0 ? _a : 'email'
                });
            })
            : [{
                    field: 'email',
                    message: result.errorMessage || 'Email not found or already confirmed'
                }];
        return res.status(http_statuses_1.HttpStatus.BadRequest).json((0, FieldError_1.createErrorsMessages)(errors));
    }
    return res.sendStatus(http_statuses_1.HttpStatus.NoContent); // 204
}));
// POST /auth/refresh-token
exports.authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oldRefresh = req.cookies[cookie_config_1.REFRESH_COOKIE_NAME];
    if (!oldRefresh) {
        return res.sendStatus(401);
    }
    const ip = req.ip || 'unknown';
    const result = yield auth_service_1.authService.refreshTokens(oldRefresh, ip);
    if (result.status !== resultCode_1.ResultStatus.Success || !result.data) {
        res.clearCookie(cookie_config_1.REFRESH_COOKIE_NAME);
        return res.sendStatus(401);
    }
    res.cookie(cookie_config_1.REFRESH_COOKIE_NAME, result.data.refreshToken, cookie_config_1.REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ accessToken: result.data.accessToken });
}));
// POST /auth/logout
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refresh = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[cookie_config_1.REFRESH_COOKIE_NAME];
    // 1. Нет токена в куке → сразу 401
    if (!refresh) {
        return res.sendStatus(http_statuses_1.HttpStatus.Unauthorized);
    }
    const result = yield auth_service_1.authService.logout(refresh);
    // 2. Токен просрочен / invalid / уже удалён → 401
    if (result.status !== resultCode_1.ResultStatus.Success) {
        res.clearCookie(cookie_config_1.REFRESH_COOKIE_NAME);
        return res.sendStatus(http_statuses_1.HttpStatus.Unauthorized);
    }
    // 3. Всё ок → чистим куку и 204
    res.clearCookie(cookie_config_1.REFRESH_COOKIE_NAME);
    res.sendStatus(http_statuses_1.HttpStatus.NoContent);
}));
// GET /auth/me
exports.authRouter.get('/me', jwt_auth_middleware_1.jwtAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const result = yield auth_service_1.authService.getCurrentUser(userId);
    if (result.status !== resultCode_1.ResultStatus.Success || !result.data) {
        return res.sendStatus(401);
    }
    res.status(200).json(result.data);
}));
//# sourceMappingURL=auth.router.js.map