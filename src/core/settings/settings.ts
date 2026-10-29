import 'dotenv/config';

export const SETTINGS = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL || '',
    DB_NAME: process.env.DB_NAME || 'Blogger_Platform',
};
