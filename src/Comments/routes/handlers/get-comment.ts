
import { Response } from 'express';
import {RequestWithParams} from "../../../Users/errors/requests";
import {ResultStatus} from "../../../Users/common/result/resultCode";
import {CommentsService} from "../../application/Comments.service";
import {HttpStatus} from "../../../core/types/http-statuses";

type CommentParams = { id: string };

export async function getCommentByIdHandler(
    req: RequestWithParams<CommentParams>, // 💡 Строгий тип для req.params.id
    res: Response,
) {
    try {
        const commentId = req.params.id;

        // 1. Вызываем Сервис
        const result = await CommentsService.findCommentById(commentId);

        // 2. Обработка ResultStatus
        switch (result.status) {
            case ResultStatus.Success:
                // 200 Success: возвращаем данные
                return res.status(HttpStatus.Ok).send(result.data);

            case ResultStatus.NotFound:
                // 404 Not Found: возвращаем пустой статус 404
                return res.sendStatus(HttpStatus.NotFound);

            // Здесь можно добавить обработку других ошибок,
            // но для GET /comments/:id нам нужны только Success и NotFound.

            default:
                // Любая другая неожиданная ошибка
                return res.sendStatus(HttpStatus.InternalServerError); // 500
        }

    } catch (e: unknown) {
        // Ошибка уровня системы (например, ошибка подключения к БД)
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}