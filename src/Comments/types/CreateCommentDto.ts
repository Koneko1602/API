import {commentatorInfo} from "../domain/commentatorInfo";

export type CreateCommentDto = {
    id: string;
    content: string;
    commentatorInfo: commentatorInfo;
    created_at: Date;

}