"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const mongodb_1 = require("mongodb");
const Mongo_db_1 = require("../../db/Mongo.db");
const repository_not_found_error_1 = require("../../core/errors/repository-not-found.error");
exports.postRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber: rawPageNumber, pageSize: rawPageSize, 
            // 1. ИСПРАВЛЕНИЕ: Устанавливаем значения по умолчанию для SORTING
            sortBy = 'createdAt', // Используем 'createdAt' по умолчанию
            sortDirection = 'desc', // Используем 'desc' по умолчанию
            searchPostTitleTerm, searchPostShortDescriptionTerm, searchPostBlogIdTerm, } = queryDto;
            // 2. ИСПРАВЛЕНИЕ: Безопасное преобразование и значения по умолчанию для PAGINATION
            const pageNumber = Number(rawPageNumber) || 1;
            const pageSize = Number(rawPageSize) || 10;
            // Теперь 'skip' вычисляется корректно, без риска NaN
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchPostTitleTerm) {
                filter.title = { $regex: searchPostTitleTerm, $options: 'i' };
            }
            if (searchPostShortDescriptionTerm) {
                filter.shortDescription = { $regex: searchPostShortDescriptionTerm, $options: 'i' };
            }
            if (searchPostBlogIdTerm) {
                filter.blogId = { $regex: searchPostBlogIdTerm, $options: 'i' };
            }
            // Преобразуем строковое направление в формат MongoDB (1 или -1)
            const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;
            const items = yield Mongo_db_1.PostsCollection
                .find(filter)
                // 3. ИСПРАВЛЕНИЕ: Используем mongoSortDirection
                .sort({ [sortBy]: mongoSortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield Mongo_db_1.PostsCollection.countDocuments(filter);
            return { items, totalCount };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // 👇 ИСПРАВЛЕНИЕ: Добавляем проверку ObjectId
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null; // Если ID невалидный, не ищем в БД, возвращаем null
            }
            return Mongo_db_1.PostsCollection
                .findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectId;
            try {
                objectId = new mongodb_1.ObjectId(id);
            }
            catch (e) {
                // Если ID невалиден, мы не можем его найти. Бросаем RepositoryNotFoundError.
                throw new repository_not_found_error_1.RepositoryNotFoundError('Post not exist'); // 💡 ИСПРАВЛЕНИЕ: Используйте 'Post not exist'
            }
            const res = yield Mongo_db_1.PostsCollection.findOne({ _id: objectId });
            if (!res) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Post not exist'); // 💡 ИСПРАВЛЕНИЕ: Используйте 'Post not exist'
            }
            return res;
        });
    },
    // Создать новый блог
    create(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield Mongo_db_1.PostsCollection.insertOne(newBlog);
            return insertResult.insertedId.toString();
        });
    },
    // Обновить данные блога
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield Mongo_db_1.PostsCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Post not exist');
            }
            return;
        });
    },
    // Удалить блог
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield Mongo_db_1.PostsCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Post not exist');
            }
            return;
        });
    },
    findPostByBlog(queryDto, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = Number(queryDto.pageNumber) || 1;
            const pageSize = Number(queryDto.pageSize) || 10;
            const sortBy = queryDto.sortBy || 'createdAt';
            const sortDirection = queryDto.sortDirection === 'asc' ? 1 : -1;
            const filter = { blogId };
            const skip = (pageNumber - 1) * pageSize;
            const [items, totalCount] = yield Promise.all([
                Mongo_db_1.PostsCollection.find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .toArray(),
                Mongo_db_1.PostsCollection.countDocuments(filter),
            ]);
            return { items, totalCount };
        });
    },
};
//# sourceMappingURL=PostRepository.js.map