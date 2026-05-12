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
exports.authRouter = (0, express_1.Router)();
// POST /auth/login
exports.authRouter.post('/login', validation_user_1.userValidation.passwordValidation, validation_user_1.userValidation.loginOrEmailValidation, input_validation_result_middleware_1.inputValidationResultMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginOrEmail, password } = req.body;
    const ip = req.ip || 'unknown';
    const title = req.headers['user-agent'] || 'Unknown device';
    const result = yield auth_service_1.authService.loginUser(loginOrEmail, password, ip, title);
    if (result.status !== resultCode_1.ResultStatus.Success || !result.data) {
        console.log('❌ Login failed');
        return res.status(401).end();
    }
    // КРИТИЧНО: Сначала cookie, потом тело
    res.cookie(cookie_config_1.REFRESH_COOKIE_NAME, result.data.refreshToken, cookie_config_1.REFRESH_COOKIE_OPTIONS);
    console.log('📤 Login OK | accessToken sent + refreshToken in cookie');
    // Тесты ожидают accessToken как строку (plain text)
    return res.status(200).send(result.data.accessToken);
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
// POST /auth/refresh-token
exports.authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oldRefresh = req.cookies[cookie_config_1.REFRESH_COOKIE_NAME];
    if (!oldRefresh) {
        console.log('❌ Refresh: no cookie');
        return res.sendStatus(401);
    }
    const ip = req.ip || 'unknown';
    const result = yield auth_service_1.authService.refreshTokens(oldRefresh, ip);
    if (result.status !== resultCode_1.ResultStatus.Success || !result.data) {
        console.log('❌ Refresh failed');
        res.clearCookie(cookie_config_1.REFRESH_COOKIE_NAME);
        return res.sendStatus(401);
    }
    res.cookie(cookie_config_1.REFRESH_COOKIE_NAME, result.data.refreshToken, cookie_config_1.REFRESH_COOKIE_OPTIONS);
    console.log('🔄 Refresh SUCCESS');
    return res.status(200).json({ accessToken: result.data.accessToken });
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