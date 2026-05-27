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
import {rateLimiterMiddleware} from "../../API/Middlewares/rateLimiter.middleware";


export const authRouter = Router();
authRouter.use((req, res, next) => {
    console.log('🌐 Router hit:', req.method, req.originalUrl);
    next();
});
// POST /auth/login
authRouter.post(
    '/login',
    rateLimiterMiddleware,
    userValidation.passwordValidation,
    userValidation.loginOrEmailValidation,
    inputValidationResultMiddleware,


    async (req: RequestWithBody<LoginDto>, res: Response) => {
        console.log('👉 Router mounted on path:', req.baseUrl, req.originalUrl);
        const {loginOrEmail, password} = req.body;
        const ip = req.ip || 'unknown';
        const title = (req.headers['user-agent'] as string) || 'Unknown device';

        const result = await authService.loginUser(loginOrEmail, password, ip, title);

        if (result.status !== ResultStatus.Success || !result.data?.accessToken) {
            console.log('❌ Login failed');
            return res.status(401).end();
        }

        res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);
        const accessToken = result.data.accessToken;
        console.log('📤 ACCESS TOKEN SENT | length:', accessToken.length);

        return res.status(200).json({
            accessToken
        });
    }


);

// POST /auth/registration-confirmation
authRouter.post(
    '/registration-confirmation',
    rateLimiterMiddleware,
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

        return res.sendStatus(HttpStatus.NoContent);
    }
);

// POST /auth/registration
authRouter.post(
    '/registration',
    rateLimiterMiddleware,
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

        return res.sendStatus(HttpStatus.NoContent);
    }
);

// POST /auth/registration-email-resending
authRouter.post(
    '/registration-email-resending',
    rateLimiterMiddleware,
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

        return res.sendStatus(HttpStatus.NoContent);
    }
);

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

        console.log('🔍 [LOGIN] Sending response:', {
            accessToken: result.data.accessToken?.slice(0,20),

        });
        return res.status(200).json({
            accessToken: result.data.accessToken
        });
    }
);

// POST /auth/logout
authRouter.post(
    '/logout',
    async (req: Request, res: Response) => {
        const refresh = req.cookies?.[REFRESH_COOKIE_NAME];

        if (!refresh) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        const result = await authService.logout(refresh);

        // ✅ Всегда очищаем куку
        res.clearCookie(REFRESH_COOKIE_NAME);

        if (result.status !== ResultStatus.Success) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        res.sendStatus(HttpStatus.NoContent);
    }
);

// GET /auth/me
authRouter.get(
    '/me',
    jwtAuthMiddleware,
    async (req: any, res: Response) => {  // ✅ Правильная типизация
        const userId = req.userId;

        const result = await authService.getCurrentUser(userId);

        if (result.status !== ResultStatus.Success || !result.data) {
            return res.sendStatus(401);
        }

        res.status(200).json(result.data);
    }
);