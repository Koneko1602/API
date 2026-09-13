export interface IUserDB {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    emailConfirmation: {
        confirmationCode: string | null,
        expirationDate: Date | null,
        isConfirmed: boolean
    }
    passwordRecovery?: {
        recoveryCode: string | null,
        recoveryExpirationDate: Date | null
    }
}
