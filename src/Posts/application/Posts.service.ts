import {PostQueryInput} from "../routes/input/post-query.input";
import {Post, PostInputModel} from "../domain/PostModel";
import {postRepository} from "../repository/PostRepository";
import {WithId} from "mongodb";
import {mapInputToPostDto} from "../routes/mappers/map-to-post-update";


export const PostsService = {


    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postRepository.findMany(queryDto);
    },

    async findByIdOrFail(id:string): Promise<WithId<Post>> {

        return postRepository.findByIdOrFail(id);
    },

    async create(dto: PostInputModel): Promise<string> {
        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName:dto.blogName,
            createdAt: new Date(),



        };
        return postRepository.create(newPost);

    },

    async update(id: string, input: PostInputModel): Promise<void> {
        const existing = await postRepository.findByIdOrFail(id);
        const dto = mapInputToPostDto(id, input, existing);
        await postRepository.update(id, dto);
    },


    async delete(id: string): Promise<void> {


        await postRepository.delete(id);
        return;
    },
};
