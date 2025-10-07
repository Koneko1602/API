import {PostsService} from "../../../Posts/application/Posts.service";
import { Request, Response } from 'express';
import {PostQueryInput} from "../../../Posts/routes/input/post-query.input";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {mapToPostListPaginatedOutput} from "../../../Posts/routes/mappers/MapToPostListPaginatedOutput";
import {PostInputModel} from "../../../Posts/domain/PostModel";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function getBlogPostListHandler(
    req: Request<{ id: string }, {}, {}, PostQueryInput>,
    res: Response,
): Promise<void> {
    try {
        const blogId = req.params.id;
        const input: PostQueryInput = req.query;

        const pageNumber = Number(input.pageNumber) || 1;
        const pageSize = Number(input.pageSize) || 10;

        const { items, totalCount } = await PostsService.findPostByBlog(
            { ...input, pageNumber, pageSize },
            blogId
        );

        const dto = mapToPostListPaginatedOutput(items, {
            pageNumber,
            pageSize,
            totalCount,
        });

        res.status(HttpStatus.Ok).send(dto);
    } catch (e) {
        errorsHandler(e, res);
    }
}


