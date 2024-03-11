import { TaskManagers } from 'src/models/taskManagers.models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TaskManagersDto } from 'src/dto/TaskManagers.dto';
import { Task } from 'src/models/task.models';
import { User } from 'src/models/user.models';

@Injectable()
export class TaskmanagersService {
  constructor(
    @InjectModel(TaskManagers.name)
    private taskManagerModel: Model<TaskManagers>,
    @InjectModel(Task.name)
    private taskModel: Model<Task>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async add({ userId, ...body }: TaskManagersDto): Promise<TaskManagers> {
    const findUser = await this.userModel.findById(userId);
    const newTaskManager = new this.taskManagerModel(body);
    const savedTaskManager = await newTaskManager.save();
    await findUser.updateOne({
      $push: { taskManagers: savedTaskManager._id },
    });
    return savedTaskManager;
  }
  async findAll(id: string, skip: string, limit: string) {
    const skipAmount = Math.max(0, parseInt(skip));
    const limitAmount = Math.max(1, parseInt(limit));
    const aggregationPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'taskmanagers',
          localField: 'taskManagers',
          foreignField: '_id',
          as: 'taskManagers',
        },
      },
      { $unwind: '$taskManagers' },
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskManagers.tasks',
          foreignField: '_id',
          as: 'taskManagers.tasks',
        },
      },
      {
        $addFields: {
          'taskManagers.tasks': {
            $slice: ['$taskManagers.tasks', skipAmount, limitAmount],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          taskManagers: { $push: '$taskManagers' },
        },
      },
    ];
    const result = await this.userModel.aggregate(aggregationPipeline).exec();
    return result[0]?.taskManagers || [];
  }

  async search(
    key: string,
    skip: string,
    limit: string,
  ): Promise<TaskManagers[]> {
    const pipeline = [
      {
        $lookup: {
          from: 'tasks',
          localField: 'tasks',
          foreignField: '_id',
          as: 'tasks',
        },
      },
      {
        $match: {
          $or: [
            { firstName: { $regex: new RegExp(key, 'i') } },
            { lastName: { $regex: new RegExp(key, 'i') } },
            { email: { $regex: new RegExp(key, 'i') } },
            {
              tasks: {
                $elemMatch: {
                  $or: [
                    { title: { $regex: new RegExp(key, 'i') } },
                    { date: { $regex: new RegExp(key, 'i') } },
                    { description: { $regex: new RegExp(key, 'i') } },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          tasks: {
            $slice: ['$tasks', parseInt(skip), parseInt(limit)],
          },
        },
      },
    ];

    return this.taskManagerModel.aggregate(pipeline);
  }

  update(id: string, body: TaskManagersDto): Promise<TaskManagers> {
    return this.taskManagerModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }
  async delete(id: string) {
    await this.taskManagerModel.deleteOne({ _id: id });
  }

  async findTasks(): Promise<TaskManagers[]> {
    return this.taskManagerModel
      .find()
      .populate({
        path: 'tasks',
        model: 'Task',
      })
      .exec();
  }
  async pagination(skip: string, limit: string): Promise<TaskManagers[]> {
    const result = await this.taskManagerModel
      .find()
      .populate({
        path: 'tasks',
        model: 'Task',
        options: {
          skip: parseInt(skip),
          limit: parseInt(limit),
        },
      })
      .exec();

    return result;
  }

  async searchUser(
    key: string,
    id: string,
    skip: string,
    limit: string,
  ): Promise<TaskManagers[]> {
    const aggregationPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'taskmanagers',
          localField: 'taskManagers',
          foreignField: '_id',
          as: 'taskManagers',
        },
      },
      { $unwind: '$taskManagers' },
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskManagers.tasks',
          foreignField: '_id',
          as: 'taskManagers.tasks',
        },
      },
      {
        $match: {
          $or: [
            { 'taskManagers.firstName': { $regex: new RegExp(key, 'i') } },
            { 'taskManagers.lastName': { $regex: new RegExp(key, 'i') } },
            { 'taskManagers.email': { $regex: new RegExp(key, 'i') } },
            {
              'taskManagers.tasks': {
                $elemMatch: {
                  $or: [
                    {
                      title: {
                        $regex: new RegExp(key, 'i'),
                      },
                    },
                    {
                      date: {
                        $regex: new RegExp(key, 'i'),
                      },
                    },
                    {
                      description: {
                        $regex: new RegExp(key, 'i'),
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          'taskManagers.tasks': {
            $slice: ['$taskManagers.tasks', parseInt(skip), parseInt(limit)],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          taskManagers: { $push: '$taskManagers' },
        },
      },
    ];
    const result = await this.userModel.aggregate(aggregationPipeline).exec();
    return result[0]?.taskManagers || [];
  }
}
