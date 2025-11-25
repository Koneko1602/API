import { Response, Router } from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {userValidation} from "../../Users/validation/validation.user";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";
import {RequestWithBody} from "../../Users/errors/requests";
import {LoginDto} from "../types/login.dto";
import {authService} from "../domain/auth.service";


export const authRouter = Router();

authRouter.post(
    '/login',
    userValidation.passwordValidation,
    userValidation.loginOrEmailValidation,
    inputValidationResultMiddleware,

    async (req: RequestWithBody<LoginDto>, res: Response) => {
        const { loginOrEmail, password } = req.body;

        const accessToken = await authService.loginUser(loginOrEmail, password);
        if (!accessToken) return res.sendStatus(HttpStatus.Unauthorized);

        return res.status(HttpStatus.NoContent).send({ accessToken });
    },
);