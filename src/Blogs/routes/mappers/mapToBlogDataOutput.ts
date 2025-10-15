import {WithId} from "mongodb";

import {ResourceType} from "../../../core/types/resource-type";
import {Blog} from "../../domain/BlogModel";
import {BlogDataOutput} from "../output/BlogDataOutput";

export function mapToBlogDataOutput(blog: WithId<Blog>): BlogDataOutput {
    return {
        type: ResourceType.Blogs,
        id: blog._id.toString(),
        attributes: {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        },
    };
}
