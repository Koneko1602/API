import {Response, Router, Request} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {userValidation} from "../../Users/validation/validation.user";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {RequestWithBody} from "../../Users/errors/requests";
import {LoginDto} from "../types/login.dto";
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../Users/common/result/resultCode";
import {body} from "express-validator";
import {createErrorsMessages} from "../../core/errors/FieldError";
import {FieldError} from "../../core/errors/APIErrorResult";
import {inputValidationAuthMiddleware} from "../../core/Middlewares/validation/validation-auth.middleware";
import {REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS} from "../../core/settings/cookie.config";
import {jwtAuthMiddleware} from "../api/guards/jwt.auth.middleware";


export const authRouter = Router();

// POST /auth/login
authRouter.post(
    '/login',
    userValidation.passwordValidation,
    userValidation.loginOrEmailValidation,
    inputValidationResultMiddleware,

    async (req: RequestWithBody<LoginDto>, res: Response) => {
        const {loginOrEmail, password} = req.body;
        const ip = req.ip || 'unknown';
        const title = (req.headers['user-agent'] as string) || 'Unknown device';

        const result = await authService.loginUser(loginOrEmail, password, ip, title);

        if (result.status !== ResultStatus.Success || !result.data) {
            console.log('❌ Login failed');
            return res.status(401).end();
        }

        // КРИТИЧНО: Сначала cookie, потом тело
        res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);

        console.log('📤 Login OK | accessToken sent + refreshToken in cookie');

        // Тесты ожидают accessToken как строку (plain text)
        return res.status(200).send(result.data.accessToken);
    }
);

// POST /auth/registration-confirmation
authRouter.post(
    '/registration-confirmation',
    body('code')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Code is required and must be a non-empty string'),

    inputValidationResultMiddleware,

    async (req: RequestWithBody<{ code: string }>, res: Response) => {
        const {code} = req.body;

        const result = await authService.confirmRegistration(code);

        if (result.status !== ResultStatus.Success) {
            let errors: FieldError[];

            if (result.extensions && result.extensions.length > 0) {
                errors = result.extensions.map(ext => ({
                    message: ext.message,
                    field: ext.field ?? 'code'
                }));
            } else {
                errors = [{
                    message: result.errorMessage || 'Invalid or expired confirmation code',
                    field: 'code'
                }];
            }

            return res.status(HttpStatus.BadRequest).json(createErrorsMessages(errors));
        }

        return res.sendStatus(HttpStatus.NoContent); // 204
    }
);

// POST /auth/registration
authRouter.post(
    '/registration',
    userValidation.loginValidation,
    userValidation.passwordValidation,
    userValidation.emailValidation,
    inputValidationAuthMiddleware,

    async (req: RequestWithBody<{ login: string, password: string, email: string }>, res: Response) => {
        const {login, password, email} = req.body;

        console.log('[REG ROUTER] Received body:', req.body);
        const result = await authService.registerUser(login, password, email);
        console.log('[REG ROUTER] Service result status:', result.status);

        if (result.status !== ResultStatus.Success) {
            const safeErrors: FieldError[] = (result.extensions || []).map(ext => ({
                message: ext.message,
                field: ext.field ?? 'general'
            }));

            if (safeErrors.length === 0) {
                safeErrors.push({
                    message: result.errorMessage || 'Registration failed (duplicate or invalid data)',
                    field: 'general'
                });
            }

            return res.status(HttpStatus.BadRequest).json(createErrorsMessages(safeErrors));
        }

        return res.sendStatus(HttpStatus.NoContent); // 204
    }
);

// POST /auth/registration-email-resending
authRouter.post(
    '/registration-email-resending',
    userValidation.emailValidation,
    inputValidationResultMiddleware,

    async (req: RequestWithBody<{ email: string }>, res: Response) => {
        const {email} = req.body;

        console.log('[RESEND/CONFIRM] Received:', req.body);

        const result = await authService.resendConfirmationEmail(email);

        if (result.status !== ResultStatus.Success) {
            const errors = result.extensions.length > 0
                ? result.extensions.map(ext => ({
                    message: ext.message,
                    field: ext.field ?? 'email'
                }))
                : [{
                    field: 'email',
                    message: result.errorMessage || 'Email not found or already confirmed'
                }];

            return res.status(HttpStatus.BadRequest).json(createErrorsMessages(errors as FieldError[]));
        }

        return res.sendStatus(HttpStatus.NoContent); // 204
    }
);

// POST /auth/refresh-token
// POST /auth/refresh-token
authRouter.post(
    '/refresh-token',
    async (req: Request, res: Response) => {
        const oldRefresh = req.cookies[REFRESH_COOKIE_NAME];

        if (!oldRefresh) {
            console.log('❌ Refresh: no cookie');
            return res.sendStatus(401);
        }

        const ip = req.ip || 'unknown';
        const result = await authService.refreshTokens(oldRefresh, ip);

        if (result.status !== ResultStatus.Success || !result.data) {
            console.log('❌ Refresh failed');
            res.clearCookie(REFRESH_COOKIE_NAME);
            return res.sendStatus(401);
        }

        res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);

        console.log('🔄 Refresh SUCCESS');

        return res.status(200).json({ accessToken: result.data.accessToken });
    }
);

// POST /auth/logout
authRouter.post(
    '/logout',
    async (req: Request, res: Response) => {
        const refresh = req.cookies?.[REFRESH_COOKIE_NAME];

        // 1. Нет токена в куке → сразу 401
        if (!refresh) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        const result = await authService.logout(refresh);

        // 2. Токен просрочен / invalid / уже удалён → 401
        if (result.status !== ResultStatus.Success) {
            res.clearCookie(REFRESH_COOKIE_NAME);
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        // 3. Всё ок → чистим куку и 204
        res.clearCookie(REFRESH_COOKIE_NAME);
        res.sendStatus(HttpStatus.NoContent);
    }
);

// GET /auth/me
authRouter.get(
    '/me',
    jwtAuthMiddleware,
    async (req: any, res: Response) => {
        const userId = req.userId;

        const result = await authService.getCurrentUser(userId);

        if (result.status !== ResultStatus.Success || !result.data) {
            return res.sendStatus(401);
        }

        res.status(200).json(result.data);
    }
);