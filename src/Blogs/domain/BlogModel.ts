
// Модель для ввода (создание/редактирование блога)

export type BlogInputModel = {
        name: string;         // макс. 15 символов
        description: string;  // макс. 500 символов
        websiteUrl: string;   // макс. 100 символов, начинается с https://

}



// Модель для вывода (ответ от сервера)
export type  Blog =  {
        name: string;
        description: string;
        websiteUrl: string;
        createdAt: Date;
        isMembership: false;
}



