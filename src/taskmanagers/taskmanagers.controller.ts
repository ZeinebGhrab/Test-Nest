import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { TaskmanagersService } from './taskmanagers.service';
import { TaskManagersDto } from 'src/dto/TaskManagers.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('taskmanagers')
@UseGuards(JwtAuthGuard)
export class TaskmanagersController {
  constructor(private readonly service: TaskmanagersService) {}

  @Post()
  Add(@Body() body: TaskManagersDto) {
    return this.service.add(body);
  }
  @Put('/:id')
  Update(@Param('id') id: string, @Body() body: TaskManagersDto) {
    return this.service.update(id, body);
  }
  @Delete('/:id')
  @UseFilters(HttpExceptionFilter)
  Delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
  @Post('/search')
  @UseFilters(HttpExceptionFilter)
  search(@Query('key') key: string, @Query() { limit, skip }) {
    return this.service.search(key, skip, limit);
  }
  @Get('get')
  @UseFilters(HttpExceptionFilter)
  @Roles(Role.Admin)
  async getdata(@Query() { limit, skip }) {
    return this.service.pagination(skip, limit);
  }
  @Get()
  @UseFilters(HttpExceptionFilter)
  async get() {
    return this.service.findTasks();
  }
  @Get('/:id')
  async getInfo(@Param('id') id: string, @Query() { skip, limit }) {
    return this.service.findAll(id, skip, limit);
  }
  @Post('/:id')
  @UseFilters(HttpExceptionFilter)
  searchUser(
    @Query('key') key: string,
    @Param('id') id: string,
    @Query() { skip, limit },
  ) {
    return this.service.searchUser(key, id, skip, limit);
  }
}
