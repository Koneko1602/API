import {PaginatedOutput} from "../../../core/types/PaginatedOutput";
import {BlogDataOutput} from "./BlogDataOutput";



export type BlogListPaginatedOutput = {
    meta: PaginatedOutput;
    data: BlogDataOutput[];
};