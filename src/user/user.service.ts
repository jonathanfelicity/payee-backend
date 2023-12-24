import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
    // Destructure password from userData and hash it separately
    const { password, ...restData } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with hashed password
    const newUser = this.userRepository.create({
      ...restData,
      password: hashedPassword,
    });

    try {
      // Save the new user to the database
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new ConflictException('Error saving user');
    }

    return newUser;
  }
}
