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
export const authRouter = Router();
authRouter.post('/login',
    async (req: RequestWithBody<LoginDto>, res: Response) => {
        const ip = req.ip!;
        const title = (req.headers['user-agent'] as string) || 'Unknown device';

        const result = await authService.loginUser(
            req.body.loginOrEmail,
            req.body.password,
            ip,
            title
        );

        if (result.status !== ResultStatus.Success || !result.data) {
            return res.status(401).end();
        }

        res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);
        return res.status(200).json({accessToken: result.data.accessToken});
    });
// POST /auth/login
authRouter.post(
    '/login',
    userValidation.passwordValidation,
    userValidation.loginOrEmailValidation,
    inputValidationResultMiddleware,

    async (req: RequestWithBody<LoginDto>, res: Response) => {
        const {loginOrEmail, password} = req.body;
        const ip = req.ip!;
        const title = (req.headers['user-agent'] as string) || 'Unknown device';
        const result = await authService.loginUser(loginOrEmail, password, ip, title);

        if (result.status !== ResultStatus.Success || !result.data) {
            return res.status(HttpStatus.Unauthorized).end();
        }

        res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);

        return res.status(HttpStatus.Ok).json({accessToken: result.data.accessToken});
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
authRouter.post(
    '/refresh-token',
    async (req: Request, res: Response) => {
        const oldRefresh = req.cookies[REFRESH_COOKIE_NAME];

        if (!oldRefresh) {
            return res.sendStatus(401);
        }
        const ip = req.ip || 'unknown';
        const result = await authService.refreshTokens(oldRefresh,ip);

        if (result.status !== ResultStatus.Success || !result.data) {
            res.clearCookie(REFRESH_COOKIE_NAME);
            return res.sendStatus(401);
        }

        res.cookie(REFRESH_COOKIE_NAME, result.data.refreshToken, REFRESH_COOKIE_OPTIONS);

        res.status(200).json({accessToken: result.data.accessToken});
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