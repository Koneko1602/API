import {commentatorInfo} from "../domain/commentatorInfo";

export type ICommentDB = {
    content: string;
    commentatorInfo: commentatorInfo;
    createdAt: Date;
    postId: string;
}