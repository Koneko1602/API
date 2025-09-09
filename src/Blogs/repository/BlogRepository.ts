import {BlogInputModel, Blog} from "../domain/BlogModel"
import {ObjectId, WithId} from "mongodb";
import {BlogsCollection} from "../../db/Mongo.db";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {BlogQueryInput} from "../routes/input/blog-query.input";


export const blogRepository = {
    async findMany ( queryDto:BlogQueryInput,): Promise<{items: WithId<Blog>[]; totalCount: number}> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchBlogNameTerm,
            searchBlogDescriptionTerm,
            searchCreatedAtTerm,

        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchBlogNameTerm) {
            filter.name = { $regex: searchBlogNameTerm, $options: 'i'}
        }
        if (searchBlogDescriptionTerm) {
            filter.description = { $regex:searchBlogDescriptionTerm, $options: 'i'}
        }
        if (searchCreatedAtTerm) {
            filter.CreatedAt = {$regex:searchCreatedAtTerm, $options: 'i'}
        }
        const items = await BlogsCollection
            .find(filter)
            .sort({ [ sortBy ]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

            const totalCount = await BlogsCollection.countDocuments(filter);

            return { items, totalCount };
    },


    async findById(id: string): Promise<WithId<Blog> | null> {
        return BlogsCollection.findOne({ _id: new ObjectId(id)});
    },
    async findByIdOrFail (id: string): Promise<WithId<Blog>> {
        const res = await BlogsCollection.findOne({_id: new ObjectId(id)});
        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return res;
    },

    // Создать новый блог
    async create(newBlog: Blog): Promise<string> {
        const insertResult= await BlogsCollection.insertOne(newBlog);


        return  insertResult.insertedId.toString();
    },

    // Обновить данные блога
    async update(id: string, body:BlogInputModel): Promise<void> {
        const updateResult = await BlogsCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError ('Blog not exist');
        }
        return;
    },


    // Удалить блог
    async delete(id: string): Promise <void> {
        const deleteResult = await BlogsCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist')
        }
        return ;
    },
};