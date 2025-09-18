import {WithId} from "mongodb";
import {Post} from "../../domain/PostModel";
import {PostListPaginatedOutput} from "../output/post-list-paginated.output";
import {ResourceType} from "../../../core/types/resource-type";


export function mapToPostListPaginatedOutput(
    posts:WithId<Post>[],
    meta:{ pageNumber: number; pageSize: number; totalCount: number}
) : PostListPaginatedOutput {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
            totalCount: meta.totalCount,

        },
        data: posts.map((Post) => ({

            type: ResourceType.Posts,
            id: Post._id.toString(),
            attributes: {
                title: Post.title,
                shortDescription: Post.shortDescription,
                content: Post.content,
                blogId: Post.blogId,
                blogName: Post.blogName,
                createdAt: Post.createdAt,
            },
        })),
    };
}






