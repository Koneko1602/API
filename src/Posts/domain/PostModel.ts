// Модель для создания/редактирования поста
export type PostInputModel = {
        title: string;             // макс. 30 символов
        shortDescription: string;  // макс. 100 символов
        content: string;           // макс. 1000 символов
        blogId: string;
}

// Модель для отображения поста (ответ от API)
export type Post = {
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        // ты сохраняешь часть данных из связанной сущности, чтобы не делать лишний запрос при отображении.
        blogName: string;//Это называется денормализация
        createdAt : Date;

}




