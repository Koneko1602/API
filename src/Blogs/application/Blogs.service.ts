import {BlogDTO} from "../dto/BlogModelDTO";
import {Blog, BlogInputModel} from "../domain/BlogModel";
import {WithId} from "mongodb";
import {blogRepository} from "../repository/BlogRepository";


export const BlogsService = {
    async findMany(
        queryDto: BlogDTO,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        return blogRepository.findMany(queryDto);
    },

    async findByIdOrFail(id:string): Promise<WithId<Blog>> {

        return blogRepository.findByIdOrFail(id);
    },
    async create(dto: BlogInputModel): Promise<string> {
        const newBlog: Blog = {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl,
                createdAt: new Date(),
                isMembership: false,


        };
        const createBlog = await blogRepository.create(newBlog);
        return createBlog._id.toString();

    },

    async update(id: string, dto: BlogDTO): Promise<void> {
        await blogRepository.update(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {


        await blogRepository.delete(id);
        return;
    },
};