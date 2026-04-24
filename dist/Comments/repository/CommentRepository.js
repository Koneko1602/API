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
exports.commentsRepository = void 0;
const Mongo_db_1 = require("../../db/Mongo.db");
const mongodb_1 = require("mongodb");
exports.commentsRepository = {
    // Метод обновления
    create(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = yield Mongo_db_1.CommentsCollection
                .insertOne(Object.assign({}, comment));
            return newComment.insertedId.toString();
        });
    },
    update(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Mongo_db_1.CommentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { content: content } });
            // Проверяем, что документ был найден и обновлен
            return result.matchedCount === 1;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDel = yield Mongo_db_1.CommentsCollection
                .deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return isDel.deletedCount === 1;
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mongo_db_1.CommentsCollection
                .findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    }
};
//# sourceMappingURL=CommentRepository.js.map