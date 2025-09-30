import {Request,Response} from "express";
import {PostInputModel} from "../../domain/PostModel";
import {PostsService} from "../../application/Posts.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {MapToPostDto} from "../mappers/mapToPostDto";
import {mapInputToPost} from "../mappers/Map-to-postInput-dto";
import {blogRepository} from "../../../Blogs/repository/BlogRepository";

export async function createPostHandler(
    req: Request<{}, {}, PostInputModel>,
    res: Response,
) {
    try {
        // Получаем blogId из тела запроса
        const blogId = req.body.blogId;

        // Ищем блог по blogId
        const blog = await blogRepository.findById(blogId);
        if (!blog) {
             res.status(HttpStatus.NotFound).send({ message: 'Блог не найден' });
             return;
        }

        // Получаем blogName из найденного блога
        const blogName = blog.name;

        // Собираем пост с blogName
        const post = mapInputToPost(req.body, blogName);

        const createdPostId = await PostsService.create(post);
        const createdPost = await PostsService.findByIdOrFail(createdPostId);

        const blogDto = MapToPostDto(createdPost);

        res.status(HttpStatus.Created).send(blogDto);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}

