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
        //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать

        const passwordHash = await bcryptService.generateHash(pass)//создать хэш пароля
        const newUser: IUserDB = { // сформировать dto юзера
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {    // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                isConfirmed: false
            }
        };
        await usersRepository.create(newUser); // сохранить юзера в базе данных
        const confirmationCode = newUser.emailConfirmation.confirmationCode;
        if (confirmationCode === null) {
            throw new Error('Confirmation code is unexpectedly null');  // Это не должно произойти в registerUser, но для безопасности
        }
//отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться отправка) приложение не падало
        try {
            await nodemailerService.sendEmail(//отправить сообщение на почту юзера с кодом подтверждения
                newUser.email,
                confirmationCode,
                emailExamples.registrationEmail);

        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return newUser;
    },
    async confirmRegistration(code: string): Promise<Result<null>> {
        const user = await usersRepository.findByConfirmationCode(code);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Invalid code',
                extensions: [{ field: 'code', message: 'User not found' }],  // Добавьте явные extensions, если нужно
                data: null  // Исправление: Добавьте data: null
            };
        }

        // Исправление TS18047: Используйте проверку null или optional chaining для expirationDate
        const isExpired = user.emailConfirmation.expirationDate
            ? user.emailConfirmation.expirationDate < new Date()
            : true;  // Считайте null как истекший для безопасности

        if (user.emailConfirmation.isConfirmed || isExpired) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Invalid code',
                extensions: [{ field: 'code', message: 'Invalid, expired or already used' }],
                data: null  // Исправление: Добавьте data: null
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
                errorMessage: 'Update failed',  // Добавьте, если нужно для ясности
                extensions: [],  // Пустые extensions ок
                data: null  // Исправление: Добавьте data: null
            };
        }

        return {
            status: ResultStatus.Success,
            errorMessage: undefined,  // Или опустите, если опционально
            extensions: [],
            data: null
        };
    }
};