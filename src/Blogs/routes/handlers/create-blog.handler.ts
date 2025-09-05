import { Request, Response} from "express";
import {Blog, BlogInputModel} from "../../domain/BlogModel";
import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogDto} from "../mappers/Map-to-blog-dto";
import {BlogsService} from "../../application/Blogs.service";
import {mapInputToBlog} from "../mappers/Map-to-blogInput-dto";
import {errorsHandler} from "../../../core/errors/errors.handler";


// export async function createBlogHandler(
//     req: Request<{}, {}, BlogInputModel>,
//     res: Response,
// ) {
//     try {
//         const blog = mapInputToBlog(req.body); // маппим вход в DTO
//
//         const createdBlogId = await BlogsService.create(blog); // создаём и получаем ID
//         const blogDto = mapToBlogDto(createdBlogId)
//
//         res.status(HttpStatus.Created).send(blogDto);
//     } catch (e: unknown) {
//         errorsHandler(e, res);
//     }
// }
export async function createBlogHandler(
    req: Request<{}, {}, BlogInputModel>,
    res: Response,
) {
    try {
        const blog = mapInputToBlog(req.body);

        const createdBlogId = await BlogsService.create(blog);
        const createdBlog = await BlogsService.findByIdOrFail(createdBlogId);

        const blogDto = mapToBlogDto(createdBlog);

        res.status(HttpStatus.Created).send(blogDto);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
