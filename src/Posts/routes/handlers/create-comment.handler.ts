import {Comment, CommentViewModel} from "../../../Comments/domain/CommentsModel";
import {HttpStatus} from "../../../core/types/http-statuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {Request, Response} from 'express';
import {commentatorInfo} from "../../../Comments/domain/commentatorInfo";
import {CommentsService} from "../../../Comments/application/Comments.service";
import {usersRepository} from "../../../Users/repository/UserRepository";


export async function createCommentForPostController(
    req: Request,
    res: Response
) {
    try {
        // --- 1. ПРОВЕРКА АУТЕНТИФИКАЦИИ (401) ---
        // Если middleware не смог установить userId (токен отсутствует или невалиден),
        // он должен был вернуть 401. Но, если он просто прошел дальше, то мы проверяем здесь.
        // Ваш authMiddleware должен ОБЕСПЕЧИТЬ 401, если токен обязателен.
        if (!req.userId) {
            // Если вы хотите, чтобы middleware устанавливал 401, удалите эту проверку.
            // Если middleware просто устанавливает req.userId = null, эта проверка нужна.
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        const currentUserId: string = req.userId;
        const postId: string = req.params.postId;
        const inputModel: Comment = req.body;

        // --- 2. ПОЛУЧЕНИЕ ДАННЫХ КОММЕНТАТОРА ---
        // Нам нужен логин пользователя для поля commentatorInfo.
        const user = await usersRepository.findById(currentUserId);

        // Крайне маловероятно, но проверяем, что пользователь существует в БД
        if (!user) {
            // Пользователь аутентифицирован по токену, но не найден в БД
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        // Формируем объект, необходимый для сервиса комментариев
        const currentUserInfo: commentatorInfo = {
            userId: user._id.toString(), // user._id из БД (ObjectId) в string
            userLogin: user.login,       // Логин из БД
        };

        // --- 3. ВЫЗОВ СЕРВИСА ---
        const newComment: CommentViewModel | null = await CommentsService.createComment(
            postId,
            inputModel, // Используем только content из body, как обычно
            currentUserInfo
        );

        // --- 4. ОБРАБОТКА РЕЗУЛЬТАТА (404 или 201) ---
        if (!newComment) {
            // Если сервис вернул null, значит пост с таким postId не найден.
            return res.sendStatus(HttpStatus.NotFound);
        }

        // Успех! Возвращаем созданный объект с кодом 201.
        return res.status(HttpStatus.Created).send(newComment);

    } catch (e) {
        console.error(`Ошибка при создании комментария для поста ${req.params.postId}:`, e);
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}