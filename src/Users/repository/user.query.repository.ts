import {IUserView} from "../types/user.view.interface";
import {ObjectId, WithId} from "mongodb";
import {IUserDB} from "../types/user.db.interface";
import {IPagination} from "../../core/pagination/pagination";
import {UsersCollection} from "../../db/Mongo.db";
import {CleanFilterAndSearchType} from "../../core/pagination/users/CleanFilterAndSearchType";


export const usersQwRepository = {
    //
    async findAllUsers(
        sortQueryDto: CleanFilterAndSearchType, // ✅ Используем объединенный чистый тип
    ): Promise<IPagination<IUserView[]>> {

        // 1. Деструктуризация всех данных (без as any, без дефолтов)
        const {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber,
            searchLoginTerm,
            searchEmailTerm
        } = sortQueryDto; // 👈 TypeScript теперь уверен во всех полях

        // 2. Формирование фильтра (логика поиска остается прежней)
        const filter: any = {$or: []};

        if (searchLoginTerm) {
            filter.$or.push({
                login: {$regex: searchLoginTerm, $options: 'i'}
            });
        }

        if (searchEmailTerm) {
            filter.$or.push({
                email: {$regex: searchEmailTerm, $options: 'i'}
            });
        }

        if (filter.$or.length === 0) {
            delete filter.$or;
        }

        // 3. Подсчет общего количества документов
        const totalCount = await UsersCollection.countDocuments(filter);

        // 4. Получение отфильтрованных, отсортированных и пагинированных данных
        const users = await UsersCollection
            .find(filter)
            // ✅ MongoDB доволен
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        // 5. Формирование объекта пагинации
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: users.map((u) => this._getInView(u)),
        };
    },
    async findById(id: string): Promise<IUserView | null> {
        const user = await UsersCollection
            .findOne({_id: new ObjectId(id)});
        return user ? this._getInView(user) : null;
    },
    _getInView(user: WithId<IUserDB>): IUserView {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        };
    }, //маппинг из внутренней модели базы данных во внешнюю модель для отображения клиенту
    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id);
    },
};