import {BlogInputModel, Blog} from "../domain/BlogModel"
import {ObjectId, WithId} from "mongodb";
import {BlogsCollection} from "../../db/Mongo.db";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {BlogDTO} from "../dto/BlogModelDTO";
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
        };
    }

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
    async create(newBlog: Blog): Promise<WithId<Blog>> {
        const insertResult= await BlogsCollection.insertOne(newBlog);
        return { ...newBlog, _id: insertResult.insertedId};
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
            throw new Error('Blog not exist');
        }
        return;
    },


    // Удалить блог
    async delete(id: string): Promise <void> {
        const deleteResult = await BlogsCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Blog not exist')
        }
    },
};