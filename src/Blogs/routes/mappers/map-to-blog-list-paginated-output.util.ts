import {WithId} from "mongodb";
import {Blog} from "../../domain/BlogModel";
import {BlogDTO} from "../../dto/BlogModelDTO";
import { mapToBlogDto} from "./Map-to-blog-dto";
import {Post} from "../../../Posts/domain/PostModel";
import {PostListPaginatedOutput} from "../../../Posts/routes/output/post-list-paginated.output";
import {mapToPostDataOutput} from "../../../Posts/routes/mappers/mapToPostDataOutput";

// ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ПРОХОЖДЕНИЯ ТЕСТА
export function mapToBlogListPaginatedOutput(
    posts: WithId<Post>[],
    meta: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
    }
): PostListPaginatedOutput {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
            totalCount: meta.totalCount,
        },
        data: posts.map(mapToPostDataOutput),
    };
}


