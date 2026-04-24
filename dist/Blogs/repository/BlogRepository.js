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
exports.blogRepository = void 0;
const mongodb_1 = require("mongodb");
const Mongo_db_1 = require("../../db/Mongo.db");
const repository_not_found_error_1 = require("../../core/errors/repository-not-found.error");
exports.blogRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber: rawPageNumber, pageSize: rawPageSize, 
            // 1. ИСПРАВЛЕНИЕ: Устанавливаем значения по умолчанию для SORTING
            sortBy = 'createdAt', // Используем 'createdAt' по умолчанию
            sortDirection = 'desc', // Используем 'desc' по умолчанию
            searchNameTerm, searchCreatedAtTerm, searchBlogDescriptionTerm, } = queryDto;
            // 2. ИСПРАВЛЕНИЕ: Безопасное преобразование и значения по умолчанию для PAGINATION
            const pageNumber = Number(rawPageNumber) || 1;
            const pageSize = Number(rawPageSize) || 10;
            // Теперь 'skip' вычисляется корректно, без риска NaN
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            if (searchBlogDescriptionTerm) {
                filter.description = { $regex: searchBlogDescriptionTerm, $options: 'i' };
            }
            if (searchCreatedAtTerm) {
                filter.createdAt = { $regex: searchCreatedAtTerm, $options: 'i' };
            }
            // Преобразуем строковое направление в формат MongoDB (1 или -1)
            const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;
            const items = yield Mongo_db_1.BlogsCollection
                .find(filter)
                // 3. ИСПРАВЛЕНИЕ: Используем mongoSortDirection
                .sort({ [sortBy]: mongoSortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield Mongo_db_1.BlogsCollection.countDocuments(filter);
            return { items, totalCount };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mongo_db_1.BlogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    // В BlogsRepository.ts
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectId;
            try {
                objectId = new mongodb_1.ObjectId(id); // ⬅️ Оборачиваем потенциально проблемный вызов
            }
            catch (e) {
                // Если ID невалиден (не 24 hex), просто выбрасываем "Не найдено"
                // Это более безопасно, чем падать
                throw new repository_not_found_error_1.RepositoryNotFoundError('Blog not exist');
            }
            // Ищем уже по безопасному objectId
            const res = yield Mongo_db_1.BlogsCollection.findOne({ _id: objectId });
            if (!res) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Blog not exist');
            }
            return res;
        });
    },
    // Создать новый блог
    create(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield Mongo_db_1.BlogsCollection.insertOne(newBlog);
            return insertResult.insertedId.toString();
        });
    },
    // Обновить данные блога
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield Mongo_db_1.BlogsCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Blog not exist');
            }
            return;
        });
    },
    // Удалить блог
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield Mongo_db_1.BlogsCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Blog not exist');
            }
            return;
        });
    },
};
//# sourceMappingURL=BlogRepository.js.map