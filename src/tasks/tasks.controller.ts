import { TasksService } from './tasks.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseFilters,
} from '@nestjs/common';
import { TaskDto } from 'src/dto/Task.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter';
@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}
  @Post()
  add(@Body() body: TaskDto) {
    return this.service.addTask(body);
  }
  @Get()
  @UseFilters(HttpExceptionFilter)
  findAll() {
    return this.service.findAll();
  }
  @Get('/:id')
  @UseFilters(HttpExceptionFilter)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Put('/:id')
  update(@Param('id') id: string, @Body() body: TaskDto) {
    return this.service.update(id, body);
  }
  @Delete('/:id')
  @UseFilters(HttpExceptionFilter)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
