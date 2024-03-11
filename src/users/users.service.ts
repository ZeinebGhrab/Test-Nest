import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.models';
import { encodePassword } from 'src/utils/bcrypt';
import { UserDto } from 'src/dto/User.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username }).exec();
    console.log('User found:', user);
    return user;
  }

  async createUser(body: UserDto): Promise<User> {
    const password = encodePassword(body.password);
    try {
      return await this.userModel.create({ ...body, password });
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Username exist! ');
      } else {
        throw new BadRequestException(
          'An error occurred while creating the user',
        );
      }
    }
  }
}
