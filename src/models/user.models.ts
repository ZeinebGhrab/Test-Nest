import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/roles/role.enum';
import { TaskManagers } from './taskManagers.models';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  roles: Role[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskManagers' }],
  })
  taskManagers: TaskManagers[];
}

export const UserSchema = SchemaFactory.createForClass(User);
