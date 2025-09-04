import { Request, Response} from "express";
import { createErrorsMessages } from "../../../core/errors/FieldError";
import {blogRepository} from "../../repository/BlogRepository";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function deleteBlogHandler(req: Request, res: Response) {

try {

    const id = req.params.id;
    const blog = await blogRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(
                createErrorsMessages([{field: 'id', message: ' Blog not found'}]),
            );
        return;
    }
    await blogRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError)
    }
}







