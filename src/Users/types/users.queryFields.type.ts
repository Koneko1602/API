import {SortQueryFieldsType} from "../pagination/sortQueryFields.type";

export type UsersQueryFieldsType = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
} & SortQueryFieldsType;