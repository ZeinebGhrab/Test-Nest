import { Module } from '@nestjs/common';
import { TaskmanagersController } from './taskmanagers.controller';
import { TaskmanagersService } from './taskmanagers.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TaskManagers,
  TaskManagersSchema,
} from 'src/models/taskManagers.models';
import { Task, TaskSchema } from 'src/models/task.models';
import { User, UserSchema } from 'src/models/user.models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskManagers.name, schema: TaskManagersSchema },
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TaskmanagersController],
  providers: [TaskmanagersService],
})
export class TaskmanagersModule {}
