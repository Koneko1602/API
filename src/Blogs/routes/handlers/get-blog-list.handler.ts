import { Request, Response} from "express";
import {BlogQueryInput} from "../input/blog-query.input";
import {BlogsService} from "../../application/Blogs.service";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/Helpers/set-default-sort-and-pagination";

import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogListPaginated} from "../mappers/Map-to-blog-list-paginated";
import {BlogListPaginatedOutput} from "../output/BlogListPaginatedOutput";
import {mapToPostListPaginatedOutput} from "../../../Posts/routes/mappers/MapToPostListPaginatedOutput";

// export async function getBlogListHandler(
//     req: Request<{}, {}, {}, BlogQueryInput>,
//     res: Response,
// ) {
//     try {
//         const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
//
//         const { items, totalCount } = await BlogsService.findMany(queryInput);
//
//         const blogsListOutput =mapToBlogListPaginated(items, {
//             pageNumber: queryInput.pageNumber,
//             pageSize: queryInput.pageSize,
//             totalCount,
//         });
//
//         res.status(HttpStatus.Ok).send(blogsListOutput);
//     } catch (e: unknown) {
//         errorsHandler(e, res);
//     }
// }




export async function getBlogListHandler(
    req: Request<{}, {}, {}, BlogQueryInput>,
    res: Response,
) {
    try {
        // 1. Безопасное извлечение и преобразование query-параметров

        const pageNumberRaw = req.query.pageNumber;
        const pageSizeRaw = req.query.pageSize;

        // Гарантируем, что пагинация — это числа, используя значения по умолчанию (1 и 10) и проверку > 0.
        const pageNumber = Number(pageNumberRaw) > 0 ? Number(pageNumberRaw) : 1;
        const pageSize = Number(pageSizeRaw) > 0 ? Number(pageSizeRaw) : 10;

        // 2. Получение данных из сервиса

        const { items, totalCount } = await BlogsService.findMany({
            ...req.query,
           
            pageNumber,
            pageSize,
        });

        // 3. Создание DTO пагинации
        // Здесь используется маппер, который возвращает структуру { meta, items }
        const blogsListOutput = mapToBlogListPaginated(items, {
            pageNumber,
            pageSize,
            totalCount,
        });

        // 4. Отправка успешного ответа (200 OK)
        res.status(HttpStatus.Ok).send(blogsListOutput);

    } catch (e: unknown) {
        // 5. Перехват и обработка ошибки (отправка 500, если это внутренняя ошибка)
        errorsHandler(e, res);
    }
}