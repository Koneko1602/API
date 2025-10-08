import { Request, Response} from "express";
import {BlogQueryInput} from "../input/blog-query.input";
import {BlogsService} from "../../application/Blogs.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/Helpers/set-default-sort-and-pagination";
import {mapToBlogListPaginatedOutput} from "../mappers/map-to-blog-list-paginated-output.util";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function getBlogListHandler(
    req: Request<{}, {}, {}, BlogQueryInput>,
    res: Response,
) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        const { items, totalCount } = await BlogsService.findMany(queryInput);

        const blogsListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.status(HttpStatus.Ok).send(blogsListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}