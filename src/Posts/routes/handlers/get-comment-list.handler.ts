import {SortQueryFilterNumberType} from "../../../core/pagination/sortQueryFilter.ntype";
import {RequestWithParamsAndQuery} from "../../../Users/errors/requests";
import {CommentsService} from "../../../Comments/application/Comments.service";
import {ResultStatus} from "../../../Users/common/result/resultCode";
import {HttpStatus} from "../../../core/types/http-statuses";
import {Response} from "express";

type PostParams = { postId: string };
type CommentQuery = SortQueryFilterNumberType;

export async function getCommentsForPostHandler(
    req: RequestWithParamsAndQuery<PostParams, CommentQuery>,
    res: Response,
) {
    try {
        const postId = req.params.postId;
        // Query параметры (pageNumber, pageSize и т.д.)
        const queryDto: CommentQuery = req.query;

        // 1. Вызываем Service Layer
        const result = await CommentsService.findCommentsForPost(
            postId,
            queryDto
        );

        // 2. ОБРАБОТКА СТАТУСА (Conversion from ResultStatus to HTTP Status)
        switch (result.status) {
            case ResultStatus.Success:
                // 200 Success: возвращаем пагинированные данные
                return res.status(HttpStatus.Ok).send(result.data);

            case ResultStatus.NotFound:
                // 404 Not Found (Пост не найден, как требует Swagger)
                return res.sendStatus(HttpStatus.NotFound);

            // Дополнительно можно обработать ResultStatus.BadRequest
            case ResultStatus.BadRequest:
                return res.status(HttpStatus.BadRequest).send({ errorsMessages: result.extensions });

            default:
                // 500 Internal Server Error для других сбоев
                return res.sendStatus(HttpStatus.InternalServerError);
        }

    } catch (e: unknown) {
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}