import {BlogDTO} from "../dto/BlogModelDTO";
import {Blog, BlogInputModel} from "../domain/BlogModel";
import {WithId} from "mongodb";
import {blogRepository} from "../repository/BlogRepository";
import {BlogQueryInput} from "../routes/input/blog-query.input";
import {mapInputToBlog} from "../routes/mappers/Map-to-blogInput-dto";
import {mapInputToBlogDto} from "../routes/mappers/Map-to-blog-update";
import {Post} from "../../Posts/domain/PostModel";

/**
 * BlogsService - класс для управления операциями с блогами
 * 
 * Отвечает за:
 * - Получение списка блогов с пагинацией и фильтрацией
 * - Получение блога по ID с проверкой существования
 * - Создание новых блогов с установкой дефолтных значений
 * - Обновление данных блога
 * - Удаление блогов из системы
 * 
 * Паттерн: Service Pattern (бизнес-логика отделена от репозитория)
 * Зависимости: blogRepository, mappers для преобразования данных
 */
export class BlogsService {
    
    /**
     * Получает список всех блогов с пагинацией и сортировкой
     * 
     * Логика:
     * 1. Принимаем параметры запроса (page, pageSize, sortBy, sortDirection)
     * 2. Передаем их в репозиторий для выборки данных
     * 3. Репозиторий возвращает массив блогов и общее количество
     * 4. Возвращаем структурированный результат с items и totalCount
     * 
     * @param queryDto - параметры пагинации и сортировки
     * @returns Promise с массивом блогов и общим количеством
     * 
     * Пример ответа:
     * {
     *   items: [{ _id: '1', name: 'Tech Blog', ... }],
     *   totalCount: 42
     * }
     */
    async findMany(
        queryDto: BlogQueryInput,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        // 📍 Передаем параметры фильтрации и сортировки в репозиторий
        return blogRepository.findMany(queryDto);
    }

    /**
     * Получает блог по ID или выбрасывает ошибку если не найден
     * 
     * Логика:
     * 1. Ищем блог в БД по ID
     * 2. Если блог не существует, репозиторий выбросит ошибку
     * 3. Если блог найден, возвращаем его с ID
     * 
     * @param id - уникальный идентификатор блога
     * @returns Promise<WithId<Blog>> - данные блога с MongoDB ID
     * @throws NotFoundException если блог не найден
     */
    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        // 📍 Репозиторий сам выбросит ошибку если блога нет
        return blogRepository.findByIdOrFail(id);
    }

    /**
     * Создает новый блог в системе
     * 
     * Логика:
     * 1. Распаковываем данные из входящего DTO (name, description, websiteUrl)
     * 2. Создаем новый объект Blog с обязательными полями:
     *    - name, description, websiteUrl - из ввода
     *    - createdAt - текущее время
     *    - isMembership - по умолчанию false (блог не требует членства)
     * 3. Сохраняем блог в БД через репозиторий
     * 4. Возвращаем ID созданного блога
     * 
     * @param dto - объект с name, description, websiteUrl
     * @returns Promise<string> - ID созданного блога
     * 
     * Пример: BlogInputModel { name: "My Blog", ... }
     *         => возвращает "507f1f77bcf86cd799439011"
     */
    async create(dto: BlogInputModel): Promise<string> {
        // 🔨 Создаем объект блога с дополнительными полями
        const newBlog: Blog = {
            name: dto.name,                    // Название блога
            description: dto.description,      // Описание
            websiteUrl: dto.websiteUrl,        // URL веб-сайта
            createdAt: new Date(),             // Время создания
            isMembership: false,               // По умолчанию блог открытый
        };
        
        // 📍 Сохраняем в БД и получаем ID
        return blogRepository.create(newBlog);
    }

    /**
     * Обновляет данные существующего блога
     * 
     * Логика:
     * 1. Проверяем существование блога (выбросит ошибку если нет)
     * 2. Берем текущие данные блога
     * 3. Преобразуем входящие данные и текущие в DTO для обновления
     * 4. Обновляем блог в БД через репозиторий
     * 
     * @param id - ID блога для обновления
     * @param input - новые данные блога (name, description, websiteUrl)
     * @returns Promise<void>
     * @throws NotFoundException если блог не найден
     */
    async update(id: string, input: BlogInputModel): Promise<void> {
        // 📍 Проверяем существование блога (выбросит ошибку если нет)
        const existing = await blogRepository.findByIdOrFail(id);
        
        // 🔄 Преобразуем входящие данные с текущим состоянием
        const dto = mapInputToBlogDto(id, input, existing);
        
        // 💾 Сохраняем обновленные данные в БД
        await blogRepository.update(id, dto);
    }

    /**
     * Удаляет блог из системы
     * 
     * Логика:
     * 1. Передаем ID блога в репозиторий
     * 2. Репозиторий удаляет блог из БД
     * 3. Возвращаем void (операция завершена)
     * 
     * ⚠️ Важно: Обычно нужна предварительная проверка:
     *    - Существует ли блог
     *    - Есть ли посты, которые нужно удалить
     *    - Права на удаление (суперадмин)
     * 
     * @param id - ID блога для удаления
     * @returns Promise<void>
     */
    async delete(id: string): Promise<void> {
        // 📍 Удаляем блог из БД
        await blogRepository.delete(id);
    }
}

/**
 * Singleton экземпляр BlogsService
 * Используется во всем приложении через этот экземпляр
 */
export const blogsService = new BlogsService();
