import {commentsRepository} from "../repository/CommentRepository";
import {Comment, CommentViewModel} from "../domain/CommentsModel";
import {postRepository} from "../../Posts/repository/PostRepository";
import {ICommentDB} from "../types/comment.db.interface";
import {commentatorInfo} from "../domain/commentatorInfo";

export const CommentsService = {

    async createComment(
        postId: string,
        inputModel: Comment,
        commentatorInfo: commentatorInfo
    ): Promise<CommentViewModel | null> {


        const postExists = await postRepository.findById(postId);
        if (!postExists) {
            return null;
        }


        const commentToSave: ICommentDB = {
            postId: postId,
            content: inputModel.content,
            commentatorInfo: {
                userId: commentatorInfo.userId,
                userLogin: commentatorInfo.userLogin
            },
            createdAt: new Date(),
        };


        const commentId: string = await commentsRepository.create(commentToSave);


        const viewModel: CommentViewModel = {
            id: commentId,
            content: commentToSave.content,
            commentatorInfo: commentToSave.commentatorInfo,
            createdAt: commentToSave.createdAt.toISOString()
        };

        return viewModel;
    }
};