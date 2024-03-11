import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Task } from './task.models';

export type TaskManagersDocument = HydratedDocument<TaskManagers>;

@Schema()
export class TaskManagers {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true }) //validation
  lastName: string;

  @Prop({ required: true, unique: true }) //validation
  email: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks: Task[];
}

export const TaskManagersSchema = SchemaFactory.createForClass(TaskManagers);
