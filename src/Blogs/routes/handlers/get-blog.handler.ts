import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import { createErrorsMessages } from "../../../core/errors/FieldError";
import {blogRepository} from "../../repository/BlogRepository";
import {mapToBlogDto} from "../mappers/Map-to-blog-dto";

export async function getBlogHandler (req: Request, res: Response) {
    try{
        const id = req.params.id;
        const blog = await blogRepository.findById(id);
        if (!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorsMessages([{field: 'id', message: 'Blog not found'}]),
                );
            return;
        }

        res.status(HttpStatus.Ok).send(mapToBlogDto(blog));
    } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
    }
}
