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
exports.commentsQwRepository = void 0;
const Mongo_db_1 = require("../../db/Mongo.db");
const mongodb_1 = require("mongodb");
exports.commentsQwRepository = {
    //
    findAllComments(postId, 
    // ✅ ИСПРАВЛЕНИЕ: Используем типобезопасный DTO для входящих параметров
    sortQueryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. ✅ БЕЗОПАСНОЕ ПРЕОБРАЗОВАНИЕ И ДЕФОЛТЫ
            // Преобразование строки в число, с дефолтом 1, если невалидно
            const pageNumber = Number(sortQueryDto.pageNumber) || 1;
            // Преобразование строки в число, с дефолтом 10, если невалидно
            const pageSize = Number(sortQueryDto.pageSize) || 10;
            // sortBy: строка, по умолчанию 'createdAt'
            const sortBy = sortQueryDto.sortBy || 'createdAt';
            // 🛑 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Преобразование 'asc'/'desc' в 1/-1 для MongoDB
            const rawSortDirection = sortQueryDto.sortDirection || 'desc';
            // ✅ ИСПРАВЛЕНИЕ: Теперь TypeScript знает, что это 1 или -1
            const sortDirectionValue = rawSortDirection === 'asc' ? 1 : -1;
            // 2. Формирование фильтра
            // ✅ ИСПРАВЛЕНИЕ: Используем Record<string, any> вместо 'any' для фильтра, если это объект с известными строковыми ключами.
            const filter = { postId: postId };
            // 3. Подсчет общего количества документов
            const totalCount = yield Mongo_db_1.CommentsCollection.countDocuments(filter);
            // 4. Получение данных
            const comments = yield Mongo_db_1.CommentsCollection
                .find(filter)
                .sort({ [sortBy]: sortDirectionValue }) // Используем 1/-1
                .skip((pageNumber - 1) * pageSize) // Безопасная математика
                .limit(pageSize)
                .toArray();
            // 5. Формирование объекта пагинации
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount,
                items: comments.map((u) => this._getInView(u)),
            };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Проверка формата ID
            if (!mongodb_1.ObjectId.isValid(id)) {
                return null;
            }
            const comment = yield Mongo_db_1.CommentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return comment ? this._getInView(comment) : null;
        });
    },
    _getInView(comment) {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt.toISOString()
        };
    }, //маппинг из внутренней модели базы данных во внешнюю модель для отображения клиенту
};
//# sourceMappingURL=comment.query.repository.js.map