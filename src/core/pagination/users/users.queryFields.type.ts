import {SortQueryFieldsType} from "../sortQueryFields.type";

export type UsersQueryFieldsType = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
} & SortQueryFieldsType;