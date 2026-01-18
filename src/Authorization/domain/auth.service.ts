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

export const authService = {

    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<{ accessToken: string } | null>> {
        const result = await this.checkUserCredentials(loginOrEmail, password);
        if (result.status !== ResultStatus.Success)
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'Unauthorized',
                extensions: [{field: 'loginOrEmail', message: 'Wrong credentials'}],
                data: null,
            };

        const accessToken = await jwtService.createToken(result.data!._id.toString());

        return {
            status: ResultStatus.Success,
            data: {accessToken},
            extensions: [],
        };
    },


    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<WithId<IUserDB> | null>> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user)
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{field: 'loginOrEmail', message: 'Not Found'}],
            };

        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
        if (!isPassCorrect)
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{field: 'password', message: 'Wrong password'}],
            };

        return {
            status: ResultStatus.Success,
            data: user,
            extensions: [],
        };
    },


    async registerUser(login: string, pass: string, email: string): Promise<IUserDB | null> {
        const user = await usersRepository.findByLoginOrEmail(email);
        if (user) return null;

        const passwordHash = await bcryptService.generateHash(pass);
        const newUser: IUserDB = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
                isConfirmed: false
            }
        };
        await usersRepository.create(newUser);

        const confirmationCode = newUser.emailConfirmation.confirmationCode;
        if (confirmationCode === null) throw new Error('Code null');

        try {
            await nodemailerService.sendEmail(newUser.email, confirmationCode, emailExamples.registrationEmail);
        } catch (e: unknown) {
            console.error('Send email error', e);
        }

        return newUser;
    },
    async confirmRegistration(code: string): Promise<Result<null>> {
        const user = await usersRepository.findByConfirmationCode(code);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Invalid code',
                extensions: [{ field: 'code', message: 'User not found' }],
                data: null
            };
        }


        const isExpired = user.emailConfirmation.expirationDate
            ? user.emailConfirmation.expirationDate < new Date()
            : true;  // Считайте null как истекший для безопасности

        if (user.emailConfirmation.isConfirmed || isExpired) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Invalid code',
                extensions: [{ field: 'code', message: 'Invalid, expired or already used' }],
                data: null
            };
        }

        // Обновление
        const updatedConfirmation = {
            confirmationCode: null,
            expirationDate: null,
            isConfirmed: true
        };

        const updated = await usersRepository.updateConfirmation(user._id.toString(), updatedConfirmation);
        if (!updated) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Update failed',
                extensions: [],
                data: null
            };
        }

        return {
            status: ResultStatus.Success,
            errorMessage: undefined,
            extensions: [],
            data: null
        };
    },
    async resendConfirmationEmail(email: string): Promise<Result<null>> {
        const user = await usersRepository.findByLoginOrEmail(email);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Email not found',
                extensions: [{ field: 'email', message: 'Email not found' }],
                data: null
            };
        }

        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Email already confirmed',
                extensions: [{ field: 'email', message: 'Email already confirmed' }],
                data: null
            };
        }

        // Генерация нового кода
        const newCode = randomUUID();
        const newExpiration = add(new Date(), { hours: 1, minutes: 30 });

        // Обновление в БД (нужен метод updateConfirmation в репозитории, как раньше)
        const updated = await usersRepository.updateConfirmation(user._id.toString(), {
            confirmationCode: newCode,
            expirationDate: newExpiration,
            isConfirmed: false
        });

        if (!updated) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Update failed',
                extensions: [],
                data: null
            };
        }

        // Отправка email
        try {
            await nodemailerService.sendEmail(email, newCode, emailExamples.registrationEmail);
        } catch (e: unknown) {
            console.error('Resend email error', e);
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Email sending failed',
                extensions: [],
                data: null
            };
        }

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: null
        };
    }

};