// src/data/schemas/environment-data.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EnvironmentDataDocument = HydratedDocument<EnvironmentData>;

@Schema({ timestamps: true }) // Thêm trường createdAt và updatedAt
export class EnvironmentData {
  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop() // Không bắt buộc
  pressure?: number;

  @Prop()
  broadband?: number;

  @Prop()
  infrared?: number;

  @Prop()
  lux?: number;

  @Prop()
  UVA?: number;

  @Prop()
  UVB?: number;

  @Prop()
  UVI?: number;
}

export const EnvironmentDataSchema = SchemaFactory.createForClass(EnvironmentData);