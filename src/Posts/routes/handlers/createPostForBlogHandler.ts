import { Request, Response} from "express";

import {PostInputModel} from "../../domain/PostModel";
import {HttpStatus} from "../../../core/types/http-statuses";

import {PostsService} from "../../application/Posts.service";
import {MapToPostDto} from "../mappers/mapToPostDto";
import {errorsHandler} from "../../../core/errors/errors.handler";


export async function createPostForBlogHandler(
    req: Request<{ blogId: string }, {}, PostInputModel>,
    res: Response
) {
    try {
        const blogId = req.params.blogId;


        const createdPostId = await PostsService.create({
            blogId,
            content:req.body.content,
            title:req.body.title,
            shortDescription:req.body.shortDescription
        });

        const createdPost = await PostsService.findByIdOrFail(createdPostId);
        const postDto = MapToPostDto(createdPost);

        res.status(HttpStatus.Created).send(postDto);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
