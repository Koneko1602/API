import { Request, Response} from "express";
import {blogRepository} from "../../../Blogs/repository/BlogRepository";
import {PostInputModel} from "../../domain/PostModel";
import {HttpStatus} from "../../../core/types/http-statuses";
import {mapInputToPost} from "../mappers/Map-to-postInput-dto";
import {PostsService} from "../../application/Posts.service";
import {MapToPostDto} from "../mappers/mapToPostDto";
import {errorsHandler} from "../../../core/errors/errors.handler";


export async function createPostForBlogHandler(
    req: Request<{ blogId: string }, {}, PostInputModel>,
    res: Response
) {
    try {
        const blogId = req.params.blogId;

        const blog = await blogRepository.findById(blogId);
        if (!blog) {
            res.status(HttpStatus.NotFound).send({ message: 'Блог не найден' });
            return;
        }

        const blogName = blog.name;
        const post = mapInputToPost(req.body, blogName, blogId); // передаём blogId явно

        const createdPostId = await PostsService.create(post);
        const createdPost = await PostsService.findByIdOrFail(createdPostId);
        const postDto = MapToPostDto(createdPost);

        res.status(HttpStatus.Created).send(postDto);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
