import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body) {
    return body;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() pagination) {
    const { limit, offset } = pagination;
    return `allusers ${limit} ${offset}`;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string) {
    return `${id}`;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() body) {
    return `${id} ${body}`;
  }

  @Delete('id')
  remove(@Param('id') id: string) {
    return `${id}`;
  }
}
