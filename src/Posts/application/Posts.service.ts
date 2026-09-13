import {PostQueryInput} from "../routes/input/post-query.input";
import {Post, PostInputModel} from "../domain/PostModel";
import {postRepository} from "../repository/PostRepository";
import {WithId} from "mongodb";
import {mapInputToPostDto} from "../routes/mappers/map-to-post-update";
import {blogRepository} from "../../Blogs/repository/BlogRepository";
import {MapToPostDto} from "../routes/mappers/mapToPostDto";
import {mapInputToPost} from "../routes/mappers/Map-to-postInput-dto";
import {postModelDto} from "../dto/PostModelDto";
import {Blog} from "../../Blogs/domain/BlogModel";

/**
 * PostsService - класс для управления операциями с постами
 * 
 * Отвечает за:
 * - Получение постов конкретного блога с пагинацией
 * - Получение всех постов в системе
 * - Получение поста по ID с проверкой существования
 * - Создание новых постов (связь с блогом)
 * - Обновление данных поста
 * - Удаление постов из системы
 * 
 * Паттерн: Service Pattern с валидацией связей между сущностями
 * Зависимости: postRepository, blogRepository, mappers
 * 
 * Важно: Посты всегда связаны с блогом!
 */
export class PostsService {
    
    /**
     * Получает список постов конкретного блога с пагинацией
     * 
     * Логика:
     * 1. Проверяем существование блога (выбросит ошибку если нет)
     * 2. Если блог существует, получаем посты только этого блога
     * 3. Возвращаем посты с учетом пагинации и сортировки
     * 
     * ✅ Это важно для разделения постов разных блогов!
     * 
     * @param queryDto - параметры пагинации и сортировки
     * @param blogId - ID блога, посты которого нужно получить
     * @returns Promise с массивом постов и общим количеством
     * @throws NotFoundException если блог не найден
     * 
     * Пример:
     * findPostByBlog({ pageNumber: 1, pageSize: 10 }, 'blog-123')
     * => вернет только посты из блога 'blog-123'
     */
    async findPostByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        // 🔍 Проверяем существование блога перед получением постов
        // Выбросит ошибку NotFoundException если блога нет
        await blogRepository.findByIdOrFail(blogId);
        
        // 📍 Получаем посты только этого блога
        return postRepository.findPostByBlog(queryDto, blogId);
    }

    /**
     * Получает список всех постов в системе с пагинацией
     * 
     * Логика:
     * 1. Передаем параметры фильтрации в репозиторий
     * 2. Репозиторий возвращает посты со всех блогов
     * 3. Возвращаем структурированный результат
     * 
     * ⚠️ Отличие от findPostByBlog: здесь посты из ВСЕХ блогов
     * 
     * @param queryDto - параметры пагинации и сортировки
     * @returns Promise с массивом постов и общим количеством
     * 
     * Пример ответа:
     * {
     *   items: [
     *     { _id: '1', title: 'Post 1', blogId: 'blog-1', ... },
     *     { _id: '2', title: 'Post 2', blogId: 'blog-2', ... }
     *   ],
     *   totalCount: 100
     * }
     */
    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        // 📍 Получаем посты из всех блогов в системе
        return postRepository.findMany(queryDto);
    }

    /**
     * Получает пост по ID или выбрасывает ошибку если не найден
     * 
     * Логика:
     * 1. Ищем пост в БД по ID
     * 2. Если пост не существует, репозиторий выбросит ошибку
     * 3. Если пост найден, возвращаем его с ID и всеми данными
     * 
     * @param id - уникальный идентификатор поста
     * @returns Promise<WithId<Post>> - данные поста с MongoDB ID
     * @throws NotFoundException если пост не найден
     */
    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        // 📍 Репозиторий сам выбросит ошибку если поста нет
        return postRepository.findByIdOrFail(id);
    }

    /**
     * Создает новый пост в связи с существующим блогом
     * 
     * Логика:
     * 1. Получаем ID блога из входящего DTO
     * 2. Проверяем существование блога (выбросит ошибку если нет)
     * 3. Получаем название блога (будет сохранено в посте)
     * 4. Создаем объект Post со всеми необходимыми данными:
     *    - title, shortDescription, content - из ввода
     *    - blogName, blogId - из проверенного блога
     *    - createdAt - текущее время
     * 5. Сохраняем пост в БД
     * 6. Возвращаем ID созданного поста
     * 
     * ✅ Важно: Пост не может существовать без блога!
     * 
     * @param dto - объект с title, shortDescription, content, blogId
     * @returns Promise<string> - ID созданного поста
     * @throws NotFoundException если блог не найден
     * 
     * Пример:
     * create({
     *   title: "My Post",
     *   shortDescription: "Description",
     *   content: "Content...",
     *   blogId: "507f1f77bcf86cd799439011"
     * })
     * => возвращает ID поста "507f1f77bcf86cd799439012"
     */
    async create(dto: PostInputModel): Promise<string> {
        // 🔍 Проверяем существование блога (выбросит ошибку если нет)
        const blog = await blogRepository.findByIdOrFail(dto.blogId);

        // 🔨 Создаем объект поста с обязательными полями
        const newPost: Post = {
            title: dto.title,                      // Название поста
            shortDescription: dto.shortDescription, // Короткое описание
            content: dto.content,                  // Полное содержание
            blogName: blog.name,                   // Название блога (денормализация)
            blogId: dto.blogId,                    // ID блога (связь)
            createdAt: new Date(),                 // Время создания
        };
        
        // 📍 Сохраняем в БД и получаем ID
        return postRepository.create(newPost);
    }

    /**
     * Обновляет данные существующего поста
     * 
     * Логика:
     * 1. Проверяем существование поста (выбросит ошибку если нет)
     * 2. Получаем текущие данные поста
     * 3. Преобразуем входящие данные с текущим состоянием в DTO
     * 4. Обновляем пост в БД через репозиторий
     * 
     * @param id - ID поста для обновления
     * @param input - новые данные поста (title, shortDescription, content, blogId)
     * @returns Promise<void>
     * @throws NotFoundException если пост не найден
     * 
     * Логика обновления:
     * - Новое название: берется из input
     * - Новое описание: берется из input
     * - Новое содержание: берется из input
     * - BlogId: остается прежним (на поддерживаем перемещение постов)
     */
    async update(id: string, input: PostInputModel): Promise<void> {
        // 📍 Проверяем существование поста (выбросит ошибку если нет)
        const existing = await postRepository.findByIdOrFail(id);
        
        // 🔄 Преобразуем входящие данные с текущим состоянием
        const dto = mapInputToPostDto(id, input, existing);
        
        // 💾 Сохраняем обновленные данные в БД
        await postRepository.update(id, dto);
    }

    /**
     * Удаляет пост из системы
     * 
     * Логика:
     * 1. Передаем ID поста в репозиторий
     * 2. Репозиторий удаляет пост из БД
     * 3. Возвращаем void (операция завершена)
     * 
     * ⚠️ Важно: Обычно нужна предварительная проверка:
     *    - Существует ли пост
     *    - Права на удаление (суперадмин или автор)
     *    - Нужна ли архивизация вместо удаления
     * 
     * @param id - ID поста для удаления
     * @returns Promise<void>
     * 
     * Примечание: После удаления поста:
     * - Комментарии к посту также должны быть удалены
     * - Лайки/оценки на посте также должны быть удалены
     */
    async delete(id: string): Promise<void> {
        // 📍 Удаляем пост из БД
        await postRepository.delete(id);
    }
}

/**
 * Singleton экземпляр PostsService
 * Используется во всем приложении через этот экземпляр
 */
export const postsService = new PostsService();
