import {ObjectId, WithId} from "mongodb";
import {IUserDB} from "../types/user.db.interface";
import {UsersCollection} from "../../db/Mongo.db";

/**
 * UserRepository - класс для работы с пользователями в БД (MongoDB)
 * 
 * Отвечает за:
 * - CRUD операции с пользователями в БД
 * - Поиск пользователей по различным критериям
 * - Обновление данных подтверждения email
 * - Обновление данных восстановления пароля
 * 
 * Паттерн: Repository Pattern (инкапсуляция логики доступа к БД)
 * БД: MongoDB с коллекцией UsersCollection
 */
export class UserRepository {
    
    /**
     * Создает нового пользователя в БД
     * 
     * Логика:
     * 1. Принимаем объект пользователя (без _id, т.к. MongoDB сам его создаст)
     * 2. Вставляем документ в коллекцию
     * 3. Получаем ID вставленного документа
     * 4. Возвращаем ID в виде строки
     * 
     * @param user - объект IUserDB с данными пользователя
     * @returns Promise<string> - ID созданного пользователя
     * 
     * Пример:
     * create({
     *   login: "john_doe",
     *   email: "john@example.com",
     *   passwordHash: "$2b$10$...",
     *   createdAt: new Date(),
     *   emailConfirmation: { ... }
     * })
     * => "507f1f77bcf86cd799439011"
     */
    async create(user: IUserDB): Promise<string> {
        // 📝 Вставляем документ в коллекцию MongoDB
        const newUser = await UsersCollection.insertOne({...user});
        
        // 🔑 Возвращаем ID вставленного документа в виде строки
        return newUser.insertedId.toString();
    }

    /**
     * Удаляет пользователя из БД по ID
     * 
     * Логика:
     * 1. Конвертируем строку ID в ObjectId (формат MongoDB)
     * 2. Удаляем документ с этим ID
     * 3. Проверяем количество удаленных документов
     * 4. Возвращаем true если удален 1 документ, false иначе
     * 
     * @param id - ID пользователя в виде строки
     * @returns Promise<boolean> - true если удален, false если не найден
     * 
     * Пример:
     * delete("507f1f77bcf86cd799439011") => true
     * delete("000000000000000000000000") => false (не существует)
     */
    async delete(id: string): Promise<boolean> {
        // 🗑️ Удаляем документ по ID
        const isDel = await UsersCollection.deleteOne({_id: new ObjectId(id)});
        
        // ✅ Проверяем удален ли ровно 1 документ
        return isDel.deletedCount === 1;
    }

    /**
     * Получает пользователя по ID
     * 
     * Логика:
     * 1. Ищем документ в коллекции по MongoDB ID
     * 2. Если найден - возвращаем с ID (WithId<IUserDB>)
     * 3. Если не найден - возвращаем null
     * 
     * @param id - ID пользователя в виде строки
     * @returns Promise<WithId<IUserDB> | null> - пользователь с ID или null
     * 
     * Пример:
     * findById("507f1f77bcf86cd799439011")
     * => {
     *   _id: ObjectId("507f1f77bcf86cd799439011"),
     *   login: "john_doe",
     *   email: "john@example.com",
     *   ...
     * }
     */
    async findById(id: string): Promise<WithId<IUserDB> | null> {
        // 🔍 Ищем пользователя по ID
        return UsersCollection.findOne({_id: new ObjectId(id)});
    }

    /**
     * Получает пользователя по логину ИЛИ email
     * 
     * Логика:
     * 1. Ищем документ где либо login совпадает, либо email совпадает
     * 2. Используем MongoDB оператор $or для поиска по двум полям
     * 3. Возвращаем первый найденный документ или null
     * 
     * ✅ Используется для логина пользователя (можно использовать login или email)
     * 
     * @param loginOrEmail - логин или email пользователя
     * @returns Promise<WithId<IUserDB> | null> - пользователь или null
     * 
     * Пример:
     * findByLoginOrEmail("john_doe") или findByLoginOrEmail("john@example.com")
     * => оба вернут одного пользователя
     */
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<IUserDB> | null> {
        // 🔍 Ищем по логину ИЛИ email
        return UsersCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });
    }

    /**
     * Получает пользователя по email
     * 
     * Логика:
     * 1. Ищем документ с точным совпадением email
     * 2. Email должен быть уникальным в системе
     * 3. Возвращаем пользователя или null
     * 
     * ✅ Используется для проверки уникальности email при регистрации
     * 
     * @param email - email адрес
     * @returns Promise<WithId<IUserDB> | null> - пользователь или null
     * 
     * Пример:
     * findByEmail("john@example.com")
     * => пользователь или null
     */
    async findByEmail(email: string): Promise<WithId<IUserDB> | null> {
        // 🔍 Ищем по email
        return UsersCollection.findOne({ email });
    }

    /**
     * Получает пользователя по коду подтверждения email
     * 
     * Логика:
     * 1. Ищем пользователя в структурированном поле emailConfirmation
     * 2. Используем нотацию точка (dot notation) для поиска в подполе
     * 3. Это позволяет найти пользователя по его коду подтверждения
     * 
     * ✅ Используется при подтверждении регистрации
     * 
     * @param code - код подтверждения (UUID)
     * @returns Promise<WithId<IUserDB> | null> - пользователь или null
     * 
     * Пример:
     * findByConfirmationCode("550e8400-e29b-41d4-a716-446655440000")
     * => пользователь или null
     */
    async findByConfirmationCode(code: string): Promise<WithId<IUserDB> | null> {
        // 🔍 Ищем по коду подтверждения в подполе
        return UsersCollection.findOne({ "emailConfirmation.confirmationCode": code });
    }

    /**
     * Получает пользователя по коду восстановления пароля
     * 
     * Логика:
     * 1. Ищем пользователя в структурированном поле passwordRecovery
     * 2. Используем нотацию точка для поиска в подполе recoveryCode
     * 3. Это позволяет найти пользователя по его коду восстановления
     * 
     * ✅ Новая функция для восстановления пароля
     * 
     * @param code - код восстановления пароля (UUID)
     * @returns Promise<WithId<IUserDB> | null> - пользователь или null
     * 
     * Пример:
     * findByRecoveryCode("550e8400-e29b-41d4-a716-446655440001")
     * => пользователь или null
     */
    async findByRecoveryCode(code: string): Promise<WithId<IUserDB> | null> {
        // 🔍 Ищем по коду восстановления в подполе
        return UsersCollection.findOne({ "passwordRecovery.recoveryCode": code });
    }

    /**
     * Обновляет данные подтверждения email пользователя
     * 
     * Логика:
     * 1. Обновляем поля в структуре emailConfirmation:
     *    - confirmationCode (код подтверждения или null)
     *    - expirationDate (срок действия кода или null)
     *    - isConfirmed (статус подтверждения)
     * 2. Используем $set оператор MongoDB для атомарного обновления
     * 3. Проверяем что ровно 1 документ был обновлен
     * 
     * ✅ Используется при подтверждении email и повторной отправке кода
     * 
     * @param id - ID пользователя
     * @param confirmationData - частичные данные для обновления
     * @returns Promise<boolean> - true если обновлен, false иначе
     * 
     * Пример:
     * updateConfirmation("507f1f77bcf86cd799439011", {
     *   confirmationCode: null,
     *   expirationDate: null,
     *   isConfirmed: true
     * })
     * => true (email подтвержден)
     */
    async updateConfirmation(id: string, confirmationData: Partial<IUserDB['emailConfirmation']>): Promise<boolean> {
        // 📝 Обновляем поля подтверждения email
        const result = await UsersCollection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    "emailConfirmation.confirmationCode": confirmationData.confirmationCode,
                    "emailConfirmation.expirationDate": confirmationData.expirationDate,
                    "emailConfirmation.isConfirmed": confirmationData.isConfirmed 
                } 
            }
        );
        
        // ✅ Проверяем что ровно 1 документ совпадает с фильтром
        return result.matchedCount === 1;
    }

    /**
     * Обновляет данные восстановления пароля пользователя
     * 
     * Логика:
     * 1. Обновляем поля в структуре passwordRecovery:
     *    - recoveryCode (код восстановления)
     *    - recoveryExpirationDate (срок действия кода)
     * 2. Используем $set оператор MongoDB для атомарного обновления
     * 3. Проверяем что ровно 1 документ был обновлен
     * 
     * ✅ Новая функция для процесса восстановления пароля
     * 
     * @param id - ID пользователя
     * @param recoveryData - данные восстановления (код и срок)
     * @returns Promise<boolean> - true если обновлен, false иначе
     * 
     * Пример:
     * updatePasswordRecovery("507f1f77bcf86cd799439011", {
     *   recoveryCode: "550e8400-e29b-41d4-a716-446655440001",
     *   recoveryExpirationDate: new Date(Date.now() + 1000 * 60 * 15) // 15 минут
     * })
     * => true
     */
    async updatePasswordRecovery(id: string, recoveryData: {recoveryCode: string, recoveryExpirationDate: Date}): Promise<boolean> {
        // 📝 Обновляем поля восстановления пароля
        const result = await UsersCollection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    "passwordRecovery.recoveryCode": recoveryData.recoveryCode,
                    "passwordRecovery.recoveryExpirationDate": recoveryData.recoveryExpirationDate
                } 
            }
        );
        
        // ✅ Проверяем что ровно 1 документ совпадает с фильтром
        return result.matchedCount === 1;
    }

    /**
     * Обновляет пароль пользователя и очищает код восстановления
     * 
     * Логика:
     * 1. Обновляем хеш пароля (новый пароль уже должен быть схеширован)
     * 2. Очищаем код восстановления (recoveryCode = null)
     * 3. Очищаем срок действия кода (recoveryExpirationDate = null)
     * 4. Используем $set оператор MongoDB для атомарного обновления
     * 5. Проверяем что ровно 1 документ был обновлен
     * 
     * ✅ Новая функция для завершения процесса восстановления пароля
     * 
     * @param id - ID пользователя
     * @param passwordData - новый хеш пароля и очистка кодов восстановления
     * @returns Promise<boolean> - true если обновлен, false иначе
     * 
     * Пример:
     * updatePassword("507f1f77bcf86cd799439011", {
     *   passwordHash: "$2b$10$...", // новый хеш
     *   recoveryCode: null,
     *   recoveryExpirationDate: null
     * })
     * => true (пароль изменен, код восстановления удален)
     */
    async updatePassword(id: string, passwordData: {passwordHash: string, recoveryCode: null, recoveryExpirationDate: null}): Promise<boolean> {
        // 📝 Обновляем пароль и очищаем код восстановления
        const result = await UsersCollection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    "passwordHash": passwordData.passwordHash,
                    "passwordRecovery.recoveryCode": passwordData.recoveryCode,
                    "passwordRecovery.recoveryExpirationDate": passwordData.recoveryExpirationDate
                } 
            }
        );
        
        // ✅ Проверяем что ровно 1 документ совпадает с фильтром
        return result.matchedCount === 1;
    }
}

/**
 * Singleton экземпляр UserRepository
 * Используется во всем приложении через этот экземпляр
 */
export const usersRepository = new UserRepository();
