import {RequestWithParamsAndBodyAndCommentId, RequestWithParamsAndBodyAndUserId} from "../../../Users/errors/requests";
import {CommentsService} from "../../application/Comments.service";
import {ResultStatus} from "../../../Users/common/result/resultCode";
import {HttpStatus} from "../../../core/types/http-statuses";
import {Response} from "express";

type CommentParams = { id: string };
type CommentInputModel = { content: string };
type UserId = string;

export async function updateCommentController(
    req: RequestWithParamsAndBodyAndCommentId   <CommentParams, CommentInputModel, UserId>,
    res: Response,
) {
    try {
        const result = await CommentsService.updateComment(
            req.params.id,
            req.userId,
            req.body,
            req.headers.authorization
        );

        switch (result.status) {
            case ResultStatus.Success:
                return res.sendStatus(HttpStatus.NoContent); // 204
            case ResultStatus.NotFound:
                return res.sendStatus(HttpStatus.NotFound); // 404
            case ResultStatus.Forbidden:
                return res.sendStatus(HttpStatus.Forbidden); // 403
            case ResultStatus.BadRequest:
                // Здесь мы ожидаем, что BadRequest не произойдет, так как 400-валидация в роутере,
                // но оставляем на случай других ошибок сервиса.
                return res.status(HttpStatus.BadRequest).send({ errorsMessages: result.extensions });
            default:
                return res.sendStatus(HttpStatus.InternalServerError);
        }
    } catch (e: unknown) {
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}