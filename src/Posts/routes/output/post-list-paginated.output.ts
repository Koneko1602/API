import {PaginatedOutput} from "../../../core/types/PaginatedOutput";
import {PostDataOutput} from "./post-data.output";


export type PostListPaginatedOutput = {
    meta: PaginatedOutput;
    data: PostDataOutput[];
};