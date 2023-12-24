import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { CreateUserDTO } from './dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(limit: number, offset: number): Promise<User[]> {
    const users = await this.userRepository.find({
      skip: offset,
      take: limit,
    });
    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { customerEmail: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(userData: any): Promise<User[]> {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Overwrite password with hashed password
    userData.password = hashedPassword;

    const newUser = this.userRepository.create(userData);

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new ConflictException('Error saving user');
    }

    return newUser;
  }
}
