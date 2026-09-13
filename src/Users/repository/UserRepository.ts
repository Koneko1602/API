import {ObjectId, WithId} from "mongodb";
import {IUserDB} from "../types/user.db.interface";
import {UsersCollection} from "../../db/Mongo.db";

export const usersRepository = {
    async create(user: IUserDB): Promise<string> {
        const newUser = await UsersCollection
            .insertOne({...user});
        return newUser.insertedId.toString();
    },
    async delete(id: string): Promise<boolean> {
        const isDel = await UsersCollection
            .deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    },
    async findById(id: string): Promise<WithId<IUserDB> | null> {
        return UsersCollection
            .findOne({_id: new ObjectId(id)});
    },
    async findByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<WithId<IUserDB> | null> {
        return UsersCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });
    },
    async findByEmail(email: string): Promise<WithId<IUserDB> | null> {
        return UsersCollection.findOne({ email });
    },
    async findByConfirmationCode(code: string): Promise<WithId<IUserDB> | null> {
        return UsersCollection.findOne({ "emailConfirmation.confirmationCode": code });
    },
    async findByRecoveryCode(code: string): Promise<WithId<IUserDB> | null> {
        return UsersCollection.findOne({ "passwordRecovery.recoveryCode": code });
    },
    async updateConfirmation(id: string, confirmationData: Partial<IUserDB['emailConfirmation']>): Promise<boolean> {
        const result = await UsersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { "emailConfirmation.confirmationCode": confirmationData.confirmationCode,
                    "emailConfirmation.expirationDate": confirmationData.expirationDate,
                    "emailConfirmation.isConfirmed": confirmationData.isConfirmed } }
        );
        return result.matchedCount === 1;
    },
    async updatePasswordRecovery(id: string, recoveryData: {recoveryCode: string, recoveryExpirationDate: Date}): Promise<boolean> {
        const result = await UsersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { 
                "passwordRecovery.recoveryCode": recoveryData.recoveryCode,
                "passwordRecovery.recoveryExpirationDate": recoveryData.recoveryExpirationDate
            } }
        );
        return result.matchedCount === 1;
    },
    async updatePassword(id: string, passwordData: {passwordHash: string, recoveryCode: null, recoveryExpirationDate: null}): Promise<boolean> {
        const result = await UsersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { 
                "passwordHash": passwordData.passwordHash,
                "passwordRecovery.recoveryCode": passwordData.recoveryCode,
                "passwordRecovery.recoveryExpirationDate": passwordData.recoveryExpirationDate
            } }
        );
        return result.matchedCount === 1;
    }
};
