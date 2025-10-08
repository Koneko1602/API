import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostsService} from "../../application/Posts.service";
import {PostQueryInput} from "../input/post-query.input";
import {mapToPostListPaginatedOutput} from "../mappers/MapToPostListPaginatedOutput";



export async function getPostListHandler(
    req: Request<{}, {}, {}, PostQueryInput>, // Используем req.query
    res: Response,
) {
    try {
        const queryDto: PostQueryInput = req.query;
        // 1. Убедитесь, что pageNumber/pageSize здесь безопасно обрабатываются
        const pageNumber = Number(queryDto.pageNumber) || 1;
        const pageSize = Number(queryDto.pageSize) || 10;

        // 2. Получаем данные из сервиса
        const { items, totalCount } = await PostsService.findMany({
            ...queryDto,
            pageNumber,
            pageSize,
        });

        // 3. Создаем DTO пагинации
        const dto = mapToPostListPaginatedOutput(items, {
            pageNumber,
            pageSize,
            totalCount,
        });

        // 4. ✅ ОТПРАВЛЯЕМ DTO В ОТВЕТЕ
        res.status(HttpStatus.Ok).send(dto); // 👈 Передаём 'dto' в send()

    } catch (e:unknown) {

    }
}