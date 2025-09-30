
import {Post, PostInputModel} from "../../domain/PostModel";


export const mapInputToPost = (
    input: PostInputModel,
    blogName: string
): Post => ({
    title: input.title,
    shortDescription: input.shortDescription,
    content: input.content,
    createdAt: new Date(),
    blogId: input.blogId,
    blogName, // ✅ теперь TypeScript доволен
});

// export const mapInputToPost = (
//     input: PostInputModel,
//     blogName: string,
//     blogId: string
// ): Post => ({
//     title: input.title,
//     shortDescription: input.shortDescription,
//     content: input.content,
//     createdAt: new Date(),
//     blogId,
//     blogName,
// });
// тестовый для ошибки 1
