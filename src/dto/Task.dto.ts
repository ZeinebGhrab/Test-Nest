import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ObjectId } from 'mongoose';

export class TaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  date: Date;

  @IsOptional()
  @MaxLength(50)
  description: string;

  @IsNotEmpty()
  completed: boolean;

  @IsNotEmpty()
  taskManagerId: ObjectId;
}
