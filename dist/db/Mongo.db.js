"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokensCollection = exports.CommentsCollection = exports.UsersCollection = exports.PostsCollection = exports.BlogsCollection = exports.client = void 0;
exports.runDB = runDB;
const mongodb_1 = require("mongodb");
const settings_1 = require("../core/settings/settings");
const BLOGS_COLLECTION_NAME = 'Blogs';
const POSTS_COLLECTION_NAME = 'Posts';
const USERS_COLLECTION_NAME = 'Users';
const COMMENTS_COLLECTION_NAME = 'Comments';
const TOKENS_COLLECTION_NAME = 'refreshTokens';
// Подключения к бд
function runDB(url) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.client = new mongodb_1.MongoClient(url);
        const db = exports.client.db(settings_1.SETTINGS.DB_NAME);
        //Инициализация коллекций
        exports.BlogsCollection = db.collection(BLOGS_COLLECTION_NAME);
        exports.PostsCollection = db.collection(POSTS_COLLECTION_NAME);
        exports.UsersCollection = db.collection(USERS_COLLECTION_NAME);
        exports.CommentsCollection = db.collection(COMMENTS_COLLECTION_NAME);
        exports.RefreshTokensCollection = db.collection(TOKENS_COLLECTION_NAME);
        try {
            yield exports.client.connect();
            yield db.command({ ping: 1 });
            console.log('✅ Connected to the database');
        }
        catch (e) {
            yield exports.client.close();
            throw new Error(`❌ Database not connected: ${e}`);
        }
    });
}
//# sourceMappingURL=Mongo.db.js.map