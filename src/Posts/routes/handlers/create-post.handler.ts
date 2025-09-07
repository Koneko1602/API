import { Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {Post, PostInputModel} from "../../domain/PostModel";
import {postRepository} from "../../repository/PostRepository";
import { blogRepository } from "../../../Blogs/repository/BlogRepository";
import {MapToPostDto} from "../mappers/mapToPostDto";



export  async function createPostHandler(
    req: Request<{},{},PostInputModel>,
    res: Response,
)  {
    try {

        const blog= await blogRepository.findById(req.body.blogId);
        if (!blog) {
             res.status(HttpStatus.NotFound).send({ error: 'Blog not found' });
             return;
        }
        const newPost: Post = {
            title:req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt:new Date(),

        };
        const createdPost = await postRepository.create(newPost);

        res.status(HttpStatus.Created).send(MapToPostDto(createdPost));
    }
    catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}
