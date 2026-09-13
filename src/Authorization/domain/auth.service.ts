import {bcryptService} from "../adapters/bcrypt.service";
import {usersRepository} from "../../Users/repository/UserRepository";
import {ResultStatus} from "../../Users/common/result/resultCode";
import {Result} from "../../Users/common/result/result.type";
import {jwtService} from "../adapters/jwt.service";
import {WithId} from "mongodb";
import {IUserDB} from "../../Users/types/user.db.interface";
import {randomUUID} from "node:crypto";
import {nodemailerService} from "../adapters/nodemailer.service";
import {emailExamples} from "../adapters/emailExamples";
import {add} from "date-fns/add";
import {RefreshTokensCollection, UsersCollection} from "../../db/Mongo.db";
import {refreshTokenRepository} from "../repository/refreshToken.repository";

/**
 * AuthService - класс для управления аутентификацией и авторизацией пользователей
 * 
 * Отвечает за:
 * - Регистрацию новых пользователей
 * - Логин пользователей с выдачей токенов
 * - Подтверждение email и регистрации
 * - Повторную отправку кода подтверждения
 * - Обновление (refresh) токенов доступа
 * - Логаут пользователя
 * - Получение текущего пользователя
 * - Восстановление пароля (новая функция)
 * 
 * Паттерн: Service Pattern + Domain Driven Design
 * Зависимости: bcryptService, jwtService, usersRepository, 
 *              refreshTokenRepository, nodemailerService
 */
export class AuthService {
    
    /**
     * Регистрирует нового пользователя в системе
     * 
     * Логика:
     * 1. Проверяем уникальность login и email отдельно
     * 2. Если дублирование - возвращаем ошибку с указанием проблемных полей
     * 3. Хешируем пароль перед сохранением
     * 4. Генерируем код подтверждения (UUID)
     * 5. Устанавливаем срок действия кода (1.5 часа)
     * 6. Сохраняем пользователя в БД (email не подтвержден)
     * 7. Отправляем письмо с кодом подтверждения
     * 8. Возвращаем код подтверждения
     * 
     * @param login - уникальное имя пользователя
     * @param pass - пароль (будет схеширован)
     * @param email - email пользователя (требует подтверждения)
     * @returns Result с кодом подтверждения или ошибкой
     * 
     * Возможные ошибки:
     * - Login already exists (400)
     * - Email already exists (400)
     */
    async registerUser(login: string, pass: string, email: string): Promise<Result<string | null>> {
        // 🔍 Проверяем login и email ПО ОТДЕЛЬНОСТИ для лучшей диагностики
        const existingLogin = await UsersCollection.findOne({login: login.trim()});
        const existingEmail = await UsersCollection.findOne({email: email.trim()});

        // 🚫 Если найдены дубликаты - собираем ошибки
        if (existingLogin || existingEmail) {
            console.log('[SERVICE-REG] DUPLICATE FOUND → returning null');
            const errors = [];
            if (existingLogin) {
                errors.push({field: 'login', message: 'Login already exists'});
            }
            if (existingEmail) {
                errors.push({field: 'email', message: 'Email already exists'});
            }

            return {
                status: ResultStatus.BadRequest,
                extensions: errors,
                data: null,
                errorMessage: 'Login or email already exists'
            };
        }
        
        // 🔐 Хешируем пароль перед сохранением
        const passwordHash = await bcryptService.generateHash(pass);
        const confirmationCode = randomUUID();

        // 👤 Создаем объект нового пользователя
        const newUser: IUserDB = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode,
                expirationDate: add(new Date(), {hours: 1, minutes: 30}),
                isConfirmed: false
            }
        };

        // 💾 Сохраняем пользователя в БД
        await usersRepository.create(newUser);

        // 📧 Отправляем письмо с кодом подтверждения
        try {
            await nodemailerService.sendEmail(newUser.email, confirmationCode, emailExamples.registrationEmail);
        } catch (e: unknown) {
            console.error('Send email error', e);
        }
        console.log(`[SERVICE-REG] SUCCESS: code generated = "${confirmationCode}"`);
        
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: confirmationCode  // Тест получит string
        };
    }

    /**
     * Подтверждает регистрацию пользователя по коду
     * 
     * Логика:
     * 1. Ищем пользователя по коду подтверждения
     * 2. Если пользователь не найден - ошибка
     * 3. Проверяем не истек ли код подтверждения
     * 4. Проверяем не был ли email уже подтвержден
     * 5. Если все ок - помечаем email как подтвержденный
     * 6. Удаляем код подтверждения из системы
     * 
     * @param code - код подтверждения из письма
     * @returns Result<null> - успех или ошибка
     * 
     * Возможные ошибки:
     * - User not found (400)
     * - Invalid, expired or already used (400)
     */
    async confirmRegistration(code: string): Promise<Result<null>> {
        // 🔍 Ищем пользователя по коду подтверждения
        const user = await usersRepository.findByConfirmationCode(code);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'User not found'}],
                data: null
            };
        }

        // ⏰ Проверяем срок действия кода
        const isExpired = user.emailConfirmation.expirationDate
            ? user.emailConfirmation.expirationDate < new Date()
            : true;

        // 🚫 Проверяем статус подтверждения
        if (user.emailConfirmation.isConfirmed || isExpired) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'Invalid, expired or already used'}],
                data: null
            };
        }
        
        console.log('[CONFIRM] Updating user:', user._id, 'to confirmed');
        
        // ✅ Помечаем email как подтвержденный
        const updated = await usersRepository.updateConfirmation(user._id.toString(), {
            confirmationCode: null,
            expirationDate: null,
            isConfirmed: true
        });

        if (!updated) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [],
                data: null
            };
        }

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: null
        };
    }

    /**
     * Повторно отправляет письмо с кодом подтверждения
     * 
     * Логика:
     * 1. Ищем пользователя по email
     * 2. Если пользователя нет - ошибка
     * 3. Если email уже подтвержден - ошибка (нечего переподтверждать)
     * 4. Генерируем новый код подтверждения
     * 5. Обновляем код и срок действия в БД
     * 6. Отправляем новое письмо с кодом
     * 
     * @param email - email пользователя
     * @returns Result<null> - успех или ошибка
     * 
     * Возможные ошибки:
     * - Email not found (400)
     * - Email already confirmed (400)
     */
    async resendConfirmationEmail(email: string): Promise<Result<null>> {
        console.log('[RESEND] Requested for email:', email);
        
        // 🔍 Ищем пользователя по email
        const user = await usersRepository.findByEmail(email);
        if (!user) {
            console.log('[RESEND] User not found → 400');
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'Email not found'}],
                data: null
            };
        }

        // 🚫 Проверяем не подтвержден ли email уже
        if (user.emailConfirmation.isConfirmed) {
            console.log('[RESEND] Email already confirmed → 400');
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'Email already confirmed'}],
                data: null
            };
        }
        
        console.log('[RESEND] User exists and not confirmed → resending');
        
        // 🔐 Генерируем новый код и срок действия
        const newCode = randomUUID();
        const newExpiration = add(new Date(), {hours: 1, minutes: 30});

        // 💾 Обновляем код в БД
        const updated = await usersRepository.updateConfirmation(user._id.toString(), {
            confirmationCode: newCode,
            expirationDate: newExpiration,
            isConfirmed: false
        });

        if (!updated) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [],
                data: null
            };
        }

        // 📧 Отправляем новое письмо
        try {
            await nodemailerService.sendEmail(email, newCode, emailExamples.registrationEmail);
        } catch (e: unknown) {
            console.error('Resend email error', e);
        }
        console.log('[RESEND] Success → 204');
        
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: null
        };
    }

    /**
     * Логирует пользователя в систему и выдает токены
     * 
     * Логика:
     * 1. Проверяем учетные данные (login/email + пароль)
     * 2. Если ошибка - возвращаем 401 Unauthorized
     * 3. Генерируем уникальный deviceId для отслеживания сессии
     * 4. Создаем access token (10 сек) и refresh token (20 сек)
     * 5. Сохраняем refresh token в БД с информацией об устройстве
     * 6. Возвращаем оба токена
     * 
     * @param loginOrEmail - логин или email пользователя
     * @param password - пароль
     * @param ip - IP адрес пользователя (для отслеживания)
     * @param title - название устройства/браузера
     * @returns Result с accessToken и refreshToken или ошибка
     * 
     * Возможные ошибки:
     * - Credentials check failed (401)
     */
    async loginUser(
        loginOrEmail: string,
        password: string,
        ip: string,
        title: string
    ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
        // 🔍 Проверяем учетные данные
        const check = await this.checkUserCredentials(loginOrEmail, password);
        if (check.status !== ResultStatus.Success) {
            console.log(`❌ Credentials check failed for ${loginOrEmail}`);
            return {status: ResultStatus.Unauthorized, data: null, extensions: []};
        }

        // 👤 Получаем ID пользователя
        const userId = check.data!._id.toString();
        const deviceId = randomUUID(); // Уникальный ID устройства

        // 🔐 Создаем access и refresh токены
        const accessToken = await jwtService.createToken(userId, deviceId);
        const refreshToken = await refreshTokenRepository.create(userId, deviceId, ip, title);

        console.log(`✅ authService.loginUser SUCCESS | userId=${userId} | deviceId=${deviceId} | accessToken=${accessToken.substring(0, 30)}...`);

        return {
            status: ResultStatus.Success,
            data: {accessToken, refreshToken},
            extensions: [],
        };
    }

    /**
     * Обновляет (refreshes) access token используя refresh token
     * 
     * Логика:
     * 1. Проверяем валидность старого refresh token в БД
     * 2. Если невалиден - возвращаем 401
     * 3. Удаляем старый refresh token
     * 4. Создаем новый refresh token
     * 5. Создаем новый access token
     * 6. Сохраняем новый refresh token в БД
     * 7. Возвращаем оба новых токена
     * 
     * @param oldRefreshToken - старый refresh token
     * @param ip - IP адрес пользователя
     * @returns Result с новыми accessToken и refreshToken или ошибка
     * 
     * Возможные ошибки:
     * - Invalid refresh token (401)
     */
    async refreshTokens(
        oldRefreshToken: string,
        ip: string
    ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
        // 🔍 Проверяем валидность старого refresh token
        const record = await refreshTokenRepository.findValid(oldRefreshToken);

        if (!record) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: []
            };
        }

        // 🗑️ Удаляем старый refresh token
        await refreshTokenRepository.deleteByToken(oldRefreshToken);

        // 🔐 Создаем новый refresh token
        const newRefresh = await jwtService.createRefreshToken(
            record.userId,
            record.deviceId
        );

        // 💾 Сохраняем новый refresh token в БД
        await RefreshTokensCollection.insertOne({
            userId: record.userId,
            deviceId: record.deviceId,
            title: record.title,
            ip,
            lastActiveDate: new Date(),
            expiresAt: new Date(Date.now() + 20 * 1000),
            createdAt: new Date(),
            token: newRefresh,
        });

        // 🔐 Создаем новый access token
        const newAccess = await jwtService.createToken(
            record.userId,
            record.deviceId
        );

        return {
            status: ResultStatus.Success,
            data: {
                accessToken: newAccess,
                refreshToken: newRefresh
            },
            extensions: [],
        };
    }

    /**
     * Логирует пользователя из системы
     * 
     * Логика:
     * 1. Проверяем валидность refresh token
     * 2. Если невалиден - возвращаем 401
     * 3. Удаляем refresh token из БД
     * 4. Сессия пользователя завершена
     * 
     * @param refreshToken - refresh token пользователя
     * @returns Result<null> - успех или ошибка
     */
    async logout(refreshToken: string): Promise<Result> {
        // 🔍 Проверяем валидность refresh token
        const record = await refreshTokenRepository.findValid(refreshToken);
        if (!record) {
            return {status: ResultStatus.Unauthorized, data: null, extensions: []};
        }

        // 🗑️ Удаляем refresh token из БД
        await refreshTokenRepository.deleteByToken(refreshToken);
        return {status: ResultStatus.Success, data: null, extensions: []};
    }

    /**
     * Получает информацию о текущем пользователе
     * 
     * Логика:
     * 1. Ищем пользователя по ID из JWT токена
     * 2. Если не найден - возвращаем 404
     * 3. Возвращаем публичные данные (userId, login, email)
     * 
     * @param userId - ID пользователя из токена
     * @returns Result с данными пользователя или 404
     */
    async getCurrentUser(userId: string): Promise<Result<{ userId: string; login: string; email: string } | null>> {
        // 🔍 Ищем пользователя в БД
        const user = await usersRepository.findById(userId);
        if (!user) {
            return {status: ResultStatus.NotFound, data: null, extensions: []};
        }

        // ✅ Возвращаем публичные данные
        return {
            status: ResultStatus.Success,
            data: {
                userId: user._id.toString(),
                login: user.login,
                email: user.email,
            },
            extensions: [],
        };
    }

    /**
     * Проверяет учетные данные пользователя (логин/email + пароль)
     * 
     * Логика:
     * 1. Ищем пользователя по логину или email
     * 2. Если не найден - возвращаем ошибку
     * 3. Проверяем соответствие пароля хешу
     * 4. Если пароль неверный - возвращаем ошибку
     * 5. Если все ок - возвращаем данные пользователя
     * 
     * @param loginOrEmail - логин или email
     * @param password - пароль в открытом виде
     * @returns Result с данными пользователя или ошибка
     * @private внутреннее использование
     */
    private async checkUserCredentials(loginOrEmail: string, password: string
    ): Promise<Result<WithId<IUserDB> | null>> {
        // 🔍 Ищем пользователя
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{field: 'loginOrEmail', message: 'Not Found'}],
            };
        }

        // 🔐 Проверяем пароль
        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);

        if (!isPassCorrect) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{field: 'password', message: 'Wrong password'}],
            };
        }

        return {
            status: ResultStatus.Success,
            data: user,
            extensions: [],
        };
    }
}

/**
 * Singleton экземпляр AuthService
 * Используется во всем приложении через этот экземпляр
 */
export const authService = new AuthService();
