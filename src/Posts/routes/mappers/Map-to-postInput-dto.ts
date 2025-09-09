
import {Post, PostInputModel} from "../../domain/PostModel";

export const mapInputToPost = (input: PostInputModel): Post => ({
    title: input.title,
    shortDescription: input.shortDescription,
    content: input.content,
    createdAt: new Date(),
    blogName:input.blogName,
    blogId:input.blogId,
});
