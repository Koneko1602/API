import {Request,Response} from "express";
import {PostInputModel} from "../../domain/PostModel";
import {PostsService} from "../../application/Posts.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import {errorsHandler} from "../../../core/errors/errors.handler";
import {MapToPostDto} from "../mappers/mapToPostDto";
import {mapInputToPost} from "../mappers/Map-to-postInput-dto";

export async function createPostHandler(
    req: Request<{}, {}, PostInputModel>,
    res: Response,
) {
    try {
        const post = mapInputToPost(req.body);

        const createdPostId = await PostsService.create(post);
        const createdPost = await PostsService.findByIdOrFail(createdPostId);

        const blogDto = MapToPostDto(createdPost);

        res.status(HttpStatus.Created).send(blogDto);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}

