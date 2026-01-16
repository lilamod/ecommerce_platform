import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({default: ""})
  image: string;

  @Prop({default: ""})
  created_by: string;

  @Prop({default: ""})
  updated_by: string
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 1 });