import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/User.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  add(@Body() body: UserDto) {
    return this.service.createUser(body);
  }
}
