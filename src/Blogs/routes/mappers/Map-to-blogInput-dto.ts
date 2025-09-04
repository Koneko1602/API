import {Blog, BlogInputModel} from "../../domain/BlogModel";


export const mapInputToBlog = (input: BlogInputModel): Blog => ({
    name: input.name,
    description: input.description,
    websiteUrl: input.websiteUrl,
    createdAt: new Date(),
    isMembership: false,
});
