"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogListPaginated = mapToBlogListPaginated;
// export function mapToBlogListPaginated(
//     blogs: WithId<Blog>[],
//     meta: {
//
//         pageNumber: number;
//         pageSize: number;
//         totalCount: number;
//     }
// ): BlogListPaginatedOutput {
//     return {
//         // 1. Поля пагинации теперь на верхнем уровне
//         pageCount: Math.ceil(meta.totalCount / meta.pageSize),
//         page: meta.pageNumber,
//         pageSize: meta.pageSize,
//         totalCount: meta.totalCount,
//
//         // 2. Массив называется 'items', а не 'data'
//         items: blogs.map((blog) => {
//             // 3. Преобразуем каждый блог в простой "плоский" объект
//             return {
//                 id: blog._id.toString(), // Конвертируем ObjectId в строку
//                 name: blog.name,
//                 description: blog.description,
//                 websiteUrl: blog.websiteUrl,
//                 createdAt: blog.createdAt,
//                 isMembership: blog.isMembership,
//             };
//         }),
//     };
// }
function mapToBlogListPaginated(blog, meta) {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: blog.map((blog) => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        })),
    };
}
//# sourceMappingURL=Map-to-blog-list-paginated.js.map