import {bcryptService} from "../adapters/bcrypt.service";
import {usersRepository} from "../../Users/repository/UserRepository";
import {ResultStatus} from "../../Users/common/result/resultCode";
import {Result} from "../../Users/common/result/result.type";
import {jwtService} from "../adapters/jwt.service";
import {WithId} from "mongodb";
import {IUserDB} from "../../Users/types/user.db.interface";
import {randomUUID} from "node:crypto";
import {nodemailerService} from "../adapters/nodemailer.service";
import {emailExamples} from "../adapters/emailExamples";
import {add} from "date-fns/add";
import {UsersCollection} from "../../db/Mongo.db";
import {refreshTokenRepository} from "../repository/refreshToken.repository";

export const authService = {

    // async loginUser(
    //     loginOrEmail: string,
    //     password: string,
    // ): Promise<Result<{ accessToken: string } | null>> {
    //     const result = await this.checkUserCredentials(loginOrEmail, password);
    //     if (result.status !== ResultStatus.Success)
    //         return {
    //             status: ResultStatus.Unauthorized,
    //             errorMessage: 'Unauthorized',
    //             extensions: [{field: 'loginOrEmail', message: 'Wrong credentials'}],
    //             data: null,
    //         };
    //
    //     const accessToken = await jwtService.createToken(result.data!._id.toString());
    //
    //     return {
    //         status: ResultStatus.Success,
    //         data: {accessToken},
    //         extensions: [],
    //     };
    // },
        async loginUser(
            loginOrEmail: string,
            password: string,
        ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
            const check = await this.checkUserCredentials(loginOrEmail, password);
            if (check.status !== ResultStatus.Success) {
                return {
                    status: ResultStatus.Unauthorized,
                    data: null,
                    extensions: [{ field: 'loginOrEmail or password', message: 'Wrong credentials' }],
                };
            }

            const userId = check.data!._id.toString();

            const accessToken = await jwtService.createToken(userId);
            const refreshToken = await refreshTokenRepository.create(userId);

            return {
                status: ResultStatus.Success,
                data: { accessToken, refreshToken },
                extensions: [],
            };
        },
        // Сохраняем refresh в БД
    async refreshTokens(oldRefreshToken: string): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
        const record = await refreshTokenRepository.findValid(oldRefreshToken);

        if (!record) {
            return { status: ResultStatus.Unauthorized,
                data: null,
                extensions: []
            };
        }

        // Инвалидируем старый
        await refreshTokenRepository.deleteByToken(oldRefreshToken);

        // Создаём новую пару
        const newAccess = await jwtService.createToken(record.userId);
        const newRefresh = await refreshTokenRepository.create(record.userId);

        return {
            status: ResultStatus.Success,
            data: { accessToken: newAccess, refreshToken: newRefresh },
            extensions: [],
        };
    },
    async logout(refreshToken: string): Promise<void> {
        await refreshTokenRepository.deleteByToken(refreshToken);
    },

    async getCurrentUser(userId: string): Promise<Result<{ userId: string; login: string; email: string } | null>> {
        const user = await usersRepository.findById(userId);
        if (!user) {
            return { status: ResultStatus.NotFound, data: null,extensions: [] };
        }

        return {
            status: ResultStatus.Success,
            data: {
                userId: user._id.toString(),
                login: user.login,
                email: user.email,
            },
            extensions: [],
        };
    },


    async checkUserCredentials (loginOrEmail: string, password: string
): Promise<Result<WithId<IUserDB> | null>> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
    return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
    };
}

const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);

if (!isPassCorrect) {
    return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
    };
}

return {
    status: ResultStatus.Success,
    data: user,
    extensions: [],
};
},

    async registerUser(login: string, pass: string, email: string): Promise<Result<string | null>> {
    // Проверяем login и email ПО ОТДЕЛЬНОСТИ
        const existingLogin = await UsersCollection.findOne({ login: login.trim() });
     const existingEmail = await UsersCollection.findOne({ email: email.trim() });

    if (existingLogin || existingEmail) {
    console.log('[SERVICE-REG] DUPLICATE FOUND → returning null');
    const errors = [];
    if (existingLogin) {
        errors.push({ field: 'login', message: 'Login already exists' });
    }
    if (existingEmail) {
        errors.push({ field: 'email', message: 'Email already exists' });
    }

    return {
        status: ResultStatus.BadRequest,
        extensions: errors,
        data: null,
        errorMessage: 'Login or email already exists'
    };
}
const passwordHash = await bcryptService.generateHash(pass);
const confirmationCode = randomUUID();

const newUser: IUserDB = {
    login,
    email,
    passwordHash,
    createdAt: new Date(),
    emailConfirmation: {
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false
    }
};

await usersRepository.create(newUser);

try {
    await nodemailerService.sendEmail(newUser.email, confirmationCode, emailExamples.registrationEmail);
} catch (e: unknown) {
    console.error('Send email error', e);
}
console.log(`[SERVICE-REG] SUCCESS: code generated = "${confirmationCode}"`);
return {
    status: ResultStatus.Success,
    extensions: [],
    data: confirmationCode  // Тест получит string
};
},
async confirmRegistration(code: string): Promise<Result<null>> {
    const user = await usersRepository.findByConfirmationCode(code);
    if (!user) {
    return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'code', message: 'User not found' }],
        data: null
    };
}

const isExpired = user.emailConfirmation.expirationDate
    ? user.emailConfirmation.expirationDate < new Date()
    : true;

if (user.emailConfirmation.isConfirmed || isExpired) {
    return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'code', message: 'Invalid, expired or already used' }],
        data: null
    };
}
console.log('[CONFIRM] Updating user:', user._id, 'to confirmed');
const updated = await usersRepository.updateConfirmation(user._id.toString(), {
    confirmationCode: null,
    expirationDate: null,
    isConfirmed: true
});

if (!updated) {
    return {
        status: ResultStatus.BadRequest,
        extensions: [],
        data: null
    };
}

return {
    status: ResultStatus.Success,
    extensions: [],
    data: null
};
},
async resendConfirmationEmail(email: string): Promise<Result<null>> {
    console.log('[RESEND] Requested for email:', email);
    const user = await usersRepository.findByEmail(email);
    if (!user) {
    console.log('[RESEND] User not found → 400');
    return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'Email not found' }],
        data: null
    };
}

if (user.emailConfirmation.isConfirmed) {
    console.log('[RESEND] Email already confirmed → 400');
    return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'Email already confirmed' }],
        data: null
    };
}
console.log('[RESEND] User exists and not confirmed → resending');
const newCode = randomUUID();
const newExpiration = add(new Date(), { hours: 1, minutes: 30 });

const updated = await usersRepository.updateConfirmation(user._id.toString(), {
    confirmationCode: newCode,
    expirationDate: newExpiration,
    isConfirmed: false
});

if (!updated) {
    return {
        status: ResultStatus.BadRequest,
        extensions: [],
        data: null
    };
}

try {
    await nodemailerService.sendEmail(email, newCode, emailExamples.registrationEmail);
} catch (e: unknown) {
    console.error('Resend email error', e);
}
console.log('[RESEND] Success → 204');
return {
    status: ResultStatus.Success,
    extensions: [],
    data: null
};
}


};