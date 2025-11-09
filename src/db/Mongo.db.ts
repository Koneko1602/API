import { Collection, Db, MongoClient } from 'mongodb';
import {Blog} from "../Blogs/domain/BlogModel";
import {Post} from "../Posts/domain/PostModel";
import { SETTINGS } from '../core/settings/settings';
import {User} from "../Users/domain/UserModel";
import {IUserDB} from "../Users/types/user.db.interface";

const BLOGS_COLLECTION_NAME = 'Blogs';
const POSTS_COLLECTION_NAME = 'Posts';
const USERS_COLLECTION_NAME = 'Users';


export let client: MongoClient;
export let BlogsCollection: Collection<Blog>;
export let PostsCollection: Collection<Post>;
export let UsersCollection: Collection<IUserDB>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    //Инициализация коллекций
    BlogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
    PostsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
    UsersCollection = db.collection<IUserDB>(USERS_COLLECTION_NAME);
    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}

