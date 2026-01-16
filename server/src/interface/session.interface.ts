import { Document } from 'mongoose';
export interface ISession extends Document{
   userId: string;
   token: string;
   expireAt: Date;
   isDeleted: boolean;
   createdAt: Date;
}