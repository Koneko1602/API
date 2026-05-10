import {config} from 'dotenv'
import { StringValue } from 'ms'
config()

export const appConfig = {

    PORT: process.env.PORT,
    DB_NAME: process.env.DB_NAME as string,
    AC_SECRET: (process.env.AC_SECRET || 'f1f5deg4hy5fr5d5g') as string,
    AC_TIME: (process.env.AC_TIME ||'1h') as StringValue,
    RT_SECRET: (process.env.RT_SECRET|| 'gkflgkfkgjdlfgjvf'),
    DB_TYPE: process.env.DB_TYPE,
    EMAIL: 'konekohell@gmail.com' as string,
    EMAIL_PASS: 'rupsgzuinauyqfsy' as string,
}