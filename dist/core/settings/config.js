"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.appConfig = {
    PORT: process.env.PORT,
    DB_NAME: process.env.DB_NAME,
    AC_SECRET: (process.env.AC_SECRET || 'f1f5deg4hy5fr5d5g'),
    AC_TIME: (process.env.AC_TIME || '1h'),
    RT_SECRET: (process.env.RT_SECRET || 'gkflgkfkgjdlfgjvf'),
    DB_TYPE: process.env.DB_TYPE,
    EMAIL: 'koneko2019@mail.ru',
    EMAIL_PASS: 'pNSFNO7hBINyta9GhKmb',
};
//# sourceMappingURL=config.js.map