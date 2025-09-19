import {Request, Response} from "express";
import {BlogInputModel} from "../../domain/BlogModel";
import {mapInputToBlog} from "../mappers/Map-to-blogInput-dto";
import {BlogsService} from "../../application/Blogs.service";
import {mapToBlogDto} from "../mappers/Map-to-blog-dto";
import {HttpStatus} from "../../../core/types/http-statuses";
import {errorsHandler} from "../../../core/errors/errors.handler";

export async function createBlogPostHandler(
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
