import {commentatorInfo} from "../domain/commentatorInfo";

export interface ICommentView  {
    id: string;
    content: string;
    commentatorInfo: commentatorInfo;
    createdAt: string;

}