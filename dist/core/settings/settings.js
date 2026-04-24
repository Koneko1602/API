"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
exports.SETTINGS = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/Blogger_Platform',
    DB_NAME: process.env.DB_NAME || 'Blogger_Platform', // узнать как правильно назвать Монго ДБ
};
//# sourceMappingURL=settings.js.map