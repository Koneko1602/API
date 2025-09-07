import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {BlogsService} from "../../application/Blogs.service";

export async function deleteBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
) {

    {
        try {
            const id = req.params.id;

            await BlogsService.delete(id);

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }
}