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
exports.usersQwRepository = void 0;
const mongodb_1 = require("mongodb");
const Mongo_db_1 = require("../../db/Mongo.db");
exports.usersQwRepository = {
    //
    findAllUsers(sortQueryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Деструктуризация всех данных (без as any, без дефолтов)
            const { sortBy, sortDirection, pageSize, pageNumber, searchLoginTerm, searchEmailTerm } = sortQueryDto; // 👈 TypeScript теперь уверен во всех полях
            // 2. Формирование фильтра (логика поиска остается прежней)
            const filter = { $or: [] };
            if (searchLoginTerm) {
                filter.$or.push({
                    login: { $regex: searchLoginTerm, $options: 'i' }
                });
            }
            if (searchEmailTerm) {
                filter.$or.push({
                    email: { $regex: searchEmailTerm, $options: 'i' }
                });
            }
            if (filter.$or.length === 0) {
                delete filter.$or;
            }
            // 3. Подсчет общего количества документов
            const totalCount = yield Mongo_db_1.UsersCollection.countDocuments(filter);
            // 4. Получение отфильтрованных, отсортированных и пагинированных данных
            const users = yield Mongo_db_1.UsersCollection
                .find(filter)
                // ✅ MongoDB доволен
                .sort({ [sortBy]: sortDirection })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            // 5. Формирование объекта пагинации
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount,
                items: users.map((u) => this._getInView(u)),
            };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Mongo_db_1.UsersCollection
                .findOne({ _id: new mongodb_1.ObjectId(id) });
            return user ? this._getInView(user) : null;
        });
    },
    _getInView(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        };
    }, //маппинг из внутренней модели базы данных во внешнюю модель для отображения клиенту
    _checkObjectId(id) {
        return mongodb_1.ObjectId.isValid(id);
    },
};
//# sourceMappingURL=user.query.repository.js.map