import {IUserView} from "../types/user.view.interface";
import {ObjectId, WithId} from "mongodb";
import {IUserDB} from "../types/user.db.interface";
import {SortQueryFilterType} from "../pagination/sortQueryFilter.type";
import {IPagination} from "../pagination/pagination";
import {UsersCollection} from "../../db/Mongo.db";


export const usersQwRepository = {
    async findAllUsers(
        sortQueryDto: SortQueryFilterType,
    ): Promise<IPagination<IUserView[]>> {
        const { sortBy, sortDirection, pageSize, pageNumber } = sortQueryDto;

        const loginAndEmailFilter = {};

        const totalCount = await UsersCollection
            .countDocuments(loginAndEmailFilter);
        const users = await UsersCollection

            .find(loginAndEmailFilter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

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
            .findOne({ _id: new ObjectId(id) });
        return user ? this._getInView(user) : null;
    },
    _getInView(user: WithId<IUserDB>): IUserView {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        };
    },
    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id);
    },
};