import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { AdmUser } from "../models/user.entity";



export class UserService {
    private userRepository = AppDataSource.getRepository(AdmUser);


    async findByUsername(username: string): Promise<AdmUser | null> {
        return this.userRepository.findOne({ 
            where: { username,state: In([1,2]) }, 
            relations: [
                'role', 
                'role.rolePermissions', 
                'role.rolePermissions.permission'
            ] 
        });
    }

    async findById(userId: number): Promise<AdmUser | null> {
        return this.userRepository.findOne({ 
            where: { userId,state: In([1,2]) }, 
            relations: [
                'role', 
                'role.rolePermissions', 
                'role.rolePermissions.permission'
            ] 
        });
    }
}