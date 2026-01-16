import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop()
    name : String;

    @Prop()
    email: String;

    @Prop()
    password: String;

    @Prop({default: false})
    isDeleted: boolean;

    @Prop({ default: false })
    isEmailVerified: boolean;

    @Prop()
    emailVerificationToken: string;

    @Prop()
    emailVerificationExpires: Date;

    @Prop({default: Date.now})
    createdAt: Date;

    @Prop({default: Date.now})
    updatedAt: Date;

    @Prop({default: ""})
    googleId: String;

    @Prop({default: ""})
    facebookId: String;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ facebookId: 1 });
