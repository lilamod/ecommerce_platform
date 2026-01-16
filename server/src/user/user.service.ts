import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class UserService {
    constructor(@InjectModel("User") private UserModel:Model<IUser>){}

    async createUser(createUserDto: CreateUserDto){
        const newUser = new this.UserModel(createUserDto);
        return newUser.save();
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto){
        return await this.UserModel.findByIdAndUpdate(userId, updateUserDto);
    }

    async getAllUser(): Promise<IUser[]>{
        return await this.UserModel.find({isDeleted: false});
    }

    async getUser(userId: string): Promise<IUser>{
        return await this.UserModel.findById({_id: userId, isDeleted: false});
    }

    async deleteUser(userId: string){
        return await this.UserModel.findByIdAndUpdate(userId, {$set:{isDeletd: true}})
    }

    async findduplicateEmail(email: string): Promise<IUser | undefined >{
        return await this.UserModel.findOne({email: email, isDeleted: false});
    }

    async findDuplicateName(name: string): Promise<IUser | undefined > {
        return await this.UserModel.findOne({name: name, isDeleted: false});
    }
}
