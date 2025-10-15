import {ResourceType} from "../../../core/types/resource-type";


export type BlogDataOutput = {

    type: ResourceType.Blogs;
    id: string;
    attributes: {

        name: string;
        description: string;
        websiteUrl: string;
        createdAt: Date;
        isMembership: false;

    }

}