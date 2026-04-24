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
exports.usersService = void 0;
const UserRepository_1 = require("../repository/UserRepository");
const bcrypt_service_1 = require("../../Authorization/adapters/bcrypt.service");
const node_crypto_1 = require("node:crypto");
const add_1 = require("date-fns/add");
exports.usersService = {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password, email } = dto;
            const passwordHash = yield bcrypt_service_1.bcryptService.generateHash(password);
            const newUser = {
                login,
                email,
                passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: (0, node_crypto_1.randomUUID)(),
                    expirationDate: (0, add_1.add)(new Date(), {
                        hours: 1,
                        minutes: 30,
                    }),
                    isConfirmed: false,
                },
            };
            const newUserId = yield UserRepository_1.usersRepository.create(newUser);
            return newUserId;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.usersRepository.findById(id);
            if (!user)
                return false;
            return yield UserRepository_1.usersRepository.delete(id);
        });
    },
};
//# sourceMappingURL=Users.service.js.map