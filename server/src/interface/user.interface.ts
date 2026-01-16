import { Document } from 'mongoose';
export interface IUser extends Document{
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly isDeleted: boolean;
    isEmailVerified: boolean;
    emailVerificationToken : string;
    emailVerificationExpires : Date;
}