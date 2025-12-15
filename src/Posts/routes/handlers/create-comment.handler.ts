import {Comment, CommentViewModel} from "../../../Comments/domain/CommentsModel";
import {HttpStatus} from "../../../core/types/http-statuses";
import {Request, Response} from 'express';
import {CommentsService} from "../../../Comments/application/Comments.service";
import {usersRepository} from "../../../Users/repository/UserRepository";


export async function createCommentForPostController(
    req: Request,
    res: Response
) {
    try {
        // 1. ПРОВЕРКА (Убедитесь, что статус 401)
        if (!req.userId) {
            // Если токен невалиден/отсутствует (тест падает с 401)
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        const currentUserId: string = req.userId;
        const postId: string = req.params.id; // 👈 Имя параметра должно быть правильным
        const inputModel: Comment = req.body;

        // 2. Поиск пользователя (если здесь падает, то 403)
        const user = await usersRepository.findById(currentUserId);
        if (!user) {
            // Токен валиден, но пользователя нет в БД (тест падает с 403)
            return res.sendStatus(HttpStatus.Forbidden);
        }

        // 3. Создание комментария (если здесь падает, то 404)
        const newComment: CommentViewModel | null = await CommentsService.createComment(
            postId,
            inputModel,
            { userId: user._id.toString(), userLogin: user.login }
        );

        if (!newComment) {
            // Пост не найден
            return res.sendStatus(HttpStatus.NotFound);
        }

        // 4. УСПЕХ (Тест проходит с 201)
        return res.status(HttpStatus.Created).send(newComment);

    } catch (e) {
        // ...
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}