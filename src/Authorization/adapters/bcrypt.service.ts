import bcrypt from 'bcrypt'

/**
 * BcryptService - класс для работы с хешированием паролей
 * 
 * Отвечает за:
 * - Хеширование паролей перед сохранением в БД
 * - Сравнение введенного пароля с хешем из БД для верификации
 * 
 * Паттерн: Adapter Pattern (адаптер над библиотекой bcrypt)
 * Безопасность: Использует 10 раундов для оптимального баланса
 *              между скоростью и безопасностью
 */
export class BcryptService {
    
    /**
     * Генерирует безопасный хеш пароля
     * 
     * Процесс:
     * 1. Генерируем соль (salt) с 10 раундами
     * 2. Применяем функцию хеширования с солью
     * 3. Возвращаем готовый хеш для сохранения в БД
     * 
     * @param password - исходный пароль от пользователя
     * @returns Promise<string> - хеш пароля (не обратимо)
     * 
     * Пример: 'password123' => '$2b$10$...' (128 символов)
     */
    async generateHash(password: string): Promise<string> {
        // Генерируем соль с 10 раундами (по умолчанию для bcrypt)
        const salt = await bcrypt.genSalt(10);
        
        // Применяем хеширование к паролю с солью
        return bcrypt.hash(password, salt);
    }

    /**
     * Проверяет соответствие пароля его хешу
     * 
     * Процесс:
     * 1. Принимаем открытый пароль от пользователя
     * 2. Принимаем хеш из БД
     * 3. Bcrypt автоматически извлекает соль из хеша
     * 4. Применяет ту же соль к паролю
     * 5. Сравнивает результаты
     * 
     * @param password - открытый пароль от пользователя при логине
     * @param hash - хеш пароля из БД
     * @returns Promise<boolean> - true если пароли совпадают
     * 
     * Пример: 
     *   checkPassword('password123', '$2b$10$...') => true
     *   checkPassword('wrongpassword', '$2b$10$...') => false
     */
    async checkPassword(password: string, hash: string): Promise<boolean> {
        // Сравниваем пароль с хешем (bcrypt сам обработает соль)
        return bcrypt.compare(password, hash);
    }
}

/**
 * Singleton экземпляр BcryptService
 * Используется во всем приложении через этот экземпляр
 */
export const bcryptService = new BcryptService();
