import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;


  @Prop({ required: true, maxlength: 255 })
  token: string;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  expireAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ token: 1 });
SessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 }); 