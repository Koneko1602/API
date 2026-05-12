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
exports.authService = void 0;
const bcrypt_service_1 = require("../adapters/bcrypt.service");
const UserRepository_1 = require("../../Users/repository/UserRepository");
const resultCode_1 = require("../../Users/common/result/resultCode");
const jwt_service_1 = require("../adapters/jwt.service");
const node_crypto_1 = require("node:crypto");
const nodemailer_service_1 = require("../adapters/nodemailer.service");
const emailExamples_1 = require("../adapters/emailExamples");
const add_1 = require("date-fns/add");
const Mongo_db_1 = require("../../db/Mongo.db");
const refreshToken_repository_1 = require("../repository/refreshToken.repository");
exports.authService = {
    loginUser(loginOrEmail, password, ip, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield this.checkUserCredentials(loginOrEmail, password);
            if (check.status !== resultCode_1.ResultStatus.Success) {
                console.log(`❌ Credentials check failed for ${loginOrEmail}`);
                return { status: resultCode_1.ResultStatus.Unauthorized, data: null, extensions: [] };
            }
            const userId = check.data._id.toString();
            const deviceId = (0, node_crypto_1.randomUUID)();
            const accessToken = yield jwt_service_1.jwtService.createToken(userId, deviceId);
            const refreshToken = yield refreshToken_repository_1.refreshTokenRepository.create(userId, ip, title);
            console.log(`✅ authService.loginUser SUCCESS | userId=${userId} | deviceId=${deviceId} | accessToken=${accessToken.substring(0, 30)}...`);
            return {
                status: resultCode_1.ResultStatus.Success,
                data: { accessToken, refreshToken },
                extensions: [],
            };
        });
    },
    // Сохраняем refresh в БД
    refreshTokens(oldRefreshToken, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield refreshToken_repository_1.refreshTokenRepository.findValid(oldRefreshToken);
            if (!record) {
                return { status: resultCode_1.ResultStatus.Unauthorized, data: null, extensions: [] };
            }
            yield Mongo_db_1.RefreshTokensCollection.updateOne({ _id: record._id }, {
                $set: {
                    lastActiveDate: new Date(),
                    ip: ip,
                    expiresAt: new Date(Date.now() + 20 * 1000)
                }
            });
            const newAccess = yield jwt_service_1.jwtService.createToken(record.userId, record.deviceId);
            const newRefresh = yield jwt_service_1.jwtService.createRefreshToken(record.userId, record.deviceId);
            return {
                status: resultCode_1.ResultStatus.Success,
                data: { accessToken: newAccess, refreshToken: newRefresh },
                extensions: [],
            };
        });
    },
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield refreshToken_repository_1.refreshTokenRepository.findValid(refreshToken);
            if (!record) {
                return { status: resultCode_1.ResultStatus.Unauthorized, data: null, extensions: [] };
            }
            yield refreshToken_repository_1.refreshTokenRepository.deleteByToken(refreshToken);
            return { status: resultCode_1.ResultStatus.Success, data: null, extensions: [] };
        });
    },
    getCurrentUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.usersRepository.findById(userId);
            if (!user) {
                return { status: resultCode_1.ResultStatus.NotFound, data: null, extensions: [] };
            }
            return {
                status: resultCode_1.ResultStatus.Success,
                data: {
                    userId: user._id.toString(),
                    login: user.login,
                    email: user.email,
                },
                extensions: [],
            };
        });
    },
    checkUserCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return {
                    status: resultCode_1.ResultStatus.NotFound,
                    data: null,
                    errorMessage: 'Not Found',
                    extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
                };
            }
            const isPassCorrect = yield bcrypt_service_1.bcryptService.checkPassword(password, user.passwordHash);
            if (!isPassCorrect) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    data: null,
                    errorMessage: 'Bad Request',
                    extensions: [{ field: 'password', message: 'Wrong password' }],
                };
            }
            return {
                status: resultCode_1.ResultStatus.Success,
                data: user,
                extensions: [],
            };
        });
    },
    registerUser(login, pass, email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Проверяем login и email ПО ОТДЕЛЬНОСТИ
            const existingLogin = yield Mongo_db_1.UsersCollection.findOne({ login: login.trim() });
            const existingEmail = yield Mongo_db_1.UsersCollection.findOne({ email: email.trim() });
            if (existingLogin || existingEmail) {
                console.log('[SERVICE-REG] DUPLICATE FOUND → returning null');
                const errors = [];
                if (existingLogin) {
                    errors.push({ field: 'login', message: 'Login already exists' });
                }
                if (existingEmail) {
                    errors.push({ field: 'email', message: 'Email already exists' });
                }
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    extensions: errors,
                    data: null,
                    errorMessage: 'Login or email already exists'
                };
            }
            const passwordHash = yield bcrypt_service_1.bcryptService.generateHash(pass);
            const confirmationCode = (0, node_crypto_1.randomUUID)();
            const newUser = {
                login,
                email,
                passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode,
                    expirationDate: (0, add_1.add)(new Date(), { hours: 1, minutes: 30 }),
                    isConfirmed: false
                }
            };
            yield UserRepository_1.usersRepository.create(newUser);
            try {
                yield nodemailer_service_1.nodemailerService.sendEmail(newUser.email, confirmationCode, emailExamples_1.emailExamples.registrationEmail);
            }
            catch (e) {
                console.error('Send email error', e);
            }
            console.log(`[SERVICE-REG] SUCCESS: code generated = "${confirmationCode}"`);
            return {
                status: resultCode_1.ResultStatus.Success,
                extensions: [],
                data: confirmationCode // Тест получит string
            };
        });
    },
    confirmRegistration(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.usersRepository.findByConfirmationCode(code);
            if (!user) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    extensions: [{ field: 'code', message: 'User not found' }],
                    data: null
                };
            }
            const isExpired = user.emailConfirmation.expirationDate
                ? user.emailConfirmation.expirationDate < new Date()
                : true;
            if (user.emailConfirmation.isConfirmed || isExpired) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    extensions: [{ field: 'code', message: 'Invalid, expired or already used' }],
                    data: null
                };
            }
            console.log('[CONFIRM] Updating user:', user._id, 'to confirmed');
            const updated = yield UserRepository_1.usersRepository.updateConfirmation(user._id.toString(), {
                confirmationCode: null,
                expirationDate: null,
                isConfirmed: true
            });
            if (!updated) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    extensions: [],
                    data: null
                };
            }
            return {
                status: resultCode_1.ResultStatus.Success,
                extensions: [],
                data: null
            };
        });
    },
    resendConfirmationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[RESEND] Requested for email:', email);
            const user = yield UserRepository_1.usersRepository.findByEmail(email);
            if (!user) {
                console.log('[RESEND] User not found → 400');
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    extensions: [{ field: 'email', message: 'Email not found' }],
                    data: null
                };
            }
            if (user.emailConfirmation.isConfirmed) {
                console.log('[RESEND] Email already confirmed → 400');
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    extensions: [{ field: 'email', message: 'Email already confirmed' }],
                    data: null
                };
            }
            console.log('[RESEND] User exists and not confirmed → resending');
            const newCode = (0, node_crypto_1.randomUUID)();
            const newExpiration = (0, add_1.add)(new Date(), { hours: 1, minutes: 30 });
            const updated = yield UserRepository_1.usersRepository.updateConfirmation(user._id.toString(), {
                confirmationCode: newCode,
                expirationDate: newExpiration,
                isConfirmed: false
            });
            if (!updated) {
                return {
                    status: resultCode_1.ResultStatus.BadRequest,
                    extensions: [],
                    data: null
                };
            }
            try {
                yield nodemailer_service_1.nodemailerService.sendEmail(email, newCode, emailExamples_1.emailExamples.registrationEmail);
            }
            catch (e) {
                console.error('Resend email error', e);
            }
            console.log('[RESEND] Success → 204');
            return {
                status: resultCode_1.ResultStatus.Success,
                extensions: [],
                data: null
            };
        });
    }
};
//# sourceMappingURL=auth.service.js.map