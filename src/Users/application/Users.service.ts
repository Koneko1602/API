import {IUserDB} from "../types/user.db.interface";
import {usersRepository} from "../repository/UserRepository";
import {CreateUserDto} from "../types/create-user.dto";
import {bcryptService} from "../../Authorization/adapters/bcrypt.service";


export const usersService = {
    async create(dto: CreateUserDto): Promise<string> {
        const { login, password, email } = dto;
        const passwordHash = await bcryptService.generateHash(password);

        const newUser: IUserDB = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
        };
        const newUserId = await usersRepository.create(newUser);

        return newUserId;
    },

    async delete(id: string): Promise<boolean> {
        const user = await usersRepository.findById(id);
        if (!user) return false;

        return await usersRepository.delete(id);
    },
};