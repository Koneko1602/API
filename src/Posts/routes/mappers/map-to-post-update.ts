import {Post, PostInputModel} from "../../domain/PostModel";
import {WithId} from "mongodb";
import {postModelDto} from "../../dto/PostModelDto";


export function mapInputToPostDto(
    id: string,
    input: PostInputModel,
    existing: WithId<Post>
): postModelDto {
    return {
        id,
        title: input.title,
        shortDescription: input.shortDescription,
        content:input.content,
        blogId:input.blogId,
        createdAt: existing.createdAt,
        blogName:input.blogName,
    };
}
