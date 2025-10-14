import {Post} from "../../../Posts/domain/PostModel";
import {PostDataOutput} from "../../../Posts/routes/output/post-data.output";
import {WithId} from "mongodb";
import {ResourceType} from "../../../core/types/resource-type";

export function mapToPostDataOutput(post: WithId<Post>): PostDataOutput {
    return {
        type: ResourceType.Posts,
        id: post._id.toString(),
        attributes: {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt.toISOString(), // ← сразу сериализуем как строку
        },
    };
}
