export type Comment = {

    content: string;
}

export type CommentViewModel = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    },
    createdAt: Date;
//какой тип данных взять , бо тут еще должен быть id , может нужно создать дтошки как в юзерах

}