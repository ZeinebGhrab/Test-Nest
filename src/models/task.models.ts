import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true }) //validation
  title: string;

  @Prop({ required: true }) //validation
  date: string;

  @Prop({ required: false }) //validation
  description: string | null;

  @Prop({ required: true }) //validation
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
