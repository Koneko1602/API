import {PostQueryInput} from "../routes/input/post-query.input";
import {Post, PostInputModel} from "../domain/PostModel";
import {postRepository} from "../repository/PostRepository";
import {WithId} from "mongodb";
import {mapInputToPostDto} from "../routes/mappers/map-to-post-update";
import {blogRepository} from "../../Blogs/repository/BlogRepository";
import {MapToPostDto} from "../routes/mappers/mapToPostDto";
import {mapInputToPost} from "../routes/mappers/Map-to-postInput-dto";
import {postModelDto} from "../dto/PostModelDto";
import {Blog} from "../../Blogs/domain/BlogModel";


export const PostsService = {


    async  findBlogByPost(postId: string): Promise<string | null> {
        const post = await postRepository.findById(postId);
        if (!post || !post.blogId) {
            return null;
        }

        const blog = await blogRepository.findById(post.blogId);
        return blog?.name ?? null;
    },




    async findPostByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{items:WithId<Post>[]; totalCount : number}> {
        await blogRepository.findByIdOrFail(blogId);
        return postRepository.findPostByBlog(queryDto,blogId);
    },

    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postRepository.findMany(queryDto);
    },

    async findByIdOrFail(id:string): Promise<WithId<Post>> {

        return postRepository.findByIdOrFail(id);
    },

    async create(dto: PostInputModel): Promise<string> {
        const blog = await blogRepository.findByIdOrFail(dto.blogId);

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogName:blog.name,
            blogId: dto.blogId,
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
    async createForBlog(input: PostInputModel, blogId: string,): Promise<postModelDto> {
        const blog = await blogRepository.findByIdOrFail(blogId);

        const post: Post = {
            ...mapInputToPost(input, blog.name),
            blogId,
            blogName: blog.name, // денормализация
            createdAt: new Date(),
        };

        const created = await postRepository.insert(post);
        return MapToPostDto(created);
    }

};
