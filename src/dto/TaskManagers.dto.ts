import { IsEmail, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class TaskManagersDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  userId: ObjectId;
}
