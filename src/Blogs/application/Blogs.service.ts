import {BlogDTO} from "../dto/BlogModelDTO";
import {Blog, BlogInputModel} from "../domain/BlogModel";
import {WithId} from "mongodb";
import {blogRepository} from "../repository/BlogRepository";
import {BlogQueryInput} from "../routes/input/blog-query.input";
import {mapInputToBlog} from "../routes/mappers/Map-to-blogInput-dto";
import {mapInputToBlogDto} from "../routes/mappers/Map-to-blog-update";


export const BlogsService = {


    async findMany(
        queryDto: BlogQueryInput,
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
       return blogRepository.create(newBlog);

    },

    async update(id: string, input: BlogInputModel): Promise<void> {
        const existing = await blogRepository.findByIdOrFail(id);
        const dto = mapInputToBlogDto(id, input, existing);
        await blogRepository.update(id, dto);
    },


    async delete(id: string): Promise<void> {


        await blogRepository.delete(id);
        return;
    },
};