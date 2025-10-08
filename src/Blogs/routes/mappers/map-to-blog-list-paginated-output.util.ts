import {WithId} from "mongodb";
import {Blog} from "../../domain/BlogModel";
import {BlogDTO} from "../../dto/BlogModelDTO";
import { mapToBlogDto} from "./Map-to-blog-dto";

// ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ПРОХОЖДЕНИЯ ТЕСТА
export function mapToBlogListPaginatedOutput(
    blogs: WithId<Blog>[],
    meta: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
    }
) {
    // 1. Вычисляем общее количество страниц с округлением вверх
    const totalPages = Math.ceil(meta.totalCount / meta.pageSize);

    // 2. Маппим элементы
    const items = blogs.map(mapToBlogDto);

    return {
        // 3. ПЕРЕИМЕНОВАНИЕ И ПЛОСКАЯ СТРУКТУРА

        // meta.totalPageCount -> pagesCount
        pagesCount: totalPages,

        // meta.pageNumber -> page
        page: meta.pageNumber,

        // Оставшиеся поля совпадают по имени и остаются на верхнем уровне
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,

        // Массив элементов
        items: items,
    };
}