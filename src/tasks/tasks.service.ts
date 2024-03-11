import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskDto } from 'src/dto/Task.dto';
import { Task } from 'src/models/task.models';
import { TaskManagers } from 'src/models/taskManagers.models';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,
    @InjectModel(TaskManagers.name)
    private taskManagerModel: Model<TaskManagers>,
  ) {}

  async addTask({ taskManagerId, ...body }: TaskDto): Promise<Task> {
    const findTaskManager = await this.taskManagerModel.findById(taskManagerId);
    const newTask = new this.taskModel(body);
    const savedTask = await newTask.save();
    await findTaskManager.updateOne({
      $push: { tasks: savedTask._id },
    });
    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find();
  }

  async findOne(id: string): Promise<Task[]> {
    return this.taskModel.findById(id);
  }

  update(id: string, body: TaskDto): Promise<Task> {
    return this.taskModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }

  delete(id: string) {
    this.taskManagerModel.updateMany({ tasks: id }, { $pull: { tasks: id } });
    return this.taskModel.deleteOne({ _id: id });
  }
}
