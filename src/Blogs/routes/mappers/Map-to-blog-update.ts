import {Blog, BlogInputModel} from "../../domain/BlogModel";
import {WithId} from "mongodb";
import {BlogDTO} from "../../dto/BlogModelDTO";

export function mapInputToBlogDto(
    id: string,
    input: BlogInputModel,
    existing: WithId<Blog>
): BlogDTO {
    return {
        id,
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        createdAt: existing.createdAt,
        isMembership: existing.isMembership,
    };
}
