import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogDto} from "../mappers/Map-to-blog-dto";
import {BlogsService} from "../../application/Blogs.service";
import {errorsHandler} from "../../../core/errors/errors.handler";

export async function getBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;

        const blog = await BlogsService.findByIdOrFail(id);

        const blogOutput = mapToBlogDto(blog);

        res.status(HttpStatus.Ok).send(blogOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}