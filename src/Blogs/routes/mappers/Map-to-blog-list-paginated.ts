
import { WithId } from 'mongodb';
import {Blog} from "../../domain/BlogModel";
import {BlogListPaginatedOutput} from "../output/BlogListPaginatedOutput";
import {Post} from "../../../Posts/domain/PostModel";


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

export function mapToBlogListPaginated(

    blog: WithId<Blog>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: {
        id: string;
        name: string;
        description: string;
        websiteUrl: string;
        isMembership: false;
        createdAt: Date;


    }[];
} {
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
            isMembership:blog.isMembership,
        })),
    };
}


