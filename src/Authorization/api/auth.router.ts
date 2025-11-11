import { Response, Router } from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {userValidation} from "../../Users/validation/validation.user";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";

export const authRouter = Router();

authRouter.post(
    routersPaths.auth.login,
    userValidation,
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,

    async (req: RequestWithBody<LoginDto>, res: Response) => {
        const { loginOrEmail, password } = req.body;

        const accessToken = await authService.loginUser(loginOrEmail, password);
        if (!accessToken) return res.sendStatus(HttpStatus.Unauthorized);

        return res.status(HttpStatus.Ok).send({ accessToken });
    },
);