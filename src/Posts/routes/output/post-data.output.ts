import {ResourceType} from "../../../core/types/resource-type";


export type PostDataOutput = {

    type: ResourceType.Posts;
    id: string;
    attributes: {

        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        // ты сохраняешь часть данных из связанной сущности, чтобы не делать лишний запрос при отображении.
        blogName: string;//Это называется денормализация
        createdAt : Date;

    }

}