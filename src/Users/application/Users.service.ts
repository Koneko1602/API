import {IUserDB} from "../types/user.db.interface";
import {usersRepository} from "../repository/UserRepository";
import {CreateUserDto} from "../types/create-user.dto";
import {bcryptService} from "../../Authorization/adapters/bcrypt.service";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";

/**
 * UsersService - класс для управления операциями с пользователями
 * 
 * Отвечает за:
 * - Создание новых пользователей с хешированием пароля
 * - Удаление пользователей из базы данных
 * - Генерацию кодов подтверждения и установку сроков действия
 * 
 * Паттерн: Service Pattern (бизнес-логика отделена от репозитория)
 * Зависимости: usersRepository, bcryptService, randomUUID
 */
export class UsersService {
    
    /**
     * Создает нового пользователя с валидацией и подготовкой данных
     * 
     * Логика:
     * 1. Распаковываем DTO с логином, паролем и email
     * 2. Хешируем пароль для безопасного хранения
     * 3. Создаем объект IUserDB с дополнительными полями
     * 4. Генерируем уникальный код подтверждения (UUID)
     * 5. Устанавливаем срок действия кода (1.5 часа)
     * 6. Сохраняем пользователя в БД
     * 7. Возвращаем ID нового пользователя
     * 
     * @param dto - объект с login, password, email
     * @returns Promise<string> - ID созданного пользователя
     * @throws Может выбросить ошибку если БД недоступна
     */
    async create(dto: CreateUserDto): Promise<string> {
        // Распаковываем данные из DTO
        const {login, password, email} = dto;
        
        // Хешируем пароль перед сохранением (10 раундов bcrypt)
        const passwordHash = await bcryptService.generateHash(password);

        // Создаем объект пользователя с обязательными полями
        const newUser: IUserDB = {
            login,
            email,
            passwordHash,
            createdAt: new Date(), // Фиксируем время создания
            emailConfirmation: {
                // Генерируем уникальный код подтверждения
                confirmationCode: randomUUID(),
                // Устанавливаем срок действия кода (1 час 30 минут)
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                // По умолчанию email не подтвержден
                isConfirmed: false,
            },
        };
        
        // Сохраняем пользователя в БД и получаем его ID
        const newUserId = await usersRepository.create(newUser);

        return newUserId;
    }

    /**
     * Удаляет пользователя из системы
     * 
     * Логика:
     * 1. Проверяем существование пользователя по ID
     * 2. Если пользователь не найден, возвращаем false
     * 3. Если пользователь существует, удаляем его из БД
     * 4. Возвращаем результат удаления
     * 
     * @param id - ID пользователя для удаления
     * @returns Promise<boolean> - true если удален, false если не найден
     */
    async delete(id: string): Promise<boolean> {
        // Проверяем существование пользователя
        const user = await usersRepository.findById(id);
        
        // Если пользователя нет, возвращаем false
        if (!user) return false;

        // Удаляем пользователя и возвращаем результат
        return await usersRepository.delete(id);
    }
}

/**
 * Singleton экземпляр UsersService
 * Используется во всем приложении через этот экземпляр
 */
export const usersService = new UsersService();
