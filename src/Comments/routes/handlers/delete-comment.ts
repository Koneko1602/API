import {ResultStatus} from "../../../Users/common/result/resultCode";
import {HttpStatus} from "../../../core/types/http-statuses";
import {CommentsService} from "../../application/Comments.service";
import { RequestWithParamsAndCommentsId} from "../../../Users/errors/requests";
import {Response} from "express"

type CommentParams = { id: string };
type UserId = string;

export async function deleteCommentController(req: RequestWithParamsAndCommentsId<CommentParams, UserId>, res: Response) {
    // Вызов сервиса...
    const result = await CommentsService.deleteComment(req.params.id, req.userId, req.headers.authorization);

    switch (result.status) {
        case ResultStatus.Success:
            return res.sendStatus(204); // ✅ Соответствует примеру usersService (204)
        case ResultStatus.NotFound:
            return res.sendStatus(404); // ✅ Соответствует примеру usersService (404)
        case ResultStatus.Forbidden:
            return res.sendStatus(403); // 🛑 Дополнительная бизнес-проверка
        default:
            return res.sendStatus(500);
    }
}