import {PostsService} from "../../../Posts/application/Posts.service";
import { Request, Response } from 'express';
import {PostQueryInput} from "../../../Posts/routes/input/post-query.input";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {mapToPostListPaginatedOutput} from "../../../Posts/routes/mappers/MapToPostListPaginatedOutput";


export async function getBlogPostListHandler(
    req: Request<{ id: string }, {}, {}, PostQueryInput>,
    res: Response,
) {
    try {
        const blogId = req.params.id;
        const queryInput = req.query;

        const { items, totalCount } = await PostsService.findPostByBlog(
            queryInput,
            blogId,

        );

        const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });
        res.send(postListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}