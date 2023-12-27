import {
  Body,
  Controller,
  // Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  // Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/userDTO';
// import { UpdateUserDTO } from './dto/update.user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() userData: CreateUserDTO) {
    return this.userService.create(userData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() pagination: any) {
    const { limit, offset } = pagination;
    return this.userService.findAll(limit, offset);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: number) {
    return this.userService.findById(id);
  }
}
