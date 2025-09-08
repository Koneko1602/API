import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {BlogInputModel} from "../../domain/BlogModel";
import {BlogsService} from "../../application/Blogs.service";



export async function updateBlogHandler (
    req: Request <{id: string}, {}, BlogInputModel>,
    res: Response,
){
    try {
        const id = req.params.id;

        await BlogsService.update(id, req.body )
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}