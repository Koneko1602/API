import { Response, Router } from "express";
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


export const authRouter = Router();

authRouter.post(
    '/login',
    userValidation.passwordValidation,
    userValidation.loginOrEmailValidation,
    inputValidationResultMiddleware,

    async (req: RequestWithBody<LoginDto>, res: Response) => {
        const { loginOrEmail, password } = req.body;

        // 1. Получаем Result объект
        const result = await authService.loginUser(loginOrEmail, password);

        // 2. Проверяем статус: если ошибка аутентификации
        if (result.status === ResultStatus.Unauthorized) {

            // Отправляем ожидаемый 401 статус
            return res.status(HttpStatus.Unauthorized).end();


        }

        // 3. Если статус "Успех"
        if (result.status === ResultStatus.Success) {
            // Отправляем 200 OK и токен
            return res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });
        }

        // На всякий случай обрабатываем неожиданный статус
        return res.sendStatus(HttpStatus.InternalServerError);
    },
    authRouter.post(
        '/registration-confirmation',
        // Валидация
        body('code')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('Code is required and must be a non-empty string'),

        // Общий middleware обработки ошибок валидации
        inputValidationResultMiddleware,

        // Основная логика
        async (req: RequestWithBody<{ code: string }>, res: Response) => {
            const { code } = req.body;

            const result = await authService.confirmRegistration(code);

            if (result.status !== ResultStatus.Success) {
                // Правильно формируем массив ошибок
                let errors: FieldError[];

                if (result.extensions && result.extensions.length > 0) {
                    // Если есть extensions — преобразуем их, заменяя null на 'code'
                    errors = result.extensions.map(ext => ({
                        message: ext.message,
                        field: ext.field ?? 'code'  // ← ext объявлен как параметр map
                    }));
                } else {
                    // Если extensions пустой или null — создаём fallback ошибку
                    errors = [{
                        message: result.errorMessage || 'Invalid or expired confirmation code',
                        field: 'code'
                    }];
                }

                return res.status(HttpStatus.BadRequest).json(createErrorsMessages(errors));
            }

            return res.sendStatus(HttpStatus.NoContent); // 204
        }
    )





);