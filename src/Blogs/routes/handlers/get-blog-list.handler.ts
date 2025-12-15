import { Request, Response} from "express";
import {BlogQueryInput} from "../input/blog-query.input";
import {BlogsService} from "../../application/Blogs.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/Helpers/set-default-sort-and-pagination";

import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogDto} from "../mappers/Map-to-blog-dto";


export async function getBlogListHandler(
    req: Request<{}, {}, {}, BlogQueryInput>,
    res: Response
) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        const { items, totalCount } = await BlogsService.findMany(queryInput);

        const result = {
            pagesCount: Math.ceil(totalCount / queryInput.pageSize),
            page: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
            items: items.map(mapToBlogDto), // ← должен возвращать BlogDto[]
        };

        res.status(HttpStatus.Ok).send(result);
    } catch (e) {
        errorsHandler(e, res);
    }
}
