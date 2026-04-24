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
exports.usersRepository = void 0;
const mongodb_1 = require("mongodb");
const Mongo_db_1 = require("../../db/Mongo.db");
exports.usersRepository = {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield Mongo_db_1.UsersCollection
                .insertOne(Object.assign({}, user));
            return newUser.insertedId.toString();
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDel = yield Mongo_db_1.UsersCollection
                .deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return isDel.deletedCount === 1;
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mongo_db_1.UsersCollection
                .findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mongo_db_1.UsersCollection.findOne({
                $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
            });
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mongo_db_1.UsersCollection.findOne({ email });
        });
    },
    findByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mongo_db_1.UsersCollection.findOne({ "emailConfirmation.confirmationCode": code });
        });
    },
    updateConfirmation(id, confirmationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Mongo_db_1.UsersCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { "emailConfirmation.confirmationCode": confirmationData.confirmationCode,
                    "emailConfirmation.expirationDate": confirmationData.expirationDate,
                    "emailConfirmation.isConfirmed": confirmationData.isConfirmed } });
            return result.matchedCount === 1;
        });
    }
};
//# sourceMappingURL=UserRepository.js.map