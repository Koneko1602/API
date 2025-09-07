import { Request, Response} from "express";
import { createErrorsMessages } from "../../../core/errors/FieldError";
import {blogRepository} from "../../repository/BlogRepository";
import {HttpStatus} from "../../../core/types/http-statuses";
import {BlogInputModel} from "../../domain/BlogModel";


export async function updateBlogHandler (
    req: Request <{id: string}, {}, BlogInputModel>,
    res: Response,
){
    try {

        const id = req.params.id;
        const blog = await blogRepository.findById(id);

        await blogRepository.update(id, req.body )
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}