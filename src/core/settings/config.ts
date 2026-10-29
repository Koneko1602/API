
import { config } from 'dotenv';
import { StringValue } from 'ms';

config();

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export const appConfig = {
    PORT: process.env.PORT || '5000',

    DB_NAME: requireEnv('DB_NAME'),

    AC_SECRET: requireEnv('AC_SECRET'),
    AC_TIME: (process.env.AC_TIME || '1h') as StringValue,

    RT_SECRET: requireEnv('RT_SECRET'),

    DB_TYPE: process.env.DB_TYPE,

    EMAIL: requireEnv('EMAIL'),
    EMAIL_PASS: requireEnv('EMAIL_PASS'),
};
