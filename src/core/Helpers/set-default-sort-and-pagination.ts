import {PaginationAndSorting} from "../types/pagination-and-sorting";
import {paginationAndSortingDefault} from "../Middlewares/validation/query-pagination-sorting.validation-middleware";

// export function setDefaultSortAndPaginationIfNotExist<P = string>(
//     query: Partial<PaginationAndSorting<P>>,
// ): PaginationAndSorting<P> {
//     return {
//         ...paginationAndSortingDefault,
//         ...query,
//         sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
//     };
// }
export function setDefaultSortAndPaginationIfNotExist<P = string>(
    query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
    const pageNumber = Number(query.pageNumber ?? paginationAndSortingDefault.pageNumber);
    const pageSize = Number(query.pageSize ?? paginationAndSortingDefault.pageSize);

    return {
        ...paginationAndSortingDefault,
        ...query,
        // ✅ Явное преобразование в Number для пагинации
        pageNumber: pageNumber,
        pageSize: pageSize,

        // Приведение типов для sortBy остается прежним:
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
    };
}