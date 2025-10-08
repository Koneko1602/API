import {WithId} from "mongodb";
import {Post} from "../../domain/PostModel";
import {PostListPaginatedOutput} from "../output/post-list-paginated.output";
import {ResourceType} from "../../../core/types/resource-type";


export function mapToPostListPaginatedOutput(

    posts: WithId<Post>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: {
        id: string;
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        blogName: string;
        createdAt: Date;
    }[];
} {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map((post) => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        })),
    };
}





