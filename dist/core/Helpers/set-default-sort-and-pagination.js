"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultSortAndPaginationIfNotExist = setDefaultSortAndPaginationIfNotExist;
const query_pagination_sorting_validation_middleware_1 = require("../Middlewares/validation/query-pagination-sorting.validation-middleware");
// export function setDefaultSortAndPaginationIfNotExist<P = string>(
//     query: Partial<PaginationAndSorting<P>>,
// ): PaginationAndSorting<P> {
//     return {
//         ...paginationAndSortingDefault,
//         ...query,
//         sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
//     };
// }
function setDefaultSortAndPaginationIfNotExist(query) {
    var _a, _b, _c;
    const pageNumber = Number((_a = query.pageNumber) !== null && _a !== void 0 ? _a : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.pageNumber);
    const pageSize = Number((_b = query.pageSize) !== null && _b !== void 0 ? _b : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.pageSize);
    return Object.assign(Object.assign(Object.assign({}, query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault), query), { 
        // ✅ Явное преобразование в Number для пагинации
        pageNumber: pageNumber, pageSize: pageSize, 
        // Приведение типов для sortBy остается прежним:
        sortBy: ((_c = query.sortBy) !== null && _c !== void 0 ? _c : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.sortBy) });
}
//# sourceMappingURL=set-default-sort-and-pagination.js.map