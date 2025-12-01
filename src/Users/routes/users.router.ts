import {Response, Router} from "express";
import {CreateUserDto} from "../types/create-user.dto";
import {baseAuthGuard} from "../../Authorization/api/guards/base.auth.guard";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../errors/requests";
import {UsersQueryFieldsType} from "../types/users.queryFields.type";
import {IPagination} from "../pagination/pagination";
import {usersQwRepository} from "../repository/user.query.repository";
import {sortQueryFieldsUtil} from "../pagination/sortQueryFields.util";
import {IUserView} from "../types/user.view.interface";
import {usersService} from "../application/Users.service";
import {HttpStatus} from "../../core/types/http-statuses";
import {IdType} from "../errors/id";
import {pageNumberValidation} from "../pagination/sorting.pagination.validation";
import {userValidation} from "../validation/validation.user";
import {inputValidationResultMiddleware} from "../../core/Middlewares/validation/input-validation-result.middleware";

export const usersRouter = Router();

usersRouter.get(
    "/",
    baseAuthGuard,
    pageNumberValidation,
    async (
        req: RequestWithQuery<UsersQueryFieldsType>,
        res: Response<IPagination<IUserView[]>>,
    ) => {

        // 1. Получаем чистые данные пагинации/сортировки
        const cleanSortPagination = sortQueryFieldsUtil(req.query);

        // 2. Извлекаем необработанные параметры поиска
        const {searchLoginTerm, searchEmailTerm} = req.query;

        // 3. 🚀 ФОРМИРУЕМ ПОЛНЫЙ, ЧИСТЫЙ ОБЪЕКТ
        const finalQueryFilter = {
            ...cleanSortPagination, // Чистые pageNumber, pageSize, sortBy, sortDirection (1|-1)
            searchLoginTerm,        // Необработанные, но нужные для фильтрации
            searchEmailTerm,
        };

        const allUsers = await usersQwRepository.findAllUsers(finalQueryFilter);

        return res.status(200).send(allUsers);
    },
    usersRouter.post(
        "/",
        baseAuthGuard,
        userValidation.passwordValidation,
        userValidation.loginValidation,
        userValidation.emailValidation,
        inputValidationResultMiddleware,
        async (req: RequestWithBody<CreateUserDto>, res: Response<IUserView>) => {
            const {login, password, email} = req.body;

            const userId = await usersService.create({login, password, email});
            const newUser = await usersQwRepository.findById(userId);

            return res.status(HttpStatus.Created).send(newUser!);
        },
    ))
;

usersRouter.delete(
    "/:id",
    baseAuthGuard,
    async (req: RequestWithParams<IdType>, res: Response<string>) => {
        const user = await usersService.delete(req.params.id);

        if (!user) return res.sendStatus(404);

        return res.sendStatus(204);
    },
);