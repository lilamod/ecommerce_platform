import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ productId: String, quantity: Number }] })
  items: any[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'pending' }) 
  status: string;

  @Prop()
  stripePaymentId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1 });