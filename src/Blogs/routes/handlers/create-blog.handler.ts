import { Request, Response} from "express";
import {Blog, BlogInputModel} from "../../domain/BlogModel";
import {blogRepository} from "../../repository/BlogRepository";
import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogDto} from "../mappers/Map-to-blog-dto";
import {BlogsService} from "../../application/Blogs.service";
import {BlogDTO} from "../../dto/BlogModelDTO";
import {mapInputToBlog} from "../mappers/Map-to-blogInput-dto";


export async function createBlogHandler(
    req: Request<{}, {}, BlogInputModel>,
    res: Response,
) {
    try {
        const blog = mapInputToBlog(req.body); // маппим вход в DTO

        const createdBlogId = await BlogsService.create(blog); // создаём и получаем ID
        const blogDto = mapToBlogDto(createdBlog)

        res.status(HttpStatus.Created).send(blogDto);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
