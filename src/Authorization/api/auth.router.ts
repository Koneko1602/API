import { Response, Router } from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {userValidation} from "../../Users/validation/validation.user";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {RequestWithBody} from "../../Users/errors/requests";
import {LoginDto} from "../types/login.dto";
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../Users/common/result/resultCode";


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

            // Если тесты требуют тело ответа, используйте:
            // return res.status(HttpStatus.Unauthorized).json(createErrorMessages(result.extensions));
        }

        // 3. Если статус "Успех"
        if (result.status === ResultStatus.Success) {
            // Отправляем 200 OK и токен
            return res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });
        }

        // На всякий случай обрабатываем неожиданный статус
        return res.sendStatus(HttpStatus.InternalServerError);
    },
);