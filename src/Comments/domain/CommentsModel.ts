export type Comment = {

    content: string;
}

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    },
    createdAt: string;
//какой тип данных взять , бо тут еще должен быть id , может нужно создать дтошки как в юзерах

}