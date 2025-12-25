
import {CommentsService} from "../../../Comments/application/Comments.service";
import {ResultStatus} from "../../../Users/common/result/resultCode";
import {HttpStatus} from "../../../core/types/http-statuses";
import {Response,Request} from "express";
import {SortQueryFieldsType} from "../../../core/pagination/sortQueryFields.type";



// Используем as any или Partial, так как req.query - это строки
export async function getCommentsForPostHandler(
    req: Request,
    res: Response,
) {
    try {
        const postId = req.params.id;

        // Просто передаем query как есть, приведение типов сделаем внутри
        const queryDto = req.query as unknown as SortQueryFieldsType;

        const result = await CommentsService.findCommentsForPost(
            postId,
            queryDto
        );

        switch (result.status) {
            case ResultStatus.Success:
                return res.status(HttpStatus.Ok).send(result.data);
            case ResultStatus.NotFound:
                return res.sendStatus(HttpStatus.NotFound);
            default:
                return res.sendStatus(HttpStatus.InternalServerError);
        }
    } catch (e) {
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}