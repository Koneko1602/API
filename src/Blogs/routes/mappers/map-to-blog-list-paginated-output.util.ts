import {WithId} from "mongodb";
import {Blog} from "../../domain/BlogModel";
import {BlogDTO} from "../../dto/BlogModelDTO";
import { mapToBlogDto} from "./Map-to-blog-dto";

export function mapToBlogListPaginatedOutput(
    blogs: WithId<Blog>[],
    meta: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
    }
): {
    items: BlogDTO[];
    meta: {
        pageNumber: number;
        pageSize: number;
        totalCount: number;
        totalPageCount: number;
    };
} {
    const items = blogs.map(mapToBlogDto);

    const metaOutput = {
        pageNumber: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        totalPageCount: Math.ceil(meta.totalCount / meta.pageSize),
    };

    return {
        items,
        meta: metaOutput,
    };
}
